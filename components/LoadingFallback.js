import { createPortal } from "react-dom";

export default function LoadingFallback() {
  return createPortal(
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
    </div>,
    document.body
  );
}