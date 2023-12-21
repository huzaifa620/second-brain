import React from "react";

const page = () => {
  return (
    <section className="w-full h-screen outline-none pt-10 flex flex-col gap-5 items-center p-6">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-center">
          Explore uploaded data
        </h1>
        <h2 className="opacity-50">
          View or delete stored data used by your brain
        </h2>
      </div>
      <div className="w-full max-w-xl flex flex-col gap-5">
        <div className="shadow-md dark:shadow-primary/25 hover:shadow-xl transition-shadow rounded-xl overflow-hidden bg-white dark:bg-[#00121f] border border-black/10 dark:border-white/25 flex flex-col sm:flex-row sm:items-center justify-between w-full p-5 gap-5">
          <span
          >
            Topic Name
          </span>
          <div className="flex gap-2 self-end">
            <div
              className="px-8 py-3 text-sm disabled:opacity-80 text-center font-medium rounded-md focus:ring ring-primary/10 outline-none flex items-center justify-center gap-2 bg-[#00121f] border border-black dark:border-white disabled:bg-gray-500 disabled:hover:bg-gray-500 text-white dark:bg-white dark:text-black hover:bg-gray-700 dark:hover:bg-gray-400 transition-colors cursor-pointer"
            >
              View{" "}
            </div>
            <div
              className="px-8 py-3 text-sm disabled:opacity-80 text-center font-medium rounded-md focus:ring ring-primary/10 outline-none flex items-center justify-center gap-2 border border-red-500 hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
            >
              Delete{" "}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default page;
