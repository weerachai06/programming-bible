use crate::basic::Speaking; // 🎭 นำเข้า trait Speaking

/// 👤 Person struct: แทนข้อมูลของบุคคล
/// ใช้สำหรับสาธิต struct definition และ method implementation
pub struct Person {
    name: String, // 📝 ชื่อ (private field)
    age: u8,      // 🎂 อายุ (private field, u8 = 0-255)
}

impl Person {
    /// 🏗️ Constructor: สร้าง Person instance ใหม่
    ///
    /// # Arguments
    /// * `name` - ชื่อของบุคคล (String)
    /// * `age` - อายุ (u8)
    ///
    /// # Returns
    /// * Person instance
    pub fn new(name: String, age: u8) -> Self {
        Self { name, age } // 📦 สร้าง struct ด้วย field shorthand
    }

    /// 👋 แสดงข้อความแนะนำตัว
    /// &self = immutable reference ไปยัง instance
    pub fn hello(&self) {
        println!(
            "Hello, my name is {} and I am {} years old.",
            self.name, self.age
        );
    }
}

/// 🎤 Implementation ของ Speaking trait สำหรับ Person
/// ทุก Person สามารถ "พูด" ได้
impl Speaking for Person {
    /// พูดข้อความง่ายๆ
    fn speak(&self) {
        println!("{} says: Hello!", self.name);
    }
}
