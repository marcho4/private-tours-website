use std::sync::Arc;
use chrono::{Local, TimeZone};
use sqlx::{Pool, Postgres};
use uuid::Uuid;
use crate::domain::error::AppError;
use crate::domain::review::Review;
use crate::domain::traits::ibooking_repo::IBookingRepo;
use crate::domain::traits::itours_repo::IToursRepo;
use crate::infrastructure::reviews_repo::ReviewsRepo;
use crate::domain::traits::ireviews_repo::IReviewsRepo;
use crate::infrastructure::tours_repo::ToursRepo;
use crate::infrastructure::bookings_repo::BookingsRepo;
use crate::infrastructure::time_slots_repo::TimeSlotRepo;
use crate::domain::traits::itimeslot_repo::ITimeSlotsRepo;

pub struct ReviewService<T, U, V, W> where T: IReviewsRepo, U: IToursRepo, V: IBookingRepo, W: ITimeSlotsRepo {
    reviews_repo: T,
    tours_repo: U,
    bookings_repo: V,
    timeslot_repo: W
}

impl ReviewService<ReviewsRepo, ToursRepo, BookingsRepo, TimeSlotRepo> {
    pub fn new(pg_pool: Arc<Pool<Postgres>>) -> Self {
        Self {
            reviews_repo: ReviewsRepo::new(pg_pool.clone()),
            bookings_repo: BookingsRepo::new(pg_pool.clone()),
            timeslot_repo: TimeSlotRepo::new(pg_pool.clone()),
            tours_repo: ToursRepo {pool: pg_pool.clone()},
        }
    }
    
    pub async fn create_review(&self, review: String, written_by: String, rating: f64, booking_id: Uuid) -> Result<(), AppError> {
        let booking = self.bookings_repo.get_booking_details(booking_id).await?;
        let timeslot = self.timeslot_repo.get_time_slot(booking.timeslot_id).await?;

        let end_naive = timeslot.day.and_time(timeslot.time_to);
        let end_dt    = Local.from_local_datetime(&end_naive).unwrap();
        if Local::now() < end_dt {
            return Err(AppError::Forbidden("You can write a review after the excursion".to_string()));
        }

        if self.reviews_repo.get_reviews_by_booking_id(booking_id).await.is_ok() {
            return Err(AppError::Forbidden("You have already written a review for this booking".to_string()));
        }
        
        self.reviews_repo.create_review(review, written_by, rating, booking.excursion_id, booking_id).await
    }
    
    pub async fn get_excursion_rating(&self, excursion_id: Uuid) -> Result<f64, AppError> {
        let reviews = self.reviews_repo.get_rating(excursion_id).await?;
        let mut sum: f64 = 0.0;
        reviews.iter().for_each(|r| sum += r.rating);
        let res_len = reviews.len();
        
        if res_len == 0 {
            return Ok(-1.0)
        }
        
        Ok(sum / res_len as f64)
    }
    
    pub async fn get_all_reviews(&self) -> Result<Vec<Review>, AppError> {
        self.reviews_repo.get_all_reviews().await
    }
}