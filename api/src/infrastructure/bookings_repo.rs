use std::sync::Arc;
use sqlx::{Pool, Postgres, Transaction};
use uuid::Uuid;
use crate::domain::booking::Booking;
use crate::domain::error::AppError;
use crate::domain::traits::ibooking_repo::IBookingRepo;

pub struct BookingsRepo {
    pool: Arc<Pool<Postgres>>
}

impl IBookingRepo for BookingsRepo {
    fn new(pool: Arc<Pool<Postgres>>) -> Self {
        Self { pool }
    }

    async fn create_booking<'a>(&self, 
        persons: i16, 
        name: String, 
        surname: String,
        phone_number: String, 
        timeslot_id: Uuid, 
        excursion_id: Uuid, 
        email: String, 
        additional_info: String,
        tx: &mut Transaction<'a, Postgres>
    ) -> Result<Booking, AppError> {
        let booking = sqlx::query("INSERT INTO bookings (persons, name, surname, phone_number, timeslot_id,
                      email, excursion_id, additional_info) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                      RETURNING *")
            .bind(persons)
            .bind(name)
            .bind(surname)
            .bind(phone_number)
            .bind(timeslot_id)
            .bind(email)
            .bind(excursion_id)
            .bind(additional_info)
            .fetch_one(&mut **tx)
            .await
            .map_err(|e| AppError::PqError(e))?;
        Ok(Booking::from(&booking))
    }

    async fn cancel_booking(&self, id: Uuid, tx: &mut Transaction<'_, Postgres>) -> Result<(), AppError> {
        sqlx::query("DELETE FROM bookings WHERE id = $1")
            .bind(id)
            .execute(&mut **tx)
            .await
            .map_err(|e| AppError::PqError(e))?;
        Ok(())
    }

    async fn get_all_bookings(&self) -> Result<Vec<Booking>, AppError> {
        let rows = sqlx::query("SELECT * FROM bookings")
            .fetch_all(self.pool.as_ref())
            .await
            .map_err(|e| AppError::PqError(e))?;
        
        Ok(rows.iter().map(|row| Booking::from(row)).collect())
    }

    async fn get_booking_details(&self, id: Uuid) -> Result<Booking, AppError> {
        let res = sqlx::query("SELECT * FROM bookings WHERE id = $1")
            .bind(id)
            .fetch_one(self.pool.as_ref()).await;

        match res { 
            Ok(row) => Ok(Booking::from(&row)),
            Err(e) => Err(AppError::Forbidden(e.to_string()))
        }
    }
}


