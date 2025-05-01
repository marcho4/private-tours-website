use std::sync::Arc;
use chrono::{NaiveDate, NaiveTime};
use sqlx::{Pool, Postgres, Transaction};
use uuid::Uuid;
use crate::domain::error::AppError;
use crate::domain::timeslot::TimeSlot;

pub trait ITimeSlotsRepo {
    fn new(pool: Arc<Pool<Postgres>>) -> Self;

    async fn get_time_slot(&self, uuid: Uuid) -> Result<TimeSlot, AppError>;
    async fn get_time_slots(&self) -> Result<Vec<TimeSlot>, AppError>;
    async fn get_time_slots_by_date(&self, date: NaiveDate) -> Result<Vec<TimeSlot>, AppError>;

    async fn add_time_slot(&self,
                           day: NaiveDate,
                           time_from: NaiveTime,
                           time_to: NaiveTime,
    ) -> Result<(), AppError>;

    async fn delete_time_slot(&self, id: Uuid) -> Result<(), AppError>;

    async fn unreserve_time_slot_with_tx<'a>(&self, id: Uuid, tx: &mut Transaction<'a, Postgres>) -> Result<(), AppError>;
    async fn reserve_time_slot_with_tx<'a>(
        &self,
        id: Uuid,
        tour_id: Uuid,
        tx: &mut Transaction<'a, Postgres>,
    ) -> Result<(), AppError>;
}