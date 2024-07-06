#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

#[macro_use]
extern crate objc;

mod window_custom;

use std::fs;
use std::path::Path;
use std::sync::Arc;

use tauri::{GlobalShortcutManager, Manager};
// use tauri_nspanel::WebViewWindowExt;

#[cfg(target_os = "macos")]
use tauri::Window;

// use window_custom::WindowExt;

#[cfg(target_os = "macos")]
use window_custom::macos::WindowExtMacos;

#[cfg(target_os = "macos")]
fn apply_macos_specifics(window: &Window) {
    window.set_visisble_on_all_workspaces(true);
    window.set_transparent_titlebar(true, true);
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let app_handle = Arc::new(app.handle());
            let overlay = app
                .get_window("overlay")
                .ok_or("Overlay window not found")?;

            // Register global shortcuts
            let app_handle_clone = Arc::clone(&app_handle);
            match app
                .global_shortcut_manager()
                .register("CommandOrControl+Shift+C", move || {
                    println!("CommandOrControl+Shift+C pressed");
                    app_handle_clone.emit_all("toggle-search-bar", ()).unwrap()
                }) {
                Ok(_) => println!("CommandOrControl+Shift+C registered successfully"),
                Err(e) => println!("Failed to register CommandOrControl+Shift+C: {}", e),
            };

            // add mac things
            #[cfg(target_os = "macos")]
            apply_macos_specifics(&overlay);

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            toggle_search_bar,
            hide_search_bar,
            show_overlay,
            check_and_create_file
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn toggle_search_bar(window: Window) -> Result<(), String> {
    let overlay = window
        .get_window("overlay")
        .ok_or("Overlay window not found")?;
    let main = window
        .get_window("main")
        .ok_or("Overlay window not found")?;
    if overlay.is_visible().map_err(|e| e.to_string())? {
        overlay.hide().map_err(|e| e.to_string())?;
        main.hide().map_err(|e| e.to_string())?;
        // Do not set focus back to the main window
        window
            .app_handle()
            .emit_all("overlay-hidden", ())
            .map_err(|e| e.to_string())?;
    } else {
        overlay.show().map_err(|e| e.to_string())?;
        overlay.set_focus().map_err(|e| e.to_string())?;
        window
            .app_handle()
            .emit_all("overlay-shown", ())
            .map_err(|e| e.to_string())?;
    }
    Ok(())
}

#[tauri::command]
fn hide_search_bar(window: Window) -> Result<(), String> {
    let overlay = window
        .get_window("overlay")
        .ok_or("Overlay window not found")?;
    if overlay.is_visible().map_err(|e| e.to_string())? {
        overlay.hide().map_err(|e| e.to_string())?;
    }
    Ok(())
}

#[tauri::command]
fn show_overlay(window: Window) -> Result<(), String> {
    if let Some(overlay) = window.get_window("overlay") {
        overlay.show().map_err(|e| e.to_string())?;
        overlay.set_focus().map_err(|e| e.to_string())?;
        window
            .app_handle()
            .emit_all("overlay-shown", ())
            .map_err(|e| e.to_string())?;
    }
    Ok(())
}

#[tauri::command]
fn check_and_create_file(directory: String) -> Result<(), String> {
    let file_path = Path::new(&directory).join("master-ingest-data.json");

    if !file_path.exists() {
        fs::write(&file_path, "{}").map_err(|err| err.to_string())?;
        println!("File created: {:?}", file_path);
    } else {
        println!("File already exists: {:?}", file_path);
    }

    Ok(())
}
