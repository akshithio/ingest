"use client";

import { open } from "@tauri-apps/api/dialog";
import { useState } from "react";

export default function Home() {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);

  const openFilePath = async () => {
    console.log("Opening file dialog...");
    try {
      const selected = await open({
        multiple: false,
        directory: true,
      });

      if (selected && typeof selected === "string") {
        // User selected a single directory
        console.log("Selected directory:", selected);
        setSelectedPath(selected);
        localStorage.setItem("selectedPath", selected); // Store the selected path in local storage
      } else {
        console.log("Selection cancelled.");
      }
    } catch (error) {
      console.error("Error opening file path:", error);
    }
  };

  return (
    <main className="bg-black flex flex-col justify-center items-center h-screen">
      <h1 className="text-white">
        Choose the file location where you want to store these things
      </h1>
      <button
        onClick={openFilePath}
        className="mt-[12px] border-white border-solid border-[1px] px-[12px] py-[1px]"
      >
        Hello
      </button>
      {selectedPath && (
        <p className="text-white mt-4">Selected Path: {selectedPath}</p>
      )}
    </main>
  );
}
