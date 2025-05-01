use std::sync::Arc;
use sqlx::{Pool, Postgres, Row};
use sqlx::postgres::PgRow;
use uuid::Uuid;
use crate::domain::error::AppError;
use crate::domain::review::Review;
use crate::domain::traits::ireviews_repo::IReviewsRepo;

pub struct ReviewsRepo {
    pool: Arc<Pool<Postgres>>
}

impl IReviewsRepo for ReviewsRepo {
    fn new(pool: Arc<Pool<Postgres>>) -> Self {
        Self { pool }
    }

    fn parse_rows(rows: Vec<PgRow>) -> Vec<Review> {
        let mut reviews_parsed: Vec<Review> = vec![];
        for row in rows {
            let id: Uuid = row.get("id");
            let rating: f64 = row.get("rating");
            let review: String = row.get("review");
            let written_by: String = row.get("written_by");
            let booking_id: Uuid = row.get("booking_id");
            let excursion_id: Uuid = row.get("excursion_id");
            reviews_parsed.push(Review {
                review,
                written_by,
                rating,
                id: id,
                booking_id: booking_id,
                excursion_id: excursion_id
            })
        }
        reviews_parsed
    }

    async fn create_review(&self, review: String, written_by: String, rating: f64, excursion_id: Uuid, booking_id: Uuid) -> Result<(), AppError> {
        let res = sqlx::query("INSERT INTO Reviews (review, written_by, rating, excursion_id, booking_id) VALUES ($1, $2, $3, $4, $5)")
            .bind(review.clone())
            .bind(written_by.clone())
            .bind(rating.clone())
            .bind(excursion_id.clone())
            .bind(booking_id.clone())
            .execute(self.pool.as_ref()).await;
        match res {
            Ok(_r) => Ok(()),
            Err(e) => Err(AppError::PqError(e))
        }
    }

    async fn get_rating(&self, excursion_id: Uuid) -> Result<Vec<Review>, AppError> {
        let res = sqlx::query("SELECT * FROM reviews WHERE excursion_id = $1")
            .bind(excursion_id)
            .fetch_all(self.pool.as_ref()).await.map_err(|e| AppError::PqError(e))?;
        
        Ok(Self::parse_rows(res))
    }

    async fn get_all_reviews(&self) -> Result<Vec<Review>, AppError> {
        let res = sqlx::query("SELECT * FROM reviews")
            .fetch_all(self.pool.as_ref())
            .await
            .map_err(|e| AppError::PqError(e))?;
        
        Ok(Self::parse_rows(res))
    }

    async fn get_reviews_by_booking_id(&self, booking_id: Uuid) -> Result<Review, AppError> {
        let res = sqlx::query("SELECT * FROM reviews WHERE booking_id = $1")
            .bind(booking_id)
            .fetch_one(self.pool.as_ref())
            .await
            .map_err(|e| AppError::PqError(e))?;
        
        Ok(Review::from(&res))
    }
}