"use client";

import { useEffect, useRef } from "react";
import { appWindow } from "@tauri-apps/api/window";
import { invoke } from "@tauri-apps/api";
import { writeTextFile, writeBinaryFile } from "@tauri-apps/api/fs";

export default function Overlay() {
  const inputRef = useRef<HTMLInputElement>(null);

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

    // Handle file drop events
    const handleDrop = async (event: DragEvent) => {
      event.preventDefault();
      console.log("File dropped"); // Debugging log
      const files = event.dataTransfer?.files;
      if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          await saveDroppedFile(files[i]);
        }
      }
    };

    window.addEventListener("drop", handleDrop);
    window.addEventListener("dragover", (event) => event.preventDefault());

    return () => {
      unlistenEscape.then((f) => f());
      unlistenToggleSearchBar.then((f) => f());
      unlistenShowOverlay.then((f) => f());
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("drop", handleDrop);
      window.removeEventListener("dragover", (event) => event.preventDefault());
    };
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Form submitted"); // Debugging log
    if (inputRef.current) {
      const text = inputRef.current.value;
      console.log("Text to save:", text); // Debugging log
      await saveTextToFile(text);
    }
  };

  const saveTextToFile = async (text: string) => {
    const selectedPath = localStorage.getItem("selectedPath");
    console.log("Selected path from local storage:", selectedPath); // Debugging log
    if (selectedPath) {
      const utcSeconds = Math.floor(Date.now() / 1000);
      const filePath = `${selectedPath}/note_${utcSeconds}.txt`;
      try {
        await writeTextFile(filePath, text);
        console.log(`File saved at ${filePath}`); // Debugging log
      } catch (error) {
        console.error("Error saving file:", error);
      }
    } else {
      console.error("No file path selected in local storage.");
    }
  };

  const saveDroppedFile = async (file: File) => {
    const selectedPath = localStorage.getItem("selectedPath");
    console.log("Selected path from local storage:", selectedPath); // Debugging log
    if (selectedPath) {
      const utcSeconds = Math.floor(Date.now() / 1000);
      const fileExtension = file.type.split("/")[1] || "bin"; // Default to "bin" if no file type
      const filePath = `${selectedPath}/img_${utcSeconds}.${fileExtension}`;
      const arrayBuffer = await file.arrayBuffer();
      try {
        await writeBinaryFile(filePath, new Uint8Array(arrayBuffer));
        console.log(`File saved at ${filePath}`); // Debugging log
      } catch (error) {
        console.error("Error saving file:", error);
      }
    } else {
      console.error("No file path selected in local storage.");
    }
  };

  return (
    <body style={{ all: "unset", backgroundColor: "transparent" }}>
      <div className="bg-[#EEE] h-screen w-screen rounded-md px-[10px] py-[12px]">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Start taking notes here... "
            className="focus:outline-none w-[80%] h-[40%] placeholder:text-[16px] bg-[#eee] text-black font-inter "
            ref={inputRef} // Set the ref here
          />
          <button
            type="submit"
            className="ml-[4px] text-black absolute bottom-4 right-4"
          >
            submit
          </button>
        </form>
      </div>
    </body>
  );
}
