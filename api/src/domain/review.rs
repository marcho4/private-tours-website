use serde::{Deserialize, Serialize};
use sqlx::postgres::PgRow;
use sqlx::Row;
use uuid::Uuid;



#[derive(Serialize, Deserialize)]
pub struct Review {
    pub review: String,
    pub written_by: String,
    pub rating: f64,
    pub id: Uuid,
    pub booking_id: Uuid,
    pub excursion_id: Uuid
}

impl From<&PgRow> for Review {
    fn from(row: &PgRow) -> Self {
        Self { 
            review: row.get("review"), 
            written_by: row.get("written_by"), 
            rating: row.get("rating"), 
            id: row.get("id"), 
            booking_id: row.get("booking_id"),
            excursion_id: row.get("excursion_id") 
        }
    }
}