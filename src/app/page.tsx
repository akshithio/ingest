"use client";

import { saans } from "ingest/scripts/fonts";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

import BinIcon from "ingest/icons/BinIcon";
import FolderIcon from "ingest/icons/FolderIcon";
import SearchIcon from "ingest/icons/SearchIcon";
import HomeIcon from "ingest/icons/HomeIcon";
import ExpandIcon from "ingest/icons/ExpandIcon";
import ProgressIcon from "ingest/icons/ProgressIcon";
import VideoIcon from "ingest/icons/VideoIcon";

export default function Home() {
  const [activeWindow, setActiveWindow] = useState<
    "home" | "search" | "folder" | "bin"
  >("home");
  const [hoveredIcon, setHoveredIcon] = useState<
    "home" | "search" | "folder" | "bin" | null
  >(null);
  const [isUserCard, setIsUserCard] = useState(false);

  const handleMouseEnter = (icon: "home" | "search" | "folder" | "bin") => {
    setHoveredIcon(icon);
  };

  const handleMouseLeave = () => {
    setHoveredIcon(null);
  };

  return (
    <main className="bg-[#040404] w-screen h-screen text-white flex">
      <div className="absolute top-0 h-8 w-full" data-tauri-drag-region />
      {/* TODO: w-12 when maximised and w-16 when minimised */}{" "}
      <div className="h-screen w-[64px] bg-[#111] py-[32px] px-[16px] flex flex-col items-center relative">
        <button
          onClick={() => setActiveWindow("home")}
          onMouseEnter={() => handleMouseEnter("home")}
          onMouseLeave={handleMouseLeave}
          className={`p-2 rounded ${
            hoveredIcon === "home" ? "bg-gray-700" : ""
          }`}
        >
          <HomeIcon isActive={activeWindow === "home"} />
        </button>

        <span className="mt-[48px]" />

        <button
          onClick={() => setActiveWindow("search")}
          onMouseEnter={() => handleMouseEnter("search")}
          onMouseLeave={handleMouseLeave}
          className={`p-2 rounded ${
            hoveredIcon === "search" ? "bg-gray-700" : ""
          }`}
        >
          <SearchIcon isActive={activeWindow === "search"} />
        </button>

        <span className="mt-[48px]" />

        <button
          onClick={() => setActiveWindow("folder")}
          onMouseEnter={() => handleMouseEnter("folder")}
          onMouseLeave={handleMouseLeave}
          className={`p-2 rounded ${
            hoveredIcon === "folder" ? "bg-gray-700" : ""
          }`}
        >
          <FolderIcon isActive={activeWindow === "folder"} />
        </button>

        <span className="mt-[48px]" />

        <button
          onClick={() => setActiveWindow("bin")}
          onMouseEnter={() => handleMouseEnter("bin")}
          onMouseLeave={handleMouseLeave}
          className={`p-2 rounded ${
            hoveredIcon === "bin" ? "bg-gray-700" : ""
          }`}
        >
          <BinIcon isActive={activeWindow === "bin"} />
        </button>

        <div className="absolute bottom-[16px]">
          <button
            onMouseEnter={() => setIsUserCard(true)}
            onMouseLeave={() => setIsUserCard(false)}
            className="hover:bg-gray-700 p-2 rounded relative cursor-pointer"
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
      <div className="w-full h-screen px-[4%] py-[2.5%]">
        {activeWindow === "home" && (
          <div>
            <h1
              className={`${saans.className} font-medium text-[48px] w-[50%]`}
            >
              hey <span className="underline text-[#FF9843]">akshith</span>, you
              have added{" "}
              <span className="underline text-[#40A2E3]">
                32 new items this week
              </span>
            </h1>
            <div className="flex mt-[5%] items-center">
              <h1
                className={`${saans.className} font- text-[#999] text-[36px] underline`}
              >
                recently edited items
              </h1>

              <div className="ml-[24px] px-[20px] py-[8px] bg-[#111] rounded-[34px] flex items-center">
                <ExpandIcon dimension={20} />
                <h1
                  className={`${saans.className} text-[16px] text-[#eee] ml-[12px]`}
                >
                  Open Master View
                </h1>
              </div>
            </div>

            <div className="mt-[32px]">
              <div className="flex items-center w-[45%] relative">
                <div className="flex items-center">
                  <ProgressIcon percentage={32} />
                  <span className="ml-[12px]" />
                  <VideoIcon />
                  {/* consider reducing size of video icon? */}
                  <h1 className="ml-[4px]">
                    Svelte Origins: A JavaSript Documentary
                  </h1>
                </div>
                <div className="flex items-center absolute right-0 text-[#999]">
                  <button>
                    <h1 className="underline">set aside for later</h1>
                    {/* TODO: add dotted underline */}
                  </button>

                  <h1 className="mx-[12px] text-[12px]">•</h1>

                  <h1 className="">added 12 hours ago</h1>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
