use axum::Json;
use serde_json::Value;
use std::sync::Arc;

use crate::domain::res::{AppError, AppResult};
use crate::domain::user::{UpdateUserRequest, UserResponse};
use crate::infrastructure::config::AppState;

pub async fn list_users(state: &Arc<AppState>) -> Json<Value> {
    let response = serde_json::json!({
        "message": "Hello, World!",
        "config_value": state.config.example_field,
    });
    Json(response)
}

pub async fn create_user(payload: UpdateUserRequest) -> AppResult<Json<UserResponse>> {
    println!("Creating user with data: {:#?}", payload);

    let user = match payload {
        UpdateUserRequest {
            name: Some(name),
            email: Some(email),
        } => UserResponse { id: 1, name, email },
        _ => {
            return Err(AppError::InvalidInput(
                "Name and email are required".to_string(),
            ));
        }
    };

    Ok(Json(user))
}
