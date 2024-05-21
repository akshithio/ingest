// src/pages/overlay.tsx
"use client";

import { useEffect } from "react";
import { appWindow } from "@tauri-apps/api/window";
import { invoke } from "@tauri-apps/api";

export default function Overlay() {
  useEffect(() => {
    const unlistenEscape = appWindow.listen("escape-pressed", () => {
      console.log("Escape key pressed in overlay"); // Debugging log
      invoke("hide_search_bar");
    });

    const unlistenToggleSearchBar = appWindow.listen(
      "toggle-search-bar",
      () => {
        console.log("Toggle search bar event received"); // Debugging log
        invoke("toggle_search_bar");
      }
    );

    return () => {
      unlistenEscape.then((f) => f());
      unlistenToggleSearchBar.then((f) => f());
    };
  }, []);

  return (
    <body style={{ backgroundColor: "transparent" }}>
      <div className="h-screen w-screen bg-red-500 rounded-md px-[8px] py-[12px]">
        <form action="">
          <input type="text" className="focus:outline-none text-black" />
          <button className="ml-[4px]">submit</button>
        </form>
      </div>
    </body>
  );
}
