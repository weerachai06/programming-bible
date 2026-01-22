# Rust HTTP Server - การเรียนรู้ Borrowing และ Ownership

โปรเจ็กต์นี้เป็นการสร้าง HTTP Server อย่างง่ายด้วย Rust เพื่อเรียนรู้ concepts สำคัญของภาษา Rust โดยเฉพาะ **Borrowing** และ **Ownership**

## โครงสร้างโปรเจ็กต์

```
src/
├── main.rs           # จุดเริ่มต้นของโปรแกรม
├── lib.rs            # Module declaration
└── http/             # HTTP library modules
    ├── mod.rs        # Module exports
    ├── server.rs     # TCP Server implementation
    ├── request.rs    # HTTP Request parser
    ├── response.rs   # HTTP Response builder
    ├── method.rs     # HTTP Methods (GET, POST, etc.)
    ├── query_string.rs # Query string parser
    ├── status.rs     # HTTP Status codes
    └── error.rs      # Error handling
```

## หลักการ Borrowing ใน Rust

### 1. ความเป็นเจ้าของ (Ownership)
```rust
// ใน main.rs
let server = Server::new("127.0.0.1:8000".to_string());
// server เป็นเจ้าของของ String
```

### 2. การยืม (Borrowing) - ตัวอย่างจากโค้ด

#### Immutable Borrow (&T)
```rust
// ใน request.rs - method path()
pub fn path(&self) -> &String {
    &self.path  // ยืมค่า path แบบ read-only
}

pub fn method(&self) -> &Method {
    &self.method  // ยืมค่า method แบบ read-only
}
```
- `&self.path` คือการยืมค่า path โดยไม่เอา ownership
- ฟังก์ชันที่เรียกใช้สามารถอ่านค่าได้แต่ไม่สามารถแก้ไข

#### Mutable Borrow (&mut T)
```rust
// ใน server.rs - run method
let mut _stream = stream?;
let mut buffer: [u8; 1024] = [0; 1024];
_stream.read(&mut buffer)?;  // ยืมแบบ mutable เพื่อเขียนข้อมูล
```
- `&mut buffer` ยืมแบบ mutable เพื่อให้ `read()` สามารถเขียนข้อมูลลงใน buffer

#### Borrowing ในการส่งผ่าน Parameters
```rust
// ใน response.rs
pub fn send(&self, stream: &mut TcpStream) -> std::io::Result<()> {
    // ฟังก์ชันยืม stream แบบ mutable และ self แบบ immutable
}
```

### 3. การแปลงและการยืมใน TryFrom
```rust
// ใน request.rs
impl TryFrom<&[u8]> for Request {
    fn try_from(buf: &[u8]) -> Result<Self> {
        let request = str::from_utf8(&buf)?;  // ยืม buf เพื่อแปลงเป็น str
        // ...
        let method: Method = method.parse()?;
        Ok(Self {
            method: method,
            path: path.to_string(),  // แปลง &str เป็น String (สร้าง owned data)
            query_string: query_string,
        })
    }
}
```

### 4. การยืมใน Pattern Matching
```rust
// ใน query_string.rs
pub fn get(&self, key: &String) -> Option<&String> {
    self.data.get(key)  // ยืมค่าจาก HashMap
}
```

### 5. ตัวอย่าง Borrowing Rules

#### กฎสำคัญของ Borrowing:
1. **Either one mutable reference OR any number of immutable references**
2. **References must always be valid**

```rust
// ❌ ไม่สามารถทำได้ - มี mutable และ immutable reference พร้อมกัน
let mut s = String::from("hello");
let r1 = &s;        // immutable borrow
let r2 = &mut s;    // ❌ ERROR! mutable borrow ขณะที่ยังมี immutable borrow

// ✅ ถูกต้อง - ใช้ immutable references หลายตัว
let s = String::from("hello");
let r1 = &s;        
let r2 = &s;        // OK!

// ✅ ถูกต้อง - ใช้ mutable reference เพียงตัวเดียว
let mut s = String::from("hello");
let r1 = &mut s;    // OK!
```

## การทำงานของ HTTP Server

### 1. Server Initialization
```rust
// main.rs
let server = Server::new("127.0.0.1:8000".to_string());
```
- สร้าง Server struct และส่ง ownership ของ address string ให้กับ server

### 2. Request Processing Flow
1. **TCP Connection** - รับ connection จาก client
2. **Read Buffer** - อ่านข้อมูลจาก stream ลงใน buffer
3. **Parse Request** - แปลง buffer เป็น Request struct
4. **Route Handling** - ตรวจสอบ method และ path
5. **Send Response** - ส่ง response กลับไปยัง client

### 3. Error Handling
ใช้ `Result<T>` type สำหรับ error handling:
```rust
pub type Result<T> = std::result::Result<T, Error>;
```

## สรุปสิ่งที่เรียนรู้เรื่อง Borrowing

1. **Immutable Borrow (`&T`)** - ยืมเพื่ออ่านค่า ไม่สามารถแก้ไข
2. **Mutable Borrow (`&mut T`)** - ยืมเพื่อแก้ไขค่า
3. **Ownership Transfer** - การส่งต่อความเป็นเจ้าของ
4. **Borrowing Rules** - ป้องกัน data races ด้วยการจำกัดการเข้าถึง

### ข้อดีของ Borrowing System:
- **Memory Safety** - ป้องกัน memory leaks และ dangling pointers
- **Thread Safety** - ป้องกัน data races โดยอัตโนมัติ
- **Zero-Cost Abstractions** - ไม่มี performance overhead ใน runtime

### Tips สำหรับการเขียน Rust:
1. เริ่มด้วย immutable borrow (`&`) ก่อน
2. ใช้ mutable borrow (`&mut`) เมื่อจำเป็นต้องแก้ไขค่า
3. หลีกเลี่ยงการ clone ข้อมูลโดยไม่จำเป็น
4. ใช้ `to_string()` เมื่อต้องการสร้าง owned String จาก &str

## วิธีการรัน

```bash
# รันเซิร์ฟเวอร์
cargo run

# ทดสอบ endpoint
curl http://localhost:8000/hello?name=petch -i
```

เซิร์ฟเวอร์จะรันที่ `127.0.0.1:8000` และรองรับ endpoints:
- `/` - หน้าแรก
- `/hello` - หน้า hello (รับ query parameters)
