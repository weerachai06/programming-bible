use bytes::Bytes;
use std::fs::{File, OpenOptions};
use std::io::{BufRead, BufReader, Write};

// นำเข้า dependencies ที่จำเป็น
// - Connection: สำหรับจัดการการเชื่อมต่อกับ client
// - Frame: รูปแบบข้อมูลที่ส่งระหว่าง client และ server
// - task: สำหรับสร้าง async tasks ใน tokio
use mini_redis::{Connection, Frame};
use tokio::task;

// ฟังก์ชันหลักของ Redis server โดยใช้ tokio runtime
// #[tokio::main] จะแปลงฟังก์ชัน async main ให้เป็น synchronous main
#[tokio::main]
async fn main() -> mini_redis::Result<()> {
    // สร้าง TCP listener บนพอร์ต 6379 (พอร์ตมาตรฐานของ Redis)
    // ใช้ localhost (127.0.0.1) เพื่อให้เชื่อมต่อได้เฉพาะจากเครื่องเดียวกัน
    let listener = tokio::net::TcpListener::bind("127.0.0.1:6379").await?;

    println!("Redis server listening on 127.0.0.1:6379");

    // วนลูปไม่สิ้นสุดเพื่อรับการเชื่อมต่อใหม่จาก clients
    loop {
        // รอรับการเชื่อมต่อใหม่ (blocking operation)
        // socket = การเชื่อมต่อกับ client
        // _ = ข้อมูล address ของ client ที่เราไม่ได้ใช้
        let (socket, _) = listener.accept().await?;

        // สร้าง task ใหม่สำหรับจัดการกับ client แต่ละตัว
        // ใช้ async move เพื่อย้าย ownership ของ socket เข้าไปใน task
        // การทำแบบนี้ทำให้ server สามารถรองรับ multiple clients พร้อมกันได้
        task::spawn(async move { process(socket).await });
    }
}

// ฟังก์ชันสำหรับจัดการกับ client แต่ละตัว
// รับ TcpStream ที่เป็นการเชื่อมต่อกับ client คนหนึ่ง ๆ
async fn process(socket: tokio::net::TcpStream) {
    use mini_redis::Command::{self, Get, Set};
    use std::collections::HashMap;

    // สร้าง HashMap เพื่อเก็บข้อมูล key-value
    // ในการใช้งานจริง ควรใช้ database หรือ persistent storage
    let mut db = HashMap::new();
    if let Ok(file) = File::open("dump.aof") {
        let reader = BufReader::new(file);
        for line in reader.lines() {
            if let Ok(l) = line {
                // รูปแบบในไฟล์: key:value
                let parts: Vec<&str> = l.splitn(2, ':').collect();
                if parts.len() == 2 {
                    db.insert(
                        parts[0].to_string(),
                        Bytes::from(parts[1].as_bytes().to_vec()),
                    );
                }
            }
        }
        println!("Loaded {} keys from dump.aof", db.len());
    }

    // สร้าง Connection wrapper จาก socket
    // Connection จะช่วยจัดการการ parsing frames จาก TCP stream
    let mut connection = Connection::new(socket);

    // วนลูปรับ commands จาก client จนกว่าการเชื่อมต่อจะปิด
    while let Some(frame) = connection.read_frame().await.unwrap() {
        // แปลง frame เป็น command และจัดการตาม command type
        let response = match Command::from_frame(frame).unwrap() {
            Set(cmd) => {
                let key = cmd.key();
                let value = cmd.value();
                // บันทึกคำสั่ง SET ลงในไฟล์ dump.aof
                if let Ok(mut file) = OpenOptions::new()
                    .create(true)
                    .append(true)
                    .open("dump.aof")
                {
                    // เขียนในรูปแบบ key:value\n
                    let line = format!("{}:{}\n", key, String::from_utf8_lossy(value));
                    let _ = file.write_all(line.as_bytes());
                }
                // คำสั่ง SET: เก็บ key และ value ใน HashMap
                // key = คีย์ที่จะเก็บ
                // value = ค่าที่จะเก็บ (เป็น Bytes)
                db.insert(key.to_string(), value.clone());
                // ส่งกลับ "OK" เพื่อบอกว่าบันทึกสำเร็จ
                Frame::Simple("OK".to_string())
            }
            Get(cmd) => {
                // คำสั่ง GET: ดึงค่าจาก key ที่ระบุ
                if let Some(value) = db.get(cmd.key()) {
                    // หากพบ key ให้ส่งค่ากลับเป็น Bulk frame
                    // Frame::Bulk ใช้สำหรับส่งข้อมูลที่เป็น binary หรือข้อความยาว
                    Frame::Bulk(value.clone())
                } else {
                    // หากไม่พบ key ให้ส่งกลับ Null (เหมือน Redis จริง ๆ)
                    Frame::Null
                }
            }
            // หาก command ไม่ใช่ SET หรือ GET จะ panic (ในตัวอย่างนี้ยังไม่รองรับคำสั่งอื่น)
            cmd => panic!("unimplemented command: {:?}", cmd),
        };

        // เขียน response กลับไปให้ client
        let result = connection.write_frame(&response).await;

        // หากเขียน response ไม่สำเร็จ แสดงว่าการเชื่อมต่อมีปัญหา
        if result.is_err() {
            println!("failed to write frame to client");
            return; // ออกจากฟังก์ชันและปิดการเชื่อมต่อ
        }

        println!("processed a command from client");
        println!("{:?}", db);
    }
}
