# My Rust API - Clean Architecture

A modern REST API built with Rust using Clean Architecture principles and the Axum web framework.

## 🏗️ Architecture Overview

This project demonstrates Clean Architecture implementation in Rust, providing a clear separation of concerns across different layers:

```
├── src/
│   ├── main.rs                     # Application entry point
│   ├── domain/                     # Enterprise Business Rules
│   │   ├── mod.rs
│   │   ├── user.rs                 # User entity, DTOs, and repository trait
│   │   └── res.rs                  # Domain errors and result types
│   ├── application/                # Application Business Rules (Use Cases)
│   │   ├── mod.rs
│   │   └── user_service.rs         # User business logic and use cases
│   ├── infrastructure/             # Infrastructure Layer
│   │   ├── mod.rs
│   │   ├── config.rs              # Application configuration and state
│   │   └── repository.rs          # Repository implementations
│   └── presentation/               # Presentation Layer (Controllers & Routes)
│       ├── mod.rs
│       └── user_controller.rs     # HTTP handlers and routing
```

## 🚀 Features

- **Clean Architecture** - Proper dependency direction and separation of concerns
- **Type Safety** - Full Rust type system benefits
- **Async/Await** - Built on Tokio for high performance
- **In-Memory Storage** - No external database dependencies
- **Error Handling** - Comprehensive error types across all layers
- **Dependency Injection** - Using trait objects for testability

## 📦 Dependencies

```toml
[dependencies]
async-trait = "0.1"      # For trait objects with async methods
axum = "0.8.8"          # Web framework
serde = { version = "1.0.228", features = ["derive"] }  # Serialization
serde_json = "1.0.147"  # JSON support
tokio = { version = "1.48.0", features = ["net", "rt-multi-thread"] }  # Async runtime
```

## 🛠️ Getting Started

### Prerequisites

- Rust 1.70+ (2024 edition)
- Cargo

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd my-api
```

2. Build and run:
```bash
cargo run
```

The server will start on `http://localhost:3000`

## 📊 API Endpoints

### Base URL: `http://localhost:3000`

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| `GET` | `/health` | Health check | - |
| `GET` | `/user/` | List all users | - |
| `POST` | `/user/` | Create new user | `CreateUserRequest` |
| `GET` | `/user/{id}` | Get user by ID | - |
| `PUT` | `/user/{id}` | Update user | `UpdateUserRequest` |
| `DELETE` | `/user/{id}` | Delete user | - |

### Request/Response Examples

#### Create User
```bash
curl -X POST http://localhost:3000/user/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com"
  }'
```

Response:
```json
{
  "id": 2,
  "name": "John Doe", 
  "email": "john@example.com"
}
```

#### Update User
```bash
curl -X PUT http://localhost:3000/user/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@example.com"
  }'
```

#### List Users
```bash
curl http://localhost:3000/user/
```

Response:
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  },
  {
    "id": 2,
    "name": "Jane Smith", 
    "email": "jane@example.com"
  }
]
```

#### Error Response
```json
{
  "error": "User not found",
  "status": 404
}
```

## 🏛️ Layer Responsibilities

### Domain Layer (`src/domain/`)
- **Pure business logic** - No framework dependencies
- **Entities** - Core business objects (`User`)
- **Repository Traits** - Abstract data access contracts
- **Domain Errors** - Business rule violations
- **Value Objects** - DTOs for data transfer

### Application Layer (`src/application/`)  
- **Use Cases** - Business workflows (`UserService`)
- **Orchestration** - Coordinates domain objects
- **Validation** - Business rule enforcement
- **Dependency Injection** - Depends on domain abstractions

### Infrastructure Layer (`src/infrastructure/`)
- **External Concerns** - Database, file system, external APIs
- **Repository Implementations** - Concrete data access (`InMemoryUserRepository`)
- **Configuration** - Application settings and state
- **Framework Glue** - Wiring dependencies together

### Presentation Layer (`src/presentation/`)
- **HTTP Concerns** - Controllers, routing, serialization
- **Request/Response Mapping** - Convert between HTTP and domain objects  
- **Error Handling** - HTTP status codes and JSON error responses
- **Input Validation** - HTTP-level validation

## 🔧 Key Design Patterns

### Dependency Inversion Principle
```rust
// Domain defines the contract
pub trait UserRepository {
    async fn find_by_id(&self, id: u32) -> AppResult<Option<User>>;
    // ...
}

// Application depends on abstraction
pub struct UserService {
    repository: Arc<dyn UserRepository + Send + Sync>,
}

// Infrastructure provides implementation
pub struct InMemoryUserRepository { /* ... */ }
impl UserRepository for InMemoryUserRepository { /* ... */ }
```

### Error Handling Strategy
```rust
// Domain errors - business focused
pub enum AppError {
    UserNotFound,
    InvalidInput(String),
    InternalServerError,
}

// Presentation layer converts to HTTP
impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        // Convert domain errors to HTTP responses
    }
}
```

### Async Trait Objects
```rust
#[async_trait::async_trait]
pub trait UserRepository {
    async fn save(&self, user: User) -> AppResult<User>;
}
```

## 🧪 Testing Strategy

### Unit Tests
- **Domain Logic** - Test business rules in isolation
- **Use Cases** - Test application flows with mock repositories
- **Repository** - Test data access logic

### Integration Tests  
- **API Endpoints** - Test full HTTP request/response cycle
- **Error Handling** - Verify proper error responses

### Example Test
```rust
#[tokio::test]
async fn test_create_user_success() {
    let repo = Arc::new(InMemoryUserRepository::new());
    let service = UserService::new(repo);
    
    let request = CreateUserRequest {
        name: "Test User".to_string(),
        email: "test@example.com".to_string(),
    };
    
    let result = service.create_user(request).await;
    assert!(result.is_ok());
}
```

## 📈 Performance Considerations

- **Zero-Copy Serialization** - Using serde for efficient JSON handling
- **Arc for Shared State** - Efficient memory sharing across threads
- **Async Runtime** - Tokio for high-concurrency handling
- **Trait Objects** - Small runtime cost for dynamic dispatch flexibility

## 🔒 Security Features

- **Input Validation** - Comprehensive request validation
- **Type Safety** - Rust's ownership system prevents common bugs
- **Error Information** - Controlled error disclosure

## 🚦 Development Workflow

1. **Add Domain Logic** - Start with business rules in `domain/`
2. **Implement Use Cases** - Add workflows in `application/`  
3. **Create Infrastructure** - Add external integrations in `infrastructure/`
4. **Expose via HTTP** - Add endpoints in `presentation/`
5. **Test** - Add comprehensive tests

## 📚 Learning Resources

- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) - Original article
- [Axum Documentation](https://docs.rs/axum/) - Web framework docs
- [Async Trait](https://docs.rs/async-trait/) - For trait objects with async methods
- [Tokio Tutorial](https://tokio.rs/tokio/tutorial) - Async runtime guide

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Follow the existing architecture patterns
4. Add tests for new functionality  
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

Built with ❤️ in Rust