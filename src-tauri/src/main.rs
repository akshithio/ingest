use std::sync::{Arc, Mutex};
use tauri::{GlobalShortcutManager, Manager, Window};

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let app_handle = Arc::new(app.handle());
            let overlay = app.get_window("overlay").unwrap();

            // Arc<Mutex<bool>> to track the visibility state
            let overlay_visible = Arc::new(Mutex::new(false));

            // Register global shortcuts
            let app_handle_clone = Arc::clone(&app_handle);
            let overlay_visible_clone = Arc::clone(&overlay_visible);
            match app
                .global_shortcut_manager()
                .register("CommandOrControl+Shift+C", move || {
                    println!("CommandOrControl+Shift+C pressed");
                    let mut visible = overlay_visible_clone.lock().unwrap();
                    if *visible {
                        app_handle_clone.emit_all("toggle-search-bar", ()).unwrap();
                    } else {
                        app_handle_clone.emit_all("show-overlay", ()).unwrap();
                    }
                }) {
                Ok(_) => println!("CommandOrControl+Shift+C registered successfully"),
                Err(e) => println!("Failed to register CommandOrControl+Shift+C: {}", e),
            };

            let app_handle_clone = Arc::clone(&app_handle);
            let overlay_visible_clone = Arc::clone(&overlay_visible);
            match app
                .global_shortcut_manager()
                .register("Ctrl+Alt+F12", move || {
                    println!("Ctrl+Alt+F12 pressed");
                    let mut visible = overlay_visible_clone.lock().unwrap();
                    if *visible {
                        app_handle_clone.emit_all("toggle-search-bar", ()).unwrap();
                    } else {
                        app_handle_clone.emit_all("show-overlay", ()).unwrap();
                    }
                }) {
                Ok(_) => println!("Ctrl+Alt+F12 registered successfully"),
                Err(e) => println!("Failed to register Ctrl+Alt+F12: {}", e),
            };

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            toggle_search_bar,
            hide_search_bar,
            show_overlay
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn toggle_search_bar(window: Window) {
    let overlay = window.get_window("overlay").unwrap();
    if overlay.is_visible().unwrap() {
        overlay.hide().unwrap();
        let app_handle = window.app_handle();
        app_handle.emit_all("overlay-hidden", ()).unwrap();
    } else {
        overlay.show().unwrap();
        overlay.set_focus().unwrap();
        let app_handle = window.app_handle();
        app_handle.emit_all("overlay-shown", ()).unwrap();
    }
}

#[tauri::command]
fn hide_search_bar(window: Window) {
    let overlay = window.get_window("overlay").unwrap();
    if overlay.is_visible().unwrap() {
        overlay.hide().unwrap();
        let app_handle = window.app_handle();
        app_handle.emit_all("overlay-hidden", ()).unwrap();
    }
}

#[tauri::command]
fn show_overlay(window: Window) {
    let overlay = window.get_window("overlay").unwrap();
    overlay.show().unwrap();
    overlay.set_focus().unwrap();
    let app_handle = window.app_handle();
    app_handle.emit_all("overlay-shown", ()).unwrap();
}
