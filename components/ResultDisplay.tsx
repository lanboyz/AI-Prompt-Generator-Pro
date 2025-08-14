import React, { useState } from 'react';
import { IconCopy } from './IconComponents';

interface ResultDisplayProps {
  indonesianPrompt: string;
  englishPrompt: string;
  structuredEnglishPrompt: string;
  structuredJsonPrompt: string;
  storyPrompt: string;
  onIndonesianChange: (value: string) => void;
  loading: boolean;
}

const CopyButton: React.FC<{ textToCopy: string; onCopy: () => void; }> = ({ textToCopy, onCopy }) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    onCopy();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="absolute top-3 right-3 bg-gray-700 p-2 rounded-lg text-gray-300 hover:bg-red-600 hover:text-white transition-colors duration-200"
      aria-label="Salin"
    >
      <IconCopy className={`w-5 h-5 ${copied ? 'text-green-400' : ''}`} />
    </button>
  );
};


export const ResultDisplay: React.FC<ResultDisplayProps> = ({ indonesianPrompt, englishPrompt, structuredEnglishPrompt, structuredJsonPrompt, storyPrompt, onIndonesianChange, loading }) => {
  const [notification, setNotification] = useState('');

  const triggerNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => {
        setNotification('');
    }, 3000);
  };

  if (loading) {
    return (
      <div className="mt-8 bg-gray-900 p-6 rounded-xl border-2 border-dashed border-gray-700 flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-500"></div>
        <p className="mt-4 text-lg text-gray-300 font-semibold font-orbitron">Menghasilkan Prompt Ajaib...</p>
        <p className="text-gray-400">Harap tunggu, AI sedang meracik mahakarya untuk Anda.</p>
      </div>
    );
  }

  if (!indonesianPrompt && !englishPrompt) {
    return null;
  }
  
  return (
    <>
      {notification && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold py-3 px-8 rounded-lg shadow-2xl z-50 animate-fade-in-out">
            {notification}
        </div>
      )}
      <div className="mt-10 pt-8 border-t-2 border-red-500/30">
          <h2 className="text-3xl font-bold text-center mb-8 font-orbitron text-white">
              Hasil <span className="text-red-500">Prompt</span>
          </h2>
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
              <div className="bg-gray-800/50 p-5 rounded-xl border border-gray-700/50 transition-all duration-300 hover:border-red-500/50 hover:shadow-lg hover:shadow-red-900/20 relative">
                  <h3 className="text-xl font-bold mb-3 text-red-400 font-orbitron">Bahasa Indonesia (Dapat Diedit)</h3>
                  <CopyButton textToCopy={indonesianPrompt} onCopy={() => triggerNotification('Prompt Bahasa Indonesia disalin!')} />
                  <div className="input-decorator input-decorator-red">
                    <textarea 
                        value={indonesianPrompt}
                        onChange={(e) => onIndonesianChange(e.target.value)}
                        className="w-full h-64 bg-gray-900 border-2 border-gray-700 rounded-lg p-3 text-gray-200 resize-y focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                    />
                  </div>
              </div>
              <div className="bg-gray-800/50 p-5 rounded-xl border border-gray-700/50 transition-all duration-300 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-900/20 relative">
                   <h3 className="text-xl font-bold mb-3 text-blue-400 font-orbitron">Bahasa Inggris (Final)</h3>
                   <CopyButton textToCopy={englishPrompt} onCopy={() => triggerNotification('Prompt Bahasa Inggris disalin!')}/>
                   <div className="input-decorator input-decorator-blue">
                    <textarea 
                        value={englishPrompt}
                        readOnly
                        className="w-full h-64 bg-gray-900 border-2 border-gray-700 rounded-lg p-3 text-gray-200 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-not-allowed transition-all duration-300"
                    />
                  </div>
              </div>
              <div className="bg-gray-800/50 p-5 rounded-xl border border-gray-700/50 transition-all duration-300 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-900/20 relative">
                   <h3 className="text-xl font-bold mb-3 text-purple-400 font-orbitron">Struktur Bahasa Inggris (Detail)</h3>
                   <CopyButton textToCopy={structuredEnglishPrompt} onCopy={() => triggerNotification('Struktur Bahasa Inggris disalin!')}/>
                   <div className="input-decorator input-decorator-purple">
                    <textarea 
                        value={structuredEnglishPrompt}
                        readOnly
                        className="w-full h-64 bg-gray-900 border-2 border-gray-700 rounded-lg p-3 text-gray-200 resize-y focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-not-allowed transition-all duration-300"
                    />
                  </div>
              </div>
               <div className="bg-gray-800/50 p-5 rounded-xl border border-gray-700/50 transition-all duration-300 hover:border-green-500/50 hover:shadow-lg hover:shadow-green-900/20 relative">
                   <h3 className="text-xl font-bold mb-3 text-green-400 font-orbitron">Struktur JSON (Bahasa Inggris)</h3>
                   <CopyButton textToCopy={structuredJsonPrompt} onCopy={() => triggerNotification('Struktur JSON disalin!')}/>
                   <div className="input-decorator input-decorator-green">
                    <textarea 
                        value={structuredJsonPrompt}
                        readOnly
                        className="w-full h-64 bg-gray-900 border-2 border-gray-700 rounded-lg p-3 text-gray-200 resize-y focus:outline-none focus:ring-2 focus:ring-green-500 cursor-not-allowed transition-all duration-300"
                    />
                  </div>
              </div>
          </div>
          {storyPrompt && (
            <div className="mt-8 bg-gray-800/50 p-5 rounded-xl border border-gray-700/50 transition-all duration-300 hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-900/20 relative">
                <h3 className="text-xl font-bold mb-3 text-amber-400 font-orbitron">Alur Cerita Berkelanjutan (Bahasa Inggris)</h3>
                <CopyButton textToCopy={storyPrompt} onCopy={() => triggerNotification('Alur Cerita disalin!')} />
                <div className="input-decorator input-decorator-amber">
                    <textarea
                        value={storyPrompt}
                        readOnly
                        className="w-full h-80 bg-gray-900 border-2 border-gray-700 rounded-lg p-3 text-gray-200 resize-y focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-not-allowed transition-all duration-300"
                    />
                </div>
            </div>
          )}
      </div>
    </>
  );
};