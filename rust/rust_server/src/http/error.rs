use std::convert::From;
use std::fmt::Display;
pub enum Error {
    InvalidRequest,
    InvalidProtocol,
    InvalidMethod,
    IO(String),
    Utf8(String),
}

impl From<std::io::Error> for Error {
    fn from(error: std::io::Error) -> Self {
        Self::IO(error.to_string())
    }
}

impl From<std::str::Utf8Error> for Error {
    fn from(error: std::str::Utf8Error) -> Self {
        Self::Utf8(error.to_string())
    }
}

impl Display for Error {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let message = match self {
            Error::InvalidRequest => "Invalid Request",
            Error::InvalidProtocol => "Invalid Protocol",
            Error::InvalidMethod => "Invalid Method",
            Error::IO(msg) => msg,
            Error::Utf8(msg) => msg,
        };

        write!(f, "Error: {}", message)
    }
}
