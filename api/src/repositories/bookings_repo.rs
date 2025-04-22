


pub trait BookingsRepo {
    pub async fn create_booking(&self, booking: Booking) -> Result<Booking, Error>;
    pub async fn get_booking(&self, id: i32) -> Result<Booking, Error>;
    pub async fn update_booking(&self, id: i32, booking: Booking) -> Result<Booking, Error>;
    pub async fn delete_booking(&self, id: i32) -> Result<(), Error>;
}



