use crate::lifetime::{DatabaseConnection, DatabaseConnection2};

pub fn lifetime_entry() {
    /*
       let r;
       {
           let x = 5;
           r = &x;
       }
       println!("r: {}", r); // This line would cause a compile-time error
    */
    exam1();
    let x = check_number(&20);
    println!("x: {}", x);

    // struct with lifetime specifier
    let db_conn_str = String::from("my_db_pool");
    // let my_db_connection: &str;
    {
        let db_connection: DatabaseConnection<'_> = DatabaseConnection::new(db_conn_str.as_str());
        // my_db_connection = db_connection.get_connection_str();
        println!(
            "Database Connection String: {}",
            db_connection.get_connection_str()
        );
    }

    /*
        let db_connection = DatabaseConnection::new(db_conn_str.as_str());
            ------------- binding `db_connection` declared here
        my_db_connection = db_connection.get_connection_str();
                           ^^^^^^^^^^^^^ borrowed value does not live long enough
        }
        - `db_connection` dropped here while still borrowed
        println!("Database Connection String: {}", my_db_connection);
    */
    // println!("Database Connection String: {}", my_db_connection);

    let my_db_connection: String;
    {
        let db_connection = DatabaseConnection2::new(db_conn_str.to_owned());
        my_db_connection = db_connection.get_connection_str().to_owned();
    }

    println!("Database Connection String: {}", my_db_connection);

    DatabaseConnection2::new(db_conn_str);

    let x = map_role_as_enum("admin");
    println!("Role: {:?}", x);
}

pub fn exam1() {
    let string1 = String::from("long string is long");
    {
        let string2 = String::from("xyz");
        let result = longest(string1.as_str(), string2.as_str());
        println!("The longest string is {}", result);
    }
}

pub fn join_strings<'a>(str1: &str, str2: &str) -> String {
    format!("{} {}", str1, str2)
}

// ✅ Correct usage of lifetimes
pub fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() { x } else { y }
}

pub fn check_number<'a>(x: &'a i32) -> &'static str {
    if *x > 10 {
        "Greater than 10"
    } else {
        "10 or less"
    }
}

fn map_role_as_enum(role_str: &str) -> Option<Role> {
    match role_str {
        "admin" => Some(Role::Admin),
        "user" => Some(Role::User),
        _ => None,
    }
}

#[derive(Debug)]
enum Role {
    Admin,
    User,
}

// ❌ Incorrect usage of lifetimes
/*
pub fn longest_wrong<'a>(x: &str, y: &str) -> &'a str {
    if x.len() > y.len() { x } else { y }
}
*/
