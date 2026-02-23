import React from 'react';
import { AppScreen } from '../types';

interface MenuProps {
  onNavigate: (screen: AppScreen) => void;
  onOpenSettings: () => void;
  onOpenCategoryMenu: () => void;
}

const Menu: React.FC<MenuProps> = ({ onNavigate, onOpenSettings, onOpenCategoryMenu }) => {
  const ICON_SETTINGS = 'https://raw.githubusercontent.com/fortnoxants2-afk/Chuvash/main/Figma/Icons/Button_settings.png';
  const ICON_MENU = 'https://raw.githubusercontent.com/fortnoxants2-afk/Chuvash/main/Figma/Icons/Button_menu.png';
  const PLASHKA_URL = 'https://raw.githubusercontent.com/fortnoxants2-afk/Chuvash/main/Figma/Icons/plashka_chuvashiya.png';

  const headerStyle: React.CSSProperties = {
    width: '100%',
    height: '5.729%',
    display: 'grid',
    gridTemplateColumns: '8.796% 10.185% 7.87% 46.296% 7.87% 10.185% 8.796%',
    alignItems: 'center',
    marginTop: '3.177%',
    position: 'relative',
    zIndex: 40
  };

  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col">
      <div style={headerStyle}>
        <div />
        <button 
          onClick={onOpenSettings} 
          className="active:scale-90 transition-transform h-full w-full flex items-center justify-center"
        >
          <img src={ICON_SETTINGS} alt="Settings" className="w-full h-full object-contain" />
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
          <img src={ICON_MENU} alt="Menu" className="w-full h-full object-contain" />
        </button>
        <div />
      </div>

      <button 
        onClick={() => onNavigate(AppScreen.CATEGORIES)}
        className="absolute z-10 active:scale-[0.98] transition-transform duration-200 outline-none" 
        style={{ 
          width: '93.333%', 
          height: '91.5%',
          left: '3.333%',
          bottom: '1.2%' 
        }}>
        <img 
          src="https://raw.githubusercontent.com/fortnoxants2-afk/Chuvash/main/Figma/foto2/Card_main_big2.png"
          alt="Main Card"
          className="w-full h-full object-fill drop-shadow-2xl"
        />
      </button>

      <div className="absolute bottom-[0.8%] right-[4%] z-20 pointer-events-none">
        <div className="text-[#5d3a24] text-[1.4vh] font-bold opacity-30">Версия 0.0.1</div>
      </div>
    </div>
  );
};

export default Menu;