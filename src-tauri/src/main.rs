#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::sync::Arc;
use tauri::{GlobalShortcutManager, Manager, Window};

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let app_handle = Arc::new(app.handle());
            let main_window = app.get_window("main").unwrap();

            // Register the Escape key
            println!("Registering Escape key");
            let mut shortcut_manager = app.global_shortcut_manager();
            let app_handle_clone = Arc::clone(&app_handle);
            match shortcut_manager.register("Escape", move || {
                println!("Escape key pressed"); // Debugging log
                app_handle_clone.emit_all("escape-pressed", ()).unwrap();
            }) {
                Ok(_) => println!("Escape key registered successfully"), // Debugging log
                Err(e) => println!("Failed to register Escape key: {}", e), // Debugging log
            };

            // Register other shortcuts
            let app_handle_clone = Arc::clone(&app_handle);
            match shortcut_manager.register("CommandOrControl+Shift+C", move || {
                println!("CommandOrControl+Shift+C pressed"); // Debugging log
                app_handle_clone.emit_all("toggle-search-bar", ()).unwrap();
            }) {
                Ok(_) => println!("CommandOrControl+Shift+C registered successfully"), // Debugging log
                Err(e) => println!("Failed to register CommandOrControl+Shift+C: {}", e), // Debugging log
            };

            let app_handle_clone = Arc::clone(&app_handle);
            match shortcut_manager.register("Ctrl+Alt+F12", move || {
                println!("Ctrl+Alt+F12 pressed"); // Debugging log
                app_handle_clone.emit_all("toggle-search-bar", ()).unwrap();
            }) {
                Ok(_) => println!("Ctrl+Alt+F12 registered successfully"), // Debugging log
                Err(e) => println!("Failed to register Ctrl+Alt+F12: {}", e), // Debugging log
            };

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![toggle_search_bar, hide_search_bar])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn toggle_search_bar(window: Window) {
    let overlay = window.get_window("overlay").unwrap();
    if overlay.is_visible().unwrap() {
        overlay.hide().unwrap();
    } else {
        overlay.show().unwrap();
    }
}

#[tauri::command]
fn hide_search_bar(window: Window) {
    let overlay = window.get_window("overlay").unwrap();
    if overlay.is_visible().unwrap() {
        overlay.hide().unwrap();
    }
}
