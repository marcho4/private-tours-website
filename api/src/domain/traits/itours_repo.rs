use chrono::Duration;
use sqlx::postgres::PgRow;
use crate::domain::error::AppError;
use crate::domain::tour::Tour;
use uuid::Uuid;

pub trait IToursRepo {
    fn from_row(rows: Vec<PgRow>) -> Vec<Tour>;
    async fn create_tour(&self,
                         name: String,
                         description: String,
                         short_description: String,
                         price: i32,
                         duration: Duration,
                         min_persons: i32,
                         max_persons: i32,
                         meeting_place: String,
                         is_outdoor: bool,
                         is_for_kids: bool) -> Result<(), AppError>;
    async fn get_all_tours(&self) -> Result<Vec<Tour>, AppError>;
    async fn delete_tour(&self, id: Uuid) -> Result<(), AppError>;
    async fn get_tour_by_id(&self, id: Uuid) -> Result<Tour, AppError>;
}