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
use serde_json::json;

mod domain;
mod presentation;
mod application;
mod infrastructure;

static MIGRATOR: Migrator = sqlx::migrate!("src/migrations");


#[actix_web::main]
async fn main() -> std::io::Result<()> {
    env_logger::init_from_env(Env::default().default_filter_or("info"));
    dotenv::dotenv().ok();
    
    let db_user = dotenv::var("POSTGRES_USER").expect("POSTGRES_USER must be set");
    let db_password = dotenv::var("POSTGRES_PASSWORD").expect("POSTGRES_PASSWORD must be set");
    let db_name = dotenv::var("DATABASE_NAME").expect("DATABASE_NAME must be set");

    let pool = PgPoolOptions::new()
        .max_connections(1)
        .connect(format!("postgres://{db_user}:{db_password}@0.0.0.0:5432/{db_name}").as_str()).await;
    
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
    .bind("0.0.0.0:8080")?
    .run()
    .await
}
