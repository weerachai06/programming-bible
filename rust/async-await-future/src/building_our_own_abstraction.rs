extern crate trpl; // required for mdbook test

use std::time::Duration;

pub fn building_our_own_abstraction() {
    trpl::block_on(async {
        let slow = async {
            trpl::sleep(Duration::from_millis(200)).await;
            42
        };

        match timeout(slow, Duration::from_millis(100)).await {
            Ok(value) => println!("Completed with value: {}", value),
            Err(_) => println!("Timed out!"),
        }
    });
}

async fn timeout<F: Future>(future_to_try: F, max_time: Duration) -> Result<F::Output, Duration> {
    match trpl::select(future_to_try, trpl::sleep(max_time)).await {
        trpl::Either::Left(value) => Ok(value),
        trpl::Either::Right(_) => Err(max_time),
    }
}
