

#[derive(Debug, thiserror::Error)]
pub enum ServiceError {
    #[error("Booking not found")]
    BookingNotFound,
    #[error("Booking already exists")]
    BookingAlreadyExists,
    #[error("Booking update failed")]
    BookingUpdateFailed,
    #[error("Booking delete failed")]
    BookingDeleteFailed,
}

