// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs;
use std::path::PathBuf;
use std::process::{Command, Stdio};
use serde::{Deserialize, Serialize};
use tauri::{command, AppHandle, Manager};
use tokio::runtime::Runtime;
use std::env;

#[derive(Serialize, Deserialize)]
struct Config {
    game_directory: String,
    is_installed: bool,
}

fn get_config_path(app: &AppHandle) -> PathBuf {
    let mut path = app.path().parse("./").unwrap();
    fs::create_dir_all(&path).ok();
    path.push("config.json");
    path
}

fn ensure_config_exists(app: &AppHandle) -> Result<(), String> {
    let path = get_config_path(app);
    if !path.exists() {
        let default_config = Config {
            game_directory: "J:\\endfield\\EndField Launcher\\EndField Game".to_string(),
            is_installed: true,
        };
        let content = serde_json::to_string_pretty(&default_config).map_err(|e| e.to_string())?;
        fs::write(path, content).map_err(|e| e.to_string())?;
    }
    Ok(())
}

#[command]
fn read_config(app: AppHandle) -> Result<Config, String> {
    ensure_config_exists(&app)?;
    let path = get_config_path(&app);
    let content = fs::read_to_string(path).map_err(|e| e.to_string())?;
    let config: Config = serde_json::from_str(&content).map_err(|e| e.to_string())?;
    Ok(config)
}

#[command]
fn write_config(app: AppHandle, config: Config) -> Result<(), String> {
    let path = get_config_path(&app);
    let content = serde_json::to_string_pretty(&config).map_err(|e| e.to_string())?;
    fs::write(path, content).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
fn is_game_running() -> bool {
    let output = Command::new("tasklist")
        .stdout(Stdio::piped())
        .output()
        .expect("Failed to check running processes");

    let output_str = String::from_utf8_lossy(&output.stdout);
    output_str.contains("Endfield_TBeta_OS.exe") // Проверяем, есть ли процесс в списке
}

mod proxy;

#[command]
fn run_game(app: AppHandle) -> Result<(), String> {
    let config = read_config(app)?;

    // Запуск прокси-сервера
    let rt = Runtime::new().unwrap();
    rt.spawn(async {
        proxy::run_proxy().await;
    });

    // Установка переменных окружения для прокси
    env::set_var("HTTP_PROXY", "http://127.0.0.1:5000");
    env::set_var("HTTPS_PROXY", "http://127.0.0.1:5000");

    let exe_path = PathBuf::from(config.game_directory).join("Endfield_TBeta_OS.exe");

    if exe_path.exists() {
        Command::new("cmd")
            .args([
                "/C",
                "powershell",
                "-Command",
                "Start-Process",
                "\"",
                exe_path.to_str().unwrap(),
                "\"",
                "-Verb",
                "RunAs",
            ])
            .spawn()
            .map_err(|e| format!("Failed to launch game: {}", e))?;
        Ok(())
    } else {
        Err("Game executable not found".to_string())
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![write_config, read_config, run_game, is_game_running])
        .run(tauri::generate_context!())
        .expect("Err");
}