use axum::{
    Json, Router,
    extract::{Path, State},
    http::StatusCode,
    response::{IntoResponse, Response},
    routing::get,
};
use serde_json::json;
use std::sync::Arc;

use crate::application::user_service::UserService;
use crate::domain::res::{AppError, AppResult};
use crate::domain::user::{CreateUserRequest, UpdateUserRequest, UserResponse};
use crate::infrastructure::config::AppState;

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
        .route("/", get(list_users).post(create_user))
        .route(
            "/{id}",
            get(get_user_by_id).put(update_user).delete(delete_user),
        )
}

async fn list_users(State(state): State<Arc<AppState>>) -> AppResult<Json<Vec<UserResponse>>> {
    let user_service = UserService::new(state.user_repository.clone());
    let users = user_service.list_users().await?;
    let responses: Vec<UserResponse> = users.into_iter().map(|u| u.into()).collect();
    Ok(Json(responses))
}

async fn create_user(
    State(state): State<Arc<AppState>>,
    Json(payload): Json<CreateUserRequest>,
) -> AppResult<Json<UserResponse>> {
    let user_service = UserService::new(state.user_repository.clone());
    let user = user_service.create_user(payload).await?;
    Ok(Json(user.into()))
}

async fn get_user_by_id(
    State(state): State<Arc<AppState>>,
    Path(id): Path<u32>,
) -> AppResult<Json<UserResponse>> {
    let user_service = UserService::new(state.user_repository.clone());
    let user = user_service.get_user_by_id(id).await?;
    Ok(Json(user.into()))
}

async fn update_user(
    State(state): State<Arc<AppState>>,
    Path(id): Path<u32>,
    Json(payload): Json<UpdateUserRequest>,
) -> AppResult<Json<UserResponse>> {
    let user_service = UserService::new(state.user_repository.clone());
    let user = user_service.update_user(id, payload).await?;
    Ok(Json(user.into()))
}

async fn delete_user(
    State(state): State<Arc<AppState>>,
    Path(id): Path<u32>,
) -> AppResult<StatusCode> {
    let user_service = UserService::new(state.user_repository.clone());
    user_service.delete_user(id).await?;
    Ok(StatusCode::NO_CONTENT)
}
