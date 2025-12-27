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

#[derive(Debug, Clone)]
pub struct AppState {
    pub config: AppConfig,
}

impl AppState {
    pub fn new() -> Self {
        Self {
            config: AppConfig::new(),
        }
    }
}

impl Default for AppState {
    fn default() -> Self {
        Self::new()
    }
}