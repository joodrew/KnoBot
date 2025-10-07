// components/EmptyState.js
export default function EmptyState({ message = "Nenhum chamado encontrado." }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-gray-500">
      <svg
        className="w-12 h-12 mb-4 text-orange-400"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.75 9.75h.008v.008H9.75V9.75zm4.5 0h.008v.008h-.008V9.75zm-6.75 6h9a2.25 2.25 0 002.25-2.25V7.5a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 006 7.5v6a2.25 2.25 0 002.25 2.25z"
        />
      </svg>
      <p className="text-lg">{message}</p>
    </div>
  );
}