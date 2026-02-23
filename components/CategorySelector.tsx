import React from 'react';

interface CategorySelectorProps {
  onSelectCategory: (category: string) => void;
  onBack: () => void;
  onNavigateToSettings: () => void;
  onNavigateToDice: () => void;
  onOpenCategoryMenu: () => void;
  diceEnabled: boolean;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ 
  onSelectCategory, 
  onBack, 
  onNavigateToSettings, 
  onNavigateToDice,
  onOpenCategoryMenu,
  diceEnabled
}) => {
  const ICON_BASE = 'https://raw.githubusercontent.com/fortnoxants2-afk/Chuvash/main/Figma/Icons/';
  const PLASHKA_URL = 'https://raw.githubusercontent.com/fortnoxants2-afk/Chuvash/main/Figma/Icons/plashka_chuvashiya.png';
  const DICE_ICON = 'https://raw.githubusercontent.com/fortnoxants2-afk/Chuvash/main/Figma/Icons/Button_dice2.png';
  
  const BG_QUESTIONS = 'https://raw.githubusercontent.com/fortnoxants2-afk/Chuvash/main/Figma/foto2/Card_questions_bg2.png';
  const BG_GIFTS = 'https://raw.githubusercontent.com/fortnoxants2-afk/Chuvash/main/Figma/foto2/Cards_gifts_bg2.png';
  const BG_STOP = 'https://raw.githubusercontent.com/fortnoxants2-afk/Chuvash/main/Figma/foto2/Card_stop_bg2.png';

  const headerContainerStyle: React.CSSProperties = {
    width: '100%',
    height: '5.729%', 
    display: 'grid',
    gridTemplateColumns: '8.796% 10.185% 7.87% 46.296% 7.87% 10.185% 8.796%',
    alignItems: 'center',
    marginTop: '3.177%',
    position: 'relative',
    zIndex: 50
  };

  const categories = [
    { id: 'questions', bg: BG_QUESTIONS },
    { id: 'gifts', bg: BG_GIFTS },
    { id: 'stop', bg: BG_STOP },
  ];

  return (
    <div className="w-full h-full flex flex-col relative overflow-hidden">
      <div style={headerContainerStyle}>
        <div />
        <button 
          onClick={onNavigateToSettings} 
          className="active:scale-90 transition-transform h-full w-full flex items-center justify-center"
        >
          <img src={`${ICON_BASE}Button_settings.png`} alt="Settings" className="w-full h-full object-contain" />
        </button>
        <div />
        <div className="h-full w-full flex items-center justify-center">
          <img 
            src={PLASHKA_URL} 
            alt="Моя Чувашия" 
            className="w-full h-[81.8%] object-contain"
          />
        </div>
        <div />
        <button 
          onClick={onOpenCategoryMenu}
          className="active:scale-90 transition-transform h-full w-full flex items-center justify-center"
        >
          <img src={`${ICON_BASE}Button_menu.png`} alt="Menu" className="w-full h-full object-contain" />
        </button>
        <div />
      </div>

      <div className="flex-1 w-full flex flex-col items-center justify-center px-[8.8%] relative overflow-visible">
        {categories.map((cat, index) => (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            style={{ 
              marginBottom: index < categories.length - 1 ? '3%' : 0 
            }}
            className="w-full aspect-[900/500] relative flex-shrink-0 outline-none transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.01] active:scale-[0.98] group z-0 hover:z-10"
          >
            <img 
              src={cat.bg} 
              alt={cat.id} 
              className="absolute inset-0 w-full h-full object-fill transition-all duration-300 drop-shadow-[0_10px_12px_rgba(0,0,0,0.18)] group-hover:drop-shadow-[0_20px_25px_rgba(0,0,0,0.3)]"
            />
          </button>
        ))}

        {diceEnabled && (
          <button 
            onClick={onNavigateToDice}
            className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center justify-center rounded-l-[2.5rem] shadow-2xl transition-all z-50 w-[19%] aspect-[1.15/1] animate-in slide-in-from-right duration-300 group outline-none"
            style={{ 
              backgroundColor: '#FEEFE3',
              padding: '4% 3% 4% 6%' 
            }}
          >
            <img src={DICE_ICON} className="w-full h-full object-contain transition-transform duration-150 group-active:scale-90" alt="Dice" />
          </button>
        )}
      </div>

      <div className="absolute bottom-[1.8%] right-[4%] z-20 pointer-events-none">
        <div className="text-[#5d3a24] text-[12px] font-bold opacity-30">Версия 0.0.1</div>
      </div>
    </div>
  );
};

export default CategorySelector;