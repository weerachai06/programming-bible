use std::{cell::RefCell, rc::Rc};

use smart_pointer::{CustomerSmartPointer, ExpensiveCalculator, List, MyBox};

fn main() {
    let x = Box::new([0u32; 1_000_000]);
    println!("{:p}", &x);

    move_smart_pointer(x);
    print_cons_list();
    following_references();
    own_smart_pointer();

    // Verify drop method to be call after goes out of scope
    let _c = CustomerSmartPointer {
        data: String::from("my stuff"),
    };
    let _d = CustomerSmartPointer {
        data: String::from("other stuff"),
    };

    // Result:
    // CustomSmartPointers created
    // Dropping CustomSmartPointer with data `other stuff`!
    // Dropping CustomSmartPointer with data `my stuff`!
    println!("CustomSmartPointers created");

    // RefCell and Interior Mutability Pattern demo
    let a = ExpensiveCalculator {
        cache: RefCell::new((0..1_000_000).collect()),
    };

    let a = a.get_value(500_000);
    println!("The calculated value is {}", a);

    // Reference Cycles Can Leak Memory
}

// https://gemini.google.com/share/4a08ff0bd431
fn move_smart_pointer(v: Box<[u32; 1_000_000]>) {
    println!("{:?}", &v[0]);
}

// error: recursive type `List` has infinite size
// enum List {
//     Cons(i32, List),
//     Nil,
// }

fn print_cons_list() {
    // ex1: using RefCell and Rc to create a recursive data structure
    // if we want to see implementation of List, please check src/lib.rs
    let list = List::Cons(
        1,
        RefCell::new(Rc::new(List::Cons(
            2,
            RefCell::new(Rc::new(List::Cons(3, RefCell::new(Rc::new(List::Nil))))),
        ))),
    );
    let tail = list.tail();
    println!("Tail of list: {:?}", tail);
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
}
