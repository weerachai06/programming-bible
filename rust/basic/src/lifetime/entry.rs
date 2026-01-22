use crate::lifetime::{DatabaseConnection, DatabaseConnection2};

/// 🕐 Lifetime concepts demo function
/// สาธิต lifetime annotations และการจัดการ memory safety ใน Rust
pub fn lifetime_entry() {
    // ❌ ตัวอย่าง dangling reference ที่จะ compile error
    /*
       let r;                    // declare r without value
       {
           let x = 5;            // x มี lifetime สั้นกว่า r
           r = &x;               // ❌ Error: x จะถูก drop เมื่อออกจาก scope
       }                         // x ถูก drop ที่นี่
       println!("r: {}", r);     // ❌ r อ้างอิงไปยัง invalid memory
    */
    
    exam1();                   // 🧪 ทดสอบ lifetime function
    
    let x = check_number(&20); // 📊 ฟังก์ชันที่ return static lifetime
    println!("x: {}", x);

    // 🔗 === STRUCT WITH LIFETIME SPECIFIER DEMO ===
    let db_conn_str = String::from("my_db_pool");
    // let my_db_connection: &str;  // ถ้าประกาศตัวนี้จะเกิด lifetime issue
    
    {
        // ✅ DatabaseConnection ใช้ lifetime parameter '<_>
        let db_connection: DatabaseConnection<'_> = DatabaseConnection::new(db_conn_str.as_str());
        // my_db_connection = db_connection.get_connection_str();  // ❌ จะ error
        println!(
            "Database Connection String: {}",
            db_connection.get_connection_str()
        );
    } // db_connection ถูก drop ที่นี่

    /* 💥 Compiler error ที่จะเกิดขึ้นถ้า uncomment:
        let db_connection = DatabaseConnection::new(db_conn_str.as_str());
            ------------- binding `db_connection` declared here
        my_db_connection = db_connection.get_connection_str();
                           ^^^^^^^^^^^^^ borrowed value does not live long enough
        }
        - `db_connection` dropped here while still borrowed
        println!("Database Connection String: {}", my_db_connection);
    */
    // println!("Database Connection String: {}", my_db_connection);

    // ✅ === วิธีแก้ไขด้วย OWNED DATA ===
    let my_db_connection: String;
    {
        // DatabaseConnection2 ใช้ owned String แทน borrowed &str
        let db_connection = DatabaseConnection2::new(db_conn_str.to_owned());
        my_db_connection = db_connection.get_connection_str().to_owned(); // clone data
    } // db_connection ถูก drop แต่ my_db_connection ยัง valid

    println!("Database Connection String: {}", my_db_connection);

    DatabaseConnection2::new(db_conn_str); // ✅ owned data ไม่มีปัญหา lifetime

    // 🎭 === ENUM PATTERN MATCHING ===
    let x = map_role_as_enum("admin");     // แปลง string เป็น enum
    println!("Role: {:?}", x);
}

/// 🧪 ทดสอบ lifetime annotation ในฟังก์ชัน
/// สาธิต longest function ที่ใช้ lifetime parameter
pub fn exam1() {
    let string1 = String::from("long string is long");
    {
        let string2 = String::from("xyz");
        // longest function ต้องการ lifetime annotation
        let result = longest(string1.as_str(), string2.as_str());
        println!("🏆 The longest string is {}", result);
    } // string2 ถูก drop ที่นี่
}

/// 🔗 ฟังก์ชันที่รวม string โดยไม่ใช้ lifetime (return owned String)
/// ไม่ต้องใช้ lifetime parameter เพราะ return owned value
pub fn join_strings<'a>(str1: &str, str2: &str) -> String {
    format!("{} {}", str1, str2) // สร้าง String ใหม่ (owned)
}

/// ✅ การใช้ lifetime annotation อย่างถูกต้อง
/// ฟังก์ชันที่ return string ที่ยาวกว่า
/// 'a lifetime parameter บอกว่า return value มี lifetime เท่ากับ input ที่สั้นกว่า
pub fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() { x } else { y }
}

/// 🔢 ฟังก์ชันที่ return static lifetime string
/// 'static lifetime = อยู่ได้ตลอด lifetime ของ program
pub fn check_number<'a>(x: &'a i32) -> &'static str {
    if *x > 10 {
        "Greater than 10" // string literal มี 'static lifetime
    } else {
        "10 or less"     // string literal มี 'static lifetime
    }
}

/// 🗂️ แปลง string เป็น enum ด้วย pattern matching
/// return Option<Role> เพื่อ handle case ที่ไม่ตรงกับ enum variant
fn map_role_as_enum(role_str: &str) -> Option<Role> {
    match role_str {
        "admin" => Some(Role::Admin), // ✅ ตรงกับ admin
        "user" => Some(Role::User),   // ✅ ตรงกับ user  
        _ => None,                    // ❌ ไม่ตรงกับอะไรเลย
    }
}

/// 👥 Enum สำหรับกำหนด user roles
/// ใช้ #[derive(Debug)] เพื่อให้ print ได้
#[derive(Debug)]
enum Role {
    Admin, // 🔑 ผู้ดูแลระบบ
    User,  // 👤 ผู้ใช้ทั่วไป
}

// ❌ Incorrect usage of lifetimes
/*
pub fn longest_wrong<'a>(x: &str, y: &str) -> &'a str {
    if x.len() > y.len() { x } else { y }
}
*/
