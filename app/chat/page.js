'use client';

import NavbarChat from "@/components/chat/NavbarChat";
import ChatArea from "@/components/chat/ChatArea";

export default function ChatPage() {
  return (
    <div className="overflow-hidden relative h-full w-full">
      {/* Navbar lateral fixa no desktop */}
      <div className="hidden sm:block fixed top-16 left-0 h-[calc(100vh-128px)] w-64 z-40">
        <NavbarChat />
      </div>

      {/* Navbar lateral no mobile (abaixo da navbar principal) */}
      <div className="sm:hidden fixed top-16 left-0 w-full z-40">
        <NavbarChat />
      </div>

      {/* Área de chat com margem lateral no desktop e topo no mobile */}
      <div className="sm:ml-64 mt-16 sm:mt-0 mb-16 h-[calc(100vh-128px)] overflow-hidden">
        <ChatArea />
      </div>
    </div>
  );
}
