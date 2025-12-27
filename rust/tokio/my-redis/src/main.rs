use mini_redis::{Connection, Frame};
use tokio::task;

#[tokio::main]
async fn main() -> mini_redis::Result<()> {
    let listener = tokio::net::TcpListener::bind("127.0.0.1:6379").await?;

    loop {
        let (socket, _) = listener.accept().await?;

        // A new task is spawned for each inbound socket. The socket is
        // moved to the new task and processed there.
        task::spawn(async move { process(socket).await });
    }
}

async fn process(socket: tokio::net::TcpStream) {
    use mini_redis::Command::{self, Get, Set};
    use std::collections::HashMap;

    // A hashmap is used to store data
    let mut db = HashMap::new();

    // Connection, provided by `mini-redis`, handles parsing frames from
    // the socket
    let mut connection = Connection::new(socket);

    // Use `read_frame` to receive a command from the connection.
    while let Some(frame) = connection.read_frame().await.unwrap() {
        let response = match Command::from_frame(frame).unwrap() {
            Set(cmd) => {
                // Store the key and value in the hashmap
                db.insert(cmd.key().to_string(), cmd.value().clone());
                Frame::Simple("OK".to_string())
            }
            Get(cmd) => {
                if let Some(value) = db.get(cmd.key()) {
                    // `Frame::Bulk` expects data to be of type `Bytes`. This
                    // type will be covered later in the tutorial. For now,
                    // `&Vec<u8>` is converted to `Bytes` using `into()`.
                    Frame::Bulk(value.clone())
                } else {
                    Frame::Null
                }
            }
            cmd => panic!("unimplemented command: {:?}", cmd),
        };

        let result = connection.write_frame(&response).await;

        if result.is_err() {
            println!("failed to write frame to client");
            return;
        }
    }
}
