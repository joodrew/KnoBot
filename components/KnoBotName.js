// components/KnoBotName.js
import { Modak } from 'next/font/google';

const modak = Modak({
  subsets: ['latin'],
  weight: '400',
});

export default function KnoBotName({ size = 'text-5xl' }) {
  return (
    <h1
      className={`${modak.className} ${size} text-whitefont-bold`}
      style={{
        WebkitTextStroke: '1px #000000', // borda preta
      }}
    >
      KnoBot
    </h1>
  );
}
