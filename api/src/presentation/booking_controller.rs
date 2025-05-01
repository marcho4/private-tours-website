use crate::domain::booking::Booking;
use actix_web::{get, HttpResponse};
use actix_web::{delete, post, Responder, web};
use uuid::Uuid;
use crate::application::bookings_service::BookingService;
use crate::infrastructure::bookings_repo::BookingsRepo;
use crate::presentation::dto::ApiResponse;
use crate::presentation::dto::CreateBookingDto;
use crate::presentation::dto::CancelBookingDto;

#[post("/booking")]
pub async fn create_booking(
    booking_service: web::Data<BookingService<BookingsRepo>>,
    body: web::Json<CreateBookingDto>
) -> impl Responder {
    let body = body.into_inner();
    let booking = booking_service.create_booking(body.persons, body.name, body.surname, body.email, body.phone_number, body.timeslot_id, body.excursion_id, body.additional_info.unwrap_or_default()).await;
    match booking {
        Ok(booking) => {
            HttpResponse::Created().json(ApiResponse::<Booking>{
                message: "Booking created successfully".to_string(),
                data: Some(booking)
            })
        }
        Err(e) => {
            HttpResponse::BadRequest().json(ApiResponse::<()>{
                message: e.to_string(),
                data: None
            })
        }
    }
}

#[delete("/booking")]
pub async fn cancel_booking(
    booking_service: web::Data<BookingService<BookingsRepo>>,
    body: web::Json<CancelBookingDto>
) -> impl Responder {
    let body = body.into_inner();
    let booking = booking_service.cancel_booking(body.booking_id, body.phone_number).await;
    match booking {
        Ok(_) => {
            HttpResponse::Ok().json(ApiResponse::<()>{
                message: "Booking cancelled successfully".to_string(),
                data: None
            })
        }
        Err(e) => {
            HttpResponse::BadRequest().json(ApiResponse::<()>{
                message: e.to_string(),
                data: None
            })
        }
    }
}

#[get("/booking/{id}")]
pub async fn get_booking(
    booking_service: web::Data<BookingService<BookingsRepo>>,
    id: web::Path<Uuid>
) -> impl Responder {
    let booking = booking_service.get_booking(id.into_inner()).await;
    match booking {
        Ok(booking) => {
            HttpResponse::Ok().json(ApiResponse::<Booking>{
                message: "Booking retrieved successfully".to_string(),
                data: Some(booking)
            })
        },
        Err(e) => {
            HttpResponse::BadRequest().json(ApiResponse::<()>{
                message: e.to_string(),
                data: None
            })
        }
    }
}