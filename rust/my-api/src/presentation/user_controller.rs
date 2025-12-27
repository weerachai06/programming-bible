use std::sync::Arc;
use axum::{
    Json, Router,
    extract::State,
    routing::{get, post},
};
use serde_json::Value;

use crate::domain::user::{UpdateUserRequest};
use crate::infrastructure::config::AppState;
use crate::application::user_service;

pub fn user_routes() -> Router<Arc<AppState>> {
    Router::new()
        .route("/list", get(list_users))
        .route("/create", post(create_user))
}

async fn list_users(State(state): State<Arc<AppState>>) -> Json<Value> {
    user_service::list_users(&state).await
}

async fn create_user(
    State(state): State<Arc<AppState>>,
    Json(payload): Json<UpdateUserRequest>
) -> Json<Value> {
    user_service::create_user(&state, payload).await
}