use std::fmt::Display;
pub enum HttpStatus {
    Ok = 200,
    NotFound = 404,
    BadRequest = 400,
}

impl Display for HttpStatus {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let message = match self {
            Self::Ok => "200 OK",
            Self::NotFound => "404 Not Found",
            Self::BadRequest => "400 Bad Request",
        };
        write!(f, "{}", message)
    }
}
