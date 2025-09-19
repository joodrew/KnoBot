import NavbarChat from "@/components/chat/NavbarChat";
import ChatArea from "@/components/chat/ChatArea";

export default function ChatPage() {
  return (
    <div className="flex flex-col sm:flex-row min-h-screen text-white bg-[#182338]/80">
      <NavbarChat />
      <ChatArea />
    </div>
  );
}
