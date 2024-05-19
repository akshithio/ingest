"use client";

import { useEffect } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { registerAll } from "@tauri-apps/api/globalShortcut";

export default function Home() {
  useEffect(() => {
    const command = async () => {
      await registerAll(
        ["CommandOrControl+Shift+C", "Ctrl+Alt+F12"],
        (shortcut) => {
          console.log(`Shortcut ${shortcut} triggered`);
          invoke("toggle_search_bar"); // Tauri command to toggle the overlay
        }
      );
    };

    command();
  }, []);

  return (
    <main className="bg-black flex justify-center items-center h-screen">
      <h1 className="text-white">
        Press CommandOrControl+Shift+C or Ctrl+Alt+F12 to toggle the search bar.
      </h1>
    </main>
  );
}
