#![allow(unused)]
use std::{
    sync::{Arc, Mutex, mpsc},
    thread,
};

fn main() {
    // https://doc.rust-lang.org/book/ch16-00-concurrency.html
    // 16.1. Using Threads to Run Code Simultaneously
    // ex01_threads_simultaneously();
    // ex02_waiting_for_threads();
    // ex1_03_using_move_with_threads();

    // 16.2. Using Message Passing to Transfer Data Between Threads
    // ex2_01_basic_channel();
    // ex2_02_send_message_series();
    // ex2_03_multiple_producers();

    // 16.3. Shared-State Concurrency with Mutexes
    // ex3_01_basic_usage_mutex();
    ex3_02_shared_access_mutex();
}

/**
* ex.01 - Threads running simultaneously
* --------------------------------------
* Spawn a new thread and have it print out
* a series of messages. Meanwhile, have the main thread
* print out a different series of messages.
* maybe print output:
*   hi number 1 from the main thread!
*   hi number 1 from the spawned thread!
*   hi number 2 from the main thread!
*   hi number 2 from the spawned thread!
*   hi number 3 from the main thread!
*   hi number 3 from the spawned thread!
*   hi number 4 from the main thread!
*   hi number 4 from the spawned thread!
*   hi number 5 from the spawned thread!
*/
fn ex1_01_threads_simultaneously() {
    thread::spawn(|| {
        for i in 1..10 {
            println!("hi number {} from the spawned thread!", i);
            thread::sleep(std::time::Duration::from_millis(1));
        }
    });

    /*
     * Note: The main thread may end before the spawned thread
     */
    for i in 1..5 {
        println!("hi number {} from the main thread!", i);
        thread::sleep(std::time::Duration::from_millis(1));
    }
}

/**
 * ex.02 - Waiting for threads to finish
 * --------------------------------------
 * Spawn a new thread and have it print out
 * a series of messages. Meanwhile, have the main thread
 * print out a different series of messages.
 * Ensure the main thread waits for the spawned thread to finish
 * before exiting.
 */
fn ex1_02_waiting_for_threads() {
    let handle = thread::spawn(|| {
        for i in 1..10 {
            println!("hi number {} from the spawned thread!", i);
            thread::sleep(std::time::Duration::from_millis(1));
        }
    });

    // Wait for the spawned thread to finish
    handle.join().unwrap();

    // Main thread should print its messages after the spawned thread
    // if we join before this loop
    for i in 1..5 {
        println!("hi number {} from the main thread!", i);
        thread::sleep(std::time::Duration::from_millis(1));
    }

    // Wait for the spawned thread to finish
    // handle.join().unwrap();
}

/**
 * ex.03 - Using move with threads
 * --------------------------------------
 * Create a vector in the main thread,
 * then spawn a new thread that takes ownership
 * of the vector and prints it.
 */
fn ex1_03_using_move_with_threads() {
    // Create a vector in the main thread
    let v = vec![1, 2, 3];

    // Spawn a new thread that takes ownership of the vector
    // Note the use of 'move' to transfer ownership
    let handle = thread::spawn(move || {
        println!("Here's a vector: {:#?}", v);
    });

    handle.join().unwrap();
}

fn ex2_01_basic_channel() {
    let (tx, rx) = mpsc::channel();

    thread::spawn(move || {
        let val = String::from("hi");
        tx.send(val).unwrap();
    });

    let received = rx.recv().unwrap();
    println!("16.2 - 1 Got: {}", received);
}

/**
 * ex.02 - Message passing between threads
 * --------------------------------------
 * Create a channel and spawn a new thread that sends
 * a series of messages through the channel.
 * The main thread should receive and print these messages.
 */
fn ex2_02_send_message_series() {
    let (tx, rx) = mpsc::channel();
    thread::spawn(move || {
        let vals = vec![
            String::from("hi"),
            String::from("from"),
            String::from("the"),
            String::from("thread"),
        ];

        for v in vals {
            tx.send(v).unwrap();
            thread::sleep(std::time::Duration::from_secs(1));
        }
    });

    for received in rx {
        println!("16.2 - 2 Got: {}", received);
    }
}

/**
 * ex.03 - Multiple producers
 * --------------------------------------
 * Create a channel and spawn multiple threads that send
 * messages through the same channel.
 * The main thread should receive and print these messages.
 */
fn ex2_03_multiple_producers() {
    let (tx, rx) = mpsc::channel();

    let tx1 = tx.clone();
    thread::spawn(move || {
        let vals = vec![
            String::from("hi"),
            String::from("from"),
            String::from("the"),
            String::from("first"),
            String::from("thread"),
        ];

        for v in vals {
            tx1.send(v).unwrap();
            thread::sleep(std::time::Duration::from_secs(1));
        }
    });

    thread::spawn(move || {
        let vals = vec![
            String::from("more"),
            String::from("messages"),
            String::from("for"),
            String::from("you"),
        ];

        for v in vals {
            tx.send(v).unwrap();
            thread::sleep(std::time::Duration::from_secs(1));
        }
    });

    for received in rx {
        println!("16.2 - 3 Got: {}", received);
    }
}

/**
 * ex.01 - Basic usage of Mutex
 * --------------------------------------
 * Create a Mutex that holds an integer.
 * Lock the Mutex, modify the integer, and then unlock it.
 */
fn ex3_01_basic_usage_mutex() {
    let mutex = Mutex::new(5);

    {
        let mut num = mutex.lock().unwrap();
        *num = 6;
    }

    println!("Mutex value: {:#?}", mutex);
}

/**
 * ex.02 - Shared access to data across multiple threads using Mutex and Arc
 * --------------------------------------
 * Create a shared counter protected by a Mutex.
 * Spawn multiple threads that increment the counter.
 * Ensure all threads complete and print the final counter value.
 */
fn ex3_02_shared_access_mutex() {
    let counter = Arc::new(Mutex::new(0));
    let mut handles = vec![];

    for _ in 0..10 {
        let counter = Arc::clone(&counter);
        let handle = thread::spawn(move || {
            let mut num = counter.lock().unwrap();
            *num += 1;
        });

        handles.push(handle);
    }

    for handle in handles {
        handle.join().unwrap();
    }

    println!("Result: {}", *counter.lock().unwrap());
}
