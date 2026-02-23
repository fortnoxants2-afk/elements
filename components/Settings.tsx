
import React from 'react';
import { AppSettings } from '../types';

interface SettingsProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  onBack: () => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, onUpdateSettings, onBack }) => {
  const WIN_SETTINGS = 'https://raw.githubusercontent.com/fortnoxants2-afk/Chuvash/main/Figma/win/win_settings.png';
  const CHECK_ON = 'https://raw.githubusercontent.com/fortnoxants2-afk/Chuvash/main/Figma/Icons/check_box01.png';
  const CHECK_OFF = 'https://raw.githubusercontent.com/fortnoxants2-afk/Chuvash/main/Figma/Icons/check_box02.png';
  const CLOSE_ICON = 'https://raw.githubusercontent.com/fortnoxants2-afk/Chuvash/main/Figma/Icons/close.png';

  const toggle = (key: keyof AppSettings) => {
    if (typeof settings[key] === 'boolean') {
      onUpdateSettings({ ...settings, [key]: !settings[key] });
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateSettings({ ...settings, imageBaseUrl: e.target.value });
  };

  return (
    <div className="absolute inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-[88%] max-w-[420px] aspect-[556/740] flex flex-col items-center">
        {/* Фоновое окно настроек */}
        <img 
          src={WIN_SETTINGS} 
          className="absolute inset-0 w-full h-full object-fill pointer-events-none" 
          alt="Settings Window" 
        />
        
        {/* Кнопка закрытия */}
        <button 
          onClick={onBack} 
          className="absolute top-[-4%] right-[-3%] w-[15%] aspect-square z-50 active:scale-90 transition-transform"
        >
          <img src={CLOSE_ICON} alt="Close" className="w-full h-full object-contain" />
        </button>

        <div className="relative z-10 w-full h-full flex flex-col items-center pt-[32%] px-[12%] pb-[8%]">
          {/* Список опций с чекбоксами */}
          <div className="w-full flex flex-col gap-y-[2.2%] mb-auto">
            <button 
              onClick={() => toggle('music')}
              className="flex items-center gap-x-[1.5vh] w-full py-[0.6vh] active:opacity-80 transition-opacity text-left outline-none group"
            >
              <div className="w-[3vh] h-[3vh] flex-shrink-0 relative flex items-center justify-center">
                <img 
                  src={settings.music ? CHECK_ON : CHECK_OFF} 
                  className="w-full h-full object-contain" 
                  alt="Checkbox" 
                />
              </div>
              <span className="text-[#5d3a24] font-bold text-[2.4vh] select-none leading-none">Музыка</span>
            </button>

            <button 
              onClick={() => toggle('sound')}
              className="flex items-center gap-x-[1.5vh] w-full py-[0.6vh] active:opacity-80 transition-opacity text-left outline-none group"
            >
              <div className="w-[3vh] h-[3vh] flex-shrink-0 relative flex items-center justify-center">
                <img 
                  src={settings.sound ? CHECK_ON : CHECK_OFF} 
                  className="w-full h-full object-contain" 
                  alt="Checkbox" 
                />
              </div>
              <span className="text-[#5d3a24] font-bold text-[2.4vh] select-none leading-none">Эффекты</span>
            </button>

            <button 
              onClick={() => toggle('diceEnabled')}
              className="flex items-center gap-x-[1.5vh] w-full py-[0.6vh] active:opacity-80 transition-opacity text-left outline-none group"
            >
              <div className="w-[3vh] h-[3vh] flex-shrink-0 relative flex items-center justify-center">
                <img 
                  src={settings.diceEnabled ? CHECK_ON : CHECK_OFF} 
                  className="w-full h-full object-contain" 
                  alt="Checkbox" 
                />
              </div>
              <span className="text-[#5d3a24] font-bold text-[2.4vh] select-none leading-none">Игральный кубик</span>
            </button>
          </div>

          {/* Техническое поле ввода URL */}
          <div className="w-full mt-4 opacity-10 hover:opacity-50 transition-opacity">
            <input 
              type="text" 
              value={settings.imageBaseUrl} 
              onChange={handleUrlChange}
              placeholder="Base URL"
              className="w-full text-[1.2vh] p-1 bg-transparent border-b border-[#5d3a24] text-[#5d3a24] outline-none font-mono"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
