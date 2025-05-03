use actix_web::{web, post, Responder, HttpResponse, get};
use actix_web::web::Json;
use serde_json::json;
use uuid::Uuid;
use crate::presentation::dto::CreateReviewDTO;
use crate::application::review_service::ReviewService;
use crate::infrastructure::reviews_repo::ReviewsRepo;
use crate::infrastructure::tours_repo::ToursRepo;
use crate::infrastructure::bookings_repo::BookingsRepo;
use crate::infrastructure::time_slots_repo::TimeSlotRepo;

type ReviewServiceData = web::Data<ReviewService<ReviewsRepo, ToursRepo, BookingsRepo, TimeSlotRepo>>;


#[post("/reviews")]
pub async fn create_review(
    body: Json<CreateReviewDTO>,
    review_service: ReviewServiceData
) -> impl Responder {
    let body = body.into_inner();
    match review_service.create_review(body.review, body.written_by, body.rating, body.booking_id).await {
        Ok(_res) => HttpResponse::Created().json(json!({
            "message": "Successfully created review!"
        })),
        Err(e) => HttpResponse::InternalServerError().json(json!({
            "error": e.to_string()
        }))
    }
}

#[get("/reviews")]
pub async fn get_all_reviews(
    review_service: ReviewServiceData
) -> impl Responder {
    match review_service.get_all_reviews().await {
        Ok(res) => HttpResponse::Ok().json(json!({
            "message": "Successfully got all reviews",
            "data": res
        })),
        Err(e) => HttpResponse::InternalServerError().json(json!({
            "error": e.to_string()
        }))
    }
}

#[get("/reviews/rating/{excursion_id}")]
pub async fn get_excursion_rating (
    excursion_id: web::Path<Uuid>,
    review_service: ReviewServiceData
) -> impl Responder {
    match review_service.get_excursion_rating(excursion_id.into_inner()).await {
        Ok(res) => HttpResponse::Ok().json(json!({
            "message": "Successfully got rating",
            "data": res
        })),
        Err(e) => HttpResponse::InternalServerError().json(json!({
            "error": e.to_string()
        }))
    }
}