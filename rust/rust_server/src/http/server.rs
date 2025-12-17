use chrono::Utc;

use crate::http::{HttpStatus, Method, Request, Response, Result};
use std::io::Read;
use std::net::TcpListener;

pub struct Server {
    addr: String,
}

impl Server {
    pub fn new(addr: String) -> Self {
        Self { addr }
    }

    pub fn run(&self) -> Result<()> {
        println!("Server running on {}", self.addr);

        let listener = TcpListener::bind(&self.addr)?;

        for stream in listener.incoming() {
            let mut _stream = stream?;
            let mut buffer: [u8; 1024] = [0; 1024];
            _stream.read(&mut buffer)?;

            let request = Request::try_from(&buffer[..])?;

            let timestamp = std::time::SystemTime::now();
            let date_time = chrono::DateTime::<Utc>::from(timestamp);
            let thai_date_time =
                date_time.with_timezone(&chrono::FixedOffset::east_opt(7 * 3600).unwrap());

            println!(
                "[{}] {:?} {}",
                thai_date_time,
                request.method(),
                request.path()
            );

            let response = match request.method() {
                Method::GET => match request.path().as_str() {
                    "/" => Response::new(HttpStatus::Ok, Some("home".to_string())),
                    "/hello" => Response::new(HttpStatus::Ok, Some("hello".to_string())),
                    _ => Response::new(crate::http::HttpStatus::NotFound, None),
                },
                _ => Response::new(crate::http::HttpStatus::NotFound, None),
            };

            response.send(&mut _stream)?;
        }

        Ok(())
    }
}
