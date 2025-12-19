/// 🎭 Speaking trait: กำหนด behavior ที่ types ต่างๆ ต้อง implement
/// 
/// Trait คล้าย interface ในภาษาอื่น ใช้สำหรับ shared behavior
/// Types ที่ implement trait นี้จะต้องมี method `speak`
pub trait Speaking {
    /// 🗣️ Method ที่ทุก type ต้อง implement
    /// 
    /// &self = method รับ immutable reference ของ instance
    fn speak(&self);
}
