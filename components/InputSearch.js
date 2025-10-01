'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function InputSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const qFromUrl = searchParams.get('q') || '';
  const [value, setValue] = useState(qFromUrl);

  useEffect(() => setValue(qFromUrl), [qFromUrl]);

  useEffect(() => {
    const id = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set('q', value); else params.delete('q');
      const targetPath = pathname.startsWith('/tickets') ? pathname : '/tickets';
      const qs = params.toString();
      router.push(qs ? `${targetPath}?${qs}` : `${targetPath}`, { scroll: false });
    }, 350);
    return () => clearTimeout(id);
  }, [value]); // eslint-disable-line

  return (
    <div className="w-full max-w-xl px-2 sm:px-0">
      <div className="flex items-center w-full bg-gray-600 border border-orange-400 rounded-full px-4 py-4 sm:px-6 sm:py-3 shadow-sm hover:shadow-md transition">
        {/* lupa */}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-400 mr-2 sm:mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M16.65 16.65A7.5 7.5 0 1116.65 2a7.5 7.5 0 010 14.65z"/>
        </svg>
        <input
          type="text"
          placeholder="Pesquisar..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="flex-grow bg-transparent text-white placeholder-gray-300 outline-none text-sm sm:text-base"
        />
      </div>
    </div>
  );
}
