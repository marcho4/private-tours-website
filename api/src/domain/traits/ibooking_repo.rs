use std::sync::Arc;
use sqlx::{Pool, Postgres, Transaction};
use uuid::Uuid;
use crate::domain::booking::Booking;
use crate::domain::error::AppError;

pub trait IBookingRepo {
    fn new(pool: Arc<Pool<Postgres>>) -> Self;
    async fn create_booking<'a>(&self, persons: i16,
                            name: String, 
                            surname: String,
                            phone_number: String,
                            timeslot_id: Uuid,
                            excursion_id: Uuid,
                            email: String,
                            additional_info: String,
                            tx: &mut Transaction<'a, Postgres>
    ) -> Result<Booking, AppError>;
    
    async fn cancel_booking(&self, id: Uuid, tx: &mut Transaction<'_, Postgres>) -> Result<(), AppError>;
    async fn get_all_bookings(&self) -> Result<Vec<Booking>, AppError>;
    async fn get_booking_details(&self, id: Uuid) -> Result<Booking, AppError>;
}