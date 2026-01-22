#![allow(dead_code)]
/// Pure domain errors - no HTTP or framework dependencies
/// Represents business rule violations and domain-specific errors
#[derive(Debug, Clone)]
pub enum AppError {
    UserNotFound,
    InvalidInput(String),
    InternalServerError,
}

impl std::fmt::Display for AppError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            AppError::UserNotFound => write!(f, "User not found"),
            AppError::InvalidInput(msg) => write!(f, "Invalid input: {}", msg),
            AppError::InternalServerError => write!(f, "Internal server error"),
        }
    }
}

impl std::error::Error for AppError {}

// Helper type alias for Results
pub type AppResult<T> = Result<T, AppError>;

impl From<serde_json::Error> for AppError {
    fn from(_: serde_json::Error) -> Self {
        Self::InvalidInput("Invalid JSON format".to_string())
    }
}
