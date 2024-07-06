"use client";

import { useEffect, useRef, useState } from "react";
import { appWindow } from "@tauri-apps/api/window";
import { invoke } from "@tauri-apps/api";
import { readTextFile, writeTextFile } from "@tauri-apps/api/fs";
import classifier from "ingest/scripts/classifier";
import invalidateWindowBorders from "ingest/scripts/invalidateWindowBorders";
import PodcastIcon from "ingest/icons/PodcastIcon";
import VideoIcon from "ingest/icons/VideoIcon";
import PaperIcon from "ingest/icons/PaperIcon";
import DocumentIcon from "ingest/icons/DocumentIcon";

// if the app initializes on another window, the overlay stays on that window & isn't coming on to the other window.

export default function Overlay() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isOverlayVisible, setOverlayVisible] = useState(false);
  const [emptyUpload, setEmptyUpload] = useState(false);
  const [invalidLink, setInvalidLink] = useState(false);

  useEffect(() => {
    setEmptyUpload(false);
    setInvalidLink(false);

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
            .then(async () => {
              setOverlayVisible(true);
              await invalidateWindowBorders();
              setTimeout(() => {
                if (inputRef.current) {
                  inputRef.current.focus();
                }
              }, 100); // does this delay help either?
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
          }, 100); // not sure if this delay helps with the macos / tauri bug?
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
            // focus on the document body to prevent the main window from regaining focus
            document.body.focus();
          })
          .catch(console.error);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    let unlistenFocusChanged: () => void;
    (async () => {
      unlistenFocusChanged = await appWindow.onFocusChanged(handleFocusChanged);
    })();

    // code for when we decide on being able to drage & drop files, not atm

    // const handleDrop = async (event: DragEvent) => {
    //   event.preventDefault();
    //   logEvent("File dropped")();
    //   const files = event.dataTransfer?.files;
    //   if (files && files.length > 0) {
    //     for (let i = 0; i < files.length; i++) {
    //       await saveDroppedFile(files[i]);
    //     }
    //   }
    // };

    // window.addEventListener("drop", handleDrop);
    // window.addEventListener("dragover", (event) => event.preventDefault());

    return () => {
      unlistenEscape.then((f) => f());
      unlistenToggleSearchBar.then((f) => f());
      unlistenShowOverlay.then((f) => f());
      if (unlistenFocusChanged) unlistenFocusChanged();
      window.removeEventListener("keydown", handleKeyDown);
      // window.removeEventListener("drop", handleDrop); code for drag & drop?
      window.removeEventListener("dragover", (event) => event.preventDefault());
    };
  }, [isOverlayVisible]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (inputRef.current) {
      const text = inputRef.current.value;
      const urlPattern = new RegExp(
        "(https?:\\/\\/(?:www\\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\\.[^\\s]{2,}|www\\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\\.[^\\s]{2,}|https?:\\/\\/(?:www\\.|(?!www))[a-zA-Z0-9]+\\.[^\\s]{2,}|www\\.[a-zA-Z0-9]+\\.[^\\s]{2,})"
      );

      if (text.trim() === "") {
        setEmptyUpload(true);
        setInvalidLink(false);
      } else if (!urlPattern.test(text)) {
        setInvalidLink(true);
        setEmptyUpload(false);
      } else {
        setEmptyUpload(false);
        setInvalidLink(false);

        await saveTextToFile(text);

        window.dispatchEvent(new CustomEvent("file-written"));

        invoke("hide_search_bar")
          .then(() => {
            setOverlayVisible(false);
            document.body.focus();
          })
          .catch(console.error);
      }
    } else {
      console.error("Input ref is null");
    }
  };

  const updateJson = async (
    jsonPath: string,
    obj: { link: string; timestamp: number }
  ) => {
    try {
      let data = [];
      try {
        const fileContent = await readTextFile(jsonPath);
        data = JSON.parse(fileContent);
        if (!Array.isArray(data)) {
          console.log("file content isn't an array?");
          data = [];
        }
      } catch (error) {
        console.log(
          "error reading file or content isn't valid json / an array"
        );
        data = [];
      }

      const objRenewed = classifier(obj);
      data.push(objRenewed); // needs to be changed to objRenewed later
      await writeTextFile(jsonPath, JSON.stringify(data, null, 2));
      console.log(`Data added to ${jsonPath}`);
    } catch (error) {
      console.error("error updating master-ingest-data.json:", error);
    }
  };

  const saveTextToFile = async (text: string) => {
    const selectedPath = localStorage.getItem("selectedPath");
    console.log("Selected path from local storage:", selectedPath);
    if (selectedPath) {
      const utcSeconds = Math.floor(Date.now() / 1000);
      try {
        // Add object to master-ingest-data.json
        await updateJson(`${selectedPath}/master-ingest-data.json`, {
          link: text,
          timestamp: utcSeconds,
        });
      } catch (error) {
        console.error("Error saving file:", error);
      }
    } else {
      console.error("No file path selected in local storage.");
    }
  };

  return (
    isOverlayVisible && (
      <body style={{ all: "unset", backgroundColor: "transparent" }}>
        <div className="bg-[#111] h-screen w-screen rounded-md px-[10px] py-[12px]">
          <form onSubmit={handleSubmit}>
            <select name="op" id="op">
              <option value="add" className="text-white">
                add
              </option>
              <option value="edit" className="text-white">
                edit
              </option>
              <option value="delete" className="text-white">
                delete
              </option>

              <select name="type" id="type">
                <option value="research-paper" className="text-white">
                  <DocumentIcon />
                </option>
                <option value="article" className="text-white">
                  <PaperIcon />
                  {/* rename to article? */}
                </option>
                <option value="video" className="text-white">
                  <VideoIcon />
                </option>
                <option value="podcast" className="text-white">
                  <PodcastIcon />
                </option>
              </select>
            </select>
            <input
              type="text"
              placeholder="Enter a link here..."
              className="ml-[4px] focus:outline-none w-[80%] h-[40%] placeholder:text-[16px] bg-[#111] text-white font-inter"
              ref={inputRef}
            />
            <button
              type="submit"
              className="ml-[4px] text-white absolute bottom-4 right-4"
            >
              submit
            </button>

            {emptyUpload && (
              <h1 className="ml-[4px] text-[#f00] absolute bottom-4 left-4 text-[10px]">
                Your text was empty, try again
              </h1>
            )}
            {invalidLink && (
              <h1 className="ml-[4px] text-[#f00] absolute bottom-4 left-4 text-[10px]">
                Invalid link, try again
              </h1>
            )}
          </form>
        </div>
      </body>
    )
  );
}
