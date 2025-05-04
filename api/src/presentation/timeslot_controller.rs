use crate::presentation::dto::CreateTimeSlotsDTO;
use actix_web::{get, web, Responder, HttpResponse, post};
use chrono::NaiveDate;
use serde::Deserialize;
use uuid::Uuid;
use crate::application::timeslots_service::TimeslotsService;
use crate::domain::error::AppError;
use crate::domain::timeslot::TimeSlot;
use crate::infrastructure::time_slots_repo::TimeSlotRepo;
use crate::presentation::dto::ApiResponse;

#[derive(Deserialize)]
struct SearchParams {
    pub date: Option<NaiveDate>,
    pub duration: Option<i32>,
}

#[get("/timeslots")]
pub async fn get_all_timeslots(
    params: web::Query<SearchParams>,
    timeslots_service: web::Data<TimeslotsService<TimeSlotRepo>>
) -> impl Responder {
    let timeslots: Result<Vec<TimeSlot>, AppError>;

    if params.date.is_some() && params.duration.is_some() {
        timeslots = timeslots_service.get_timeslots_by_date(params.date.unwrap(), params.duration).await;
    } else {
        timeslots = timeslots_service.get_timeslots().await;
    }
    
    match timeslots {
        Ok(timeslots) => {
            HttpResponse::Ok().json(ApiResponse::<Vec<TimeSlot>>{
                message: String::from("Success"),
                data: Some(timeslots),
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

#[post("/timeslots")]
pub async fn create_timeslot(
    body: web::Json<CreateTimeSlotsDTO>,
    timeslots_service: web::Data<TimeslotsService<TimeSlotRepo>>
) -> impl Responder {
    let body = body.into_inner();
    match timeslots_service.create_timeslots(body.date_from, body.date_to, body.time_from, body.time_to).await {
        Ok(_) => {
            HttpResponse::Created().json(ApiResponse::<Vec<TimeSlot>>{
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

#[get("/timeslots/{id}")]
pub async fn get_timeslot(
    timeslots_service: web::Data<TimeslotsService<TimeSlotRepo>>,
    id: web::Path<Uuid>,
) -> impl Responder {
    let id= id.into_inner();

    match timeslots_service.get_timeslot(id).await {
        Ok(timeslots) => {
            HttpResponse::Ok().json(ApiResponse::<TimeSlot>{
                message: String::from("Success"),
                data: Some(timeslots),
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