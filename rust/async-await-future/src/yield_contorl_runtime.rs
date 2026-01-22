// นำเข้า thread และ Duration สำหรับการจำลอง blocking operations
use std::{thread, time::Duration};

// ฟังก์ชันหลักที่แสดงความแตกต่างระหว่างการไม่มี yield control และการมี yield control
pub fn yield_control_runtime() {
    // ตัวอย่างแบบไม่ดี - ไม่มี yield control (ปิดการใช้งาน)
    // bad_example_no_yield_control_runtime();
    // println!("-----------------------------------");

    // ตัวอย่างที่ดี - มี yield control
    yield_now_example();
}

// ตัวอย่างแบบไม่ดี: ไม่มี yield control ทำให้ task หนึ่งทำงานติดต่อกันจนเสร็จ
// ก่อนที่จะให้ task อื่นได้รันต่อ (blocking แบบไม่สมดุล)
pub fn bad_example_no_yield_control_runtime() {
    trpl::block_on(async {
        // Task A: จะทำงานติดต่อกันจนเสร็จก่อน
        let a = async {
            println!("'a' started.");
            slow("a", 30); // ทำงาน 30ms แบบ blocking
            slow("a", 10); // ทำงาน 10ms แบบ blocking ต่อเนื่อง
            slow("a", 20); // ทำงาน 20ms แบบ blocking ต่อเนื่อง
            println!("'a' finished.");
        };

        // Task B: จะรอให้ task A เสร็จก่อน แล้วถึงจะได้ทำงาน
        let b = async {
            println!("'b' started.");
            slow("b", 75); // ทำงาน 75ms แบบ blocking
            slow("b", 10); // ทำงาน 10ms แบบ blocking ต่อเนื่อง
            slow("b", 15); // ทำงาน 15ms แบบ blocking ต่อเนื่อง
            slow("b", 350); // ทำงาน 350ms แบบ blocking ต่อเนื่อง
            println!("'b' finished.");
        };

        // รัน task A และ B พร้อมกัน แต่จริงๆ แล้วจะเป็น sequential เพราะไม่มี yield
        trpl::join(a, b).await;
    });
}

// ตัวอย่างที่ดี: ใช้ yield_now() เพื่อให้ control กลับไปยัง runtime
// ทำให้ tasks สามารถสลับกันทำงานได้อย่างสมดุล (cooperative multitasking)
pub fn yield_now_example() {
    trpl::block_on(async {
        // Task A: มี yield points ทำให้สามารถสลับไปทำ task อื่นได้
        let a = async {
            println!("'a' started.");
            slow("a", 30); // ทำงาน 30ms
            trpl::yield_now().await; // ยกระดับ control ให้ runtime เพื่อสลับไป task อื่น
            slow("a", 10); // ทำงาน 10ms
            trpl::yield_now().await; // yield ให้ task อื่นได้รัน
            slow("a", 20); // ทำงาน 20ms
            trpl::yield_now().await; // yield ให้ task อื่นได้รัน
            println!("'a' finished.");
        };

        // Task B: มี yield points เช่นเดียวกัน
        let b = async {
            println!("'b' started.");
            slow("b", 75); // ทำงาน 75ms
            trpl::yield_now().await; // yield control กลับไป runtime
            slow("b", 10); // ทำงาน 10ms
            trpl::yield_now().await; // yield control กลับไป runtime
            slow("b", 15); // ทำงาน 15ms
            trpl::yield_now().await; // yield control กลับไป runtime
            slow("b", 350); // ทำงาน 350ms
            trpl::yield_now().await; // yield control กลับไป runtime
            println!("'b' finished.");
        };

        // รัน task A และ B พร้อมกัน โดย runtime จะสลับ context ระหว่าง tasks
        // ตาม yield points ที่เรากำหนด
        trpl::join(a, b).await;
    });
}

// ฟังก์ชันจำลอง blocking operation ที่ใช้เวลานาน
// รับ name สำหรับการ debug และ ms (milliseconds) สำหรับระยะเวลาการทำงาน
fn slow(name: &str, ms: u64) {
    // ใช้ thread::sleep เพื่อจำลอง CPU-intensive task ที่ใช้เวลานาน
    // ในโลกจริงอาจเป็น file I/O, การคำนวณ, หรือ network call
    thread::sleep(Duration::from_millis(ms));

    // แสดงผลเพื่อติดตามการทำงานของ task แต่ละตัว
    println!("'{name}' ran for {ms}ms");
}
