// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::os::windows::process::CommandExt;
use std::process::{Command, Stdio};
use std::thread;
use tauri::Emitter;
use std::time::Duration;
use std::path::PathBuf;

fn is_game_running() -> bool {
    let output = Command::new("tasklist")
        .stdout(Stdio::piped())
        .stderr(Stdio::null())
        .creation_flags(0x08000000)
        .output()
        .expect("Failed to check running processes");

    let output_str = String::from_utf8_lossy(&output.stdout);
    output_str.contains("Endfield_TBeta_OS.exe")
}

#[tauri::command]
fn run_game(game_path: String, app_handle: tauri::AppHandle) -> Result<(), String> {
    let exe_path = PathBuf::from(game_path);

    if exe_path.exists() {
        let exe_str = exe_path.to_str().unwrap();
        let formatted_path = format!("'{}'", exe_str.replace("'", "''"));

        Command::new("powershell")
            .args([
                "-WindowStyle",
                "Hidden",
                "-Command",
                "Start-Process",
                formatted_path.as_str(),
                "-Verb",
                "RunAs",
            ])
            .creation_flags(0x08000000)
            .spawn()
            .map_err(|e| format!("Failed to launch game: {}", e))?;

            app_handle.emit("game_started", true).unwrap();

            // Запускаем поток для периодической проверки состояния процесса
            thread::spawn(move || {
                loop {
                    thread::sleep(Duration::from_secs(5)); // Проверяем каждые 5 секунд
                    if !is_game_running() {
                        app_handle.emit("game_started", false).unwrap();
                        break;
                    }
                }
            });
    
            Ok(())
        } else {
            Err("Game executable not found".to_string())
        }    
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_notification::init())
        .invoke_handler(tauri::generate_handler![
            run_game
        ])
        .run(tauri::generate_context!())
        .expect("Err");
}
