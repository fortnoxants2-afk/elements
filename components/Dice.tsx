
import React, { useState, useEffect, useRef } from 'react';
import { audioService } from '../services/audioService';

interface DiceProps {
  onBack: () => void;
  onNavigateToSettings: () => void;
}

const Dice: React.FC<DiceProps> = ({ onBack, onNavigateToSettings }) => {
  const ICON_BASE = 'https://raw.githubusercontent.com/fortnoxants2-afk/Chuvash/main/Figma/Icons/';
  const PLASHKA_URL = 'https://raw.githubusercontent.com/fortnoxants2-afk/Chuvash/main/Figma/Icons/plashka_chuvashiya.png';
  const TRAY_URL = 'https://raw.githubusercontent.com/fortnoxants2-afk/Chuvash/main/Figma/Icons/Button_down_02.png';
  const BTN_HOME_NEW = 'https://raw.githubusercontent.com/fortnoxants2-afk/Chuvash/main/Figma/Icons/Button_back2.png';
  const BTN_OK_01 = 'https://raw.githubusercontent.com/fortnoxants2-afk/Chuvash/main/Figma/Icons/Button_OK_01.png';
  const BTN_OK_02 = 'https://raw.githubusercontent.com/fortnoxants2-afk/Chuvash/main/Figma/Icons/Button_OK_02.png';
  const BTN_DICE_NEW = 'https://raw.githubusercontent.com/fortnoxants2-afk/Chuvash/main/Figma/Icons/Button_dice2.png';
  
  const DICE_WINDOW = 'https://raw.githubusercontent.com/fortnoxants2-afk/Chuvash/main/Figma/gif/dice_window.png';
  const CLOSE_ICON = 'https://raw.githubusercontent.com/fortnoxants2-afk/Chuvash/main/Figma/Icons/close.png';
  
  const FRAME_BASE_URL = 'https://raw.githubusercontent.com/fortnoxants2-afk/Chuvash/main/Figma/gif/white_dice/all_frames/white_dice_six_sides_animation_frames_';
  const RESULT_BASE_URL = 'https://raw.githubusercontent.com/fortnoxants2-afk/Chuvash/main/Figma/gif/white_dice/resultat/white_dice_six_sides_results_orthographic_';

  const [value, setValue] = useState<number>(() => Math.floor(Math.random() * 6) + 1);
  const [isRolling, setIsRolling] = useState(false);
  const [isButtonPressed, setIsButtonPressed] = useState(false);
  const [frameIndex, setFrameIndex] = useState(1);
  const [offset, setOffset] = useState(0); 

  const animationRef = useRef<number | null>(null);

  const startRoll = () => {
    if (isRolling) return;
    
    // Воспроизведение звука броска
    audioService.playEffect('dice');

    let newValue;
    do {
      newValue = Math.floor(Math.random() * 6) + 1;
    } while (newValue === value);

    const startFrom = Math.random() > 0.5 ? 'left' : 'right';
    const initialOffset = startFrom === 'left' ? -250 : 250; 
    
    setOffset(initialOffset);
    setIsRolling(true);
    
    const duration = 1400; 
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const t = progress;
      const easeOut = 1 - Math.pow(1 - t, 3);
      const currentOffset = initialOffset * (1 - easeOut);
      
      const currentFrame = (Math.floor(elapsed / 90) % 8) + 1;
      
      setOffset(currentOffset);
      setFrameIndex(currentFrame);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsRolling(false);
        setOffset(0);
        setValue(newValue);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    startRoll();
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

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

  const SIDE_ZONE_RATIO = (64 / 372) * 100; 
  const CENTER_ZONE_RATIO = (244 / 372) * 100;
  const OK_BTN_RATIO = 43; 
  const SIDE_BTN_RATIO = 40; 

  const formattedFrame = frameIndex.toString().padStart(2, '0');
  const resultValue = value.toString().padStart(2, '0');

  const diceImageUrl = isRolling 
    ? `${FRAME_BASE_URL}${formattedFrame}.png` 
    : `${RESULT_BASE_URL}${resultValue}.png`;

  const getOkButtonImage = () => {
    if (isButtonPressed) return BTN_OK_02;
    return BTN_OK_01;
  };

  return (
    <div className="flex flex-col h-full overflow-hidden relative">
      <div className="absolute inset-0 bg-black/40 z-[45] pointer-events-none transition-opacity duration-300"></div>

      <div style={headerStyle}>
        <div />
        <button onClick={onNavigateToSettings} className="active:scale-90 transition-transform h-full w-full flex items-center justify-center">
          <img src={`${ICON_BASE}Button_settings.png`} alt="Settings" className="w-full h-full object-contain" />
        </button>
        <div />
        <div className="h-full w-full flex items-center justify-center">
          <img src={PLASHKA_URL} alt="Моя Чувашия" className="w-full h-[81.8%] object-contain" />
        </div>
        <div />
        <button onClick={onBack} className="active:scale-90 transition-transform h-full w-full flex items-center justify-center">
          <img src={`${ICON_BASE}Button_menu.png`} alt="Menu" className="w-full h-full object-contain" />
        </button>
        <div />
      </div>

      <div className="flex-1 relative z-50">
        <div 
          className="absolute left-1/2 -translate-x-1/2 w-[85%] max-w-[420px] aspect-[556/958]"
          style={{ bottom: '7.5%' }}
        >
          <img src={DICE_WINDOW} className="absolute inset-0 w-full h-full object-fill z-10" alt="Dice Window" />
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onBack();
            }} 
            className="absolute top-[-4%] right-[-3%] w-[15%] aspect-square z-50 active:scale-90 transition-transform"
          >
            <img src={CLOSE_ICON} alt="Close" className="w-full h-full object-contain drop-shadow-sm" />
          </button>

          <div 
            onClick={startRoll}
            className="absolute inset-x-[6%] inset-y-[12%] overflow-hidden z-20 flex items-center justify-center cursor-pointer"
          >
            <div 
              className="w-[55%] aspect-square flex items-center justify-center pointer-events-none"
              style={{ 
                transform: `translateX(${offset}%) rotate(${offset * 1.8}deg)`,
                transition: isRolling ? 'none' : 'transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
              }}
            >
              <img 
                src={diceImageUrl} 
                alt="Dice" 
                className="w-full h-full object-contain drop-shadow-2xl" 
                style={{ imageRendering: 'auto' }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-[15%] flex items-end justify-center pointer-events-none z-[60]">
        <div className="relative h-full flex items-center justify-center pointer-events-auto" style={{ width: '93.333%' }}>
          <img src={TRAY_URL} className="absolute inset-x-0 bottom-0 w-full h-full object-contain object-bottom" alt="Tray BG" />
          <div className="relative w-full h-full flex items-center">
            <div style={{ width: `${SIDE_ZONE_RATIO}%` }} className="h-full flex items-center justify-center">
              <button onClick={onBack} style={{ width: `${SIDE_BTN_RATIO}%`, transform: 'translateX(320%)' }} className="aspect-square active:scale-90 transition-transform mb-[6.5%]">
                <img src={BTN_HOME_NEW} className="w-full h-full object-contain" alt="Home" />
              </button>
            </div>
            <div style={{ width: `${CENTER_ZONE_RATIO}%` }} className="h-full flex items-center justify-center">
              <button 
                onMouseDown={() => !isRolling && setIsButtonPressed(true)}
                onMouseUp={() => setIsButtonPressed(false)}
                onMouseLeave={() => setIsButtonPressed(false)}
                onTouchStart={() => !isRolling && setIsButtonPressed(true)}
                onTouchEnd={() => setIsButtonPressed(false)}
                onClick={startRoll} 
                disabled={isRolling} 
                style={{ width: `${OK_BTN_RATIO}%` }} 
                className="aspect-square transition-all flex items-center justify-center"
              >
                <img src={getOkButtonImage()} className="w-full h-full object-contain" alt="Roll" />
              </button>
            </div>
            <div style={{ width: `${SIDE_ZONE_RATIO}%` }} className="h-full flex items-center justify-center">
              <button style={{ width: `${SIDE_BTN_RATIO}%`, transform: 'translateX(-320%)' }} className="aspect-square active:scale-90 transition-transform mb-[6.5%]">
                <img src={BTN_DICE_NEW} className="w-full h-full object-contain opacity-40" alt="Dice" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-[0.5%] right-[5%] text-[#5d3a24] text-[10px] font-black opacity-30 z-[70]">Версия 0.0.1</div>
    </div>
  );
};

export default Dice;
