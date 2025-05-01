use serde::{Deserialize, Serialize};
use uuid::Uuid;
use chrono::Duration;

#[derive(Serialize, Deserialize)]
pub struct Tour {
    pub id: Uuid,
    pub name: String,
    pub short_description: String,
    pub description: String,
    pub price: i32,
    pub duration: Duration,
    pub min_persons: i32,
    pub max_persons: i32,
    pub meeting_place: String,
    pub is_outdoor: bool,
    pub is_for_kids: bool,
}
