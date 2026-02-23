import React, { useState, useEffect } from 'react';
import { Question } from '../types';
import { audioService } from '../services/audioService';

interface QuizProps {
  question: Question;
  categoryId: string;
  categoryName: string;
  onAdvance: () => void;
  onBack: () => void;
  onNavigateToSettings: () => void;
  onNavigateToDice: () => void;
  onOpenCategoryMenu: () => void;
  imageBaseUrl?: string;
  diceEnabled: boolean;
}

const Quiz: React.FC<QuizProps> = ({ 
  question, 
  categoryId, 
  categoryName, 
  onAdvance,
  onBack, 
  onNavigateToSettings, 
  onNavigateToDice,
  onOpenCategoryMenu,
  imageBaseUrl,
  diceEnabled
}) => {
  const ICON_BASE = 'https://raw.githubusercontent.com/fortnoxants2-afk/Chuvash/main/Figma/Icons/';
  const PLASHKA_DEFAULT = 'https://raw.githubusercontent.com/fortnoxants2-afk/Chuvash/main/Figma/Icons/plashka_chuvashiya.png';
  const PLASHKA_ZNAMENITOSTI = 'https://raw.githubusercontent.com/fortnoxants2-afk/Chuvash/main/Figma/Icons/plashka_znamenitosti.png';
  const PLASHKA_RAYONY = 'https://raw.githubusercontent.com/fortnoxants2-afk/Chuvash/main/Figma/Icons/plashka_rayoni.png';
  const PLASHKA_PRAZDNIKI = 'https://raw.githubusercontent.com/fortnoxants2-afk/Chuvash/main/Figma/Icons/plashka_prazdniki.png';
  const PLASHKA_PROMISEL = 'https://raw.githubusercontent.com/fortnoxants2-afk/Chuvash/main/Figma/Icons/plashka_promisli.png';
  const PLASHKA_SKULPTURA = 'https://raw.githubusercontent.com/fortnoxants2-afk/Chuvash/main/Figma/Icons/plashka_skulptura.png';
  const PLASHKA_YAZIK = 'https://raw.githubusercontent.com/fortnoxants2-afk/Chuvash/main/Figma/Icons/plashka_yazik.png';
  const CARD_BG = 'https://raw.githubusercontent.com/fortnoxants2-afk/Chuvash/main/Figma/Card_main_big.png';
  const TRAY_URL = 'https://raw.githubusercontent.com/fortnoxants2-afk/Chuvash/main/Figma/Icons/Button_down_02.png';
  const BTN_HOME_NEW = 'https://raw.githubusercontent.com/fortnoxants2-afk/Chuvash/main/Figma/Icons/Button_back2.png';
  const BTN_DICE_NEW = 'https://raw.githubusercontent.com/fortnoxants2-afk/Chuvash/main/Figma/Icons/Button_dice2.png';
  const CLOSE_ICON = 'https://raw.githubusercontent.com/fortnoxants2-afk/Chuvash/main/Figma/Icons/close.png';
  
  const WIN_GOOD_BG = 'https://raw.githubusercontent.com/fortnoxants2-afk/Chuvash/main/Figma/win/win_good.png';
  const WIN_BAD_BG = 'https://raw.githubusercontent.com/fortnoxants2-afk/Chuvash/main/Figma/win/win_bad.png';
  
  const ALMS_GIF = 'https://raw.githubusercontent.com/fortnoxants2-afk/Chuvash/main/Figma/gif/alms.gif';
  const NEUTRAL_GIF = 'https://raw.githubusercontent.com/fortnoxants2-afk/Chuvash/main/Figma/gif/neutral.gif';
  
  const BTN_NO_ACTION = 'https://raw.githubusercontent.com/fortnoxants2-afk/Chuvash/main/Figma/Icons/Button_No%20action.png';
  const BTN_OK_01 = 'https://raw.githubusercontent.com/fortnoxants2-afk/Chuvash/main/Figma/Icons/Button_OK_01.png';
  const BTN_OK_02 = 'https://raw.githubusercontent.com/fortnoxants2-afk/Chuvash/main/Figma/Icons/Button_OK_02.png';

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isButtonPressed, setIsButtonPressed] = useState(false);
  const [imgStatus, setImgStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [isSquareImg, setIsSquareImg] = useState(false);

  useEffect(() => {
    setSelectedOption(null);
    setShowFeedback(false);
    setIsButtonPressed(false);
    setImgStatus('loading');
    setIsSquareImg(false);
  }, [question.id]);

  const getImageUrl = () => {
    let base = imageBaseUrl?.trim() || 'https://raw.githubusercontent.com/fortnoxants2-afk/Chuvash/main/';
    if (!base.endsWith('/')) base += '/';
    let imgPath = question.imageUrl.trim();
    if (imgPath.startsWith('/')) imgPath = imgPath.substring(1);
    
    return `${base}${imgPath}`;
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const ratio = img.naturalWidth / img.naturalHeight;
    if (ratio > 0.85 && ratio < 1.15) {
      setIsSquareImg(true);
    } else {
      setIsSquareImg(false);
    }
    setImgStatus('loaded');
  };

  const checkAnswer = () => {
    if (!selectedOption || showFeedback) return;
    const correct = selectedOption === question.correctAnswer;
    setIsCorrect(correct);
    setShowFeedback(true);
    
    // Воспроизведение звукового эффекта
    audioService.playEffect(correct ? 'yes' : 'no');
  };

  const isCelebrityCategory = categoryId === 'znamenitosti';
  const isRayony = categoryId === 'rayony';
  const isPrazdniki = categoryId === 'prazdniki';
  const isPromisel = categoryId === 'promisel';
  const isSkulptury = categoryId === 'skulptury';
  const isYazik = categoryId === 'yazik';
  
  const isSpecial = question.id === 103 || question.id === 231;
  const isPeopleIllustration = question.imageUrl.includes('01_prazd.png') || question.imageUrl.includes('03_yazik.png');
  const isYazikObject = question.imageUrl.includes('01_yazik.png') || question.imageUrl.includes('02_yazik.png');
  const isLongQuestion = question.id === 104 || question.id === 105 || question.id === 508;
  
  const isPng = question.imageUrl.toLowerCase().endsWith('.png');
  const shouldDisableMask = (isRayony || isPrazdniki || isPromisel || isSkulptury || isYazik) && isPng;

  let containerWidthClass = 'w-[76%]';
  if (isPng) {
    if (isPeopleIllustration) {
      containerWidthClass = 'w-[52%]';
    } else if (isYazikObject) {
      containerWidthClass = 'w-[60%]';
    } else if (isSpecial) {
      containerWidthClass = 'w-[86%]'; 
    } else if (isPromisel || isSkulptury || isYazik) {
      containerWidthClass = 'w-[76%]';
    } else if (isPrazdniki) {
      containerWidthClass = 'w-[52%]'; 
    } else if (isRayony) {
      containerWidthClass = 'w-[64%]';
    }
  }

  const contentPaddingTop = isSpecial ? 'pt-[13%]' : (isRayony ? 'pt-[14%]' : 'pt-[10.5%]');
  const imageMarginBottom = (isLongQuestion || isPeopleIllustration) ? 'mb-4' : (isSpecial ? 'mb-2' : ((isRayony || isPrazdniki || isPromisel || isSkulptury || isYazik) ? 'mb-2' : 'mb-4'));
  const answersMarginTop = (isLongQuestion || isPeopleIllustration) ? 'mt-2' : (isSpecial ? 'mt-0' : (isRayony ? 'mt-1.5' : 'mt-4'));

  // Скорректированные коэффициенты масштабирования
  const questionFont = isLongQuestion ? 'text-[2.1vh]' : 'text-[2.3vh]';
  const optionFont = 'text-[2.1vh]';

  const currentPlashka = isCelebrityCategory 
    ? PLASHKA_ZNAMENITOSTI 
    : (isRayony ? PLASHKA_RAYONY : (isPrazdniki ? PLASHKA_PRAZDNIKI : (isPromisel ? PLASHKA_PROMISEL : (isSkulptury ? PLASHKA_SKULPTURA : (isYazik ? PLASHKA_YAZIK : PLASHKA_DEFAULT)))));

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
    <div className="flex flex-col h-full overflow-hidden relative">
      <div style={headerStyle}>
        <div />
        <button onClick={onNavigateToSettings} className="active:scale-90 transition-transform h-full w-full flex items-center justify-center">
          <img src={`${ICON_BASE}Button_settings.png`} alt="Settings" className="w-full h-full object-contain" />
        </button>
        <div />
        <div className="h-full w-full flex items-center justify-center">
          <img src={currentPlashka} alt={categoryName} className="w-full h-[81.8%] object-contain" />
        </div>
        <div />
        <button onClick={onOpenCategoryMenu} className="active:scale-90 transition-transform h-full w-full flex items-center justify-center">
          <img src={`${ICON_BASE}Button_menu.png`} alt="Menu" className="w-full h-full object-contain" />
        </button>
        <div />
      </div>

      <div className="absolute z-10 flex flex-col items-center" style={{ width: '93.333%', height: '91.5%', left: '3.333%', bottom: '1.2%' }}>
        <img src={CARD_BG} className="absolute inset-0 w-full h-full object-fill pointer-events-none drop-shadow-2xl" alt="Card BG" />
        
        <div className={`relative z-10 w-full h-full flex flex-col items-center px-[10%] pb-[30%] ${contentPaddingTop}`}>
          <div className={`${containerWidthClass} ${isSquareImg ? 'aspect-square' : 'aspect-[3.4/4.3]'} ${imageMarginBottom} relative flex-shrink-0 flex items-center justify-center transition-all duration-300 ${shouldDisableMask ? '' : 'rounded-[2.5rem] overflow-hidden bg-[#f3f4f6] shadow-inner'}`}>
             {imgStatus === 'loading' && (
               <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-8 h-8 border-4 border-[#5d3a24]/20 border-t-[#5d3a24] rounded-full animate-spin"></div>
               </div>
             )}
             
             {imgStatus === 'error' && (
               <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                 <div className="w-12 h-12 mb-2 opacity-20">
                   <svg viewBox="0 0 24 24" fill="none" stroke="#5d3a24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                     <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                     <circle cx="8.5" cy="8.5" r="1.5"/>
                     <polyline points="21 15 16 10 5 21"/>
                   </svg>
                 </div>
                 <span className="text-[#5d3a24] font-bold text-[1.2vh] uppercase opacity-40">Ошибка загрузки</span>
               </div>
             )}

             <img 
               src={getImageUrl()} 
               alt="Question" 
               className={`w-full h-full transition-opacity duration-300 ${shouldDisableMask ? 'object-contain' : 'object-cover'} ${imgStatus === 'loaded' ? 'opacity-100' : 'opacity-0'}`}
               onLoad={handleImageLoad}
               onError={() => setImgStatus('error')}
             />
             
             {!shouldDisableMask && <div className="absolute inset-0 rounded-[2.5rem] border-[1px] border-black/5 pointer-events-none"></div>}
          </div>
          
          <div className="flex-1 w-full px-2 flex flex-col justify-center items-center text-center min-h-[3.5vh] relative z-20">
            <h2 className={`text-[#0a0a0a] font-bold ${questionFont} leading-tight tracking-tight`}>
              {question.text}
            </h2>
          </div>
          
          <div className={`w-full space-y-[0.4vh] flex-shrink-0 relative z-10 ${answersMarginTop}`}>
            {Object.entries(question.options).map(([key, text]) => (
              <button
                key={key}
                disabled={showFeedback}
                onClick={() => setSelectedOption(key)}
                className={`w-full py-[0.6vh] px-[2.5vh] text-left rounded-[1.2rem] font-bold text-[#0a0a0a] ${optionFont} transition-all duration-150 ${selectedOption === key ? 'bg-white shadow-md scale-[1.02]' : 'bg-transparent active:bg-white/10'}`}
              >
                {text}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-[15%] flex items-end justify-center pointer-events-none z-[60]">
        <div className="relative h-full flex items-center justify-center pointer-events-auto" style={{ width: '93.333%' }}>
          <img src={TRAY_URL} className="absolute inset-x-0 bottom-0 w-full h-full object-contain object-bottom" alt="Tray BG" />
          <div className="relative w-full h-full flex items-center">
            <div style={{ width: '17.2%' }} className="h-full flex items-center justify-center">
              <button onClick={onBack} style={{ width: '40%', transform: 'translateX(320%)' }} className="aspect-square active:scale-90 transition-transform mb-[6.5%]">
                <img src={BTN_HOME_NEW} className="w-full h-full object-contain" alt="Home" />
              </button>
            </div>
            <div style={{ width: '65.6%' }} className="h-full flex items-center justify-center">
              <button 
                onMouseDown={() => selectedOption && !showFeedback && setIsButtonPressed(true)}
                onMouseUp={() => setIsButtonPressed(false)}
                onClick={checkAnswer} 
                disabled={!selectedOption || showFeedback}
                style={{ width: '43%' }}
                className="aspect-square transition-all flex items-center justify-center"
              >
                <img src={!selectedOption ? BTN_NO_ACTION : (isButtonPressed || showFeedback ? BTN_OK_02 : BTN_OK_01)} className="w-full h-full object-contain" alt="OK" />
              </button>
            </div>
            <div style={{ width: '17.2%' }} className="h-full flex items-center justify-center">
              <button 
                onClick={onNavigateToDice} 
                disabled={!diceEnabled}
                style={{ width: '40%', transform: 'translateX(-320%)' }} 
                className={`aspect-square transition-all mb-[6.5%] ${diceEnabled ? 'active:scale-90' : 'opacity-20 cursor-not-allowed'}`}
              >
                <img src={BTN_DICE_NEW} className="w-full h-full object-contain" alt="Dice" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {showFeedback && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="relative w-[85%] max-w-[420px] aspect-[556/650] flex flex-col items-center">
            <img 
              src={isCorrect ? WIN_GOOD_BG : WIN_BAD_BG} 
              className="absolute inset-0 w-full h-full object-fill pointer-events-none" 
              alt="Feedback BG" 
            />
            <button 
              onClick={onAdvance} 
              className="absolute top-[-4%] right-[-3%] w-[15%] aspect-square z-50 active:scale-90 transition-transform"
            >
              <img src={CLOSE_ICON} alt="Close" className="w-full h-full object-contain" />
            </button>

            <div className="relative z-10 w-full h-full flex flex-col items-center pt-[54%]">
              <div className="w-[58%] aspect-square flex items-center justify-center">
                <img 
                  src={isCorrect ? ALMS_GIF : NEUTRAL_GIF} 
                  alt={isCorrect ? "Correct" : "Incorrect"} 
                  className="w-full h-full object-contain" 
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz;