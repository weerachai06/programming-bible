// อนุญาตให้มี dead_code ในโปรแกรมนี้ เพราะเป็นตัวอย่างหลายแบบ
#![allow(dead_code)]

// นำเข้า Duration สำหรับใช้งาน sleep และจัดการเวลา
// use std::time::Duration;

use async_await_future::yield_contorl_runtime::yield_control_runtime;
// นำเข้า Html parser สำหรับแยก HTML content
use trpl::Html;

// ทำหน้าที่เชื่อมโยงไปยังไลบรารีภายนอก
extern crate trpl; // ปัจจุบันไม่จำเป็นต้องใช้ extern crate ใน Rust 2018 ขึ้นไป

// ฟังก์ชันหลักของโปรแกรม ประกอบด้วยตัวอย่างการใช้งาน async/await หลายแบบ
fn main() {
    // เก็บ command line arguments (ปิดการใช้งานเพื่อไม่รบกวนตัวอย่างอื่น)
    // let args = std::env::args().collect::<Vec<_>>();

    // ตัวอย่างที่ 1: การใช้งาน future เดียวและ select เพื่อรอผลลัพธ์จากหลาย future
    // ex01: Single future example
    /*
    // block_on ใช้สำหรับรัน async block จนกว่าจะเสร็จสิ้น
    trpl::block_on(async {
        // สร้าง future สำหรับดึง page title จาก URL แรก
        let future1 = page_title(&args[1]);
        // สร้าง future สำหรับดึง page title จาก URL ที่สอง
        let future2 = page_title(&args[2]);

        // ใช้ select เพื่อรอ future ใดก็ตามที่เสร็จสิ้นก่อน
        let maybe_title = match trpl::select(future1, future2).await {
            trpl::Either::Left(title) => title,   // ถ้า future1 เสร็จก่อน
            trpl::Either::Right(title) => title,  // ถ้า future2 เสร็จก่อน
        };

        // ตรวจสอบและแสดงผลลัพธ์
        match maybe_title {
            Some(title) => println!("Title is {}", title),
            None => println!("No title found from"),
        }
    })
    */

    // ตัวอย่างที่ 2: การรัน async tasks หลายอันพร้อมกันและรอให้ทั้งหมดเสร็จสิ้น
    // ex02: Async and Await with threads
    /*
       trpl::block_on(async {
           // สร้าง async block แรกที่จะวนลูป 9 รอบ
           let fut_1 = async {
               for i in 1..10 {
                   println!("Spawned thread says hi {}", i);
                   // หยุดชั่วคราว 500ms ระหว่างการทำงาน
                   trpl::sleep(std::time::Duration::from_millis(500)).await;
               }
           };

           // สร้าง async block ที่สองที่จะวนลูป 4 รอบ
           let fut2 = async {
               for i in 1..5 {
                   println!("Another spawned thread says hi {}", i);
                   // หยุดชั่วคราว 500ms ระหว่างการทำงาน
                   trpl::sleep(std::time::Duration::from_millis(500)).await;
               }
           };

           // ใช้ join เพื่อรอให้ทั้ง fut_1 และ fut2 เสร็จสิ้นก่อนดำเนินการต่อ
           trpl::join(fut_1, fut2).await;
       })
    */

    // ตัวอย่างที่ 3: การส่งข้อมูลระหว่าง async tasks ผ่าน channel
    // ex03: Sending data between async tasks
    /*
    trpl::block_on(async {
        // สร้าง channel สำหรับส่งข้อมูล: tx (transmitter) และ rx (receiver)
        let (tx, mut rx) = trpl::channel();

        // เตรียมข้อมูลที่จะส่ง
        let vals = vec!["Hello", "from", "the", "other", "side"];

        // ส่งข้อมูลทีละตัวผ่าน channel
        for val in vals {
            tx.send(val).unwrap();  // ส่งข้อมูล
            trpl::sleep(std::time::Duration::from_millis(500)).await;  // รอ 500ms
        }

        // รับข้อมูลจาก channel และแสดงผล
        while let Some(value) = rx.recv().await {
            println!("Got: {}", value);
        }
    })
     */

    // ตัวอย่างที่ 4: โค้ดใน async block จะทำงานแบบเป็นลำดับ (linearly)
    // ตัวอย่างที่ 5: การใช้ join! macro เพื่อรวม futures หลายตัว
    // ex04: Code Within One Async Block Executes Linearly
    /*
    trpl::block_on(async {
        // สร้าง channel สำหรับการสื่อสาร
        let (tx, mut rx) = trpl::channel();
        // โคลน transmitter เพื่อใช้ใน future อื่น
        let tx1 = tx.clone();

        // Future แรก: ส่งข้อความชุดแรก
        let tx_fut1 = async move {
            let vals = vec![
                String::from("hi"),
                String::from("from"),
                String::from("the"),
                String::from("future"),
            ];

            // ส่งข้อความทีละตัวพร้อมหน่วงเวลา
            for val in vals {
                tx1.send(val).unwrap();
                trpl::sleep(Duration::from_millis(500)).await;
            }
        };

        // Future สำหรับรับข้อความ
        let rx_fut = async {
            while let Some(value) = rx.recv().await {
                println!("Got: {}", value);
            }
        };

        // การใช้ join แบบเก่า (ปิดการใช้งาน)
        // trpl::join(tx_fut1, rx_fut).await;

        // ตัวอย่างที่ 5: การใช้ join! macro สำหรับรวม futures หลายตัว
        // ex05: Joining a Number of Futures with the join! Macro
        // Future ที่สอง: ส่งข้อความชุดที่สอง
        let tx_fut = async move {
            let vals = vec![
                String::from("more"),
                String::from("messages"),
                String::from("for"),
                String::from("you"),
            ];

            // ส่งข้อความทีละตัวด้วยช่วงเวลานานขึ้น (1.5 วินาที)
            for val in vals {
                tx.send(val).unwrap();
                trpl::sleep(Duration::from_millis(1500)).await;
            }
        };

        // ใช้ join! macro เพื่อรันทั้ง 3 futures พร้อมกัน
        // จะรอให้ทุก future เสร็จสิ้นก่อนที่โปรแกรมจะจบ
        trpl::join!(tx_fut1, tx_fut, rx_fut)
    });
    */

    yield_control_runtime();
}

// ฟังก์ชัน async สำหรับดึง title ของหน้าเว็บจาก URL
// รับ URL เป็น string slice และคืนค่า Option<String>
async fn page_title(url: &str) -> Option<String> {
    // ส่ง HTTP GET request และรอรับ response
    let response = trpl::get(url).await;
    // แปลง response เป็น text
    let response_text = response.text().await;

    // ใช้ HTML parser เพื่อค้นหา tag <title> แรกที่เจอ
    // และดึงเนื้อหาภายในออกมา
    Html::parse(&response_text)
        .select_first("title")
        .map(|title| title.inner_html())
}
