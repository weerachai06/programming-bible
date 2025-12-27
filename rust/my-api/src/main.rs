use std::sync::Arc;

use axum::{
    Json, Router,
    extract::State,
    routing::{get, post},
};
use serde::{Deserialize, Serialize};
use serde_json::Value;

struct AppConfig {
    example_field: String,
}

struct AppState {
    config: AppConfig,
}

#[derive(Deserialize, Serialize, Debug)]
struct UpdateUserRequest {
    name: Option<String>,
    email: Option<String>,
}

fn user_controller() -> Router<Arc<AppState>> {
    Router::new()
        .route("/list", get(root))
        .route("/create", post(create_user))
}

async fn create_user(Json(payload): Json<UpdateUserRequest>) -> Json<Value> {
    let response = serde_json::json!({
        "message": "User created successfully",
    });

    println!("Creating user with data: {:#?}", payload);

    Json(response)
}

#[tokio::main]
async fn main() {
    // Shared application state
    let shared_state = Arc::new(AppState {
        config: AppConfig {
            example_field: String::from("example_value"),
        },
    });

    // Build our application with a route
    let app = Router::new()
        .route("/health", get(|| async { "OK" }))
        .nest("/user", user_controller())
        .with_state(shared_state);

    // run on port 3000
    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();

    axum::serve(listener, app).await.unwrap();
}

// which calls one of these handlers
async fn root(State(state): State<Arc<AppState>>) -> Json<Value> {
    let response = serde_json::json!({
        "message": "Hello, World!",
        "config_value": state.config.example_field,
    });
    Json(response)
}
