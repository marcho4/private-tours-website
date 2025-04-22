

pub trait BookingsProvider {
    pub async fn cancel_booking(&self, id: i32) -> Result<(), ServiceError>;
    pub async fn create_booking(&self, booking: Booking) -> Result<Booking, ServiceError>;
    pub async fn get_booking(&self, id: i32) -> Result<Booking, ServiceError>;
}

pub struct BookingsProvider {
    repo: Arc<dyn BookingsRepo>,
}

impl BookingsProvider for BookingsProvider {
    async fn cancel_booking(&self, id: i32) -> Result<(), ServiceError> {
        self.repo.delete_booking(id).await
    }
    async fn create_booking(&self, booking: Booking) -> Result<Booking, ServiceError> {
        self.repo.create_booking(booking).await
    }
    async fn get_booking(&self, id: i32) -> Result<Booking, ServiceError> {
        self.repo.get_booking(id).await
    }
}   







