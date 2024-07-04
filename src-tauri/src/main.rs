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

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            toggle_search_bar,
            hide_search_bar,
            show_overlay,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

// hello this is a test 


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
