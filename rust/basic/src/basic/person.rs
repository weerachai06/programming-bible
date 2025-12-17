use crate::basic::Speaking;

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

impl Speaking for Person {
    fn speak(&self) {
        println!("{} says: Hello!", self.name);
    }
}
