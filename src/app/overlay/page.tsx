"use client";

export default function Page() {
  return (
    <body style={{ backgroundColor: "transparent" }}>
      <div className="h-screen w-screen bg-red-500 rounded-md px-[8px] py-[12px]">
        <form action="">
          <input type="text" className="focus:outline-none text-black" />
          <button className="ml-[4px]">submit</button>
        </form>
      </div>
    </body>
  );
}

// console.log("hello world this is a test")
