use std::collections::HashMap;

#[derive(Debug)]
pub struct QueryString {
    data: HashMap<String, String>,
}

impl QueryString {
    pub fn get(&self, key: &String) -> Option<&String> {
        self.data.get(key)
    }
}

impl From<&str> for QueryString {
    fn from(value: &str) -> Self {
        let mut data = HashMap::new();

        for c in value.split('&') {
            if let Some(i) = c.find('=') {
                let key = &c[..i];
                let val = &c[i + 1..];
                data.insert(key.to_string(), val.to_string());
            }
        }

        QueryString { data }
    }
}
