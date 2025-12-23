// อนุญาตให้มี unused code เพื่อการศึกษา
#![allow(unused)]

// นำเข้า Pin และ pin macro สำหรับการจัดการความทรงจำของ Future
use std::pin::pin;
// นำเข้า Pin และ Context สำหรับ low-level async operations
use std::{pin::Pin, task::Context};

// --snip--

// นำเข้า Duration สำหรับการจัดการเวลา
use std::time::Duration;

// กำหนด Poll enum ของเราเอง เพื่อแสดงสถานะของ Future
// ในความเป็นจริงใช้ std::task::Poll แต่นี่สร้างขึ้นเพื่อการศึกษา
pub enum Poll<T> {
    Ready(T), // Future เสร็จสิ้นแล้ว มีผลลัพธ์
    Pending,  // Future ยังไม่เสร็จ ต้องรอต่อ
}

// กำหนด Future trait ของเราเอง เพื่อแสดงการทำงานภายในของ async
// ในความเป็นจริงใช้ std::future::Future
pub trait MyFuture {
    type Output; // ชนิดข้อมูลที่ Future จะคืน

    // เมทอดหลักสำหรับตรวจสอบสถานะของ Future
    // รับ self แบบ Pin<&mut Self> เพื่อป้องกันการย้าย memory address
    // Context ใช้สำหรับการสื่อสารกับ async runtime
    fn poll(self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<Self::Output>;
}

// ฟังก์ชันหลักที่แสดงการใช้งาน Pin และการจัดการ Future ในลักษณะที่ลึกขึ้น
pub fn closer_look_trait_for_async() {
    trpl::block_on(async {
        // สร้าง channel สำหรับการสื่อสารระหว่าง tasks
        let (tx, mut rx) = trpl::channel();

        // โคลน transmitter เพื่อใช้ใน task ที่สอง
        let tx1: trpl::Sender<String> = tx.clone();

        // สร้าง future แรกและ pin ไว้ใน memory เพื่อป้องกันการย้าย
        // pin! macro ช่วยให้สร้าง Pin<&mut Future> ได้ง่ายขึ้น
        let tx1_fut = pin!(async move {
            // --snip--
            // ข้อมูลชุดแรกที่จะส่ง
            let vals = vec![
                String::from("hi"),
                String::from("from"),
                String::from("the"),
                String::from("future"),
            ];

            // ส่งข้อมูลทีละตัวพร้อม delay 1 วินาที
            for val in vals {
                tx1.send(val).unwrap();
                trpl::sleep(Duration::from_secs(1)).await;
            }
        });

        // สร้าง future สำหรับรับข้อมูลและ pin ไว้
        let rx_fut = pin!(async {
            // --snip--
            // รับข้อมูลจาก channel จนกว่าจะปิด
            while let Some(value) = rx.recv().await {
                println!("received '{value}'");
            }
        });

        // สร้าง future สำหรับ transmitter ตัวที่สองและ pin ไว้
        let tx_fut = pin!(async move {
            // --snip--
            // ข้อมูลชุดที่สองที่จะส่ง
            let vals = vec![
                String::from("more"),
                String::from("messages"),
                String::from("for"),
                String::from("you"),
            ];

            // ส่งข้อมูลทีละตัวพร้อม delay 1 วินาที
            for val in vals {
                tx.send(val).unwrap();
                trpl::sleep(Duration::from_secs(1)).await;
            }
        });

        // สร้าง vector ของ pinned futures ที่มี trait object เหมือนกัน
        // Pin<&mut dyn Future<Output = ()>> หมายถึง pinned reference ไปยัง trait object
        // ที่สามารถเก็บ Future ชนิดต่างๆ ได้ใน vector เดียวกัน
        let futures: Vec<Pin<&mut dyn Future<Output = ()>>> = vec![tx1_fut, rx_fut, tx_fut];

        // ใช้ join_all เพื่อรัน futures ทั้งหมดพร้อมกัน
        // จะรอให้ทุก future ใน vector เสร็จสิ้นก่อนจะดำเนินการต่อ
        trpl::join_all(futures).await;
    });
}

/*
// ตัวอย่างที่ใช้ไม่ได้: พยายามใช้ Box<dyn Future> แทน Pin<&mut dyn Future>
// ปัญหา: Future บางชนิดไม่สามารถย้ายได้ (not Unpin) จึงใช้ Box ไม่ได้
fn cannot_be_unpinned_example() {
    use std::time::Duration;

    trpl::block_on(async {
        let (tx, mut rx) = trpl::channel();

        let tx1 = tx.clone();
        // ไม่ใช้ pin! macro - เป็นเพียง async block ธรรมดา
        let tx1_fut = async move {
            let vals = vec![
                String::from("hi"),
                String::from("from"),
                String::from("the"),
                String::from("future"),
            ];

            for val in vals {
                tx1.send(val).unwrap();
                trpl::sleep(Duration::from_secs(1)).await;
            }
        };

        let rx_fut = async {
            while let Some(value) = rx.recv().await {
                println!("received '{value}'");
            }
        };

        let tx_fut = async move {
            // --snip--
            let vals = vec![
                String::from("more"),
                String::from("messages"),
                String::from("for"),
                String::from("you"),
            ];

            for val in vals {
                tx.send(val).unwrap();
                trpl::sleep(Duration::from_secs(1)).await;
            }
        };

        // พยายามใช้ Box<dyn Future> แต่จะไม่ทำงานเพราะ Future ไม่สามารถย้ายได้
        let futures: Vec<Box<dyn Future<Output = ()>>> =
            vec![Box::new(tx1_fut), Box::new(rx_fut), Box::new(tx_fut)];

        trpl::join_all(futures).await;
    });
}
 */
