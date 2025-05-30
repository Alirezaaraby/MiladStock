use std::path::PathBuf;
use crate::server::TauriAppState;
use actix_web::{get, post, web, HttpResponse, Responder};
use actix_files::NamedFile;
use serde::Deserialize;
use tauri::{Emitter};

#[derive(Debug, Deserialize)]
struct FormData {
    event: String,
}

#[get("/")]
async fn index() -> actix_web::Result<NamedFile> {
    let manifest_dir = std::env::var("CARGO_MANIFEST_DIR")
        .expect("CARGO_MANIFEST_DIR not set");
    println!("CARGO_MANIFEST_DIR: {}", manifest_dir);
    let path : PathBuf = "./static/index.html".parse().unwrap();
        // .expect("Failed to parse path");
    // println!("Serving index from: {}", path.display());
    Ok(NamedFile::open(path)?)
}

#[get("/api/speak")]
pub async fn handle_get(
    state: web::Data<TauriAppState>,
    query: web::Query<FormData>,
) -> impl Responder {
    let event = query.event.clone();
    let app = state.app.lock().unwrap();
    app.emit("next", &event).unwrap();
    HttpResponse::Ok().body(format!("Event '{}' triggered successfully (GET)", event))
}


#[post("/api/speak")]
pub async fn handle_post(
    state: web::Data<TauriAppState>,
    form: web::Form<FormData>,
) -> impl Responder {
    let event = form.event.clone();
    let app = state.app.lock().unwrap();
    app.emit("next", &event).unwrap();
    HttpResponse::Ok().body(format!("Event '{}' triggered successfully (POST)", event))
}
