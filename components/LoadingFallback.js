// components/LoadingFallback.jsx
export default function LoadingFallback() {
  return (
    <div className="p-4 space-y-4 animate-pulse">
      <div className="h-6 w-1/3 bg-orange-300 rounded" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-40 bg-gray-300 rounded shadow"
          />
        ))}
      </div>
    </div>
  );
}