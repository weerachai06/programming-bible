fn main() {
    let x = Box::new([0u32; 1_000_000]);
    println!("{:p}", &x);

    move_smart_pointer(x);
    print_const_list();
    following_references();
    own_smart_pointer();
}

use smart_pointer::my_box::{CustomerSmartPointer, MyBox};

use crate::List::{Cons, Nil};

// https://gemini.google.com/share/4a08ff0bd431
fn move_smart_pointer(v: Box<[u32; 1_000_000]>) {
    println!("{:?}", &v[0]);
}

// error: recursive type `List` has infinite size
// enum List {
//     Cons(i32, List),
//     Nil,
// }

#[derive(Debug)]
#[allow(dead_code)]
enum List {
    Cons(i32, Box<List>),
    Nil,
}

fn print_const_list() {
    // ex1: using Box to create a recursive data structure
    let list = Cons(1, Box::new(Cons(2, Box::new(Cons(3, Box::new(Nil))))));
    println!("{:?}", list);
}

fn following_references() {
    let x = 5;
    let y = &x;

    assert_eq!(5, x);
    assert_eq!(5, *y);
}

fn own_smart_pointer() {
    let b = 5;
    let m = MyBox::new(5);

    // if not implement deref Deref trait should error:
    // can't compare `{integer}` with `MyBox<{integer}>`
    assert_eq!(5, b);
    assert_eq!(5, *m);

    // we can call hello function with string slice
    let m = MyBox::new(String::from("Rust"));
    hello(&m);
    let m2 = MyBox::new(String::from("World"));
    hello(&(*m2)[..]); // explicit deref coercion to &str
}

fn hello(name: &str) {
    println!("Hello, {}!", name);
    // Verify drop method to be call after goes out of scope
    let _c = CustomerSmartPointer {
        data: String::from("my stuff"),
    };
    let _d = CustomerSmartPointer {
        data: String::from("other stuff"),
    };

    println!("CustomSmartPointers created");

    // Result:
    // CustomSmartPointers created
    // Dropping CustomSmartPointer with data `other stuff`!
    // Dropping CustomSmartPointer with data `my stuff`!
}
