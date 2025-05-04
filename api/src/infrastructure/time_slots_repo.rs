use std::sync::Arc;
use chrono::{Duration, NaiveDate, NaiveTime};
use sqlx::{Pool, Postgres, Transaction};
use uuid::Uuid;
use crate::domain::error::AppError;
use crate::domain::timeslot::TimeSlot;
use crate::domain::traits::itimeslot_repo::ITimeSlotsRepo;

pub struct TimeSlotRepo {
    pool: Arc<Pool<Postgres>>,   
}

impl ITimeSlotsRepo for TimeSlotRepo {
    fn new(pool: Arc<Pool<Postgres>>) -> Self {
        Self { pool }   
    }

    async fn get_time_slot(&self, uuid: Uuid) -> Result<TimeSlot, AppError> {
        let res = sqlx::query("SELECT * FROM timeslots WHERE id = $1")
            .bind(uuid.clone())
            .fetch_one(self.pool.as_ref()).await?;
        Ok(TimeSlot::from(&res))
    }
    async fn get_time_slots(&self) -> Result<Vec<TimeSlot>, AppError> {
        let res = sqlx::query("SELECT * FROM timeslots")
            .fetch_all(self.pool.as_ref()).await?;
        let vec = res.iter().map(|row| TimeSlot::from(row)).collect();
        Ok(vec)   
    }

    async fn get_time_slots_by_date(&self, date: NaiveDate, duration: Option<i32>) -> Result<Vec<TimeSlot>, AppError> {
        let time_slots = self.get_time_slots().await?;
        let vec: Vec<TimeSlot> = time_slots.into_iter().filter(|slot| slot.day == date).collect();
        
        if let Some(duration) = duration {
            let duration = Duration::new(duration as i64, 0).unwrap();
            let mut ans: Vec<&TimeSlot> = vec![];
            
            let mut prev_is_booked = false;
            let mut prev_booked_slot: &TimeSlot = &vec[vec.len() - 1];
            
            let mut i: i32 = (vec.len() - 1) as i32;
            
            while i >= 0 {
                let slot = vec.get(i as usize).unwrap();
                if slot.reserved == false && prev_is_booked == false {
                    i -= 1;
                    ans.push(slot);
                } else if slot.reserved == true && prev_is_booked == true {
                    i -= 1;
                } else if slot.reserved == true && prev_is_booked == false {
                    prev_is_booked = true;
                    prev_booked_slot = slot;
                    i -= 1;
                } else if slot.time_from <= prev_booked_slot.time_from - duration {
                    ans.push(slot);
                    prev_is_booked = false;
                    i -= 1;
                }
                
            }
        }
        Ok(vec)  
    }

    async fn add_time_slot(&self, day: NaiveDate, time_from: NaiveTime, time_to: NaiveTime) -> Result<(), AppError> {
        let existing_slot = sqlx::query("SELECT id FROM timeslots WHERE day = $1 AND time_from = $2 AND time_to = $3")
            .bind(day.clone())
            .bind(time_from.clone())
            .bind(time_to.clone())
            .fetch_optional(self.pool.as_ref()).await?;
        
        if existing_slot.is_some() {
            return Ok(());
        }
        
        let _ = sqlx::query("INSERT INTO timeslots (day, time_from, time_to, reserved) VALUES ($1, $2, $3, false)")
            .bind(day.clone())
            .bind(time_from.clone())
            .bind(time_to.clone())
            .execute(self.pool.as_ref()).await?;
        
        Ok(()) 
    }

    async fn delete_time_slot(&self, id: Uuid) -> Result<(), AppError> {
        let query = sqlx::query("DELETE FROM timeslots WHERE id = $1")
            .bind(id.clone())
            .execute(self.pool.as_ref()).await?;
        let res = query.rows_affected();
        if res == 0 {
            return Err(AppError::EditError("Time slot doesn't exists or hasn't been changed".to_string()));
        };
        Ok(())
    }

    async fn unreserve_time_slot_with_tx<'a>(
        &self,
        id: Uuid,
        tx: &mut Transaction<'a, Postgres>,
    ) -> Result<(), AppError> {
        let query = sqlx::query("UPDATE timeslots SET reserved = false WHERE id = $1")
            .bind(id.clone());
        let _ = query.execute(&mut **tx).await?;
        Ok(())
    }

    async fn reserve_time_slot_with_tx<'a>(
        &self,
        id: Uuid,
        tour_id: Uuid,
        tx: &mut Transaction<'a, Postgres>,
    ) -> Result<(), AppError> {
        let query = sqlx::query("UPDATE timeslots SET reserved = true, excursion_id = $2 WHERE id = $1")
            .bind(id.clone())
            .bind(tour_id.clone());
        let res = query.execute(&mut **tx).await?;
        
        if res.rows_affected() == 0 {
            return Err(AppError::EditError("Time slot doesn't exists or hasn't been changed".to_string()));
        };
        
        Ok(())
    }
}