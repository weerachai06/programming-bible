/// 🔗 DatabaseConnection with lifetime parameter
/// สาธิต struct ที่มี borrowed reference (&str) ต้องใช้ lifetime annotation
/// จำเป็นต้องระบุ lifetime เพราะ compiler ต้องรู้ว่า reference นี้ valid นานแค่ไหน
pub struct DatabaseConnection<'a> {
    pool: &'a str,  // 🔗 borrowed reference ต้องมี lifetime 'a
    
    // ❌ วิธีที่ผิด: borrowed reference โดยไม่มี lifetime specifier
    // pool2: &str,  // error: missing lifetime specifier
}

/// ✅ DatabaseConnection2 with owned data
/// ใช้ String แทน &str เพื่อหลีกเลี่ยงปัญหา lifetime
/// เมื่อใช้ owned data จะไม่ต้องกังวลเรื่อง lifetime
pub struct DatabaseConnection2 {
    pool: String, // 📦 owned String ไม่ต้องใส่ lifetime
}

/// Implementation สำหรับ DatabaseConnection2 (owned version)
impl DatabaseConnection2 {
    /// 🏗️ Constructor: สร้าง instance ใหม่ด้วย owned String
    /// รับ String ownership แทนการ borrow
    pub fn new(sql: String) -> DatabaseConnection2 {
        DatabaseConnection2 { pool: sql }
    }

    /// 📄 ส่งกลับ string slice จาก owned String
    /// สามารถคืน &str ได้เพราะ self มี lifetime ที่ชัดเจน
    pub fn get_connection_str(&self) -> &str {
        self.pool.as_str() // แปลง String -> &str
    }
}

/// Implementation สำหรับ DatabaseConnection (borrowed version)
/// ต้องระบุ lifetime parameter ทั้งใน impl และ struct
impl<'a> DatabaseConnection<'a> {
    /// 🏗️ Constructor: สร้าง instance ที่ borrow string reference
    /// sql parameter ต้องมี lifetime เท่ากับ struct ที่สร้าง
    pub fn new(sql: &'a str) -> DatabaseConnection<'a> {
        DatabaseConnection { pool: sql }
    }

    /// 📄 ส่งกลับ borrowed string reference
    /// lifetime ของ return value ผูกอยู่กับ lifetime ของ struct
    pub fn get_connection_str(&self) -> &str {
        self.pool // ส่งกลับ borrowed string โดยตรง
    }
}

/* 🧠 สรุปความแตกต่าง:
 * 
 * DatabaseConnection<'a>:
 * ✅ Memory efficient (ไม่ copy string)
 * ❌ ซับซ้อนเรื่อง lifetime
 * ❌ จำกัดด้วย lifetime ของ original string
 * 
 * DatabaseConnection2:
 * ❌ ใช้ memory มากกว่า (copy string)
 * ✅ ไม่มีปัญหา lifetime
 * ✅ มี ownership เต็มรูปแบบ
 */
