use actix_web::{delete, get, post, web, HttpResponse, Responder};
use uuid::Uuid;
use crate::application::tour_service::TourService;
use crate::domain::tour::Tour;
use crate::infrastructure::tours_repo::ToursRepo;
use crate::presentation::dto::{ApiResponse, CreateTourDTO, DeleteTourDTO};

#[get("/tours")]
pub async fn get_all_tour(
    tours_service: web::Data<TourService<ToursRepo>>
) -> impl Responder {
    let tours = tours_service.get_all_tours().await;
    match tours {
        Ok(tours) => {
            HttpResponse::Ok().json(ApiResponse::<Vec<Tour>>{
                message: String::from("Success"),
                data: Some(tours),
            })
        }
        Err(e) => {
            HttpResponse::InternalServerError().json(ApiResponse::<String>{
                message: e.to_string(),
                data: None,           
            })
        }
    }
}

#[get("/tours/{id}")]
pub async fn get_tour(
    tours_service: web::Data<TourService<ToursRepo>>,
    id: web::Path<Uuid>
) -> impl Responder {
    let tours = tours_service.get_tour_by_id(id.into_inner()).await;
    match tours {
        Ok(tours) => {
            HttpResponse::Ok().json(ApiResponse::<Tour>{
                message: String::from("Success"),
                data: Some(tours),
            })
        }
        Err(e) => {
            HttpResponse::InternalServerError().json(ApiResponse::<String>{
                message: e.to_string(),
                data: None,
            })
        }
    }
}

#[post("/tours")]
pub async fn create_tour(
    tours_service: web::Data<TourService<ToursRepo>>,
    body: web::Json<CreateTourDTO>
) -> impl Responder {
    let body = body.into_inner();
    let tour = tours_service.create_tour(
        body.name,
        body.description,
        body.short_description,
        body.price,
        body.duration,
        body.min_persons,
        body.max_persons,
        body.meeting_place,
        body.is_outdoor,
        body.is_for_kids,
        body.password
    ).await;
    match tour {
        Ok(_tour) => {
            HttpResponse::Created().json(ApiResponse::<Tour>{
                message: String::from("Success"),
                data: None,
            })
        }
        Err(e) => {
            HttpResponse::InternalServerError().json(ApiResponse::<String>{
                message: e.to_string(),
                data: None,           
            })
        }
    }
}

#[delete("/tours")]
pub async fn delete_tour(
    tours_service: web::Data<TourService<ToursRepo>>,
    body: web::Json<DeleteTourDTO>
) -> impl Responder {
    let body = body.into_inner();
    let res = tours_service.delete_tour(body.uuid, body.password).await;
    match res {
        Ok(_) => {
            HttpResponse::Ok().json(ApiResponse::<String>{
                message: String::from("Successfully deleted"),
                data: None,
            })
        }
        Err(e) => {
            HttpResponse::InternalServerError().json(ApiResponse::<String>{
                message: e.to_string(),
                data: None,
            })
        }
    }
    
}
