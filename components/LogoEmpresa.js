'use client';

import { useState } from 'react';

function stringToColor(str = '') {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 50%)`;
}

export default function LogoEmpresa({ nome = '', logo = '' }) {
  const [erro, setErro] = useState(false);
  const letra = nome?.charAt(0).toUpperCase() || '?';

  if (!logo || erro) {
    return (
      <div
        className="h-16 w-16 rounded-full flex items-center justify-center mx-auto my-2 text-white font-bold text-xl"
        style={{ backgroundColor: stringToColor(nome) }}
      >
        {letra}
      </div>
    );
  }

  return (
    <img
      src={logo}
      alt={nome}
      className="h-16 max-h-20 w-auto object-contain mx-auto my-2"
      onError={() => setErro(true)}
    />
  );
}
