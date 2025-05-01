use std::sync::Arc;
use chrono::{NaiveDate, NaiveTime, Timelike};
use sqlx::{Pool, Postgres};
use uuid::Uuid;
use crate::domain::error::AppError;
use crate::domain::timeslot::TimeSlot;
use crate::domain::traits::itimeslot_repo::ITimeSlotsRepo;
use crate::infrastructure::time_slots_repo::TimeSlotRepo;

pub struct TimeslotsService<T> where T: ITimeSlotsRepo {
    repo: T,
}

impl TimeslotsService<TimeSlotRepo> {
    pub fn new(pool: Arc<Pool<Postgres>>) -> Self {
        Self {
            repo: TimeSlotRepo::new(pool),
        }
    }
    
    pub async fn get_timeslots_by_date(&self, date: NaiveDate) -> Result<Vec<TimeSlot>, AppError> {
        self.repo.get_time_slots_by_date(date).await
    }
    
    pub async fn get_timeslots(&self) -> Result<Vec<TimeSlot>, AppError> {
        self.repo.get_time_slots().await   
    }
    
    pub async fn get_timeslot(&self, id: Uuid) -> Result<TimeSlot, AppError> {
        self.repo.get_time_slot(id).await
    }
    
    pub async fn create_timeslots(&self, 
                                  date_from: NaiveDate, 
                                  date_to: NaiveDate, 
                                  time_from: NaiveTime, 
                                  time_to: NaiveTime
    ) -> Result<(), AppError> {
        let mut created_timeslots = Vec::new();
        let mut current_date = date_from;
        
        while current_date <= date_to {
            let mut current_time = time_from;
            
            while current_time < time_to {
                let next_time = if current_time.hour() == 23 {
                    NaiveTime::from_hms_opt(0, 0, 0).unwrap()
                } else {
                    NaiveTime::from_hms_opt(current_time.hour() + 1, 0, 0).unwrap()
                };
                
                let end_time = if next_time <= time_to {
                    next_time
                } else {
                    time_to
                };
                
                let timeslot = self.repo.add_time_slot(current_date, current_time, end_time).await?;
                created_timeslots.push(timeslot);
                
                current_time = next_time;
            }
            
            current_date = current_date.succ_opt().unwrap();
        }
        
        Ok(())
    }
}