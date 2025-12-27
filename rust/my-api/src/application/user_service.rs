use std::sync::Arc;
use axum::Json;
use serde_json::Value;

use crate::domain::user::UpdateUserRequest;
use crate::infrastructure::config::AppState;

pub async fn list_users(state: &Arc<AppState>) -> Json<Value> {
    let response = serde_json::json!({
        "message": "Hello, World!",
        "config_value": state.config.example_field,
    });
    Json(response)
}

pub async fn create_user(
    state: &Arc<AppState>, 
    payload: UpdateUserRequest
) -> Json<Value> {
    let response = serde_json::json!({
        "message": "User created successfully",
        "config_value": state.config.example_field,
    });

    println!("Creating user with data: {:#?}", payload);

    Json(response)
}