use std::sync::Arc;
use chrono::Local;
use sqlx::{Pool, Postgres};
use uuid::Uuid;
use crate::domain::booking::Booking;
use crate::domain::error::AppError;
use crate::domain::timeslot::TimeSlot;
use crate::domain::traits::ibooking_repo::IBookingRepo;
use crate::domain::traits::itimeslot_repo::ITimeSlotsRepo;
use crate::domain::traits::itours_repo::IToursRepo;
use crate::infrastructure::bookings_repo::BookingsRepo;
use crate::infrastructure::time_slots_repo::TimeSlotRepo;
use crate::infrastructure::tours_repo::ToursRepo;

pub struct BookingService<T> where T: IBookingRepo {
    repo: T,
    timeslot_repo: TimeSlotRepo,
    tours_repo: ToursRepo,
    pool: Arc<Pool<Postgres>>
}

impl BookingService<BookingsRepo> {
    pub fn new(pool: Arc<Pool<Postgres>>) -> Self {
        Self { 
            repo: BookingsRepo::new(pool.clone()), 
            timeslot_repo: TimeSlotRepo::new(pool.clone()),
            pool: pool.clone(),
            tours_repo: ToursRepo { pool },
        }
    }
    
    pub async fn create_booking(&self,
                                persons: i16,
                                name: String,
                                surname: String,
                                email: String,
                                phone_number: String,
                                timeslot_id: Uuid,
                                excursion_id: Uuid,
                                additional_info: String
    ) ->Result<Booking, AppError> {
        let timeslot_info = self.timeslot_repo.get_time_slot(timeslot_id.clone()).await?;
        let timeslots = self.timeslot_repo.get_time_slots_by_date(timeslot_info.day).await?;
        let tour = self.tours_repo.get_tour_by_id(excursion_id.clone()).await?;

        if timeslot_info.reserved {
            return Err(AppError::Forbidden("Timeslot has already been reserved".to_string()));
        }

        if persons < tour.min_persons as i16 || persons > tour.max_persons as i16 {
            return Err(AppError::Forbidden(format!(
                "Persons must be between {} and {}",
                tour.min_persons, tour.max_persons
            )));
        }
        
        // Проверяем не заняты ли следующие слоты в системе
        let mut next_timeslots: Vec<&TimeSlot> = vec![];
        
        if tour.duration > timeslot_info.time_to - timeslot_info.time_from {
            next_timeslots = timeslots.iter()
                .filter(|t| t.time_from < timeslot_info.time_from + tour.duration && t.time_from > timeslot_info.time_from) 
                .collect();
            
            for timeslot in next_timeslots.iter() {
                if timeslot.reserved {
                    return Err(AppError::Forbidden("Timeslot has already been reserved".to_string()));   
                }
            }
        }
        
        let mut tx = self.pool.begin().await?;
        

        for timeslot in next_timeslots.iter() {
            self.timeslot_repo.reserve_time_slot_with_tx(timeslot.id, tour.id.clone(), &mut tx).await?;
        }
        
        self.timeslot_repo.reserve_time_slot_with_tx(timeslot_info.id, tour.id.clone(), &mut tx).await?;
        
        let booking = self.repo.create_booking(
            persons, 
            name,
            surname,
            phone_number,
            timeslot_id,
            excursion_id,
            email.clone(),
            additional_info,
            &mut tx
        ).await?;
        
        tx.commit().await?;
        
        send_email(&email, "Booking Confirmation", "Your booking is confirmed").await?;

        Ok(booking)
    }
    
    pub async fn cancel_booking(&self, id: Uuid, phone_number: String) -> Result<(), AppError> {
        let booking = self.repo.get_booking_details(id.clone()).await?;
        let timeslot = self.timeslot_repo.get_time_slot(booking.timeslot_id.clone()).await?;
        let tour = self.tours_repo.get_tour_by_id(booking.excursion_id.clone()).await?;
        
        // Проверяем, можно ли отменить бронь
        if Local::now().date_naive() > timeslot.day || (Local::now().date_naive() == timeslot.day && Local::now().time() > timeslot.time_from) {
            return Err(AppError::Forbidden("Booking cannot be cancelled".to_string()));
        }

        // Проверяем, совпадает ли номер телефона с номером телефона в бронировании
        if booking.phone_number != phone_number {
            return Err(AppError::Forbidden("Phone number does not match".to_string()));
        }
        
        let mut tx = self.pool.begin().await?;
        self.repo.cancel_booking(id, &mut tx).await?;
        
        let timeslot = self.timeslot_repo.get_time_slot(booking.timeslot_id.clone()).await?;
        let mut timeslots_to_unreserve = vec![timeslot.clone()];
        let timeslots = self.timeslot_repo.get_time_slots_by_date(timeslot.day.clone()).await?;
         
        for timeslot in timeslots.iter() {
            if timeslot.time_from < timeslot.time_from + tour.duration && timeslot.time_from > timeslot.time_from {
                timeslots_to_unreserve.push(timeslot.clone());
            }
        }

        for timeslot in timeslots_to_unreserve.iter() {
            self.timeslot_repo.unreserve_time_slot_with_tx(timeslot.id, &mut tx).await?;
        }

        tx.commit().await?;

        send_email(&booking.email, "Booking Cancelled", "Your booking has been cancelled").await?;
        Ok(())
    }
    
    pub async fn get_booking(&self, uuid: Uuid) -> Result<Booking, AppError> {
        self.repo.get_booking_details(uuid).await
    }
}

async fn send_email(to: &str, subject: &str, body: &str) -> Result<(), AppError> {
    println!("Email to {}: {} – {}", to, subject, body);
    Ok(())
}