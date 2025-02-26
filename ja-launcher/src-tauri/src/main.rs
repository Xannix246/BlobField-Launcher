// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::os::windows::process::CommandExt;
use std::process::{Command, Stdio};
use std::thread;
use tauri::Emitter;
use reqwest::Client;
use std::path::PathBuf;
use reqwest::header;
use tokio::fs::OpenOptions;
use tokio::io::AsyncWriteExt;
use std::io::BufReader;
use std::io::BufRead;
use std::fs;
use tokio::time::{Instant, Duration};
use futures_util::stream::StreamExt;
use std::path::Path;
use tokio::task;

#[tauri::command]
async fn download_file(url: String, resource_path: String, window: tauri::Window) -> Result<(), String> {
    let filename = url.split('/').last().ok_or("Invalid URL")?;
    let temp_dir = format!("{}/temp", resource_path);
    let file_path = format!("{}/{}", temp_dir, filename);

    if !Path::new(&temp_dir).exists() {
        fs::create_dir_all(&temp_dir).map_err(|e| e.to_string())?;
    }

    let client = Client::new();
    let downloaded_size = if Path::new(&file_path).exists() {
        fs::metadata(&file_path).map(|meta| meta.len()).unwrap_or(0)
    } else {
        0
    };

    println!("Resuming download: {} -> {} ({} bytes downloaded)", url, file_path, downloaded_size);

    let mut request = client.get(&url)
        .header("User-Agent", "Mozilla/5.0");
    if downloaded_size > 0 {
        request = request.header(header::RANGE, format!("bytes={}-", downloaded_size));
    }

    let response = request.send().await.map_err(|e| e.to_string())?;
    let total_size = response.content_length().unwrap_or(0) + downloaded_size;
    println!("Total file size: {} bytes", total_size);
    let mut file = OpenOptions::new()
        .append(true)
        .create(true)
        .open(&file_path)
        .await
        .map_err(|e| e.to_string())?;

    let mut stream = response.bytes_stream();
    let mut downloaded = downloaded_size;
    let mut last_update = Instant::now();
    let mut last_downloaded = downloaded_size;

    while let Some(chunk) = stream.next().await {
        let chunk = chunk.map_err(|e| e.to_string())?;
        file.write_all(&chunk).await.map_err(|e| e.to_string())?;
        downloaded += chunk.len() as u64;

        if last_update.elapsed() >= Duration::from_secs(1) {
            let speed = (downloaded - last_downloaded) / 1024; // KB/s
            last_downloaded = downloaded;
            last_update = Instant::now();

            let progress = if total_size > 0 {
                (downloaded as f64 / total_size as f64) * 100.0
            } else {
                0.0
            };

            window.emit("download_progress", (progress, speed, total_size)).unwrap();
        }
    }

    println!("Download complete: {}", file_path);
    Ok(())
}

#[tauri::command]
async fn extract_archive(
    archive_path: String,
    extract_path: String,
    seven_zip_path: String,
    window: tauri::Window,
) -> Result<(), String> {
    let extract_path_clone = extract_path.clone();

    task::spawn_blocking(move || {
        let archive_dir = Path::new(&extract_path_clone);
        if !archive_dir.exists() {
            fs::create_dir_all(&archive_dir).map_err(|e| e.to_string()).unwrap();
        }

        window.emit("extract_progress", "Extracting data, please wait...").unwrap();
        let list_output = Command::new(&seven_zip_path)
            .arg("l")
            .arg(&archive_path)
            .output();

        let total_files = match list_output {
            Ok(output) if output.status.success() => {
                let output_str = String::from_utf8_lossy(&output.stdout);
                output_str.lines().filter(|line| line.contains(" D.")).count() as u64
            }
            _ => 0,
        };

        let mut copied_files = 0;

        let output = Command::new(&seven_zip_path)
            .arg("x")
            .arg(&archive_path)
            .arg("-o".to_string() + &extract_path_clone)
            .arg("-y")
            .stdout(Stdio::piped())
            .spawn();

        if let Ok(mut child) = output {
            let stdout = child.stdout.take().unwrap();
            let reader = BufReader::new(stdout);

            for line in reader.lines() {
                if let Ok(line) = line {
                    if line.starts_with("Extracting") {
                        copied_files += 1;

                        let progress = if total_files > 0 {
                            (copied_files as f64 / total_files as f64) * 100.0
                        } else {
                            0.0
                        };

                        window.emit("extract_progress", (progress, copied_files, total_files)).unwrap();
                    }
                }
            }

            let _ = child.wait();
        }

        if let Ok(entries) = fs::read_dir(&extract_path_clone) {
            let folders: Vec<PathBuf> = entries
                .filter_map(|entry| entry.ok())
                .filter(|entry| entry.file_type().map(|ft| ft.is_dir()).unwrap_or(false))
                .map(|entry| entry.path())
                .collect();

            if folders.len() == 1 {
                let extracted_folder = &folders[0];

                for entry in fs::read_dir(extracted_folder).unwrap() {
                    if let Ok(entry) = entry {
                        let new_path = extract_path_clone.clone() + "/" + entry.file_name().to_str().unwrap();
                        fs::rename(entry.path(), new_path).unwrap();
                    }
                }
                fs::remove_dir(extracted_folder).unwrap();
            }
        }

        window.emit("extract_progress", "Extraction complete!").unwrap();
    })
    .await
    .map_err(|e| e.to_string())?;

    Ok(())
}


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
            thread::spawn(move || {
                loop {
                    thread::sleep(Duration::from_secs(5));
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
            run_game,
            download_file,
            extract_archive
        ])
        .run(tauri::generate_context!())
        .expect("Err");
}
