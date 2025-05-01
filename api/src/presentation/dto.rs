use chrono::{Duration, NaiveDate, NaiveTime};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Serialize, Deserialize)]
pub struct CreateReviewDTO {
    pub review: String,
    pub rating: f64,
    pub written_by: String,
    pub booking_id: Uuid,
}

#[derive(Serialize, Deserialize)]
pub struct CreateTourDTO {
    pub name: String,
    pub description: String,
    pub short_description: String,
    pub price: i32,
    pub duration: Duration,
    pub min_persons: i32,
    pub max_persons: i32,
    pub meeting_place: String,
    pub is_outdoor: bool,
    pub is_for_kids: bool,
    pub password: String
}

#[derive(Serialize, Deserialize)]
pub struct DeleteTourDTO {
    pub uuid: Uuid,
    pub password: String
}

#[derive(Serialize, Deserialize)]
pub struct ApiResponse<T> where T: Serialize {
    pub message: String,
    pub data: Option<T>
}

#[derive(Serialize, Deserialize)]
pub struct CreateBookingDto {
    pub persons: i16,
    pub name: String,
    pub surname: String,
    pub email: String,
    pub phone_number: String,
    pub timeslot_id: Uuid,
    pub excursion_id: Uuid,
    pub additional_info: Option<String>
}

#[derive(Serialize, Deserialize)]
pub struct CancelBookingDto {
    pub booking_id: Uuid,
    pub phone_number: String
}

#[derive(Serialize, Deserialize)]
pub struct CreateTimeSlotsDTO {
    pub date_from: NaiveDate,
    pub date_to: NaiveDate,
    pub time_from: NaiveTime,
    pub time_to: NaiveTime
}

