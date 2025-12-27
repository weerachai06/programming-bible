// =============================================================================
// IMPORTS & DEPENDENCIES
// =============================================================================

// Imports สำหรับจัดการไฟล์และ binary data
// - Bytes: type สำหรับจัดการ binary data อย่างมีประสิทธิภาพ (zero-copy)
//          ใช้เก็บ values ใน Redis (สามารถเป็น string หรือ binary ได้)
use bytes::Bytes;

// Imports สำหรับการทำงานกับไฟล์ระบบ (persistence)
// - File: สำหรับเปิดและอ่านไฟล์
// - OpenOptions: สำหรับการตั้งค่าการเปิดไฟล์ (create, append, write mode)
use std::fs::{File, OpenOptions};

// Imports สำหรับการอ่าน/เขียนไฟล์
// - BufRead: trait สำหรับการอ่านไฟล์ทีละบรรทัด
// - BufReader: buffered reader สำหรับอ่านไฟล์อย่างมีประสิทธิภาพ
// - Write: trait สำหรับการเขียนข้อมูลลงไฟล์
use std::io::{BufRead, BufReader, Write};

// =============================================================================
// MINI REDIS SERVER - โปรแกรม Redis server แบบง่ายที่เขียนด้วย Rust
// =============================================================================

// นำเข้า dependencies ที่จำเป็นสำหรับการทำงาน
// - Connection: คลาสสำหรับจัดการการเชื่อมต่อกับ client และการส่งข้อมูล
//               ช่วยแปลง TCP stream เป็น Redis protocol frames
// - Frame: enum ที่แทนรูปแบบข้อมูลต่างๆ ใน Redis protocol เช่น:
//          Frame::Simple (สำหรับคำตอบสั้นๆ), Frame::Bulk (ข้อมูลขนาดใหญ่), Frame::Null
// - task: module ใน tokio สำหรับสร้างและจัดการ async tasks
//         ใช้สำหรับให้ server รองรับ multiple clients พร้อมกัน
use mini_redis::{Connection, Frame};
use tokio::task;

// =============================================================================
// MAIN FUNCTION - จุดเริ่มต้นของ Redis server
// =============================================================================

// ฟังก์ชันหลักของ Redis server โดยใช้ tokio async runtime
// #[tokio::main] เป็น procedural macro ที่:
//   1. สร้าง tokio runtime อัตโนมัติ
//   2. แปลง async main function ให้เป็น synchronous main ที่ OS เรียกได้
//   3. จัดการ lifecycle ของ runtime (เริ่ม-หยุด)
//
// mini_redis::Result<()> เป็น type alias สำหรับ Result<(), mini_redis::Error>
// ใช้ ? operator ในการ propagate errors ขึ้นไปยัง caller
#[tokio::main]
async fn main() -> mini_redis::Result<()> {
    // สร้าง TCP listener บนพอร์ต 6379 (พอร์ตมาตรฐานของ Redis)
    // - "127.0.0.1" = localhost, จำกัดการเชื่อมต่อเฉพาะจากเครื่องเดียวกัน
    // - ":6379" = พอร์ตมาตรฐานของ Redis protocol
    // - .await? = รอให้ binding สำเร็จ และ propagate error หากล้มเหลว
    let listener = tokio::net::TcpListener::bind("127.0.0.1:6379").await?;

    println!("Redis server listening on 127.0.0.1:6379");

    // =============================================================================
    // MAIN SERVER LOOP - รับและจัดการ client connections
    // =============================================================================

    // วนลูปไม่สิ้นสุดเพื่อรับการเชื่อมต่อใหม่จาก clients
    // แต่ละรอบของลูปจะ:
    //   1. รอรับ connection ใหม่
    //   2. สร้าง task ใหม่สำหรับจัดการ client นั้น
    //   3. กลับไปรอ connection ถัดไป
    loop {
        // รอรับการเชื่อมต่อใหม่ (เป็น blocking operation แต่เป็น async blocking)
        // - socket: TcpStream = การเชื่อมต่อกับ client คนนึง
        // - _: SocketAddr = IP address และ port ของ client (เราไม่ได้ใช้ในตัวอย่างนี้)
        // - .await? = รอให้มี connection ใหม่ และ propagate error
        let (socket, _) = listener.accept().await?;

        // สร้าง async task ใหม่สำหรับจัดการกับ client แต่ละตัวแยกกัน
        // ทำไมต้องใช้ task::spawn?
        //   - ให้ server สามารถรองรับ multiple clients พร้อมกันได้ (concurrent)
        //   - แต่ละ client จะมี task แยกกัน ไม่รบกวนกัน
        //   - หาก client หนึ่งติดขัด client อื่นยังทำงานได้ต่อ
        //
        // async move คือ:
        //   - async: task นี้เป็น async function
        //   - move: ย้าย ownership ของ socket เข้าไปใน task
        //           (เพราะ socket จะใช้งานใน task และ main loop จะวนต่อ)
        task::spawn(async move {
            // เรียก process() เพื่อจัดการกับ client
            // หากเกิด error ใน process() จะไม่ส่งผลกับ main server loop
            process(socket).await
        });
    }
}

// =============================================================================
// CLIENT PROCESSING FUNCTION - จัดการกับ client แต่ละตัว
// =============================================================================

// ฟังก์ชันสำหรับจัดการกับ client แต่ละตัวใน task แยกกัน
// รับ TcpStream ที่เป็นการเชื่อมต่อกับ client คนหนึ่ง ๆ
//
// หน้าที่ของฟังก์ชันนี้:
//   1. สร้าง database ชั่วคราวสำหรับ client นี้ (HashMap)
//   2. อ่าน commands จาก client
//   3. ประมวลผล commands และส่งผลลัพธ์กลับ
//   4. วนลูปจนกว่า client จะปิดการเชื่อมต่อ
async fn process(socket: tokio::net::TcpStream) {
    // Import Redis command types และ HashMap
    // Command เป็น enum ที่มี variants สำหรับคำสั่งต่างๆ เช่น Get, Set, etc.
    use mini_redis::Command::{self, Get, Set};
    use std::collections::HashMap;

    // สร้าง HashMap เพื่อเก็บข้อมูล key-value ชั่วคราว
    // ⚠️  ข้อจำกัด: ข้อมูลจะเก็บใน memory เฉพาะ client session นี้
    //     ในระบบจริงควรใช้:
    //     - Shared state ระหว่าง clients (Arc<Mutex<HashMap>>)
    //     - Database แท้จริง (PostgreSQL, MongoDB, etc.)
    //     - Persistent storage (ไฟล์, Redis snapshot, etc.)
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

    // สร้าง Connection wrapper จาก raw TCP socket
    // Connection เป็น abstraction layer ที่:
    //   - แปลง raw bytes จาก TCP เป็น Redis protocol frames
    //   - จัดการ serialization/deserialization
    //   - ตรวจสอบความถูกต้องของ protocol
    let mut connection = Connection::new(socket);

    // =============================================================================
    // CLIENT COMMAND PROCESSING LOOP
    // =============================================================================

    // วนลูปรับ commands จาก client จนกว่าการเชื่อมต่อจะปิด
    // while let Some(frame) = ... เป็น pattern ที่:
    //   - อ่าน frame จาก connection
    //   - หากได้ Some(frame) ให้ประมวลผล
    //   - หากได้ None แสดงว่า client ปิด connection แล้ว (break loop)
    //   - .unwrap() จะ panic หากเกิด error (ในโปรแกรมจริงควร handle error อย่างเหมาะสม)
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
                // =============================================================================
                // GET COMMAND HANDLER
                // =============================================================================
                // คำสั่ง GET: ดึงค่าจาก key ที่ระบุ
                //
                // GET command structure:
                //   - cmd.key(): &str = คีย์ที่ต้องการดึงค่า
                //
                // การทำงาน:
                //   1. ค้นหา key ใน HashMap
                //   2. หากพบ: ส่งค่ากลับเป็น Frame::Bulk
                //   3. หากไม่พบ: ส่งกลับ Frame::Null

                if let Some(value) = db.get(cmd.key()) {
                    // หากพบ key ให้ส่งค่ากลับเป็น Bulk frame
                    // Frame::Bulk ใช้สำหรับส่งข้อมูลที่:
                    //   - เป็น binary data
                    //   - มีขนาดใหญ่
                    //   - ต้องการ length prefix (ตาม Redis protocol)
                    Frame::Bulk(value.clone())
                } else {
                    // หากไม่พบ key ให้ส่งกลับ Null
                    // เป็นพฤติกรรมมาตรฐานของ Redis เมื่อ key ไม่มีอยู่
                    Frame::Null
                }
            }
            // =============================================================================
            // UNHANDLED COMMANDS
            // =============================================================================
            // หาก command ไม่ใช่ SET หรือ GET จะ panic
            // ⚠️  ในโปรแกรมจริงควร:
            //     - Return error frame แทน panic
            //     - Log unhandled command
            //     - รองรับคำสั่งเพิ่มเติม (DEL, EXISTS, KEYS, etc.)
            cmd => panic!("unimplemented command: {:?}", cmd),
        };

        // =============================================================================
        // RESPONSE SENDING & ERROR HANDLING
        // =============================================================================

        // เขียน response frame กลับไปให้ client ผ่าน TCP connection
        // write_frame() จะ:
        //   1. Serialize frame เป็น Redis protocol format
        //   2. เขียนลงใน TCP stream
        //   3. Flush buffer เพื่อให้แน่ใจว่าข้อมูลถูกส่ง
        let result = connection.write_frame(&response).await;

        // Error handling: หากเขียน response ไม่สำเร็จ
        // สาเหตุที่อาจเกิดขึ้น:
        //   - Client ปิด connection กะทันหัน
        //   - Network error
        //   - TCP buffer เต็ม
        if result.is_err() {
            println!("failed to write frame to client");
            // ออกจากฟังก์ชันและปิดการเชื่อมต่อ
            // Task จะสิ้นสุดและ resources จะถูก cleanup อัตโนมัติ
            return;
        }

        // แสดงสถานะและข้อมูลปัจจุบันของ database สำหรับ debugging
        println!("processed a command from client");
        println!("{:?}", db);
    }

    // หากถึงจุดนี้ แสดงว่า client ปิด connection แล้ว (read_frame() return None)
    // Function จะจบและ task จะสิ้นสุด
}
