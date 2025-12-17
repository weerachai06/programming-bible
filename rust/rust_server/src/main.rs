use rust_server::http::Server;

fn main() {
    let server = Server::new("127.0.0.1:8000".to_owned());

    if let Err(e) = server.run() {
        eprintln!("Error running server: {}", e);
    }
}
