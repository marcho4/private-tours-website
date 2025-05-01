use std::sync::Arc;
use sqlx::{Pool, Postgres};
use sqlx::postgres::PgRow;
use uuid::Uuid;
use crate::domain::error::AppError;
use crate::domain::review::Review;

pub trait IReviewsRepo {
    fn new(pool: Arc<Pool<Postgres>>) -> Self;
    fn parse_rows(rows: Vec<PgRow>) -> Vec<Review>;
    async fn create_review(&self, review: String, written_by: String, rating: f64, excursion_id: Uuid, booking_id: Uuid) -> Result<(), AppError>;
    async fn get_rating(&self, excursion_id: Uuid) -> Result<Vec<Review>, AppError>;
    async fn get_all_reviews(&self) -> Result<Vec<Review>, AppError>;
    async fn get_reviews_by_booking_id(&self, booking_id: Uuid) -> Result<Review, AppError>;
}
