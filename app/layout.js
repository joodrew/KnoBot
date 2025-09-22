import { Ubuntu, Ubuntu_Mono } from "next/font/google";
import "./globals.css";
import StarsBackground from "@/components/StarBackground";
import MarioClouds from "@/components/MarioClouds";
import Navbar from "@/components/Navbar";

const ubuntuSans = Ubuntu({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const ubuntuMono = Ubuntu_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata = {
  title: "KnoBot",
  description: "Ajuda assim não IA achar.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${ubuntuSans.variable} ${ubuntuMono.variable}`}>
      <body className="font-sans antialiased bg-[#182338]/80 h-screen overflow-hidden">

        {/* Fundo de estrelas */}
        <div className="fixed inset-0 z-[-10] pointer-events-none overflow-hidden">
          <StarsBackground />
        </div>

        {/* Nuvens no rodapé */}
        <div className="fixed bottom-0 left-0 w-full h-[700px] z-[-10] pointer-events-none overflow-hidden">
          <MarioClouds />
        </div>

        {/* Navbar fixa */}
        <div className="fixed top-0 left-0 w-full h-16 z-50">
          <Navbar />
        </div>

        {/* Conteúdo principal entre navbar e footer */}
        <div className="pt-16 pb-16 h-full">
          <main className="h-full overflow-auto">
            {children}
          </main>
        </div>

        {/* Rodapé fixo */}
        <footer className="fixed bottom-0 left-0 w-full h-16 z-20 bg-[var(--footer-bg)] text-gray-200 text-center flex items-center justify-center">
          © 2025 Knobot. Todos os direitos reservados.
        </footer>
      </body>
    </html>
  );
}

