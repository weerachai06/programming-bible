fn main() {
    let x = Box::new([0u32; 1_000_000]);
    println!("{:p}", &x);

    move_smart_pointer(x);
    print_const_list();
}

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
