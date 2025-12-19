use crate::List::{Cons, Nil};
use std::cell::RefCell;
use std::ops::Deref;
use std::rc::Rc;

pub struct MyBox<T>(T);

impl<T> MyBox<T> {
    pub fn new(x: T) -> MyBox<T> {
        MyBox(x)
    }
}

pub struct CustomerSmartPointer {
    pub data: String,
}

impl Drop for CustomerSmartPointer {
    fn drop(&mut self) {
        println!("Dropping CustomSmartPointer with data `{}`!", self.data);
    }
}

impl<T> Deref for MyBox<T> {
    type Target = T;

    fn deref(&self) -> &T {
        &self.0
    }
}

// RefCell<T> and the Interior Mutability Pattern
pub trait Messages {
    fn send(&self, msg: &str);
}

pub struct LimitTracker<'a, T: Messages> {
    pub value: usize,
    pub max: usize,
    pub message: &'a T,
}

impl<'a, T: Messages> LimitTracker<'a, T>
where
    T: Messages,
{
    pub fn new(message: &T, max: usize) -> LimitTracker<'_, T> {
        LimitTracker {
            value: 0,
            max,
            message,
        }
    }

    pub fn set_value(&mut self, value: usize) {
        self.value = value;

        let percentage_of_max = self.value as f64 / self.max as f64;

        if percentage_of_max >= 1.0 {
            self.message.send("Error: You are over your quota!");
        } else if percentage_of_max >= 0.9 {
            self.message
                .send("Urgent warning: You've used up over 90% of your quota!");
        } else if percentage_of_max >= 0.75 {
            self.message
                .send("Warning: You've used up over 75% of your quota!");
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::cell::RefCell;

    struct MockMessenger {
        sent_messages: RefCell<Vec<String>>,
    }

    impl MockMessenger {
        fn new() -> MockMessenger {
            MockMessenger {
                sent_messages: RefCell::new(vec![]),
            }
        }
    }

    impl Messages for MockMessenger {
        fn send(&self, message: &str) {
            self.sent_messages.borrow_mut().push(String::from(message));
        }
    }

    #[test]
    fn it_sends_an_over_75_percent_warning_message() {
        // --snip--
        let mock_messenger = MockMessenger::new();
        let mut limit_tracker = LimitTracker::new(&mock_messenger, 100);

        limit_tracker.set_value(80);

        assert_eq!(mock_messenger.sent_messages.borrow().len(), 1);
    }
}

pub struct ExpensiveCalculator {
    pub cache: RefCell<Vec<u32>>,
}

impl ExpensiveCalculator {
    pub fn get_value(&self, index: usize) -> u32 {
        let mut cache = self.cache.borrow_mut();

        if let Some(&value) = cache.get(index) {
            return value;
        }

        let length = cache.len() as u32;

        // simulate expensive calculation
        let value = (0..length).map(|x| x * 2).sum::<u32>() + index as u32;

        cache.push(value);

        value
    }
}

#[derive(Debug)]
pub enum List {
    Cons(i32, RefCell<Rc<List>>),
    Nil,
}

impl List {
    pub fn tail(&self) -> Option<&RefCell<Rc<List>>> {
        match self {
            Cons(_, item) => Some(item),
            Nil => None,
        }
    }
}
