use std::fs::File;
use std::io::BufReader;
use std::sync::Arc;
use actix_web::{error, middleware, web, App, HttpResponse, HttpServer};
use sqlx::migrate::Migrator;
use sqlx::postgres::PgPoolOptions;
use crate::application::bookings_service::BookingService;
use crate::application::review_service::ReviewService;
use crate::application::timeslots_service::TimeslotsService;
use crate::application::tour_service::TourService;
use env_logger;
use env_logger::Env;
use actix_cors::Cors;
use serde_json::json;

mod domain;
mod presentation;
mod application;
mod infrastructure;

static MIGRATOR: Migrator = sqlx::migrate!("./src/migrations");


#[actix_web::main]
async fn main() -> std::io::Result<()> {
    env_logger::init_from_env(Env::default().default_filter_or("info"));
    dotenv::dotenv().ok();

    rustls::crypto::aws_lc_rs::default_provider()
        .install_default()
        .unwrap();

    let mut certs_file = BufReader::new(File::open("cert.pem").unwrap());
    let mut key_file = BufReader::new(File::open("key.pem").unwrap());
    
    let tls_certs = rustls_pemfile::certs(&mut certs_file)
        .collect::<Result<Vec<_>, _>>()
        .unwrap();
    let tls_key = rustls_pemfile::pkcs8_private_keys(&mut key_file)
        .next()
        .unwrap()
        .unwrap();
    
    let tls_config = rustls::ServerConfig::builder()
        .with_no_client_auth()
        .with_single_cert(tls_certs, rustls::pki_types::PrivateKeyDer::Pkcs8(tls_key))
        .unwrap();
    
    let db_user = dotenv::var("POSTGRES_USER").expect("POSTGRES_USER must be set");
    let db_password = dotenv::var("POSTGRES_PASSWORD").expect("POSTGRES_PASSWORD must be set");
    let db_name = dotenv::var("DATABASE_NAME").expect("DATABASE_NAME must be set");
    
    let smtp_login = dotenv::var("SMTP_LOGIN").expect("SMTP_LOGIN must be set");
    let smtp_password = dotenv::var("SMTP_PASSWORD").expect("SMTP_PASSWORD must be set");
    let smtp_host = dotenv::var("SMTP_HOST").expect("SMTP_HOST must be set");
    let smtp_port = dotenv::var("SMTP_PORT").expect("SMTP_PORT must be set");
    let smtp_from = dotenv::var("SMTP_FROM").expect("SMTP_FROM must be set");

    let pool = PgPoolOptions::new()
        .max_connections(1)
        .connect(format!("postgres://{db_user}:{db_password}@postgres:5432/{db_name}").as_str()).await;
    
    let pool = match pool { 
        Ok(pool) => Arc::new(pool),
        Err(e) => panic!("{}", e.to_string())
    };

    MIGRATOR.run(&*pool).await.unwrap();
    
    
    let review_service = web::Data::new(ReviewService::new(pool.clone()));  
    let timeslot_service = web::Data::new(TimeslotsService::new(pool.clone()));
    let tour_service = web::Data::new(TourService::new(pool.clone()));
    let booking_service = web::Data::new(BookingService::new(pool.clone()));

    let json_cfg = web::Data::new(web::JsonConfig::default()
        .error_handler(|err, _req| {
            let err_msg = err.to_string();
            error::InternalError::from_response(err, HttpResponse::Conflict().json(
                json!({ "msg": Some(err_msg)})
            ).into()).into()
        }));
    
    HttpServer::new(move || {
        App::new()
            .wrap(Cors::default()
                .allowed_origin("http://localhost:3000")
                .allowed_origin("https://localhost:3000")
                .allowed_origin("http://85.208.110.41:3000")
                .allowed_origin("https://85.208.110.41:3000")
                .allowed_origin("https://85.208.110.41")
                .allowed_origin("http://85.208.110.41")
                .allow_any_header()
                .allow_any_method()
                .supports_credentials()
            )
            .wrap(middleware::Logger::default())
            .app_data(json_cfg.clone())

            .app_data(review_service.clone())
            .app_data(timeslot_service.clone())

            .app_data(tour_service.clone())
            .app_data(booking_service.clone())
            .service(presentation::review_controller::create_review)
            .service(presentation::review_controller::get_all_reviews)
            .service(presentation::review_controller::get_excursion_rating)
            .service(presentation::tours_controller::create_tour)
            .service(presentation::tours_controller::delete_tour)
            .service(presentation::tours_controller::get_all_tour)
            .service(presentation::tours_controller::get_tour)
            .service(presentation::timeslot_controller::get_all_timeslots)
            .service(presentation::timeslot_controller::get_all_timeslots)
            .service(presentation::timeslot_controller::create_timeslot)
            .service(presentation::booking_controller::create_booking)
            .service(presentation::booking_controller::cancel_booking)
            .service(presentation::booking_controller::get_booking)
    })
    .bind(("0.0.0.0", 8080))?
    .bind_rustls_0_23(("0.0.0.0", 8443), tls_config)?
    .run()
    .await
}
