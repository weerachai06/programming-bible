use rust_server::http::Server; // 🌐 นำเข้า HTTP Server module

/// 🚀 Entry point: จุดเริ่มต้นของ HTTP Server application
/// สร้าง TCP server ที่ listen บน localhost port 8000
fn main() {
    // 🏠 สร้าง server instance ด้วย IP และ port ที่กำหนด
    let server = Server::new("127.0.0.1:8000".to_owned());

    // 💯 เริ่มรัน server และ handle errors
    // ใช้ pattern matching กับ Result type
    if let Err(e) = server.run() {
        eprintln!("❌ Error running server: {}", e); // ส่ง error ไป stderr
    }
    
    // 📝 หมายเหตุ: server.run() จะ block thread จนกว่าจะมี error หรือ interrupt
    // สามารถ test ได้ด้วย: curl http://127.0.0.1:8000/
}
