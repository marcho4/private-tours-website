use chrono::{NaiveDate, NaiveTime};
use serde::{Deserialize, Serialize};
use sqlx::postgres::PgRow;
use sqlx::Row;
use uuid::Uuid;

#[derive(Serialize, Deserialize, Clone)]
pub struct TimeSlot {
    pub id: Uuid,
    pub day: NaiveDate,
    pub time_from: NaiveTime,
    pub time_to: NaiveTime,
    pub reserved: bool,
    pub excursion_id: Option<Uuid>,
}

impl From<&PgRow> for TimeSlot {
    fn from(value: &PgRow) -> Self {
        Self {
            id: value.get("id"),
            day: value.get("day"),
            time_from: value.get("time_from"),
            time_to: value.get("time_to"),
            reserved: value.get("reserved"),
            excursion_id: value.get("excursion_id"),
        }
    }
}