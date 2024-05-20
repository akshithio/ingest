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
    <main className="bg-black flex flex-col justify-center items-center h-screen">
      <h1 className="text-white">
        Choose file location for where I need to store these things
      </h1>
      <button className="mt-[12px] border-white border-solid border-[1px] px-[12px] py-[1px]">
        Hello
      </button>
    </main>
  );
}
