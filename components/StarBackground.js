export default function StarsBackground() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <div className="rotate-stars w-full h-full relative">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="star absolute"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
