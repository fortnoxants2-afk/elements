
import React, { useState, useEffect, useMemo } from 'react';
import { AppScreen, AppSettings, Question, CATEGORY_NAMES } from './types';
import { getQuestions } from './data';
import { shuffleArray } from './services/gameLogic';
import { audioService } from './services/audioService';
import Menu from './components/Menu';
import CategorySelector from './components/CategorySelector';
import Quiz from './components/Quiz';
import Settings from './components/Settings';
import Dice from './components/Dice';
import CategoryModal from './components/CategoryModal';

interface DeckState {
  order: number[]; 
  pointer: number; 
}

const DECK_STORAGE_KEY = 'chuvashia_deck_v6';

const App: React.FC = () => {
  const [screen, setScreen] = useState<AppScreen>(AppScreen.MENU);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  
  const [deck, setDeck] = useState<DeckState | null>(() => {
    try {
      const saved = localStorage.getItem(DECK_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error("Failed to parse deck from storage", e);
      return null;
    }
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    const defaultUrl = 'https://raw.githubusercontent.com/fortnoxants2-afk/Chuvash/main/'; 
    const defaultSettings: AppSettings = {
      sound: true,
      music: true,
      diceEnabled: true,
      imageBaseUrl: defaultUrl,
      activeCategories: ['znamenitosti', 'rayony', 'prazdniki', 'skulptury', 'promisel', 'yazik']
    };

    try {
      const saved = localStorage.getItem('chuvashia_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...defaultSettings,
          ...parsed,
          imageBaseUrl: (!parsed.imageBaseUrl || parsed.imageBaseUrl === '' || parsed.imageBaseUrl === './') 
            ? defaultUrl 
            : parsed.imageBaseUrl
        };
      }
    } catch (e) {
      console.error("Failed to parse settings from storage", e);
    }
    return defaultSettings;
  });

  useEffect(() => {
    audioService.setMusicEnabled(settings.music);
    audioService.setSoundEnabled(settings.sound);
  }, [settings.music, settings.sound]);

  useEffect(() => {
    const startAudio = () => {
      audioService.playMusic();
      window.removeEventListener('click', startAudio);
      window.removeEventListener('touchstart', startAudio);
    };
    window.addEventListener('click', startAudio);
    window.addEventListener('touchstart', startAudio);
    return () => {
      window.removeEventListener('click', startAudio);
      window.removeEventListener('touchstart', startAudio);
    };
  }, []);

  useEffect(() => {
    setAllQuestions(getQuestions());
  }, []);

  useEffect(() => {
    if (allQuestions.length > 0) {
      const filtered = allQuestions.filter(q => settings.activeCategories.includes(q.category));
      const ids = filtered.map(q => q.id);
      
      const currentIdsSorted = [...(deck?.order || [])].sort().join(',');
      const newIdsSorted = [...ids].sort().join(',');

      if (!deck || currentIdsSorted !== newIdsSorted || ids.length === 0) {
        const newDeck = {
          order: shuffleArray(ids.length > 0 ? ids : allQuestions.map(q => q.id)),
          pointer: 0
        };
        setDeck(newDeck);
        localStorage.setItem(DECK_STORAGE_KEY, JSON.stringify(newDeck));
      }
    }
  }, [allQuestions, settings.activeCategories]);

  useEffect(() => {
    localStorage.setItem('chuvashia_settings', JSON.stringify(settings));
  }, [settings]);

  const handleToggleCategory = (catId: string) => {
    setSettings(prev => {
      const current = prev.activeCategories;
      if (current.includes(catId)) {
        if (current.length <= 1) return prev;
        return { ...prev, activeCategories: current.filter(id => id !== catId) };
      }
      return { ...prev, activeCategories: [...current, catId] };
    });
  };

  const handleCategorySelect = (categoryId: string) => {
    setScreen(AppScreen.QUIZ);
  };

  const advanceDeck = () => {
    setDeck(prev => {
      if (!prev || prev.order.length === 0) return prev;
      let nextPointer = prev.pointer + 1;
      let nextOrder = [...prev.order];
      if (nextPointer >= prev.order.length) {
        nextPointer = 0;
        nextOrder = shuffleArray([...prev.order]);
      }
      const newState = { order: nextOrder, pointer: nextPointer };
      localStorage.setItem(DECK_STORAGE_KEY, JSON.stringify(newState));
      return newState;
    });
  };

  const currentQuestion = useMemo(() => {
    if (!deck || deck.order.length === 0 || allQuestions.length === 0) return null;
    const currentId = deck.order[deck.pointer];
    return allQuestions.find(q => q.id === currentId) || allQuestions[0];
  }, [deck, allQuestions]);

  return (
    <div className="app-screen-container overflow-hidden">
      {screen === AppScreen.MENU && (
        <Menu 
          onNavigate={setScreen} 
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenCategoryMenu={() => setIsCategoryModalOpen(true)}
        />
      )}

      {screen === AppScreen.CATEGORIES && (
        <CategorySelector 
          onSelectCategory={handleCategorySelect} 
          onBack={() => setScreen(AppScreen.MENU)} 
          onNavigateToSettings={() => setIsSettingsOpen(true)}
          onNavigateToDice={() => setScreen(AppScreen.DICE)}
          onOpenCategoryMenu={() => setIsCategoryModalOpen(true)}
          diceEnabled={settings.diceEnabled}
        />
      )}

      {screen === AppScreen.QUIZ && currentQuestion && (
        <Quiz 
          question={currentQuestion} 
          categoryId={currentQuestion.category}
          categoryName={CATEGORY_NAMES[currentQuestion.category] || 'Викторина'}
          onAdvance={() => {
            advanceDeck();
            setScreen(AppScreen.CATEGORIES);
          }}
          onBack={() => setScreen(AppScreen.CATEGORIES)}
          onNavigateToSettings={() => setIsSettingsOpen(true)}
          onNavigateToDice={() => setScreen(AppScreen.DICE)}
          onOpenCategoryMenu={() => setIsCategoryModalOpen(true)}
          imageBaseUrl={settings.imageBaseUrl}
          diceEnabled={settings.diceEnabled}
        />
      )}

      {screen === AppScreen.DICE && (
        <Dice 
          onBack={() => setScreen(AppScreen.CATEGORIES)} 
          onNavigateToSettings={() => setIsSettingsOpen(true)}
        />
      )}

      {isSettingsOpen && (
        <Settings 
          settings={settings} 
          onUpdateSettings={setSettings} 
          onBack={() => setIsSettingsOpen(false)} 
        />
      )}

      {isCategoryModalOpen && (
        <CategoryModal 
          activeCategories={settings.activeCategories}
          onToggleCategory={handleToggleCategory}
          onClose={() => setIsCategoryModalOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
