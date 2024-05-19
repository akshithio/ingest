// src-tauri/src/main.rs

#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use tauri::{Manager, Window};

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![toggle_search_bar])
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
