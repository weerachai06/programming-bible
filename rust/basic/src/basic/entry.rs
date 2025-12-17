#![allow(unused)]
// use package::module::item;
use std::collections::HashMap;

use crate::{basic::Customer, basic::Person, basic::Speaking};

// 1. Variable Basic
pub fn basic_entry() {
    // int
    println!("=============== Integer Types: ================");
    let a = 6_i16;
    let b: u32 = 20000;
    let c = 2_000_000u64; // with underscore for readability
    println!("The value of x is: {}", a);
    println!("The value of y is: {}", b);
    println!("The value of z is: {}", c);

    println!("=============== Boolean Types: ================");
    let t = true;
    let f: bool = false; // with explicit type annotation
    println!("The value of t is: {}", t);
    println!("The value of f is: {}", f);

    println!("=============== Character Types: ================");
    let z = 'z';
    let heart_eyed_cat = '😻';
    println!("The value of z is: {}", z);
    println!("The value of heart_eyed_cat is: {}", heart_eyed_cat);

    println!("=============== Floating-Point Types: ================");
    let x = 2.0; // f64 by default
    let y: f32 = 3.0; // f32 with explicit type annotation
    println!("The value of x is: {}", x);
    println!("The value of y is: {}", y);

    println!("=============== Compound Types: ================");
    // Tuple
    let tup: (i32, f64, u8) = (500, 6.4, 1);
    let (x, y, z) = tup;
    println!("The value of x is: {}", x);
    println!("The value of y is: {}", y);
    println!("The value of z is: {}", z);

    println!("=============== Array Types: ================");
    let arr: [i32; 5] = [1, 2, 3, 4, 5];
    let first = arr[0];
    let second = arr[1];
    println!("The first element is: {}", first);
    println!("The second element is: {}", second);

    println!("=============== Done ================");

    // Ownership and Borrowing
    println!("=============== Ownership and Borrowing: ================");
    let mut n1 = 5;
    let n2 = &mut n1;
    *n2 += 1;
    println!(" n2: {}", n2);

    let s1 = String::from("hello");
    let s2 = &s1; // borrow s1
    println!(" s1: {}, s2: {}", s1, s2);
    test_borrowing(s2);
    mutate_number(n2);

    println!(" n1: {}", n1);

    // String
    let hello = "Hello, world!";
    let hello = String::from("Hello, world!");
    let hello = "Hello, world!".to_string();
    let hello_slice = &hello[0..5]; // string slice
    println!("The string is: {}", hello);
    println!("The string slice is: {}", hello_slice);

    // Collections
    let mut vec = Vec::new();
    vec.push(1);
    vec.push(2);
    vec.push(3);
    println!("The vector is: {:?}", vec);

    // vec with macro
    let mut vec = vec![4, 5, 6];
    println!("The vector is: {:?}", vec);

    // HashMap
    let mut map = HashMap::new();
    map.insert("one", 1);
    map.insert("two", 2);
    map.insert("three", 3);
    println!("The hashmap is: {:?}", map);

    println!("{}", map.get("one").unwrap());

    // Struct
    let person = Person::new("Alice".to_string(), 20);

    person.hello();

    // Trait
    person.speak();

    // Enum
    let color = Colors::Red;
    let mut color_str = "";
    match color {
        Colors::Red => color_str = "Red",
        Colors::Green => color_str = "Green",
        Colors::Blue => color_str = "Blue",
        _ => println!("Unknown color"),
    }

    println!("The color is: {}", color_str);
    let grade = check_grade(-1);
    match grade {
        GradeResult::Error(e) => println!("Error: {}", e),
        GradeResult::Value(g) => println!("Your grade is: {}", g),
    }
    // let grade = check_grade2(105);
    // match grade {
    //     None => println!("Error: Score must be between 0 and 100"),
    //     Some(g) => println!("Your grade is: {}", g),
    // }

    let grade = check_grade3(90);

    // if let Ok(v) = grade {
    //     println!("Your grade is: {}", v);
    // }

    // if grade.is_err() {
    //     return;
    // }

    // let v = grade.unwrap();
    // println!("Your grade is: {}", v);

    let v = match grade {
        Err(e) => {
            println!("Error: {}", e);
            return;
        }
        Ok(g) => g,
    };

    println!("Your grade is: {}", v);

    // closures
    let x = add(10, 20);
    println!("The sum is: {}", x);
    let sub = |a, b| a - b;
    let y = sub(30, 40);
    println!("The difference is: {}", y);
    let y = cal(10, 30, sub);
    println!("The difference is: {}", y);
    let y = cal(10, 30, add);
    println!("The sum is: {}", y);
    let y = cal(10, 30, |a, b| a % b);
    println!("The modulus is: {}", y);
}

fn cal<F: Fn(i32, i32) -> i32>(a: i32, b: i32, f: F) -> i32 {
    f(a, b)
}

fn add(a: i32, b: i32) -> i32 {
    a + b
}

fn check_grade(score: i32) -> GradeResult {
    if score > 100 || score < 0 {
        return GradeResult::Error("Score must be between 0 and 100".to_string());
    }

    GradeResult::Value("A".to_string())
}

fn check_grade2(score: i32) -> Option<String> {
    if score > 100 || score < 0 {
        return None;
    }

    Some("A".to_string())
}

fn check_grade3(score: i32) -> Result<String, String> {
    if (score > 100 || score < 0) {
        return Err("Score must be between 0 and 100".to_string());
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
