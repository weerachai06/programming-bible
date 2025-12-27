use std::sync::Arc;

use crate::domain::res::{AppError, AppResult};
use crate::domain::user::{CreateUserRequest, UpdateUserRequest, User, UserRepository};

// Pure use cases - no HTTP dependencies
pub struct UserService {
    repository: Arc<dyn UserRepository + Send + Sync>,
}

impl UserService {
    pub fn new(repository: Arc<dyn UserRepository + Send + Sync>) -> Self {
        Self { repository }
    }

    pub async fn list_users(&self) -> AppResult<Vec<User>> {
        self.repository.find_all().await
    }

    pub async fn create_user(&self, request: CreateUserRequest) -> AppResult<User> {
        // Validation
        if request.name.trim().is_empty() {
            return Err(AppError::InvalidInput("Name cannot be empty".to_string()));
        }

        if request.email.trim().is_empty() || !request.email.contains('@') {
            return Err(AppError::InvalidInput("Invalid email format".to_string()));
        }

        // Create user entity
        let user = User {
            id: 0, // Will be set by repository
            name: request.name,
            email: request.email,
        };

        self.repository.save(user).await
    }

    pub async fn get_user_by_id(&self, id: u32) -> AppResult<User> {
        match self.repository.find_by_id(id).await? {
            Some(user) => Ok(user),
            None => Err(AppError::UserNotFound),
        }
    }

    pub async fn update_user(&self, id: u32, request: UpdateUserRequest) -> AppResult<User> {
        let mut user = self.get_user_by_id(id).await?;

        // Apply updates
        if let Some(name) = request.name {
            if name.trim().is_empty() {
                return Err(AppError::InvalidInput("Name cannot be empty".to_string()));
            }
            user.name = name;
        }

        if let Some(email) = request.email {
            if email.trim().is_empty() || !email.contains('@') {
                return Err(AppError::InvalidInput("Invalid email format".to_string()));
            }
            user.email = email;
        }

        self.repository.update(user).await
    }

    pub async fn delete_user(&self, id: u32) -> AppResult<()> {
        self.repository.delete(id).await
    }
}
