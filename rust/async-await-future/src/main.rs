#![allow(dead_code)]
use std::time::Duration;

use trpl::Html;

// ทำหน้าที่เชื่อมโยงไปยังไลบรารีภายนอก
extern crate trpl; // ปัจจุบันไม่จำเป็นต้องใช้ extern crate ใน Rust 2018 ขึ้นไป

fn main() {
    // let args = std::env::args().collect::<Vec<_>>();

    // ex01: Single future example
    /*
    trpl::block_on(async {
        let future1 = page_title(&args[1]);
        let future2 = page_title(&args[2]);
        let maybe_title = match trpl::select(future1, future2).await {
            trpl::Either::Left(title) => title,
            trpl::Either::Right(title) => title,
        };

        match maybe_title {
            Some(title) => println!("Title is {}", title),
            None => println!("No title found from"),
        }
    })
    */

    // ex02: Async and Await with threads
    /*
       trpl::block_on(async {
           let fut_1 = async {
               for i in 1..10 {
                   println!("Spawned thread says hi {}", i);
                   trpl::sleep(std::time::Duration::from_millis(500)).await;
               }
           };

           let fut2 = async {
               for i in 1..5 {
                   println!("Another spawned thread says hi {}", i);
                   trpl::sleep(std::time::Duration::from_millis(500)).await;
               }
           };

           trpl::join(fut_1, fut2).await;
       })
    */

    // ex03: Sending data between async tasks
    /*
    trpl::block_on(async {
        let (tx, mut rx) = trpl::channel();

        let vals = vec!["Hello", "from", "the", "other", "side"];

        for val in vals {
            tx.send(val).unwrap();
            trpl::sleep(std::time::Duration::from_millis(500)).await;
        }

        while let Some(value) = rx.recv().await {
            println!("Got: {}", value);
        }
    })
     */

    // ex04: Code Within One Async Block Executes Linearly
    trpl::block_on(async {
        let (tx, mut rx) = trpl::channel();
        let tx1 = tx.clone();

        let tx_fut1 = async move {
            let vals = vec![
                String::from("hi"),
                String::from("from"),
                String::from("the"),
                String::from("future"),
            ];

            for val in vals {
                tx1.send(val).unwrap();
                trpl::sleep(Duration::from_millis(500)).await;
            }
        };

        let rx_fut = async {
            while let Some(value) = rx.recv().await {
                println!("Got: {}", value);
            }
        };

        // trpl::join(tx_fut1, rx_fut).await;

        // ex05: Joining a Number of Futures with the join! Macro
        let tx_fut = async move {
            let vals = vec![
                String::from("more"),
                String::from("messages"),
                String::from("for"),
                String::from("you"),
            ];

            for val in vals {
                tx.send(val).unwrap();
                trpl::sleep(Duration::from_millis(1500)).await;
            }
        };

        trpl::join!(tx_fut1, tx_fut, rx_fut)
    });
}

async fn page_title(url: &str) -> Option<String> {
    let response = trpl::get(url).await;
    let response_text = response.text().await;

    Html::parse(&response_text)
        .select_first("title")
        .map(|title| title.inner_html())
}
