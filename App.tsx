
import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { VeoPromptGenerator } from './components/VeoPromptGenerator';
import { ImagenPromptGenerator } from './components/ImagenPromptGenerator';
import { IconVideo, IconImage } from './components/IconComponents';
import { WelcomeScreen } from './components/WelcomeScreen';
import { LoginScreen } from './components/LoginScreen';

type ActiveTab = 'veo' | 'imagen';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('veo');
  const [showWelcome, setShowWelcome] = useState(true);
  const [userName, setUserName] = useState<string | null>(null);
  const [isAppVisible, setIsAppVisible] = useState(false);

  useEffect(() => {
    if (userName) {
      // Allow a brief moment for the login screen to transition out before fading in the app
      const timer = setTimeout(() => setIsAppVisible(true), 100);
      return () => clearTimeout(timer);
    }
  }, [userName]);

  const handleWelcomeEnter = () => {
    setShowWelcome(false);
  };

  const handleLogin = (name: string) => {
    setUserName(name);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'veo':
        return <VeoPromptGenerator />;
      case 'imagen':
        return <ImagenPromptGenerator />;
      default:
        return null;
    }
  };

  const getTabClass = (tabName: ActiveTab) =>
    `flex items-center gap-2 px-6 py-3 font-bold text-lg rounded-t-lg cursor-pointer transition-all duration-300 border-b-4 ${
      activeTab === tabName
        ? 'bg-gray-800 border-red-500 text-white'
        : 'bg-gray-900 border-transparent text-gray-400 hover:bg-gray-800 hover:text-white'
    }`;

  if (showWelcome) {
    return <WelcomeScreen onEnter={handleWelcomeEnter} />;
  }

  if (!userName) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className={`main-app-container watermark-bg ${isAppVisible ? 'visible' : ''}`}>
      <Header userName={userName} />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-center mb-8">
          <nav className="flex space-x-2">
            <button onClick={() => setActiveTab('veo')} className={getTabClass('veo')}>
              <IconVideo className="w-6 h-6" />
              <span>Veo 3 Prompt</span>
            </button>
            <button onClick={() => setActiveTab('imagen')} className={getTabClass('imagen')}>
              <IconImage className="w-6 h-6" />
              <span>Imagen 3 Prompt</span>
            </button>
          </nav>
        </div>
        
        {renderTabContent()}
      </main>
      <footer className="text-center py-6 text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} AI Prompt Generator Pro. Dibuat dengan tema Black Suite Spiderman.</p>
      </footer>
    </div>
  );
};

export default App;
