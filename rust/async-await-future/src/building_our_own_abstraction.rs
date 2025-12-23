// นำเข้าไลบรารี trpl ที่จำเป็นสำหรับการทดสอบ
extern crate trpl; // required for mdbook test

// นำเข้า Duration สำหรับจัดการเวลา
use std::time::Duration;

// ฟังก์ชันหลักที่แสดงการสร้าง abstraction ของเราเอง (timeout function)
// แสดงแนวคิดการสร้าง utility functions ที่ใช้ async/await
pub fn building_our_own_abstraction() {
    trpl::block_on(async {
        // สร้าง async block ที่ใช้เวลา 200ms ในการทำงาน
        // future นี้จะคืนค่า 42 หลังจาก sleep เสร็จ
        let slow = async {
            trpl::sleep(Duration::from_millis(200)).await;
            42 // ค่าที่จะส่งคืนเมื่อ future เสร็จสิ้น
        };

        // เรียกใช้ timeout function ที่เราสร้างขึ้น
        // กำหนด timeout เป็น 100ms ซึ่งน้อยกว่าเวลาที่ slow future ใช้ (200ms)
        // ดังนั้น slow future จะ timeout ก่อนที่จะเสร็จ
        match timeout(slow, Duration::from_millis(100)).await {
            Ok(value) => println!("Completed with value: {}", value), // ถ้าเสร็จทัน
            Err(_) => println!("Timed out!"),                         // ถ้า timeout
        }
    });
}

// ฟังก์ชัน timeout ที่เป็น generic และเป็น async function
// F: Future หมายถึงรับ parameter ที่เป็น Future type ใดก็ได้
// คืนค่า Result<F::Output, Duration> ซึ่งจะเป็น Ok(ผลลัพธ์) หรือ Err(เวลา timeout)
async fn timeout<F: Future>(future_to_try: F, max_time: Duration) -> Result<F::Output, Duration> {
    // ใช้ select เพื่อแข่งขันระหว่าง 2 futures:
    // 1. future_to_try = future ที่เราต้องการรัน
    // 2. trpl::sleep(max_time) = timer สำหรับ timeout
    // future ใดเสร็จก่อนจะถูกเลือก
    match trpl::select(future_to_try, trpl::sleep(max_time)).await {
        // ถ้า future_to_try เสร็จก่อน (Left) = ไม่ timeout
        trpl::Either::Left(value) => Ok(value),
        // ถ้า sleep เสร็จก่อน (Right) = timeout เกิดขึ้น
        trpl::Either::Right(_) => Err(max_time),
    }
}
