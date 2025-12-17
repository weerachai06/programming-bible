pub fn lifetime_entry() {
    /*
       let r;
       {
           let x = 5;
           r = &x;
       }
       println!("r: {}", r); // This line would cause a compile-time error
    */
    exam1();
    let x = check_number(&20);
    println!("x: {}", x);
}

pub fn exam1() {
    let string1 = String::from("long string is long");
    {
        let string2 = String::from("xyz");
        let result = longest(string1.as_str(), string2.as_str());
        println!("The longest string is {}", result);
    }
}

pub fn join_strings<'a>(str1: &str, str2: &str) -> String {
    format!("{} {}", str1, str2)
}

// ✅ Correct usage of lifetimes
pub fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() { x } else { y }
}

pub fn check_number<'a>(x: &'a i32) -> &'static str {
    if *x > 10 {
        "Greater than 10"
    } else {
        "10 or less"
    }
}

// ❌ Incorrect usage of lifetimes
/*
pub fn longest_wrong<'a>(x: &str, y: &str) -> &'a str {
    if x.len() > y.len() { x } else { y }
}
*/
