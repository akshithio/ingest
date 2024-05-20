import GlobalShortcutsComponent from "ingest/components/GlobalShortcutsComponent";

export default function Home() {
  return (
    <main className="bg-black flex flex-col justify-center items-center h-screen">
      <GlobalShortcutsComponent />
      <h1 className="text-white">
        Choose file location for where I need to store these things
      </h1>
      <button className="mt-[12px] border-white border-solid border-[1px] px-[12px] py-[1px]">
        Hello
      </button>
    </main>
  );
}
