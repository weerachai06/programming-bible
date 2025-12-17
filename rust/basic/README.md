# Rust Programming Bible - Basic Concepts

📚 สรุปเนื้อหาที่เรียนรู้ในโปรเจ็กต์ Rust Basic

## 📖 Table of Contents

1. [Variable Types](#1-variable-types)
2. [Ownership & Borrowing](#2-ownership--borrowing)
3. [String Types](#3-string-types)
4. [Collections](#4-collections)
5. [Control Flow](#5-control-flow)
6. [Functions](#6-functions)
7. [Structs & Implementation](#7-structs--implementation)
8. [Traits](#8-traits)
9. [Enums](#9-enums)
10. [Error Handling](#10-error-handling)
11. [Closures](#11-closures)

## 1. Variable Types

### 1.1 Integer Types
```rust
let a = 6_i16;           // 16-bit signed integer
let b: u32 = 20000;      // 32-bit unsigned integer with type annotation
let c = 2_000_000u64;    // 64-bit unsigned integer with suffix
```

### 1.2 Boolean Types
```rust
let t = true;
let f: bool = false;     // with explicit type annotation
```

### 1.3 Character Types
```rust
let z = 'z';
let heart_eyed_cat = '😻';  // Unicode support
```

### 1.4 Floating-Point Types
```rust
let x = 2.0;             // f64 by default
let y: f32 = 3.0;        // f32 with explicit type annotation
```

### 1.5 Compound Types

#### Tuples
```rust
let tup: (i32, f64, u8) = (500, 6.4, 1);
let (x, y, z) = tup;     // Destructuring
```

#### Arrays
```rust
let arr: [i32; 5] = [1, 2, 3, 4, 5];
let first = arr[0];      // Accessing elements
let second = arr[1];
```

## 2. Ownership & Borrowing

### 2.1 Mutable References
```rust
let mut n1 = 5;
let n2 = &mut n1;        // Mutable borrow
*n2 += 1;                // Dereference and modify
```

### 2.2 Immutable Borrowing
```rust
let s1 = String::from("hello");
let s2 = &s1;            // Immutable borrow
println!(" s1: {}, s2: {}", s1, s2);  // Both can be used
```

### 2.3 Functions with Borrowing
```rust
fn test_borrowing(s: &String) {
    println!("The string is: {}", s);
}

fn mutate_number(n: &mut i32) {
    *n += 1;
}
```
### 2.4 Memory of String
```
 Stack                    Heap
 ┌─────────────┐         ┌──────────────┐
 │db_connection│ ──────→ │"my_db_pool"  │
 │  String {   │         │              │
 │   ptr: 0x.. │         │              │
 │   len: 9    │         │              │
 │   cap: 9    │         │              │
 │  }          │         │              │
 └─────────────┘         └──────────────┘
       ↓                        ↓
 เมื่อออกจาก scope          Heap ถูกทำลายตาม
```

## 3. String Types

### 3.1 Different Ways to Create Strings
```rust
let hello = "Hello, world!";                    // String literal
let hello = String::from("Hello, world!");      // String from literal
let hello = "Hello, world!".to_string();        // Convert to String
```

### 3.2 String Slicing
```rust
let hello_slice = &hello[0..5];  // String slice
```

## 4. Collections

### 4.1 Vectors
```rust
// Creating and modifying vectors
let mut vec = Vec::new();
vec.push(1);
vec.push(2);
vec.push(3);

// Using vec! macro
let mut vec = vec![4, 5, 6];
```

### 4.2 HashMap
```rust
use std::collections::HashMap;

let mut map = HashMap::new();
map.insert("one", 1);
map.insert("two", 2);
map.insert("three", 3);

// Accessing values
println!("{}", map.get("one").unwrap());
```

## 5. Control Flow

### 5.1 If Statements
```rust
let number = 7;
if number < 5 {
    println!("The number is less than 5");
} else if number == 5 {
    println!("The number is equal to 5");
} else {
    println!("The number is greater than 5");
}
```

### 5.2 If in Let Statements
```rust
let score = 85;
let grade = if score >= 90 {
    "A"
} else if score >= 80 {
    "B"
} else if score >= 70 {
    "C"
} else if score >= 60 {
    "D"
} else {
    "F"
};
```

### 5.3 Match Statements
```rust
let day = 3;
let day_name = match day {
    1 => "Monday",
    2 => "Tuesday",
    3 => "Wednesday",
    4 => "Thursday",
    5 => "Friday",
    6 => "Saturday",
    7 => "Sunday",
    _ => "Invalid day",
};
```

### 5.4 Loops

#### Loop with Break Value
```rust
let mut counter = 0;
let result = loop {
    counter += 1;
    if counter == 10 {
        break counter * 2;  // Return value from loop
    }
};
```

#### Loop Labels
```rust
let mut count = 0;
'outer: loop {
    let mut inner_count = 10;
    loop {
        if inner_count == 9 {
            break;           // Break inner loop
        }
        if count == 2 {
            break 'outer;    // Break outer loop
        }
        inner_count -= 1;
    }
    count += 1;
}
```

#### For Loops with Ranges
```rust
// Countdown using for loop and rev()
for number in (1..=4).rev() {
    println!("{number}!");
}
println!("LIFTOFF!!!");
```

## 6. Functions

### 6.1 Basic Functions
```rust
fn log_sum(a: i32, b: i32) {
    println!("The sum is: {}", a + b);
}

fn sum(a: i32, b: i32) -> i32 {
    return a + b;  // Explicit return
}

fn implicit_return_sum(a: i32, b: i32) -> i32 {
    a + b  // Implicit return (no semicolon)
}
```

### 6.2 Labeled Parameters
```rust
fn print_labeled_measurement(value: i32, unit_label: char) {
    println!("The measurement is: {value}{unit_label}");
}
```

### 6.3 Statements vs Expressions
```rust
let x = 5;  // Statement

// Expression block returns a value
let y = {
    let x_squared = x * x;  // Statement
    x_squared + 10          // Expression (no semicolon)
};
```

## 7. Structs & Implementation

### 7.1 Struct Definition
```rust
// person.rs
pub struct Person {
    name: String,
    age: u8,
}

impl Person {
    pub fn new(name: String, age: u8) -> Self {
        Self { name, age }
    }

    pub fn hello(&self) {
        println!(
            "Hello, my name is {} and I am {} years old.",
            self.name, self.age
        );
    }
}
```

### 7.2 Simple Struct
```rust
// customer.rs
pub struct Customer {
    pub name: String,
    pub age: u8,
}
```

## 8. Traits

### 8.1 Trait Definition
```rust
// speaking.rs
pub trait Speaking {
    fn speak(&self);
}
```

### 8.2 Implementing Traits
```rust
impl Speaking for Person {
    fn speak(&self) {
        println!("{} says: Hello!", self.name);
    }
}
```

## 9. Enums

### 9.1 Simple Enums
```rust
enum Colors {
    Red,
    Green,
    Blue,
}

let color = Colors::Red;
match color {
    Colors::Red => println!("Red"),
    Colors::Green => println!("Green"),
    Colors::Blue => println!("Blue"),
}
```

### 9.2 Enums with Data
```rust
enum GradeResult {
    Value(String),
    Error(String),
}

fn check_grade(score: i32) -> GradeResult {
    if score > 100 || score < 0 {
        return GradeResult::Error("Score must be between 0 and 100".to_string());
    }
    GradeResult::Value("A".to_string())
}
```

## 10. Error Handling

### 10.1 Option Type
```rust
fn check_grade2(score: i32) -> Option<String> {
    if score > 100 || score < 0 {
        return None;
    }
    Some("A".to_string())
}
```

### 10.2 Result Type
```rust
fn check_grade3(score: i32) -> Result<String, String> {
    if score > 100 || score < 0 {
        return Err("Score must be between 0 and 100".to_string());
    }
    Ok("A".to_string())
}

// Pattern matching with Result
let grade = check_grade3(90);
let v = match grade {
    Err(e) => {
        println!("Error: {}", e);
        return;
    }
    Ok(g) => g,
};
```

## 11. Closures

### 11.1 Basic Closures
```rust
let add = |a: i32, b: i32| -> i32 { a + b };  // Explicit types and return
let subtract = |a: i32, b: i32| a - b;        // Implicit return

let result = add(5, 7);
println!("Result: {}", subtract(10, 4));
```

### 11.2 Higher-Order Functions
```rust
fn cal<F: Fn(i32, i32) -> i32>(a: i32, b: i32, f: F) -> i32 {
    f(a, b)
}

// Using with different functions/closures
let y = cal(10, 30, |a, b| a - b);        // Anonymous closure
let y = cal(10, 30, add);                 // Named function
let y = cal(10, 30, |a, b| a % b);        // Modulus operation
```

## 🏗️ Project Structure

```
src/
├── main.rs           # Entry point with examples of all concepts
├── lib.rs            # Module exports
├── control_flow.rs   # Control flow examples
├── function.rs       # Function examples and closures
├── person.rs         # Struct implementation with methods
├── customer.rs       # Simple struct definition
└── speaking.rs       # Trait definition
```

## 🚀 Key Learning Points

1. **Memory Safety**: Rust's ownership system prevents common bugs
2. **Type System**: Strong static typing with type inference
3. **Pattern Matching**: Powerful `match` expressions for control flow
4. **Error Handling**: `Option` and `Result` types for safe error handling
5. **Traits**: Interface-like feature for shared behavior
6. **Zero-Cost Abstractions**: High-level features without runtime overhead
7. **Immutability by Default**: Variables are immutable unless marked `mut`

## 📝 Notes

- ใช้ `#![allow(unused)]` เพื่อไม่ให้ compiler เตือนเรื่อง unused variables
- Rust ใช้ snake_case สำหรับ function และ variable names
- การใช้ underscore ใน numbers เพื่อความง่ายในการอ่าน (เช่น `2_000_000`)
- Expression ไม่มี semicolon, Statement มี semicolon
- `println!` เป็น macro ไม่ใช่ function (สังเกตจาก `!`)

---

🎯 **เป้าหมาย**: ทำความเข้าใจพื้นฐานของ Rust programming language เพื่อเตรียมพร้อมสำหรับการพัฒนาโปรแกรมที่ซับซ้อนมากขึ้น