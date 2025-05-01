use sqlx::Error;
use thiserror;

#[derive(thiserror::Error, Debug)]
pub enum AppError {
    #[error("Postgres Error {0}")]
    PqError(#[from] Error),
    #[error("Tour not found {0}")]
    TourNotFound(String),
    #[error("Creation error {0}")]
    CreationError(String),
    #[error("Forbidden {0}")]
    Forbidden(String),
    #[error("Edit error {0}")]
    EditError(String),
}

