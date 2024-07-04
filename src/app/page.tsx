"use client";

import { saans } from "ingest/scripts/fonts";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

import BinIcon from "ingest/icons/BinIcon";
import FolderIcon from "ingest/icons/FolderIcon";
import SearchIcon from "ingest/icons/SearchIcon";
import HomeIcon from "ingest/icons/HomeIcon";

//

export default function Home() {
  const [isUserCard, setIsUserCard] = useState(false);
  const [activeWindow, setActiveWindow] = useState<
    "home" | "search" | "folder" | "bin"
  >("home");

  return (
    <main className="bg-[#040404] w-screen h-screen text-white flex">
      <div className="absolute top-0 h-8 w-full" data-tauri-drag-region />
      {/* TODO: w-12 when maximised and w-16 when minimised */}{" "}
      <div className="h-screen w-[64px] bg-[#111] py-[32px] px-[16px] flex flex-col items-center relative">
        <button onClick={() => setActiveWindow("home")}>
          <HomeIcon isActive={activeWindow === "home"} />
        </button>

        <div className="mt-[48px]" />

        <button onClick={() => setActiveWindow("search")}>
          <SearchIcon isActive={activeWindow === "search"} />
        </button>

        <div className="mt-[48px]" />
        <button onClick={() => setActiveWindow("folder")}>
          <FolderIcon isActive={activeWindow === "folder"} />
        </button>

        <div className="mt-[48px]" />

        <button onClick={() => setActiveWindow("bin")}>
          <BinIcon isActive={activeWindow === "bin"} />
        </button>

        <div className="absolute bottom-[16px]">
          <button
            onMouseEnter={() => setIsUserCard(true)}
            onMouseLeave={() => setIsUserCard(false)}
            className="hover:bg-slate-50 relative cursor-pointer"
          >
            <Image
              src="/profile-pic.png"
              width={32}
              height={32}
              alt="profile picture"
            />
            {isUserCard && (
              <div className="absolute bg-[#000] top-0 w-[200px]">
                hello world
              </div>
            )}
          </button>
        </div>
      </div>
      <div className="w-full h-screen px-[6%] py-[3%]">
        {activeWindow === "home" && (
          <div>
            <h1
              className={`${saans.className} font-medium text-white text-[48px] w-[50%]`}
            >
              hey <span className="underline text-[#FF9843]">akshith</span>, you
              have added{" "}
              <span className="underline text-[#40A2E3]">
                32 new items this week
              </span>
            </h1>
          </div>
        )}
      </div>
    </main>
  );
}
