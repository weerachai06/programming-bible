use axum::{
    Json, Router,
    extract::State,
    http::StatusCode,
    response::{IntoResponse, Response},
    routing::{get, post},
};
use serde_json::{Value, json};
use std::sync::Arc;

use crate::domain::res::{AppError, AppResult};
use crate::domain::user::UpdateUserRequest;
use crate::infrastructure::config::AppState;
use crate::{application::user_service, domain::user::UserResponse};

// HTTP mapping for domain errors - belongs in presentation layer
impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        let (status, error_message) = match self {
            AppError::UserNotFound => (StatusCode::NOT_FOUND, "User not found"),
            AppError::InvalidInput(ref msg) => (StatusCode::BAD_REQUEST, msg.as_str()),
            AppError::InternalServerError => {
                (StatusCode::INTERNAL_SERVER_ERROR, "Internal server error")
            }
        };

        let body = json!({
            "error": error_message,
            "status": status.as_u16(),
        });

        (status, Json(body)).into_response()
    }
}

pub fn user_routes() -> Router<Arc<AppState>> {
    Router::new()
        .route("/list", get(list_users))
        .route("/create", post(create_user))
}

async fn list_users(State(state): State<Arc<AppState>>) -> Json<Value> {
    user_service::list_users(&state).await
}

async fn create_user(Json(payload): Json<UpdateUserRequest>) -> AppResult<Json<UserResponse>> {
    user_service::create_user(payload).await
}
