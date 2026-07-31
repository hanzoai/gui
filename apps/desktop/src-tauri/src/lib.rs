// The Tauri host that loads the hanzogui webview and wires the native bridge
// consumed by @hanzogui/tauri (window controls come free from the frameless
// window; shell / fs / global-shortcut are the plugins below).
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .run(tauri::generate_context!())
        .expect("error while running the Hanzo desktop shell");
}
