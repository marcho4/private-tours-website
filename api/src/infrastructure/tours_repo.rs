use std::sync::Arc;
use chrono::Duration;
use sqlx::postgres::{PgRow, PgTypeInfo};
use sqlx::{Decode, Pool, Postgres, Row, Type};
use sqlx::error::BoxDynError;
use uuid::Uuid;
use crate::domain::error::AppError;
use crate::domain::tour::Tour;
use crate::domain::traits::itours_repo::IToursRepo;

pub struct ToursRepo {
    pub pool: Arc<Pool<Postgres>>
}

impl IToursRepo for ToursRepo {
    fn from_row(rows: Vec<PgRow>) -> Vec<Tour> {
        let mut tours: Vec<Tour> = Vec::new();
        
        for row in rows {
            let duration: PgInterval = row.get("duration");
            tours.push(Tour {
                id: row.get("id"),
                name: row.get("name"),
                description: row.get("description"),
                short_description: row.get("short_description"),
                price: row.get("price"),
                duration: Duration::from(duration),
                min_persons: row.get("min_persons"),
                max_persons: row.get("max_persons"),
                meeting_place: row.get("meeting_place"),
                is_outdoor: row.get("is_outdoor"),
                is_for_kids: row.get("is_for_kids"),
            });
        }

        tours
    }

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
        is_for_kids: bool) -> Result<(), AppError> {
        let res = sqlx::query("INSERT INTO tours (name, description, short_description, price, duration, min_persons, max_persons, meeting_place, is_outdoor, is_for_kids) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)")
            .bind(name)
            .bind(description)
            .bind(short_description)
            .bind(price)
            .bind(duration)
            .bind(min_persons)
            .bind(max_persons)
            .bind(meeting_place)
            .bind(is_outdoor)
            .bind(is_for_kids)
            .execute(self.pool.as_ref())
            .await?;
        if res.rows_affected() == 0 {
            return Err(AppError::CreationError("Error while creating tour".to_string()));
        }
        Ok(())
    }

    async fn get_all_tours(&self) -> Result<Vec<Tour>, AppError> {
        let tours = sqlx::query("SELECT * FROM tours").fetch_all(self.pool.as_ref()).await?;
        let tours: Vec<Tour> = ToursRepo::from_row(tours);
        Ok(tours)
    }

    async fn delete_tour(&self, id: Uuid) -> Result<(), AppError> {
        let res = sqlx::query("DELETE FROM tours WHERE id = $1")
            .bind(id)
            .execute(self.pool.as_ref())
            .await?;
        if res.rows_affected() == 0 {
            return Err(AppError::TourNotFound(format!("Tour with id {} not found", id)));
        }
        Ok(())
    }

    async fn get_tour_by_id(&self, id: Uuid) -> Result<Tour, AppError> {
        let row = sqlx::query("SELECT * FROM tours WHERE id = $1")
            .bind(id)
            .fetch_one(self.pool.as_ref())
            .await?;

        if row.is_empty() {
            return Err(AppError::TourNotFound(format!("Tour with id {} not found", id)));
        };
        let duration: PgInterval = row.get("duration");

        let tour = Tour {
            id: row.get("id"),
            name: row.get("name"),
            description: row.get("description"),
            short_description: row.get("short_description"),
            price: row.get("price"),
            duration: Duration::from(duration),
            min_persons: row.get("min_persons"),
            max_persons: row.get("max_persons"),
            meeting_place: row.get("meeting_place"),
            is_outdoor: row.get("is_outdoor"),
            is_for_kids: row.get("is_for_kids"),
        };

        Ok(tour)
    }
}

#[derive(Debug, Clone)]
pub struct PgInterval(pub Duration);

impl From<PgInterval> for Duration {
    fn from(interval: PgInterval) -> Self {
        interval.0
    }
}

impl<'r> Decode<'r, Postgres> for PgInterval {
    fn decode(value: sqlx::postgres::PgValueRef<'r>) -> Result<Self, BoxDynError> {
        let pg_interval = sqlx::postgres::types::PgInterval::decode(value)?;

        let duration = Duration::microseconds(
            pg_interval.microseconds
                + (pg_interval.days as i64 * 24 * 60 * 60 * 1_000_000)
                + (pg_interval.months as i64 * 30 * 24 * 60 * 60 * 1_000_000) 
        );

        Ok(PgInterval(duration))
    }
}

impl Type<Postgres> for PgInterval {
    fn type_info() -> PgTypeInfo {
        <sqlx::postgres::types::PgInterval as Type<Postgres>>::type_info()
    }
}