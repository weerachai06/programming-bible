use axum::{Router, routing::get};
use std::sync::Arc;

mod application;
mod domain;
mod infrastructure;
mod presentation;

use infrastructure::config::AppState;
use presentation::user_controller;

#[tokio::main]
async fn main() {
    // Shared application state
    let shared_state = Arc::new(AppState::new());

    // Build our application with a route
    let app = Router::new()
        .route("/health", get(|| async { "OK" }))
        .nest("/user", user_controller::user_routes())
        .with_state(shared_state);

    // run on port 3000
    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();

    axum::serve(listener, app).await.unwrap();
}
