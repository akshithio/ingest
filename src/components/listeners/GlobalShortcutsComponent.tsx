"use client";

import { useEffect } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import {
  register,
  registerAll,
  unregisterAll,
} from "@tauri-apps/api/globalShortcut";

const GlobalShortcutRegistration = () => {
  useEffect(() => {
    const registerShortcuts = async () => {
      await unregisterAll(); // Unregister all shortcuts first
      await registerAll(
        ["CommandOrControl+Shift+C", "Ctrl+Alt+F12"],
        (shortcut) => {
          console.log(`Shortcut ${shortcut} triggered`);
          invoke("toggle_search_bar"); // Tauri command to toggle the overlay
        }
      );
    };

    registerShortcuts();

    return () => {
      unregisterAll().catch((e) =>
        console.error("Failed to unregister shortcuts", e)
      );
    };
  }, []);

  return null;
};

export default GlobalShortcutRegistration;
