use actix_web::{App, HttpServer};
mod routes; 
mod models;

use routes::get_guide_info::get_guide_info;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            .service(get_guide_info)
    })          
    .bind("0.0.0.0:8080")?
    .run()
    .await
}
