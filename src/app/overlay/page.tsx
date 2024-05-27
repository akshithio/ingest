"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { appWindow } from "@tauri-apps/api/window";
import { invoke } from "@tauri-apps/api";
import { writeTextFile, writeBinaryFile } from "@tauri-apps/api/fs";

export default function Overlay() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isOverlayVisible, setOverlayVisible] = useState(false);

  useEffect(() => {
    const logEvent = (eventName: string) => () =>
      console.log(`${eventName} event received`);

    const unlistenEscape = appWindow.listen(
      "escape-pressed",
      logEvent("Escape key pressed in overlay")
    );
    const unlistenToggleSearchBar = appWindow.listen(
      "toggle-search-bar",
      logEvent("Toggle search bar")
    );
    const unlistenShowOverlay = appWindow.listen("show-overlay", () => {
      logEvent("Show overlay")();
      invoke("show_overlay");
      setOverlayVisible(true);
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100); // Slight delay to ensure the window is focused
    });

    const setFocus = async () => {
      await appWindow.setFocus();
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };

    setFocus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        logEvent("Escape key pressed")();
        invoke("hide_search_bar");
        setOverlayVisible(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    const handleDrop = async (event: DragEvent) => {
      event.preventDefault();
      logEvent("File dropped")();
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
    console.log("Form submitted");
    if (inputRef.current) {
      const text = inputRef.current.value;
      console.log("Text to save:", text);
      await saveTextToFile(text);
      // Dispatch custom event to notify that a new file has been written
      window.dispatchEvent(new CustomEvent("file-written"));
    } else {
      console.error("Input ref is null");
    }
  };

  const saveTextToFile = async (text: string) => {
    const selectedPath = localStorage.getItem("selectedPath");
    console.log("Selected path from local storage:", selectedPath);
    if (selectedPath) {
      const utcSeconds = Math.floor(Date.now() / 1000);
      const filePath = `${selectedPath}/note_${utcSeconds}.txt`;
      try {
        await writeTextFile(filePath, text);
        console.log(`File saved at ${filePath}`);
      } catch (error) {
        console.error("Error saving file:", error);
      }
    } else {
      console.error("No file path selected in local storage.");
    }
  };

  const saveDroppedFile = async (file: File) => {
    const selectedPath = localStorage.getItem("selectedPath");
    console.log("Selected path from local storage:", selectedPath);
    if (selectedPath) {
      const utcSeconds = Math.floor(Date.now() / 1000);
      const fileExtension = file.type.split("/")[1] || "bin"; // Default to "bin" if no file type
      const filePath = `${selectedPath}/img_${utcSeconds}.${fileExtension}`;
      const arrayBuffer = await file.arrayBuffer();
      try {
        await writeBinaryFile(filePath, new Uint8Array(arrayBuffer));
        console.log(`File saved at ${filePath}`);
        // Dispatch custom event to notify that a new file has been written
        window.dispatchEvent(new CustomEvent("file-written"));
      } catch (error) {
        console.error("Error saving file:", error);
      }
    } else {
      console.error("No file path selected in local storage.");
    }
  };

  return (
    <body style={{ all: "unset", backgroundColor: "transparent" }}>
      {isOverlayVisible && (
        <div className="bg-[#EEE] h-screen w-screen rounded-md px-[10px] py-[12px]">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Start taking notes here... "
              className="focus:outline-none w-[80%] h-[40%] placeholder:text-[16px] bg-[#eee] text-black font-inter"
              ref={inputRef}
            />
            <button
              type="submit"
              className="ml-[4px] text-black absolute bottom-4 right-4"
            >
              submit
            </button>
          </form>
        </div>
      )}
    </body>
  );
}
