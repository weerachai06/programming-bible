#![deny(clippy::all)]

use napi_derive::napi;

#[napi]
pub fn plus_100(input: i32) -> i32 {
  input + 100
}

#[napi]
pub fn add(a: i32, b: i32) -> i32 {
  a + b
}

#[napi]
pub fn subtract(a: i32, b: i32) -> i32 {
  a - b
}

#[napi]
pub fn multiply(a: i32, b: i32) -> i32 {
  a * b
}

#[napi]
pub fn divide(a: i32, b: i32) -> i32 {
  a / b
}

#[napi]
pub fn modulo(a: i32, b: i32) -> i32 {
  a % b
}

#[napi]
pub fn cal<F>(a: i32, b: i32, func: F) -> napi::Result<i32>
where
  F: Fn(i32, i32) -> napi::Result<i32>,
{
  func(a, b)
}

pub fn fibonacci(n: u128) -> u128 {
  match n {
    0 => 0,
    1 => 1,
    _ => {
      let fib_array = &mut vec![0; (n + 1) as usize];
      fib_array[0] = 0;
      fib_array[1] = 1;
      for i in 2..=n as usize {
        fib_array[i] = fib_array[i - 1] + fib_array[i - 2];
      }
      fib_array[n as usize]
    }
  }
}

#[napi]
pub fn heavy_calculation(n: u32) -> f64 {
  fibonacci(n as u128) as f64
}
