use axum::{
    Json,
    http::StatusCode,
    response::{IntoResponse, Response},
};
use serde_json::json;

pub enum AppError {
    UserNotFound,
    InvalidInput(String),
    InternalServerError,
}

impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        let (status, error_message) = match self {
            AppError::UserNotFound => (StatusCode::NOT_FOUND, "Not found".to_string()),
            AppError::InvalidInput(msg) => (StatusCode::BAD_REQUEST, msg),
            AppError::InternalServerError => (
                StatusCode::INTERNAL_SERVER_ERROR,
                String::from("Internal server error"),
            ),
        };

        let body = json!({
            "error": error_message,
            "status": status.as_u16(),
        });

        (status, Json(body)).into_response()
    }
}

impl From<AppError> for Json<serde_json::Value> {
    fn from(err: AppError) -> Self {
        let (status, error_message) = match err {
            AppError::UserNotFound => (StatusCode::NOT_FOUND, "Not found".to_string()),
            AppError::InvalidInput(msg) => (StatusCode::BAD_REQUEST, msg),
            AppError::InternalServerError => (
                StatusCode::INTERNAL_SERVER_ERROR,
                String::from("Internal server error"),
            ),
        };

        let body = json!({
            "error": error_message,
            "status": status.as_u16(),
        });

        Json(body)
    }
}

// Helper type alias for Results
pub type AppResult<T> = Result<T, AppError>;

impl From<serde_json::Error> for AppError {
    fn from(_: serde_json::Error) -> Self {
        Self::InvalidInput("Invalid JSON format".to_string())
    }
}
