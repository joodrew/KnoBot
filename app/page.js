"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import KnoBotName from "@/components/KnoBotName";
import InputSearch from "@/components/InputSearch";
import LoadingFallback from "@/components/LoadingFallback";

export default function Home() {
  const router = useRouter();
  const [showLoading, setShowLoading] = useState(false);

  const handleClick = () => {
    setShowLoading(true);
    setTimeout(() => {
      router.push("/tickets");
    }, 1500);
  };

  return (
    <div className="font-sans flex flex-col h-full text-[var(--foreground)]">
      <main className="flex-1 flex flex-col items-center justify-center px-4 overflow-auto">
        <KnoBotName size="text-5xl sm:text-6xl md:text-7xl lg:text-9xl" />

        {/* 
        <div className="w-full max-w-xl flex flex-col items-center gap-4">
          <InputSearch />

          <div className="flex py-4 gap-6">
            <button className="bg-gray-500 text-white px-5 py-2 rounded hover:bg-gray-700 transition text-sm font-medium">
              Pesquisar
            </button>
            <button className="bg-orange-400 text-white px-5 py-2 rounded hover:bg-orange-500 transition text-sm font-medium">
              Chat
            </button>
          </div>
        </div>
        */}

        <div className="flex py-4 gap-6">
          <button
            onClick={handleClick}
            className="bg-orange-400 text-white px-5 py-2 rounded hover:bg-orange-500 transition text-sm font-medium"
          >
            Tickets
          </button>
        </div>

        {showLoading && <LoadingFallback />}
      </main>
    </div>
  );
}