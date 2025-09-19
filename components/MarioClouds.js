
export default function MarioClouds() {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-[17%] z-0 pointer-events-none">
      {[...Array(20)].map((_, i) => {
        const size = 60 + Math.random() * 100;
        const height = size * 0.6;
        const top = Math.random() * 100;
        return (
          <div
            key={i}
            className="mario-cloud fade-cloud"
            style={{
              top: `${top}%`,
              left: `${Math.random() * 100}%`,
              width: `${size}px`,
              height: `${height}px`,
              animationDelay: `${Math.random() * 10}s`,
            }}
          />
        );
      })}
    </div>
  );
}
