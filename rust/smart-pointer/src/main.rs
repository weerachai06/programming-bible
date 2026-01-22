use std::{cell::RefCell, rc::Rc}; // 🧵 RefCell: interior mutability, Rc: reference counting

use smart_pointer::{CustomerSmartPointer, ExpensiveCalculator, List, MyBox};

/// 🧠 Smart Pointers demo: สาธิต memory management ใน Rust
/// ครอบคลุม: Box, Rc, RefCell, custom smart pointers
fn main() {
    // 📦 === BOX DEMO: HEAP ALLOCATION ===
    // สร้างข้อมูลขนาดใหญ่บน heap แทน stack
    let x = Box::new([0u32; 1_000_000]); // 1M integers บน heap
    println!("📏 Heap address: {:p}", &x);  // แสดง memory address

    // 📦 ย้าย ownership ของ Box ไป function อื่น
    move_smart_pointer(x);
    
    // 🔗 === CONS LIST (RECURSIVE DATA STRUCTURE) ===
    print_cons_list();       // สาธิต Rc + RefCell pattern
    
    // 📎 === FOLLOWING REFERENCES ===
    following_references();   // dereference operator (*)
    
    // 🏗️ === CUSTOM SMART POINTER ===
    own_smart_pointer();     // custom MyBox with Deref trait

    // 🗑️ === DROP TRAIT DEMO ===
    // สาธิตว่า drop method ถูกเรียกเมื่อ out of scope
    let _c = CustomerSmartPointer {
        data: String::from("my stuff"),
    };
    let _d = CustomerSmartPointer {
        data: String::from("other stuff"),
    };

    // 📝 ผลลัพธ์ที่จะได้:
    // CustomSmartPointers created
    // Dropping CustomSmartPointer with data `other stuff`!
    // Dropping CustomSmartPointer with data `my stuff`!
    println!("✅ CustomSmartPointers created");

    // 📋 === REFCELL AND INTERIOR MUTABILITY ===
    // แปลง immutable context เป็น mutable ได้ ที่ runtime
    let a = ExpensiveCalculator {
        cache: RefCell::new((0..1_000_000).collect()), // vector 1M elements
    };

    let a = a.get_value(500_000); // เข้าถึง element ที่ index 500,000
    println!("📊 The calculated value is {}", a);

    // ⚠️ Reference Cycles Can Leak Memory (ไม่ได้ implement ใน demo นี้)
}

/// 📦 ย้าย Box ขนาดใหญ่ไป function อื่น
/// แสดงให้เห็นว่าข้อมูลถูก move ไป
// https://gemini.google.com/share/4a08ff0bd431
fn move_smart_pointer(v: Box<[u32; 1_000_000]>) {
    println!("📎 First element: {:?}", &v[0]); // เข้าถึง element แรก
} // v ถูก drop ที่นี่ (heap memory ถูกลบอัตโนมัติ)

/// ❌ ตัวอย่าง recursive type ที่จะ compile error:
// enum List {
//     Cons(i32, List),  // ❌ infinite size!
//     Nil,
// }

/// 🔗 สาธิต Cons List (linked list) ด้วย Rc + RefCell
/// ใช้ Rc เพื่อให้หลาย owners และ RefCell เพื่อ interior mutability
fn print_cons_list() {
    // ex1: ใช้ RefCell และ Rc เพื่อสร้าง recursive data structure
    // ถ้าต้องการดู implementation ของ List ให้ดูที่ src/lib.rs
    let list = List::Cons(
        1,  // ค่า node แรก
        RefCell::new(Rc::new(List::Cons(
            2, // ค่า node ที่สอง
            RefCell::new(Rc::new(List::Cons(
                3, // ค่า node ที่สาม
                RefCell::new(Rc::new(List::Nil)) // สิ้นสุด list
            )))
        )))
    );
    let tail = list.tail();  // เข้าถึง tail ของ list
    println!("🔗 Tail of list: {:?}", tail);
}

/// 📎 สาธิต dereference operator (*)
/// ใช้เพื่อเข้าถึงค่าที่ reference ชี้ไป
fn following_references() {
    let x = 5;      // ค่าบน stack
    let y = &x;     // reference ไปยัง x

    assert_eq!(5, x);   // ✅ เปรียบเทียบค่าโดยตรง
    assert_eq!(5, *y);  // ✅ dereference y เพื่อเข้าถึงค่า
}

/// 🏗️ สาธิต custom smart pointer (MyBox)
/// implement Deref trait เพื่อให้ใช้ * operator ได้
fn own_smart_pointer() {
    let b = 5;
    let m = MyBox::new(5);  // custom smart pointer

    // ⚠️ ถ้าไม่ implement Deref trait จะ error:
    // can't compare `{integer}` with `MyBox<{integer}>`
    assert_eq!(5, b);   // ✅ เปรียบเทียบค่าปกติ
    assert_eq!(5, *m);  // ✅ dereference MyBox เพื่อเข้าถึงค่า

    // 🎭 === DEREF COERCION DEMO ===
    // เราสามารถเรียก function ที่รับ string slice ด้วย MyBox<String>
    let m = MyBox::new(String::from("Rust"));
    hello(&m);          // ✅ deref coercion: MyBox<String> -> &String -> &str
    
    let m2 = MyBox::new(String::from("World"));
    hello(&(*m2)[..]);  // 🔧 explicit deref coercion เป็น &str
}

/// 👋 ฟังก์ชันที่รับ string slice
/// ใช้เพื่อสาธิต deref coercion
fn hello(name: &str) {
    println!("👋 Hello, {}!", name);
}
