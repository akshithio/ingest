"use client";

import { useEffect, useRef, useState } from "react";
import { appWindow } from "@tauri-apps/api/window";
import { invoke } from "@tauri-apps/api";
import { writeTextFile, writeBinaryFile } from "@tauri-apps/api/fs";

export default function Overlay() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isOverlayVisible, setOverlayVisible] = useState(false);
  const [emptyUpload, setEmptyUpload] = useState(false);

  useEffect(() => {
    setEmptyUpload(false);

    const logEvent = (eventName: string) => () =>
      console.log(`${eventName} event received`);

    const unlistenEscape = appWindow.listen(
      "escape-pressed",
      logEvent("Escape key pressed in overlay")
    );
    const unlistenToggleSearchBar = appWindow.listen(
      "toggle-search-bar",
      () => {
        logEvent("Toggle search bar")();
        if (isOverlayVisible) {
          invoke("hide_search_bar")
            .then(() => {
              setOverlayVisible(false);
            })
            .catch(console.error);
        } else {
          invoke("show_overlay")
            .then(() => {
              setOverlayVisible(true);
              setTimeout(() => {
                if (inputRef.current) {
                  inputRef.current.focus();
                }
              }, 100); // Slight delay to ensure the window is focused
            })
            .catch(console.error);
        }
      }
    );
    const unlistenShowOverlay = appWindow.listen("show-overlay", () => {
      logEvent("Show overlay")();
      invoke("show_overlay")
        .then(() => {
          setOverlayVisible(true);
          setTimeout(() => {
            if (inputRef.current) {
              inputRef.current.focus();
            }
          }, 100); // Slight delay to ensure the window is focused
        })
        .catch(console.error);
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        logEvent("Escape key pressed")();
        invoke("hide_search_bar")
          .then(() => {
            setOverlayVisible(false);
          })
          .catch(console.error);
      }
    };

    const handleFocusChanged = ({ payload: focused }: { payload: boolean }) => {
      console.log("Focus changed, window is focused? " + focused);
      if (!focused && isOverlayVisible) {
        invoke("hide_search_bar")
          .then(() => {
            setOverlayVisible(false);
          })
          .catch(console.error);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    let unlistenFocusChanged: () => void;
    (async () => {
      unlistenFocusChanged = await appWindow.onFocusChanged(handleFocusChanged);
    })();

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
      if (unlistenFocusChanged) unlistenFocusChanged();
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("drop", handleDrop);
      window.removeEventListener("dragover", (event) => event.preventDefault());
    };
  }, [isOverlayVisible]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Form submitted");
    if (inputRef.current) {
      const text = inputRef.current.value;
      if (text.trim() === "") {
        setEmptyUpload(true);
      } else {
        setEmptyUpload(false);
        console.log("Text to save:", text);
        await saveTextToFile(text);
        // Dispatch custom event to notify that a new file has been written
        window.dispatchEvent(new CustomEvent("file-written"));
        invoke("hide_search_bar");
      }
    } else {
      console.error("Input ref is null");
    }
    //invoke("hide_search_bar")
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
        <div
          className="bg-[#EEE] h-screen w-screen rounded-md px-[10px] py-[12px]"
          style={{ border: "none" }}
        >
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

            {emptyUpload && (
              <h1 className="ml-[4px] text-[#f00] absolute bottom-4 left-4 text-[10px]">
                your text was empty try again
              </h1>
            )}
          </form>
        </div>
      )}
    </body>
  );
}
