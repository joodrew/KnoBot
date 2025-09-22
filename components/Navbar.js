'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import KnoBotName from './KnoBotName';
import InputSearch from './InputSearch';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import ChatIcon from '@mui/icons-material/Chat';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { HomeIcon } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [isHome, setIsHome] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setIsHome(pathname === '/');
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [pathname]);

  return (
    <>
      <header className="w-full  bg-[var(--nav-bg)] text-white  relative z-50">
        <div className="mx-auto px-4 py-4 flex items-center justify-between gap-4 h-full">
          {/* Logo */}
          <div className="flex-shrink-0">
            {!isHome && !isMobile ? (
              <Link href="/" className="text-xl font-bold text-white transition">
                <KnoBotName size="text-4xl" />
              </Link>
            ) : (
              <Link href="/" className="text-orange-400 hover:text-orange-500 transition" title="Voltar para o início">
                <img src="/robot-icon.png" alt="KnoBot" className="w-10 h-10 object-contain" />
              </Link>
            )}
          </div>

          {/* InputSearch */}
          <div className="flex-grow flex justify-center">
            {!isHome && !pathname.startsWith('/chat') && <InputSearch />}
          </div>

          {/* Ícones ou menu */}
          <div className="flex-shrink-0 flex items-center gap-4">
            {isMobile ? (
              <button
                title={menuOpen ? 'Fechar menu' : 'Abrir menu'}
                onClick={() => setMenuOpen(!menuOpen)}
                className="text-orange-400 p-2 rounded hover:text-orange-500 transition"
              >
                {menuOpen ? <CloseIcon fontSize="medium" /> : <MenuIcon fontSize="medium" />}
              </button>
            ) : (
              <nav className="flex gap-4">
                <Link href="/tickets" title="Chamados" className="text-white p-2 rounded hover:text-orange-400 transition flex items-center">
                  <LocalActivityIcon fontSize="small" />
                </Link>
                <Link href="/chat" title="Chat" className="text-white p-2 rounded hover:text-orange-400 transition flex items-center">
                  <ChatIcon fontSize="small" />
                </Link>
                <div title="Configurações" className="text-gray-500 p-2 rounded cursor-not-allowed flex items-center">
                  <SettingsIcon fontSize="small" />
                </div>
              </nav>
            )}
          </div>
        </div>
      </header>

      {/* Menu mobile fixo abaixo do header */}
      {menuOpen && isMobile && (
        <div className="fixed top-16 left-0 w-full bg-[var(--nav-bg)] text-white flex flex-col items-center py-6 gap-6  z-40">
          <Link href="/" className="flex items-center gap-2 text-white hover:text-orange-400 transition" onClick={() => setMenuOpen(false)}>
            <HomeIcon fontSize="small" />
            <span>Inicio</span>
          </Link>
          <Link href="/tickets" className="flex items-center gap-2 text-white hover:text-orange-400 transition" onClick={() => setMenuOpen(false)}>
            <LocalActivityIcon fontSize="small" />
            <span>Chamados</span>
          </Link>
          <Link href="/chat" className="flex items-center gap-2 text-white hover:text-orange-400 transition" onClick={() => setMenuOpen(false)}>
            <ChatIcon fontSize="small" />
            <span>Chat</span>
          </Link>
          <div className="flex items-center gap-2 text-gray-500 cursor-not-allowed">
            <SettingsIcon fontSize="small" />
            <span>Configurações</span>
          </div>
        </div>
      )}
    </>
  );
}
