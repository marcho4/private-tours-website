use serde::{Deserialize, Serialize};
use sqlx::postgres::PgRow;
use sqlx::Row;
use uuid::Uuid;

#[derive(Serialize, Deserialize)]
pub struct Booking {
    pub id: Uuid,
    pub persons: i16,
    pub timeslot_id: Uuid,
    pub name: String,
    pub surname: String,
    pub email: String,
    pub phone_number: String,
    pub additional_info: String,
    pub excursion_id: Uuid,
}

impl From<&PgRow> for Booking {
    fn from(value: &PgRow) -> Self {
        Self {
            id: value.get("id"),
            persons: value.get("persons"),
            timeslot_id: value.get("timeslot_id"),
            name: value.get("name"),
            surname: value.get("surname"),
            email: value.get("email"),
            phone_number: value.get("phone_number"),
            additional_info: value.get("additional_info"),  
            excursion_id: value.get("excursion_id"),
        }
    }
}