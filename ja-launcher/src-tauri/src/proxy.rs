use hyper::service::{make_service_fn, service_fn};
use hyper::{Body, Client, Request, Response, Server, Uri};
use std::convert::Infallible;
use std::net::SocketAddr;

async fn handle_request(req: Request<Body>) -> Result<Response<Body>, hyper::Error> {
    let mut uri_string = req.uri().to_string();
    uri_string = uri_string.replace("https://", "http://");

    let uri: Uri = uri_string.parse().unwrap();
    let (mut parts, body) = req.into_parts();
    parts.uri = uri;

    let new_req = Request::from_parts(parts, body);

    let client = Client::new();
    client.request(new_req).await
}

pub async fn run_proxy() {
    let addr = SocketAddr::from(([127, 0, 0, 1], 5000));
    let make_svc = make_service_fn(|_conn| {
        async { Ok::<_, Infallible>(service_fn(handle_request)) }
    });

    let server = Server::bind(&addr).serve(make_svc);

    if let Err(e) = server.await {
        eprintln!("server error: {}", e);
    }
}