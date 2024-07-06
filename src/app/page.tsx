"use client";

import { saans } from "ingest/scripts/fonts";
import { useState, useCallback } from "react";
import { open } from "@tauri-apps/api/dialog";
import { invoke } from "@tauri-apps/api/tauri";
import Image from "next/image";

import BinIcon from "ingest/icons/BinIcon";
import FolderIcon from "ingest/icons/FolderIcon";
import SearchIcon from "ingest/icons/SearchIcon";
import HomeIcon from "ingest/icons/HomeIcon";
import ExpandIcon from "ingest/icons/ExpandIcon";
import ProgressIcon from "ingest/icons/ProgressIcon";
import VideoIcon from "ingest/icons/VideoIcon";
import PaperIcon from "ingest/icons/PaperIcon";
import DocumentIcon from "ingest/icons/DocumentIcon";
import PodcastIcon from "ingest/icons/PodcastIcon";
import LandscapeIcon from "ingest/icons/LandscapeIcon";
import ClockIcon from "ingest/icons/ClockIcon";
import SettingsIcon from "ingest/icons/SettingsIcon";
import TerminalIcon from "ingest/icons/TerminalIcon";

// priority TODOS

// TODO: overlay has weird 1px border [COMPLETED]
// TODO: add, edit & more capabilities in overlay [WIP]
// TODO: basics of classifier schema + intelligence [WIP - needs to be triggered onChange instead of onSubmit tho]
// TODO: refactor overlay/page.tsx for clarity

// TODO: port over to NSPanel tauri implementation to prevent weird bug with back in focus issue
// TODO: cursor: pointer not working for unknown reasons
// TODO: responsiveness across dimensions [WIP]
// TODO: YouTube API connection for CDN images [COMPLETED]
// TODO: render actual state of data in the folder view dynamically
// TODO: search capabilites (in overlay?)

export default function Home() {
  const [activeWindow, setActiveWindow] = useState<
    "home" | "search" | "folder" | "bin"
  >("home");
  const [hoveredIcon, setHoveredIcon] = useState<
    "home" | "search" | "folder" | "bin" | null
  >(null);
  const [isUserCard, setIsUserCard] = useState(false);
  const [isFileDialog, setIsFileDialog] = useState(false);

  const handleMouseEnter = (icon: "home" | "search" | "folder" | "bin") => {
    setHoveredIcon(icon);
  };

  const handleMouseLeave = () => {
    setHoveredIcon(null);
  };

  const openFilePath = useCallback(async () => {
    if (isFileDialog) return;

    setIsFileDialog(true);

    try {
      const selected = await open({
        multiple: false,
        directory: true,
      });

      if (selected && typeof selected === "string") {
        localStorage.setItem("selectedPath", selected); // Store the selected path in local storage

        // Check and create the file in the selected directory
        await invoke("check_and_create_file", { directory: selected });
      } else {
        console.log("Selection cancelled.");
      }
    } catch (error) {
      console.error("Error opening file path:", error);
    } finally {
      setIsFileDialog(false); // Reset opening state
    }
  }, [isFileDialog]);

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

        <div className="absolute bottom-[16px] flex left-[8px]">
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
              className="block"
            />
            {isUserCard && (
              <div className="absolute bg-gray-100 border-solid border-[1px] border-[#222] rounded-md bottom-[32px] left-[32px] w-[250px] h-[100px] text-left flex flex-col">
                <button
                  onClick={openFilePath}
                  className="text-black text-[12px] mt-[8px]"
                >
                  <TerminalIcon />
                  Change Folder Location
                </button>
                <button className="text-black text-[12px] mt-[8px]">
                  <SettingsIcon />
                  Settings
                </button>
              </div>
            )}
          </button>
        </div>
      </div>
      {activeWindow === "home" && (
        <div className="w-screen flex overflow-hidden">
          <div className="w-[65%] h-screen pl-[4%] pr-[2%] py-[2.5%]">
            <h1
              className={`${saans.className} font-medium text-[48px] w-[90%]`}
            >
              hey <span className="underline text-[#FF9843]">akshith</span>, you
              have added{" "}
              <span className="underline text-[#40A2E3]">
                32 new items this week
              </span>
            </h1>
            <div className="flex mt-[4.5%] items-center">
              <h1
                className={`${saans.className} text-[#999] text-[36px] underline`}
              >
                recently edited items
              </h1>
              <button>
                <div className="ml-[24px] px-[20px] py-[8px] bg-[#111] rounded-[34px] flex items-center">
                  <ExpandIcon dimension={20} />
                  <h1
                    className={`${saans.className} text-[16px] text-[#eee] ml-[12px]`}
                  >
                    Open Master View
                  </h1>
                </div>
              </button>
            </div>

            <div className="mt-[32px]">
              <div className="flex items-center w-full relative my-[16px]">
                <div className="flex items-center">
                  <ProgressIcon percentage={32} dimension={20} />
                  <span className="ml-[12px]" />
                  <VideoIcon fill="#f00" />
                  {/* consider reducing size of video icon? */}
                  <h1 className="ml-[4px]">
                    Svelte Origins: A JavaSript Documentary
                  </h1>
                </div>
                <div className="flex items-center absolute right-0 text-[#999]">
                  <button className="">
                    <h1 className="border-b-[2px] border-dotted border-[#999] no-underline">
                      set aside for later
                    </h1>
                  </button>

                  <h1 className="mx-[12px] text-[12px]">•</h1>

                  <h1 className="">added 12 hours ago</h1>
                </div>
              </div>
              <div className="flex items-center w-full relative my-[16px]">
                <div className="flex items-center">
                  <ProgressIcon percentage={32} dimension={20} />
                  <span className="ml-[12px]" />
                  <PaperIcon />
                  {/* consider reducing size of video icon? */}
                  <h1 className="ml-[4px]">
                    Understanding the Levenshtein Distance Equation for
                    Beginners
                  </h1>
                  {/* 60 characters limit, if a word ends in between 60 - 65 allow but don't allow a new word to start? */}
                </div>
                <div className="flex items-center absolute right-0 text-[#999]">
                  <button className="">
                    <h1 className="border-b-[2px] border-dotted border-[#999] no-underline">
                      set aside for later
                    </h1>
                  </button>

                  <h1 className="mx-[12px] text-[12px]">•</h1>

                  <h1 className="">added 12 hours ago</h1>
                </div>
              </div>
              <div className="flex items-center w-full relative my-[16px]">
                <div className="flex items-center">
                  <ProgressIcon percentage={32} dimension={20} />
                  <span className="ml-[12px]" />
                  <DocumentIcon />
                  {/* consider reducing size of video icon? */}
                  <h1 className="ml-[4px]">On the Measure of Intelligence</h1>
                </div>
                <div className="flex items-center absolute right-0 text-[#999]">
                  <button className="">
                    <h1 className="border-b-[2px] border-dotted border-[#999] no-underline">
                      set aside for later
                    </h1>
                  </button>

                  <h1 className="mx-[12px] text-[12px]">•</h1>

                  <h1 className="">added 12 hours ago</h1>
                </div>
              </div>
              <div className="flex items-center w-full relative my-[16px]">
                <div className="flex items-center">
                  <ProgressIcon percentage={32} dimension={20} />
                  <span className="ml-[12px]" />
                  <PodcastIcon fill="#1DB954" />
                  {/* consider reducing size of video icon? */}
                  <h1 className="ml-[4px]">The Yips and CNN</h1>
                </div>
                <div className="flex items-center absolute right-0 text-[#999]">
                  <button className="">
                    <h1 className="border-b-[2px] border-dotted border-[#999] no-underline">
                      set aside for later
                    </h1>
                  </button>

                  <h1 className="mx-[12px] text-[12px]">•</h1>

                  <h1 className="">added 12 hours ago</h1>
                </div>
              </div>
              <div className="flex items-center w-full relative my-[16px]">
                <div className="flex items-center">
                  <ProgressIcon percentage={32} dimension={20} />
                  <span className="ml-[12px]" />
                  <VideoIcon />
                  {/* consider reducing size of video icon? */}
                  <h1 className="ml-[4px]">
                    Svelte Origins: A JavaSript Documentary
                  </h1>
                </div>
                <div className="flex items-center absolute right-0 text-[#999]">
                  <button className="">
                    <h1 className="border-b-[2px] border-dotted border-[#999] no-underline">
                      set aside for later
                    </h1>
                  </button>

                  <h1 className="mx-[12px] text-[12px]">•</h1>

                  <h1 className="">added 12 hours ago</h1>
                </div>
              </div>
              <div className="flex items-center w-full relative my-[16px]">
                <div className="flex items-center">
                  <ProgressIcon percentage={32} dimension={20} />
                  <span className="ml-[12px]" />
                  <PaperIcon />
                  {/* consider reducing size of video icon? */}
                  <h1 className="ml-[4px]">
                    Understanding the Levenshtein Distance Equation for
                    Beginners
                  </h1>
                </div>
                <div className="flex items-center absolute right-0 text-[#999]">
                  <button className="">
                    <h1 className="border-b-[2px] border-dotted border-[#999] no-underline">
                      set aside for later
                    </h1>
                  </button>

                  <h1 className="mx-[12px] text-[12px]">•</h1>

                  <h1 className="">added 12 hours ago</h1>
                </div>
              </div>
            </div>
            <div className="flex mt-[4.5%] items-center">
              <h1
                className={`${saans.className} text-[#999] text-[36px] underline`}
              >
                usage statistics
              </h1>

              <button>
                <div className="ml-[24px] px-[20px] py-[8px] bg-[#111] rounded-[34px] flex items-center">
                  <LandscapeIcon />
                  <h1
                    className={`${saans.className} text-[16px] text-[#eee] ml-[12px]`}
                  >
                    Change View
                  </h1>
                </div>
              </button>

              <button>
                <div className="ml-[16px] px-[20px] py-[8px] bg-[#111] rounded-[34px] flex items-center">
                  <ClockIcon />
                  <h1
                    className={`${saans.className} text-[16px] text-[#eee] ml-[12px]`}
                  >
                    Change Timeline
                  </h1>
                </div>
              </button>
            </div>
          </div>
          {/* width needs to be constrained, height isn't an issue? */}
          <div className="hidden flex-grow xl:flex flex-col items-center py-[2.5%]">
            <div className="my-[2.5%]">
              <h1 className="text-[#999] text-[11px] text-center mb-[8px] ml-[-4px]">
                because you asked me to remind you about this video today
              </h1>
              <Image
                src="/temp-thumbnail.png"
                width={303}
                alt="temp thumbnail"
                height={159}
                className="rounded-[17px] z-10"
              />

              <div className="w-[275px] h-[2.5px] bg-[#d9d9d9] ml-[15px] z-20" />
              <div className="w-[100px] h-[2.5px] mt-[-2.5px] bg-[#f00] ml-[15px] z-30" />

              <div className="flex ml-[-14px] mt-[8px]">
                <div className="mt-[4px]">
                  <ProgressIcon percentage={48} dimension={15} />
                </div>
                <div className="ml-[4px]">
                  <h1
                    className={`${saans.className} text-[#999] font-medium text-[16px]`}
                  >
                    Svelte Origins: A JavaScript Documentary
                  </h1>
                  <h1
                    className={`${saans.className} text-white font-medium text-[12px]`}
                  >
                    `OfferZ`enOrigins - YouTube
                  </h1>
                </div>
              </div>
            </div>
            <div className="my-[2.5%]">
              <h1 className="text-[#999] text-[11px] text-center mb-[8px] ml-[-4px]">
                because you asked me to remind you about this video today
              </h1>
              <Image
                src="/temp-thumbnail.png"
                width={303}
                alt="temp thumbnail"
                height={159}
                className="rounded-[17px] z-10"
              />

              <div className="w-[275px] h-[2.5px] bg-[#d9d9d9] ml-[15px] z-20" />
              <div className="w-[100px] h-[2.5px] mt-[-2.5px] bg-[#f00] ml-[15px] z-30" />

              <div className="flex ml-[-14px] mt-[8px]">
                <div className="mt-[4px]">
                  <ProgressIcon percentage={48} dimension={15} />
                </div>
                <div className="ml-[4px]">
                  <h1
                    className={`${saans.className} text-[#999] font-medium text-[16px]`}
                  >
                    Svelte Origins: A JavaScript Documentary
                  </h1>
                  <h1
                    className={`${saans.className} text-white font-medium text-[12px]`}
                  >
                    OfferZenOrigins - YouTube
                  </h1>
                </div>
              </div>
            </div>
            <div className="my-[2.5%]">
              <h1 className="text-[#999] text-[11px] text-center mb-[8px] ml-[-4px]">
                because you asked me to remind you about this video today
              </h1>
              <Image
                src="/temp-thumbnail.png"
                width={303}
                alt="temp thumbnail"
                height={159}
                className="rounded-[17px] z-10"
              />

              <div className="w-[275px] h-[2.5px] bg-[#d9d9d9] ml-[15px] z-20" />
              <div className="w-[100px] h-[2.5px] mt-[-2.5px] bg-[#f00] ml-[15px] z-30" />

              <div className="flex ml-[-14px] mt-[8px]">
                <div className="mt-[4px]">
                  <ProgressIcon percentage={48} dimension={15} />
                </div>
                <div className="ml-[4px]">
                  <h1
                    className={`${saans.className} text-[#999] font-medium text-[16px]`}
                  >
                    Svelte Origins: A JavaScript Documentary
                  </h1>
                  <h1
                    className={`${saans.className} text-white font-medium text-[12px]`}
                  >
                    OfferZenOrigins - YouTube
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
