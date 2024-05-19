"use client";

import { useEffect, useState } from "react";
import { registerAll } from "@tauri-apps/api/globalShortcut";

export default function Home() {
  const [showSearchBar, setShowSearchBar] = useState(false);

  useEffect(() => {
    const command = async () => {
      await registerAll(
        ["CommandOrControl+Shift+C", "Ctrl+Alt+F12"],
        (shortcut) => {
          console.log(`Shortcut ${shortcut} triggered`);
          setShowSearchBar((prev) => !prev); // Toggle the search bar visibility
        }
      );
    };

    command();
  }, []);

  return (
    <main className="bg-black flex justify-center items-center h-screen">
      {showSearchBar && (
        <div className="fixed top-1/4 left-1/2 transform -translate-x-1/2 bg-white p-4 rounded shadow-lg w-1/3">
          <input
            type="text"
            placeholder="Search..."
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
      )}
    </main>
  );
}
