"use client";

import { open } from "@tauri-apps/api/dialog";
import { readDir, readTextFile, BaseDirectory } from "@tauri-apps/api/fs";
import { useState, useCallback, useEffect } from "react";

export default function Home() {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [isOpening, setIsOpening] = useState(false); // State to manage button click debounce
  const [txtContents, setTxtContents] = useState<string[]>([]);

  // Function to fetch .txt files
  const fetchTxtFiles = useCallback(async (path: string) => {
    try {
      const entries = await readDir(path, { recursive: true });
      const txtFiles = entries.filter((entry) => entry.name?.endsWith(".txt"));

      if (txtFiles.length > 0) {
        const contents = await Promise.all(
          txtFiles.map((file) => readTextFile(file.path))
        );
        setTxtContents(contents);
      } else {
        setTxtContents([]);
      }
    } catch (error) {
      console.error("Error reading directory contents:", error);
      setTxtContents([]);
    }
  }, []);

  // Retrieve the selected path from localStorage when the component mounts
  useEffect(() => {
    const storedPath = localStorage.getItem("selectedPath");
    if (storedPath) {
      setSelectedPath(storedPath);
    }
  }, []);

  // Effect to read .txt files whenever selectedPath changes
  useEffect(() => {
    if (selectedPath) {
      fetchTxtFiles(selectedPath);
    }
  }, [selectedPath, fetchTxtFiles]);

  // Listen for the custom event to re-fetch .txt files
  useEffect(() => {
    const handleFileWritten = () => {
      if (selectedPath) {
        fetchTxtFiles(selectedPath);
      }
    };

    window.addEventListener("file-written", handleFileWritten);

    return () => {
      window.removeEventListener("file-written", handleFileWritten);
    };
  }, [selectedPath, fetchTxtFiles]);

  const openFilePath = useCallback(async () => {
    if (isOpening) return; // Prevent multiple simultaneous openings

    setIsOpening(true); // Set opening state
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
    } finally {
      setIsOpening(false); // Reset opening state
    }
  }, [isOpening]);

  return (
    <main className="bg-black flex flex-col justify-center items-center h-screen">
      <h1 className="text-white">
        Choose the file location where you want to store these things
      </h1>
      <button
        onClick={openFilePath}
        className="mt-[12px] border-white border-solid border-[1px] px-[12px] py-[1px]"
        disabled={isOpening} // Disable button while opening
      >
        Hello
      </button>
      {selectedPath && (
        <p className="text-white mt-4">Selected Path: {selectedPath}</p>
      )}
      {txtContents.length > 0 && (
        <div className="text-white mt-4">
          <h2 className="text-lg">Contents of .txt files:</h2>
          {txtContents.map((content, index) => (
            <pre key={index} className="whitespace-pre-wrap">
              {content}
            </pre>
          ))}
        </div>
      )}
    </main>
  );
}
