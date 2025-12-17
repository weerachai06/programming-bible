pub struct DatabaseConnection<'a> {
    pool: &'a str,
    // incorrect way
    // &str borrowed reference ต้องมี lifetime specifier
    // pool2: &str, // error: missing lifetime specifier
}

pub struct DatabaseConnection2 {
    // owner ไม่ต้องใส่ lifetime
    pool: String,
}

impl DatabaseConnection2 {
    pub fn new(sql: String) -> DatabaseConnection2 {
        DatabaseConnection2 { pool: sql }
    }

    pub fn get_connection_str(&self) -> &str {
        self.pool.as_str()
    }
}

impl<'a> DatabaseConnection<'a> {
    pub fn new(sql: &'a str) -> DatabaseConnection<'a> {
        DatabaseConnection { pool: sql }
    }

    pub fn get_connection_str(&self) -> &str {
        self.pool
    }
}
