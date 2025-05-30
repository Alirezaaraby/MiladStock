mod handlers;

use std::{sync::Mutex};

use actix_cors::Cors;
use actix_web::{middleware, web, App, HttpServer};
use tauri::AppHandle;

struct TauriAppState {
    app: Mutex<AppHandle>,
}

#[actix_web::main]
pub async fn init(app: AppHandle) -> std::io::Result<()> {
    let tauri_app = web::Data::new(TauriAppState {
        app: Mutex::new(app),
    });
    
    // let handle = web::Data::new(app.clone());

    HttpServer::new(move || {
        App::new()
            .wrap(
                Cors::default()
                    .allow_any_origin()
                    .allow_any_method()
                    .allow_any_header()
            )
            .app_data(tauri_app.clone())
            .wrap(middleware::Logger::default())
            .service(handlers::timer::index)
            .service(handlers::timer::handle_get)
            .service(handlers::timer::handle_post)
    })
    .bind(("127.0.0.1", 4875))?
    .run()
    .await
}