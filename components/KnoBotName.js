// components/KnoBotName.js
import { Modak } from 'next/font/google';

const modak = Modak({
  subsets: ['latin'],
  weight: '400',
});

export default function KnoBotName({ size = 'text-5xl' }) {
  return (
    <h1
      className={`${modak.className} ${size} text-white font-bold break-words text-center`}
      style={{
        WebkitTextStroke: '1px #000000',
      }}
    >
      KnoBot
    </h1>
  );
}

