"use client";

import { useEffect } from "react";
import { registerAll } from "@tauri-apps/api/globalShortcut";

const ClientComponent = () => {
  useEffect(() => {
    console.log("hello world 1");
    const command = async () => {
      console.log("hello world 2");
      await registerAll(
        ["CommandOrControl+Shift+C", "Ctrl+Alt+F12"],
        (shortcut) => {
          console.log(`Shortcut ${shortcut} triggered`);
          console.log("hello world 3");
        }
      );
    };

    

    if (typeof window !== "undefined") {
      command();
    }
  }, []);

  return null;
};

export default ClientComponent;
