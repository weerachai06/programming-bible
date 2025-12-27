#![allow(dead_code)]
use serde::{Deserialize, Serialize};

// Core business entity - no framework dependencies
#[derive(Debug, Clone)]
pub struct User {
    pub id: u32,
    pub name: String,
    pub email: String,
}

// DTOs for API communication
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CreateUserRequest {
    pub name: String,
    pub email: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UpdateUserRequest {
    pub name: Option<String>,
    pub email: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UserResponse {
    pub id: u32,
    pub name: String,
    pub email: String,
}

// Conversion from Entity to DTO
impl From<User> for UserResponse {
    fn from(user: User) -> Self {
        Self {
            id: user.id,
            name: user.name,
            email: user.email,
        }
    }
}

// Repository interface (belongs to domain)
#[async_trait::async_trait]
pub trait UserRepository {
    async fn find_by_id(&self, id: u32) -> AppResult<Option<User>>;
    async fn find_all(&self) -> AppResult<Vec<User>>;
    async fn save(&self, user: User) -> AppResult<User>;
    async fn update(&self, user: User) -> AppResult<User>;
    async fn delete(&self, id: u32) -> AppResult<()>;
}

use crate::domain::res::AppResult;
