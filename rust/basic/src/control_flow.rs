fn main() {
    // Control flow example
    let number = 7;
    if number < 5 {
        println!("The number is less than 5");
    } else if number == 5 {
        println!("The number is equal to 5");
    } else {
        println!("The number is greater than 5");
    }

    // Using if in a let Statement
    let score = 85;
    let grade = if score >= 90 {
        "A"
    } else if score >= 80 {
        "B"
    } else if score >= 70 {
        "C"
    } else if score >= 60 {
        "D"
    } else {
        "F"
    };
    println!("The grade is: {}", grade);

    // Handling multiple branches with match
    let day = 3;
    let day_name = match day {
        1 => "Monday",
        2 => "Tuesday",
        3 => "Wednesday",
        4 => "Thursday",
        5 => "Friday",
        6 => "Saturday",
        7 => "Sunday",
        _ => "Invalid day",
    };
    println!("The day is: {}", day_name);

    loop {
        println!("This will run forever unless we break");
        break;
    }

    // Returning Values from Loops
    let mut counter = 0;

    let result = loop {
        counter += 1;

        if counter == 10 {
            break counter * 2;
        }
    };

    println!("The result is {result}");

    // Disambiguating with Loop Labels
    let mut count = 0;
    'outer: loop {
        println!("Count: {}", count);
        let mut inner_count = 10;
        loop {
            println!("Inner Count: {}", inner_count);
            if inner_count == 9 {
                break;
            }
            if count == 2 {
                break 'outer;
            }
            inner_count -= 1;
        }
        count += 1;
    }

    // While Loop
    // let mut number = 3;
    // while number != 0 {
    //     println!("{}!", number);
    //     number -= 1;
    // }

    // println!("LIFTOFF!!!");

    // For Loop
    // let a = [10, 20, 30, 40, 50];
    // for element in a.iter() {
    //     println!("The value is: {}", element);
    // }

    // Countdown using for loop and rev()
    // =4 is inclusive, if you use ..4 it is exclusive
    // for number in (2..4).rev() {
    //     println!("{number}!");
    // }
    for number in (1..=4).rev() {
        println!("{number}!");
    }
    println!("LIFTOFF!!!");
}
