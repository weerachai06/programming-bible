#![allow(dead_code)]
#[derive(Debug, Clone)]
pub struct AppConfig {
    pub example_field: String,
}

impl AppConfig {
    pub fn new() -> Self {
        Self {
            example_field: String::from("example_value"),
        }
    }
}

impl Default for AppConfig {
    fn default() -> Self {
        Self::new()
    }
}

pub struct AppState {
    pub config: AppConfig,
    pub user_repository: std::sync::Arc<dyn crate::domain::user::UserRepository + Send + Sync>,
}

impl std::fmt::Debug for AppState {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.debug_struct("AppState")
            .field("config", &self.config)
            .field("user_repository", &"UserRepository")
            .finish()
    }
}

impl AppState {
    pub fn new() -> Self {
        Self {
            config: AppConfig::new(),
            user_repository: std::sync::Arc::new(
                crate::infrastructure::repository::InMemoryUserRepository::new(),
            ),
        }
    }
}

impl Default for AppState {
    fn default() -> Self {
        Self::new()
    }
}
