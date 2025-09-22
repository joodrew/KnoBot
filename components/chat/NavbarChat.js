'use client';

import { useState, useEffect, useRef } from "react";
import { Search, MessageCircle, SquarePen, History } from "lucide-react";

export default function NavbarChat() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showAllChats, setShowAllChats] = useState(false);
  const menuRef = useRef(null);

  const chats = [
    "Preciso de uma sugestão de tratativa para um erro de", "Chat 2", "Chat 3", "Chat 4", "Chat 5", "Chat 6", "Chat 7"
  ];
  const chatsVisiveis = showAllChats ? chats : chats.slice(0, 3);

  const toggleChatMenu = () => setShowMobileMenu(prev => !prev);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMobileMenu(false);
      }
    };
    if (showMobileMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMobileMenu]);

  const renderChats = () => (
    <div className="pl-6.5 flex flex-col gap-2">
      {chatsVisiveis.map((chat, index) => (
        <button
          key={index}
          disabled={index !== 0}
          className={`text-left truncate overflow-hidden whitespace-nowrap ${
            index !== 0
              ? 'text-white opacity-50 cursor-not-allowed'
              : 'text-white hover:text-orange-400 transition'
          }`}
        >
          {chat}
        </button>
      ))}
      {chats.length > 3 && (
        <button
          onClick={() => setShowAllChats(!showAllChats)}
          className="text-white hover:text-orange-400 text-left"
        >
          {showAllChats ? 'Ver menos...' : 'Ver mais...'}
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* MOBILE */}
      <aside className="w-full sm:hidden bg-[var(--nav-bg)] p-4 flex flex-col gap-4">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-2 w-full">
            <button
              title="Histórico"
              onClick={toggleChatMenu}
              className={`text-white hover:text-orange-400 transition ${showMobileMenu ? 'text-orange-400' : ''}`}
            >
              <History size={20} />
            </button>

            <div className="flex items-center bg-gray-700 text-white px-3 py-2 rounded-full border border-orange-400 w-full">
              <Search size={18} className="mr-2" />
              <input
                type="text"
                placeholder="Buscar nas conversas..."
                className="rounded-full bg-transparent outline-none placeholder-gray-400 w-full"
              />
            </div>

            <button
              title="Novo chat"
              className="text-white hover:text-orange-400 transition"
            >
              <SquarePen size={22} />
            </button>
          </div>
        </div>

        {showMobileMenu && (
          <div ref={menuRef} className="mt-4 w-full flex flex-col gap-3">
            <div className="text-white font-semibold flex items-center gap-2">
              <MessageCircle size={18} />
              <span>Chat</span>
            </div>
            {renderChats()}
          </div>
        )}
      </aside>

      {/* DESKTOP */}
      <aside className="hidden sm:flex flex-col w-64 fixed top-16 left-0 h-[calc(100vh-128px)] bg-[var(--nav-bg)] p-4 gap-4 z-40 overflow-y-auto">
        <div className="flex flex-col w-full gap-2">
          <div className="flex items-center bg-gray-700 text-white px-3 py-2 rounded-full border border-orange-400 w-full">
            <Search size={18} className="mr-2" />
            <input
              type="text"
              placeholder="Buscar nas conversas..."
              className="rounded-full bg-transparent outline-none placeholder-gray-400 w-full"
            />
          </div>

          <button
            title="Nova conversa"
            className="pt-5 text-white hover:text-orange-400 transition text-left flex items-center gap-2"
          >
            <SquarePen size={18} />
            <span>Nova conversa</span>
          </button>
        </div>

        <div className="flex flex-col gap-3 mt-2">
          <div className="text-white font-semibold flex items-center gap-2">
            <MessageCircle size={18} />
            <span>Chat</span>
          </div>
          {renderChats()}
        </div>
      </aside>
    </>
  );
}
