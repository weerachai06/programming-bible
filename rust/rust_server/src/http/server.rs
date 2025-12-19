use chrono::Utc; // 🕰️ สำหรับจัดการ timestamp

// 🌐 นำเข้า HTTP types จาก module ของเรา
use crate::http::{HttpStatus, Method, Request, Response, Result};
use std::io::Read;        // trait สำหรับอ่านข้อมูลจาก stream
use std::net::TcpListener; // สำหรับ listen TCP connections

/// 🌐 HTTP Server struct: จัดการ TCP connections และ HTTP requests
/// รองรับ basic GET requests และ routing
pub struct Server {
    addr: String, // 📏 IP address และ port (เช่น "127.0.0.1:8000")
}

impl Server {
    /// 🏗️ Constructor: สร้าง Server instance ใหม่
    /// 
    /// # Arguments  
    /// * `addr` - IP address และ port ในรูปแบบ string
    /// 
    /// # Returns
    /// * Server instance
    pub fn new(addr: String) -> Self {
        Self { addr }
    }

    /// 🚀 รัน HTTP server: main event loop
    /// 
    /// # Process:
    /// 1. Bind TCP listener ไปยัง address
    /// 2. รอ incoming connections
    /// 3. อ่าน HTTP request จาก client  
    /// 4. Parse request และ generate response
    /// 5. ส่ง response กลับไป client
    /// 6. วนซ้ำ
    /// 
    /// # Returns
    /// * `Result<()>` - Ok(()) เมื่อสำเร็จ, Err เมื่อเกิด error
    pub fn run(&self) -> Result<()> {
        println!("🌍 Server running on {}", self.addr);

        // 🔌 Bind TCP listener ไปยัง address
        // ? operator: return early หาก bind ล้มเหลว
        let listener = TcpListener::bind(&self.addr)?;

        // ♾️ Main server loop: รอและจัดการ incoming connections
        for stream in listener.incoming() {
            let mut _stream = stream?;               // 🌊 รับ TCP stream
            let mut buffer: [u8; 1024] = [0; 1024]; // 🗂️ Buffer 1KB สำหรับอ่านข้อมูล
            _stream.read(&mut buffer)?;             // 📄 อ่าน request data

            // 📝 Parse HTTP request จาก raw bytes
            let request = Request::try_from(&buffer[..])?;

            // 🕰️ สร้าง timestamp สำหรับ logging
            let timestamp = std::time::SystemTime::now();
            let date_time = chrono::DateTime::<Utc>::from(timestamp);
            // 🇺🇭 แปลงเป็นเวลาไทย (+7 hours)
            let thai_date_time =
                date_time.with_timezone(&chrono::FixedOffset::east_opt(7 * 3600).unwrap());

            // 📊 Log request information
            println!(
                "[{}] {:?} {}",
                thai_date_time,
                request.method(), // HTTP method (GET, POST, etc.)
                request.path()    // URL path (/hello, /, etc.)
            );

            // 🎣 Route handling: จับคู่ HTTP method และ path
            let response = match request.method() {
                Method::GET => match request.path().as_str() {
                    "/" => Response::new(HttpStatus::Ok, Some("home".to_string())),     // 🏠 Home page
                    "/hello" => Response::new(HttpStatus::Ok, Some("hello".to_string())), // 👋 Hello page
                    _ => Response::new(crate::http::HttpStatus::NotFound, None),         // ❌ 404 Not Found
                },
                _ => Response::new(crate::http::HttpStatus::NotFound, None),             // ❌ Method not allowed
            };

            // 📤 ส่ง HTTP response กลับไป client
            response.send(&mut _stream)?;
        } // 🔁 วนกลับไปรอ connection ถัดไป
        }

        Ok(())
    }
}
