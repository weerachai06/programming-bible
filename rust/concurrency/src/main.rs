#![allow(unused)] // 🔧 อนุญาตให้ใช้ unused functions ในการทดสอบ
// 🧵 นำเข้า modules ที่จำเป็นสำหรับ concurrency
use std::{
    sync::{Arc, Mutex, mpsc}, // Arc: thread-safe reference counting, Mutex: mutual exclusion, mpsc: message passing
    thread,                   // thread management
};

/// 🎯 ฟังก์ชันหลักสำหรับทดลอง concurrency concepts
/// เปิด comment ในแต่ละบรรทัดเพื่อทดสอบ
fn main() {
    // 📚 ตาม Rust Book Chapter 16: https://doc.rust-lang.org/book/ch16-00-concurrency.html

    // 🇺️ 16.1. Using Threads to Run Code Simultaneously
    // ex01_threads_simultaneously();     // ⚠️ thread อาจไม่ทำงานครบ
    // ex02_waiting_for_threads();        // ✅ รอให้ thread ทำงานเสร็จ
    // ex1_03_using_move_with_threads();   // 📦 ย้าย ownership ไป thread

    // 📨 16.2. Using Message Passing to Transfer Data Between Threads
    // ex2_01_basic_channel();            // ช่องทาง producer-consumer พื้นฐาน
    // ex2_02_send_message_series();       // ส่งข้อมูลหลายครั้ง
    // ex2_03_multiple_producers();        // หลาย producers, consumer เดียว

    // 🔒 16.3. Shared-State Concurrency with Mutexes
    // ex3_01_basic_usage_mutex();         // การใช้ Mutex พื้นฐาน
    ex3_02_shared_access_mutex(); // ✅ แชร์ data ระหว่าง threads
}

/**
 * 🇺️ ex.01 - Threads running simultaneously  
 * =======================================
 * สร้าง thread ใหม่และให้ print messages พร้อมกัน
 * ⚠️ ปัญหา: Main thread อาจจบก่อน spawned thread ทำงานเสร็จ
 *
 * ผลลัพธ์ที่อาจได้:
 *   hi number 1 from the main thread!
 *   hi number 1 from the spawned thread!
 *   hi number 2 from the main thread!
 *   hi number 2 from the spawned thread!
 *   ...
 */
fn ex1_01_threads_simultaneously() {
    // 🚀 สร้าง thread ใหม่ด้วย closure
    thread::spawn(|| {
        for i in 1..10 {
            println!("hi number {} from the spawned thread!", i);
            thread::sleep(std::time::Duration::from_millis(1)); // หน่วงเวลา 1ms
        }
    });

    // ⚠️ หมายเหตุ: Main thread อาจสิ้นสุดก่อน spawned thread
    for i in 1..5 {
        println!("hi number {} from the main thread!", i);
        thread::sleep(std::time::Duration::from_millis(1));
    }
}

/**
 * ✅ ex.02 - Waiting for threads to finish
 * =========================================
 * ใช้ JoinHandle เพื่อรอให้ spawned thread ทำงานเสร็จ
 * ก่อนที่ main thread จะ exit
 */
fn ex1_02_waiting_for_threads() {
    // 📌 handle = JoinHandle สำหรับ control thread
    let handle = thread::spawn(|| {
        for i in 1..10 {
            println!("hi number {} from the spawned thread!", i);
            thread::sleep(std::time::Duration::from_millis(1));
        }
    });

    // ⏳ รอให้ spawned thread ทำงานเสร็จก่อนโค้ดต่อไป
    handle.join().unwrap();

    // 🏠 Main thread จะทำงาน AFTER spawned thread เสร็จ
    for i in 1..5 {
        println!("hi number {} from the main thread!", i);
        thread::sleep(std::time::Duration::from_millis(1));
    }
}

/**
 * 📦 ex.03 - Using move with threads  
 * ====================================
 * ย้าย ownership ของ variable จาก main thread ไปยัง spawned thread
 * จำเป็นเมื่อ data มีขนาดใหญ่หรือ thread lifetime ต่างกัน
 */
fn ex1_03_using_move_with_threads() {
    // 📋 สร้าง vector ใน main thread
    let v = vec![1, 2, 3];

    // 📦 'move' keyword: ย้าย ownership ของ v ไปยัง spawned thread
    // Note the use of 'move' to transfer ownership
    let handle = thread::spawn(move || {
        println!("Here's a vector: {:#?}", v);
    });

    handle.join().unwrap();
}
/// 📡 ex.01 - Basic channel communication
/// =====================================
/// สาธิตการใช้ mpsc::channel() สำหรับส่งข้อมูลระหว่าง threads
/// tx = transmitter (sender), rx = receiver
fn ex2_01_basic_channel() {
    let (tx, rx) = mpsc::channel(); // 📡 สร้าง channel

    // 🚀 Spawn thread ที่ส่งข้อมูล
    thread::spawn(move || {
        let val = String::from("hi"); // 📝 ข้อมูลที่จะส่ง
        tx.send(val).unwrap(); // 📤 ส่งข้อมูลไป receiver
        // หลังจาก send แล้ว val ถูก move ไป receiver
    });

    // 📥 รับข้อมูลใน main thread
    let received = rx.recv().unwrap(); // block จนกว่าจะได้ข้อมูล
    println!("📨 16.2 - 1 Got: {}", received);
}

/**
 * 📨 ex.02 - Message passing series
 * ===================================
 * ส่งข้อมูลหลายครั้งผ่าน channel เดียวกัน
 * Main thread รับและ print ข้อมูลทุกตัว
 * สาธิต channel ที่สามารถส่งข้อมูลหลายครั้ง
 */
fn ex2_02_send_message_series() {
    let (tx, rx) = mpsc::channel();

    // 🚀 Thread ส่งหลายข้อความ
    thread::spawn(move || {
        let vals = vec![
            // 📝 vector ของข้อความ
            String::from("hi"),
            String::from("from"),
            String::from("the"),
            String::from("thread"),
        ];

        for v in vals {
            // 🔄 ส่งทีละตัว
            tx.send(v).unwrap();
            thread::sleep(std::time::Duration::from_secs(1)); // ⏰ รอ 1 วินาที
        }
    });

    // 📥 รับข้อมูลทุกตัว
    for received in rx {
        // iterator ที่ block จนกว่า sender จะปิด
        println!("📨 16.2 - 2 Got: {}", received);
    }
}

/**
 * 🔀 ex.03 - Multiple producers
 * =============================
 * หลาย threads ส่งข้อมูลไปยัง receiver เดียวกัน  
 * สาธิต mpsc = Multiple Producer Single Consumer
 */
fn ex2_03_multiple_producers() {
    let (tx, rx) = mpsc::channel();

    // 👥 Clone sender สำหรับ thread แรก
    let tx1 = tx.clone();
    thread::spawn(move || {
        let vals = vec![
            String::from("hi"),
            String::from("from"),
            String::from("the"),
            String::from("first"),
            String::from("thread"),
        ];

        for v in vals {
            tx1.send(v).unwrap();
            thread::sleep(std::time::Duration::from_secs(1));
        }
    });

    // 👥 Thread ที่สองใช้ sender เดิม (tx)
    thread::spawn(move || {
        let vals = vec![
            String::from("more"),
            String::from("messages"),
            String::from("for"),
            String::from("you"),
        ];

        for v in vals {
            tx.send(v).unwrap();
            thread::sleep(std::time::Duration::from_secs(1));
        }
    });

    // 📥 รับข้อมูลจากทุก producers
    for received in rx {
        println!("📨 16.2 - 3 Got: {}", received);
    }
}

/**
 * 🔐 ex.01 - Basic Mutex usage
 * ============================
 * สาธิตการใช้ Mutex ในรูปแบบพื้นฐาน
 * Mutex = Mutual Exclusion (ป้องกันการเข้าถึงพร้อมกัน)
 */
fn ex3_01_basic_usage_mutex() {
    let mutex = Mutex::new(5); // 🔒 สร้าง Mutex ที่ protect integer

    {
        let mut num = mutex.lock().unwrap(); // 🔓 ขอ exclusive access
        *num = 6; // ✏️ แก้ไขค่า
    } // 🔒 lock ถูกปล่อยอัตโนมัติเมื่อออกจาก scope

    println!("🔒 Mutex value: {:#?}", mutex);
}

/**
 * ex.02 - Shared access to data across multiple threads using Mutex and Arc
 * --------------------------------------
 * Create a shared counter protected by a Mutex.
 * Spawn multiple threads that increment the counter.
 * Ensure all threads complete and print the final counter value.
 */
fn ex3_02_shared_access_mutex() {
    let counter = Arc::new(Mutex::new(0));
    let mut handles = vec![];

    for _ in 0..10 {
        let counter = Arc::clone(&counter);
        let handle = thread::spawn(move || {
            let mut num = counter.lock().unwrap();
            *num += 10;
        });

        handles.push(handle);
    }

    for handle in handles {
        handle.join().unwrap();
    }

    println!("Result: {}", *counter.lock().unwrap());
}
