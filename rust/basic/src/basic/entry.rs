#![allow(unused)] // 🔧 อนุญาตให้มี unused variables สำหรับการเรียนรู้
// use package::module::item; // 📦 วิธีการ import modules ในรูปแบบปกติ
use std::collections::HashMap; // 📚 นำเข้า HashMap จาก standard library

// 🏗️ นำเข้า custom types จาก modules ของเรา
use crate::{basic::Customer, basic::Person, basic::Speaking};

/// 🎯 ฟังก์ชันหลักสำหรับทดลอง concepts พื้นฐานของ Rust
/// ครอบคลุม: data types, ownership, borrowing, collections
pub fn basic_entry() {
    // 🔢 === INTEGER TYPES DEMO ===
    println!("=============== Integer Types: ================");
    let a = 6_i16; // i16: signed 16-bit integer (-32,768 to 32,767)
    let b: u32 = 20000; // u32: unsigned 32-bit integer (explicit type)
    let c = 2_000_000u64; // u64: ใช้ underscore เพื่อให้อ่านง่าย และ suffix u64
    println!("The value of x is: {}", a);
    println!("The value of y is: {}", b);
    println!("The value of z is: {}", c);

    // ✅ === BOOLEAN TYPES DEMO ===
    println!("=============== Boolean Types: ================");
    let t = true; // bool: type inference
    let f: bool = false; // bool: explicit type annotation
    println!("The value of t is: {}", t);
    println!("The value of f is: {}", f);

    // 🔤 === CHARACTER TYPES DEMO ===
    println!("=============== Character Types: ================");
    let z = 'z'; // char: 4 bytes, Unicode scalar value
    let heart_eyed_cat = '😻'; // char: รองรับ Unicode emoji
    println!("The value of z is: {}", z);
    println!("The value of heart_eyed_cat is: {}", heart_eyed_cat);

    // 🔢 === FLOATING-POINT TYPES DEMO ===
    println!("=============== Floating-Point Types: ================");
    let x = 2.0; // f64: default floating point type
    let y: f32 = 3.0; // f32: explicit type annotation
    println!("The value of x is: {}", x);
    println!("The value of y is: {}", y);

    // 📦 === COMPOUND TYPES DEMO ===
    println!("=============== Compound Types: ================");
    // 🎭 Tuple: group multiple values with different types
    let tup: (i32, f64, u8) = (500, 6.4, 1);
    let (x, y, z) = tup; // destructuring tuple
    println!("The value of x is: {}", x);
    println!("The value of y is: {}", y);
    println!("The value of z is: {}", z);

    // 📊 === ARRAY TYPES DEMO ===
    println!("=============== Array Types: ================");
    let arr: [i32; 5] = [1, 2, 3, 4, 5]; // Array: fixed size, same type
    let first = arr[0]; // accessing elements by index
    let second = arr[1];
    println!("The first element is: {}", first);
    println!("The second element is: {}", second);

    println!("=============== Done ================");

    // 🔒 === OWNERSHIP AND BORROWING DEMO ===
    println!("=============== Ownership and Borrowing: ================");
    let mut n1 = 5; // mutable variable
    let n2 = &mut n1; // mutable reference to n1
    *n2 += 1; // dereference และ modify value
    println!(" n2: {}", n2);

    let s1 = String::from("hello"); // s1 owns the String
    let s2 = &s1; // s2 borrows from s1 (immutable reference)
    println!(" s1: {}, s2: {}", s1, s2); // both can be used
    test_borrowing(s2); // pass reference to function
    mutate_number(n2); // pass mutable reference

    println!(" n1: {}", n1);

    // 📝 === STRING TYPES DEMO ===
    let hello = "Hello, world!"; // &str: string literal (immutable)
    let hello = String::from("Hello, world!"); // String: heap-allocated (growable)
    let hello = "Hello, world!".to_string(); // อีกวิธีสร้าง String
    let hello_slice = &hello[0..5]; // string slice: reference to part of string
    println!("The string is: {}", hello);
    println!("The string slice is: {}", hello_slice);

    // 📚 === COLLECTIONS DEMO ===
    // 🗂️ Vector: dynamic array
    let mut vec = Vec::new(); // สร้าง empty vector
    vec.push(1); // เพิ่ม elements
    vec.push(2);
    vec.push(3);
    println!("The vector is: {:?}", vec);

    // 🏭 vec with macro: วิธีสร้าง vector ที่สะดวกกว่า
    let mut vec = vec![4, 5, 6];
    println!("The vector is: {:?}", vec);

    // 🗃️ HashMap: key-value storage
    let mut map = HashMap::new();
    map.insert("one", 1); // insert key-value pairs
    map.insert("two", 2);
    map.insert("three", 3);
    println!("The hashmap is: {:?}", map);

    // ⚠️ unwrap(): จะ panic ถ้า key ไม่มี (ใช้เพื่อการทดสอบเท่านั้น)
    println!("{}", map.get("one").unwrap());

    // 🏗️ === STRUCT DEMO ===
    let person = Person::new("Alice".to_string(), 20); // สร้าง instance

    person.hello(); // เรียก method

    // 🎭 === TRAIT DEMO ===
    person.speak(); // เรียก method จาก trait Speaking

    // 🔀 === ENUM DEMO ===
    let color = Colors::Red; // enum variant
    let mut color_str = "";
    match color {
        // pattern matching
        Colors::Red => color_str = "Red",
        Colors::Green => color_str = "Green",
        Colors::Blue => color_str = "Blue",
        _ => println!("Unknown color"), // wildcard pattern
    }

    println!("🎨 The color is: {}", color_str);

    // 📊 === ERROR HANDLING DEMO ===
    // Custom error handling with custom enum
    let grade = check_grade(-1);
    match grade {
        GradeResult::Error(e) => println!("❌ Error: {}", e),
        GradeResult::Value(g) => println!("✅ Your grade is: {}", g),
    }

    // Option<T> pattern (commented out)
    // let grade = check_grade2(105);
    // match grade {
    //     None => println!("Error: Score must be between 0 and 100"),
    //     Some(g) => println!("Your grade is: {}", g),
    // }

    // Result<T, E> pattern - Rust's idiomatic error handling
    let grade = check_grade3(90);

    // 🔄 Different ways to handle Result:
    // if let Ok(v) = grade {
    //     println!("Your grade is: {}", v);
    // }

    // if grade.is_err() {
    //     return;
    // }

    // let v = grade.unwrap();  // ⚠️ จะ panic ถ้า error
    // println!("Your grade is: {}", v);

    // 🎯 Best practice: ใช้ match เพื่อ handle ทั้ง Ok และ Err
    let v = match grade {
        Err(e) => {
            println!("❌ Error: {}", e);
            return; // early return ถ้า error
        }
        Ok(g) => g, // extract value ถ้า success
    };

    println!("✅ Your grade is: {}", v);

    // 🎯 === CLOSURES (LAMBDA FUNCTIONS) ===
    // Regular function call
    let x = add(10, 20);
    println!("📈 The sum is: {}", x);

    // Closure (anonymous function)
    let sub = |a, b| a - b; // |params| body
    let y = sub(30, 40);
    println!("📉 The difference is: {}", y);

    // Higher-order function: function ที่รับ function เป็น parameter
    let y = cal(10, 30, sub); // ส่ง closure เป็น argument
    println!("📉 The difference is: {}", y);

    let y = cal(10, 30, add); // ส่ง regular function
    println!("📈 The sum is: {}", y);

    let y = cal(10, 30, |a, b| a % b); // inline closure
    println!("📐 The modulus is: {}", y);
}

/// 🔧 Higher-order function: รับ closure/function เป็น parameter
/// F: Fn(i32, i32) -> i32 = function trait bound
fn cal<F: Fn(i32, i32) -> i32>(a: i32, b: i32, f: F) -> i32 {
    f(a, b) // เรียก function/closure ที่ส่งมา
}

/// ➕ Regular function สำหรับบวกเลข
fn add(a: i32, b: i32) -> i32 {
    a + b
}

/// 📊 Error handling ด้วย custom enum
fn check_grade(score: i32) -> GradeResult {
    if score > 100 || score < 0 {
        return GradeResult::Error("Score must be between 0 and 100".to_string());
    }

    GradeResult::Value("A".to_string()) // สำหรับ demo เท่านั้น
}

/// 📊 Error handling ด้วย Option<T>
fn check_grade2(score: i32) -> Option<String> {
    if score > 100 || score < 0 {
        return None; // ไม่มีค่า
    }

    Some("A".to_string()) // มีค่า
}

/// 📊 Error handling ด้วย Result<T, E> (Rust idiomatic way)
fn check_grade3(score: i32) -> Result<String, String> {
    if score > 100 || score < 0 {
        return Err("Score must be between 0 and 100".to_string()); // Error case
    }

    return Ok("A".to_string());
}

fn test_borrowing(s: &String) {
    println!("The string is: {}", s);
}

fn mutate_number(n: &mut i32) {
    *n += 1;
}

enum Colors {
    Red,
    Green,
    Blue,
}

enum GradeResult {
    Value(String),
    Error(String),
}
