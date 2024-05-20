"use client";

import { useEffect } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import {
  register,
  registerAll,
  unregisterAll,
} from "@tauri-apps/api/globalShortcut";

const GlobalShortcutsComponent = () => {
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

      // Register the Escape key as a global shortcut
      await register("Escape", () => {
        console.log("Escape key triggered");
        invoke("hide_search_bar"); // Tauri command to hide the overlay
      });
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

export default GlobalShortcutsComponent;
