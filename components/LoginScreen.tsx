
import React, { useState } from 'react';

interface LoginScreenProps {
  onLogin: (name: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onLogin(name.trim());
    } else {
      setError('Nama tidak boleh kosong.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4 animate-fade-in">
      <div className="w-full max-w-md text-center">
        <h1 
          className="text-4xl md:text-5xl font-black text-white font-orbitron tracking-wider mb-8 animate-slide-up-fade-in"
          style={{ animationDelay: '0.2s' }}
        >
          Masukkan <span className="text-red-500">Nama</span> Anda
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div 
            className="animate-slide-up-fade-in"
            style={{ animationDelay: '0.5s' }}
          >
            <div className="input-decorator input-decorator-red">
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Nama Anda..."
                className="w-full bg-gray-900 border-2 border-gray-700 rounded-lg p-4 text-gray-200 text-lg text-center transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                aria-label="Nama Pengguna"
              />
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>

          <div 
            className="animate-slide-up-fade-in"
            style={{ animationDelay: '0.8s' }}
          >
            <button 
              type="submit"
              className="w-full bg-red-600 hover:bg-red-500 text-white font-bold text-xl py-3 px-12 rounded-lg transition-all duration-300 shadow-lg hover:shadow-red-500/50 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-500/50 disabled:bg-gray-600 disabled:transform-none"
              disabled={!name.trim()}
            >
              Lanjutkan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
