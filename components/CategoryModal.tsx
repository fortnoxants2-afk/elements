
import React from 'react';
import { CATEGORY_ORDER, CATEGORY_NAMES } from '../types';

interface CategoryModalProps {
  activeCategories: string[];
  onToggleCategory: (categoryId: string) => void;
  onClose: () => void;
}

const CategoryModal: React.FC<CategoryModalProps> = ({ activeCategories, onToggleCategory, onClose }) => {
  const WIN_MENU = 'https://raw.githubusercontent.com/fortnoxants2-afk/Chuvash/main/Figma/Icons/win_menu.png';
  const CHECK_ON = 'https://raw.githubusercontent.com/fortnoxants2-afk/Chuvash/main/Figma/Icons/check_box01.png';
  const CHECK_OFF = 'https://raw.githubusercontent.com/fortnoxants2-afk/Chuvash/main/Figma/Icons/check_box02.png';
  const CLOSE_ICON = 'https://raw.githubusercontent.com/fortnoxants2-afk/Chuvash/main/Figma/Icons/close.png';

  return (
    <div className="absolute inset-0 z-[200] flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-[88%] max-w-[420px] aspect-[556/740] flex flex-col items-center">
        {/* Фоновое окно */}
        <img src={WIN_MENU} className="absolute inset-0 w-full h-full object-fill pointer-events-none" alt="Menu Window" />
        
        {/* Кнопка закрытия */}
        <button 
          onClick={onClose} 
          className="absolute top-[-4%] right-[-3%] w-[15%] aspect-square z-50 active:scale-90 transition-transform"
        >
          <img src={CLOSE_ICON} alt="Close" className="w-full h-full object-contain" />
        </button>

        <div className="relative z-10 w-full h-full flex flex-col pt-[20%] pb-[5%] px-[12%]">
          {/* Список категорий */}
          <div className="flex-1 flex flex-col justify-center gap-y-[2.2%] overflow-y-auto scrollbar-hide">
            {CATEGORY_ORDER.map((id) => {
              const isActive = activeCategories.includes(id);
              return (
                <button
                  key={id}
                  onClick={() => onToggleCategory(id)}
                  className="flex items-center gap-x-[1.5vh] w-full group py-[0.6vh] text-left outline-none"
                >
                  <div className="w-[3vh] aspect-square flex-shrink-0">
                    <img 
                      src={isActive ? CHECK_ON : CHECK_OFF} 
                      className="w-full h-full object-contain" 
                      alt={isActive ? "Checked" : "Unchecked"} 
                    />
                  </div>
                  <span className="text-[#5d3a24] font-bold text-[2.4vh] leading-tight select-none">
                    {CATEGORY_NAMES[id]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;
