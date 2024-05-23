"use client";

import { useEffect, useRef } from "react";
import { appWindow } from "@tauri-apps/api/window";
import { invoke } from "@tauri-apps/api";

export default function Overlay() {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof window !== undefined) {
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

      const unlistenShowOverlay = appWindow.listen("show-overlay", () => {
        console.log("Show overlay event received"); // Debugging log
        invoke("show_overlay");
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }, 100); // Slight delay to ensure the window is focused
      });

      // Set focus to the input element when the component mounts
      const setFocus = async () => {
        await appWindow.setFocus();
        if (inputRef.current) {
          inputRef.current.focus();
        }
      };

      setFocus();

      // Handle Escape key to hide the overlay
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          console.log("Escape key pressed"); // Debugging log
          invoke("hide_search_bar");
        }
      };

      window.addEventListener("keydown", handleKeyDown);

      return () => {
        unlistenEscape.then((f) => f());
        unlistenToggleSearchBar.then((f) => f());
        unlistenShowOverlay.then((f) => f());
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, []);

  return (
    <body style={{ all: "unset", backgroundColor: "transparent" }}>
      <div className="bg-[#EEE] h-screen w-screen rounded-md px-[10px] py-[12px]">
        <form action="">
          <input
            type="text"
            placeholder="Start taking notes here... "
            className="focus:outline-none w-[80%] h-[40%] placeholder:text-[16px] bg-[#eee] text-black font-inter "
            ref={inputRef} // Set the ref here
          />
          <button className="ml-[4px] text-black absolute bottom-4 right-4">
            submit
          </button>
        </form>
      </div>
    </body>
  );
}
