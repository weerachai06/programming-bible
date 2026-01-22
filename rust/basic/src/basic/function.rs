fn main() {
    second_implement();
    log_sum(10, 12);
    let sum = sum(50, 50);
    let implicit_sum = implicit_return_sum(20, 30);
    println!("The returned sum is: {}", sum);
    println!("The implicit returned sum is: {}", implicit_sum);
    print_labeled_measurement(20, 'c');

    // closures
    let add = |a: i32, b: i32| -> i32 { a + b };
    let subtract = |a: i32, b: i32| a - b; // implicit return
    let result = add(5, 7);
    println!("The result of the closure addition is: {}", result);
    println!(
        "The result of the closure subtraction is: {}",
        subtract(10, 4)
    );

    // Statement vs Expression
    let x = 5; // statement
    // being an expression, the block returns a value
    let y = {
        let x_squared = x * x; // statement
        x_squared + 10 // expression
    };
    println!("The value of y is: {}", y);
}

fn second_implement() {
    println!("Hello, world!");
}

fn log_sum(a: i32, b: i32) {
    println!("The sum is: {}", a + b);
}

fn sum(a: i32, b: i32) -> i32 {
    return a + b;
}

fn implicit_return_sum(a: i32, b: i32) -> i32 {
    a + b
}

fn print_labeled_measurement(value: i32, unit_label: char) {
    // Using curly braces for formatting
    println!("The measurement is: {value}{unit_label}");
}
