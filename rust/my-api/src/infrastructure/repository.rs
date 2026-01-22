use std::collections::HashMap;
use std::sync::{Arc, Mutex};

use crate::domain::res::{AppError, AppResult};
use crate::domain::user::{User, UserRepository};

// In-memory repository implementation (no database)
#[derive(Debug)]
pub struct InMemoryUserRepository {
    storage: Arc<Mutex<HashMap<u32, User>>>,
    next_id: Arc<Mutex<u32>>,
}

impl InMemoryUserRepository {
    pub fn new() -> Self {
        let mut storage = HashMap::new();

        // Initialize with some sample data
        storage.insert(
            1,
            User {
                id: 1,
                name: "John Doe".to_string(),
                email: "john@example.com".to_string(),
            },
        );

        Self {
            storage: Arc::new(Mutex::new(storage)),
            next_id: Arc::new(Mutex::new(2)),
        }
    }
}

#[async_trait::async_trait]
impl UserRepository for InMemoryUserRepository {
    async fn find_by_id(&self, id: u32) -> AppResult<Option<User>> {
        let storage = self.storage.lock().unwrap();
        Ok(storage.get(&id).cloned())
    }

    async fn find_all(&self) -> AppResult<Vec<User>> {
        let storage = self.storage.lock().unwrap();
        Ok(storage.values().cloned().collect())
    }

    async fn save(&self, mut user: User) -> AppResult<User> {
        let mut storage = self.storage.lock().unwrap();
        let mut next_id = self.next_id.lock().unwrap();

        // Check if email already exists
        for existing_user in storage.values() {
            if existing_user.email == user.email {
                return Err(AppError::InvalidInput("Email already exists".to_string()));
            }
        }

        user.id = *next_id;
        *next_id += 1;

        storage.insert(user.id, user.clone());
        Ok(user)
    }

    async fn update(&self, user: User) -> AppResult<User> {
        let mut storage = self.storage.lock().unwrap();

        // Check if user exists
        if !storage.contains_key(&user.id) {
            return Err(AppError::UserNotFound);
        }

        // Check if email is taken by another user
        for (id, existing_user) in storage.iter() {
            if *id != user.id && existing_user.email == user.email {
                return Err(AppError::InvalidInput("Email already exists".to_string()));
            }
        }

        storage.insert(user.id, user.clone());
        Ok(user)
    }

    async fn delete(&self, id: u32) -> AppResult<()> {
        let mut storage = self.storage.lock().unwrap();

        if storage.remove(&id).is_none() {
            return Err(AppError::UserNotFound);
        }

        Ok(())
    }
}
