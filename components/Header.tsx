
import React, { useState, useEffect } from 'react';
import { SpiderLogo } from './IconComponents';

interface HeaderProps {
  userName: string | null;
}

export const Header: React.FC<HeaderProps> = ({ userName }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Atur interval untuk memperbarui waktu setiap detik
    const timerId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Bersihkan interval saat komponen dilepas
    return () => {
      clearInterval(timerId);
    };
  }, []);

  // Opsi format untuk Intl.DateTimeFormat
  const formatOptions: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'long',
    hour12: false,
  };
  
  // Format waktu ke string Bahasa Indonesia dan sesuaikan pemisahnya
  const formattedTime = new Intl.DateTimeFormat('id-ID', formatOptions)
    .format(currentTime)
    .replace(/\./g, ':') // Ganti titik dengan titik dua untuk waktu
    .replace(' ', ', '); // Tambahkan koma antara tanggal dan waktu

  return (
    <header className="bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-800 shadow-lg shadow-red-500/10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <SpiderLogo className="w-12 h-12 text-red-500 animate-pulse" />
          <h1 className="ml-4 text-3xl md:text-4xl font-black text-white font-orbitron tracking-wider">
            AI Prompt Generator <span className="text-red-500">Pro</span>
          </h1>
        </div>
        {userName && (
          <div className="hidden md:block text-right">
            <p className="text-red-500 font-bold text-lg font-orbitron">{userName}</p>
            <p className="text-gray-400 text-xs font-orbitron tracking-wider">{formattedTime}</p>
          </div>
        )}
      </div>
    </header>
  );
};
