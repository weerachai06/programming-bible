use std::{
    future::Future,
    pin::Pin,
    sync::{Arc, Mutex},
    task::{Context, Poll, Waker},
    thread,
    time::Duration,
};

struct SharedState {
    completed: bool,
    waker: Option<Waker>,
}

pub struct TimerFuture {
    shared_state: Arc<Mutex<SharedState>>,
}

impl Future for TimerFuture {
    type Output = String;

    fn poll(self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<Self::Output> {
        let mut shared_state = self.shared_state.lock().unwrap();

        if shared_state.completed {
            // ถ้าเสร็จแล้ว คืนค่า Ready
            Poll::Ready(String::from("Time's up!"))
        } else {
            // ถ้ายังไม่เสร็จ เก็บ Waker ไว้ (จดเบอร์ติดต่อกลับ)
            // cx.waker() จะได้ Waker ที่มาจาก Executor
            shared_state.waker = Some(cx.waker().clone());
            Poll::Pending
        }
    }
}

impl TimerFuture {
    pub fn new(duration: Duration) -> Self {
        let shared_state = Arc::new(Mutex::new(SharedState {
            completed: false,
            waker: None,
        }));

        let thread_shared_state = shared_state.clone();
        thread::spawn(move || {
            // 1. หลับตามเวลาที่กำหนด (จำลองงาน I/O)
            thread::sleep(duration);

            // 2. เมื่องานเสร็จ เปลี่ยนสถานะ
            let mut shared_state = thread_shared_state.lock().unwrap();
            shared_state.completed = true;

            // 3. ปลุก Executor ให้กลับมา poll งานนี้ใหม่!
            if let Some(waker) = shared_state.waker.take() {
                waker.wake();
            }
        });

        Self { shared_state }
    }
}
