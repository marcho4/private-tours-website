use std::sync::Arc;
use chrono::Duration;
use sqlx::{Pool, Postgres};
use uuid::Uuid;
use crate::domain::error::AppError;
use crate::domain::tour::Tour;
use crate::domain::traits::itours_repo::IToursRepo;
use crate::infrastructure::tours_repo::ToursRepo;

pub struct TourService<T> where T: IToursRepo {
    pub repo: T,
}

impl TourService<ToursRepo> {
    pub fn new(pool: Arc<Pool<Postgres>>) -> Self {
        Self { 
            repo: ToursRepo { pool: pool.clone() } 
        }
    }
    
    pub async fn get_all_tours(&self) -> Result<Vec<Tour>, AppError> {
        self.repo.get_all_tours().await
    }
    
    pub async fn get_tour_by_id(&self, id: Uuid) -> Result<Tour, AppError> {
        self.repo.get_tour_by_id(id).await
    }
    
    pub async fn create_tour(&self, 
                             name: String,
                             description: String,
                             short_description: String,
                             price: i32,
                             duration: Duration,
                             min_persons: i32,
                             max_persons: i32,
                             meeting_place: String,
                             is_outdoor: bool,
                             is_for_kids: bool,
                             password: String,
    ) -> Result<(), AppError> {
        
        if password != "NatashaTopGuide" {
            return Err(AppError::Forbidden("Wrong password".to_string()));
        }
        
        self.repo.create_tour(name, 
                              description, 
                              short_description, 
                              price, 
                              duration, 
                              min_persons, 
                              max_persons, 
                              meeting_place,
                              is_outdoor, 
                              is_for_kids).await
    }
    
    pub async fn delete_tour(&self, id: Uuid, password: String) -> Result<(), AppError> {
        if password != "NatashaTopGuide" {
            return Err(AppError::Forbidden("Wrong password".to_string()));
        }
        self.repo.delete_tour(id).await
    }
}