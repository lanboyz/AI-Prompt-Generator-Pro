import React from 'react';
import { SpiderLogo } from './IconComponents';

interface WelcomeScreenProps {
  onEnter: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onEnter }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4 animate-fade-in">
      <div className="text-center space-y-8">
        
        <div 
          className="animate-slide-up-fade-in" 
          style={{ animationDelay: '0.2s' }}
        >
          <SpiderLogo className="w-32 h-32 text-red-500 mx-auto animate-pulse-slow" />
        </div>

        <h1 
          className="text-5xl md:text-7xl font-black text-white font-orbitron tracking-wider animate-slide-up-fade-in"
          style={{ animationDelay: '0.5s' }}
        >
          AI Prompt Generator <span className="text-red-500">Pro</span>
        </h1>

        <p 
          className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto animate-slide-up-fade-in"
          style={{ animationDelay: '0.8s' }}
        >
          Alat canggih Anda untuk merancang prompt berkualitas tinggi untuk Veo & Imagen 3, ditenagai oleh Gemini AI.
        </p>

        <div 
          className="animate-slide-up-fade-in"
          style={{ animationDelay: '1.1s' }}
        >
          <button 
            onClick={onEnter}
            className="bg-red-600 hover:bg-red-500 text-white font-bold text-2xl py-4 px-12 rounded-lg transition-all duration-300 shadow-lg hover:shadow-red-500/50 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-red-500/50"
          >
            Mulai
          </button>
        </div>

      </div>
    </div>
  );
};