mod server;

use std::thread;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    std::env::set_var("RUST_LOG", "debug");
    env_logger::init();
    tauri::Builder::default()
        .setup(|app| {
            if cfg!(debug_assertions) {
                let handle = app.handle().clone();

                thread::spawn(move || {
                    server::init(handle).unwrap();
                });
            }

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
