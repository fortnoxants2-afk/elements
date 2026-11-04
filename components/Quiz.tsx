import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Question } from '../types';
import { audioService } from '../services/audioService';
import { shuffleArray } from '../services/gameLogic';

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

const ICON_SOUND = 'https://raw.githubusercontent.com/fortnoxants2-afk/elements/main/Figma/icon/icon_sound_03.webp';

const WORD_AUDIO_MAP: Record<string, string> = {
  'атте': 'https://raw.githubusercontent.com/fortnoxants2-afk/elements/main/Figma/sounds/chuvash/audio_%D0%B0%D1%82%D1%82%D0%B5.MP3',
  'ача': 'https://raw.githubusercontent.com/fortnoxants2-afk/elements/main/Figma/sounds/chuvash/audio_%D0%B0%D1%87%D0%B0.MP3',
  'асатте': 'https://raw.githubusercontent.com/fortnoxants2-afk/elements/main/Figma/sounds/chuvash/audio_%D0%B0%D1%81%D0%B0%D1%82%D1%82%D0%B5.MP3',
  'шăллăм': 'https://raw.githubusercontent.com/fortnoxants2-afk/elements/main/Figma/sounds/chuvash/audio_%D1%88%C4%83%D0%BB%D0%BB%C4%83%D0%BC.MP3',
  'арçын': 'https://raw.githubusercontent.com/fortnoxants2-afk/elements/main/Figma/sounds/chuv_sounds/audio_%D0%B0%D1%80%C3%A7%D1%8B%D0%BD.mp3',
  'маçак': 'https://raw.githubusercontent.com/fortnoxants2-afk/elements/main/Figma/sounds/chuv_sounds/audio_%D0%BC%D0%B0%C3%A7%D0%B0%D0%BA.mp3'
};

export default function Quiz({ 
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
}: QuizProps) {
  const ICON_SETTINGS = 'https://fortnoxants2-afk.github.io/elements/Figma/icon/icon_settings.webp';
  const ICON_MENU = 'https://fortnoxants2-afk.github.io/elements/Figma/icon/icon_menu.webp';
  const PLASHKA_URL = 'https://fortnoxants2-afk.github.io/elements/Figma/icon/icon_plashka.webp';
  
  const isStretchedScreen = useMemo(() => {
    if (typeof window === 'undefined') return false;
    const ratio = window.innerHeight / window.innerWidth;
    return ratio > 1.85;
  }, []);

  const STANDARD_CARD_BG = 'https://raw.githubusercontent.com/fortnoxants2-afk/elements/main/Figma/main/card_main_01_100px.webp';
  const SQUARE_CARD_BG = 'https://raw.githubusercontent.com/fortnoxants2-afk/elements/main/Figma/main/card_main_02_100px.webp';
  const PORTRAIT_CARD_BG = 'https://raw.githubusercontent.com/fortnoxants2-afk/elements/main/Figma/main/card_main_03_100px.webp';

  const FEEDBACK_CARD_BG = 'https://fortnoxants2-afk.github.io/elements/Figma/main/card_main_04.webp';
  const GAME_PLASHKA_URL = 'https://fortnoxants2-afk.github.io/elements/Figma/icon/game_plashka_01.webp';
  const ALMS_GIF = 'https://fortnoxants2-afk.github.io/elements/Figma/anim_gif/alms.gif';
  const VOPROS_PART = 'https://fortnoxants2-afk.github.io/elements/Figma/pictures_cards/foto/vopros2.webp';
  const LUPA_PART = 'https://fortnoxants2-afk.github.io/elements/Figma/pictures_cards/foto/lupa2.webp';
  
  const BTN_STATE_01 = 'https://fortnoxants2-afk.github.io/elements/Figma/icon/icon_button_01.webp'; 
  const BTN_STATE_02 = 'https://fortnoxants2-afk.github.io/elements/Figma/icon/icon_button_02.webp'; 
  const BTN_STATE_03 = 'https://fortnoxants2-afk.github.io/elements/Figma/icon/icon_button_03.webp'; 
  const OPTION_FRAME = 'https://fortnoxants2-afk.github.io/elements/Figma/icon/icon_plashka_02.svg';
  const OPTION_DEFAULT_HIGHLIGHT = 'https://fortnoxants2-afk.github.io/elements/Figma/icon/icon_plashka_04_low2.webp';
  const OPTION_USER_HIGHLIGHT = 'https://fortnoxants2-afk.github.io/elements/Figma/icon/icon_plashka_04_low.webp';

  const isWebp = question.imageUrl.toLowerCase().endsWith('.webp');
  const isTallDrawing = 
    question.imageUrl.includes('01_prazd.webp') || 
    question.imageUrl.includes('01_yazik.webp') || 
    question.imageUrl.includes('02_yazik.webp') || 
    question.imageUrl.includes('03_yazik.webp');

  const isPortraitStyle = useMemo(() => 
    categoryId === 'znamenitosti' || 
    categoryId === 'skulptury' || 
    isTallDrawing || 
    question.id === 224 ||
    question.id === 231, 
  [categoryId, isTallDrawing, question.id]);

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [userDidSelect, setUserDidSelect] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isButtonPressed, setIsButtonPressed] = useState(false);
  const [imgStatus, setImgStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [isSquareImg, setIsSquareImg] = useState(!isPortraitStyle);
  const [isIconPulsing, setIsIconPulsing] = useState(false);
  const speechAudioRef = useRef<HTMLAudioElement | null>(null);
  const pulseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stopAudio = () => {
    if (pulseTimerRef.current) {
      clearTimeout(pulseTimerRef.current);
      pulseTimerRef.current = null;
    }
    if (speechAudioRef.current) {
      speechAudioRef.current.pause();
      speechAudioRef.current.currentTime = 0;
      speechAudioRef.current = null;
    }
    setIsIconPulsing(false);
  };

  const playAudioUrl = (url?: string) => {
    if (!url) return;
    stopAudio();
    const audio = new Audio(url);
    speechAudioRef.current = audio;
    setIsIconPulsing(true);

    const schedulePulseStop = () => {
      if (pulseTimerRef.current) {
        clearTimeout(pulseTimerRef.current);
        pulseTimerRef.current = null;
      }
      if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
        // Завершаем увеличение-уменьшение иконки на 0.5 сек раньше окончания речи
        const remainingTimeSec = audio.duration > 0.6 
          ? (audio.duration - 0.5 - audio.currentTime) 
          : Math.max(0.1, audio.duration * 0.4);
        const remainingMs = Math.max(50, remainingTimeSec * 1000);
        pulseTimerRef.current = setTimeout(() => {
          setIsIconPulsing(false);
        }, remainingMs);
      }
    };

    audio.onloadedmetadata = () => {
      schedulePulseStop();
    };

    audio.oncanplay = () => {
      if (!pulseTimerRef.current) {
        schedulePulseStop();
      }
    };

    audio.onplay = () => {
      schedulePulseStop();
    };

    audio.ontimeupdate = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        if (!pulseTimerRef.current && audio.currentTime < audio.duration - 0.5) {
          schedulePulseStop();
        }
        if (audio.duration > 0.6 && audio.currentTime >= audio.duration - 0.5) {
          setIsIconPulsing(false);
        }
      }
    };

    audio.onended = () => {
      if (pulseTimerRef.current) {
        clearTimeout(pulseTimerRef.current);
        pulseTimerRef.current = null;
      }
      setIsIconPulsing(false);
    };

    audio.onerror = () => {
      if (pulseTimerRef.current) {
        clearTimeout(pulseTimerRef.current);
        pulseTimerRef.current = null;
      }
      setIsIconPulsing(false);
    };

    audio.play().catch(() => {
      setIsIconPulsing(false);
    });
  };

  useEffect(() => {
    return () => {
      if (pulseTimerRef.current) {
        clearTimeout(pulseTimerRef.current);
        pulseTimerRef.current = null;
      }
      if (speechAudioRef.current) {
        speechAudioRef.current.pause();
        speechAudioRef.current = null;
      }
    };
  }, []);

  const shuffledData = useMemo(() => {
    const originalKeys: Array<'a' | 'b' | 'c' | 'd'> = ['a', 'b', 'c', 'd'];
    const originalOptions = Object.values(question.options);
    const correctText = question.options[question.correctAnswer];
    
    // Извлекаем чистый текст (удаляем префикс "X) ")
    const pureTexts = originalOptions.map((text) => text.replace(/^[А-Я]\)\s*/, ''));
    
    // Перемешиваем чистые тексты
    const shuffledPure = shuffleArray(pureTexts);
    
    // Прикрепляем префиксы заново в правильном порядке
    const prefixes = ["А) ", "Б) ", "В) ", "Г) "];
    const newOptions: Record<string, string> = {};
    const newAudios: Record<string, string | undefined> = {};
    let newCorrectKey = 'a';
    
    const keys = ['a', 'b', 'c', 'd'];
    shuffledPure.forEach((text, index) => {
      const key = keys[index];
      const fullText = prefixes[index] + text;
      newOptions[key] = fullText;
      
      const origKey = originalKeys.find(
        (k) => question.options[k].replace(/^[А-Я]\)\s*/, '') === text
      );
      if (origKey && question.audioUrls?.[origKey]) {
        newAudios[key] = question.audioUrls[origKey];
      } else if (WORD_AUDIO_MAP[text.toLowerCase().trim()]) {
        newAudios[key] = WORD_AUDIO_MAP[text.toLowerCase().trim()];
      }
      
      // Проверяем, является ли этот вариант правильным
      if (text === correctText.replace(/^[А-Я]\)\s*/, '')) {
        newCorrectKey = key;
      }
    });
    
    return { options: newOptions, correctKey: newCorrectKey, audios: newAudios };
  }, [question.options, question.correctAnswer, question.audioUrls]);

  const getImageUrl = () => {
    const imgPath = question.imageUrl.trim();
    if (imgPath.startsWith('http')) return imgPath;
    
    let base = imageBaseUrl?.trim() || 'https://raw.githubusercontent.com/fortnoxants2-afk/elements/main/Figma/pictures_cards/kategoriya/';
    if (!base.endsWith('/')) base += '/';
    
    let path = imgPath;
    if (path.startsWith('/')) path = path.substring(1);
    
    // Формируем полную ссылку и заменяем пробелы на %20 для корректной работы в браузерах
    const fullUrl = `${base}${path}`.replace(/ /g, '%20');
    return fullUrl;
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const ratio = img.naturalWidth / img.naturalHeight;
    setIsSquareImg(ratio > 0.85 && ratio < 1.15 || question.id === 701 || question.id === 703 || question.id === 704);
    setImgStatus('loaded');
  };

  const checkAnswer = () => {
    if (!selectedOption || showFeedback) return;
    stopAudio();
    const correct = selectedOption === shuffledData.correctKey;
    setIsCorrect(correct);
    setShowFeedback(true);
    
    if (correct) {
      audioService.playCorrectSequence();
    } else {
      audioService.playEffect('no');
    }
  };

  const isDistrictShield = categoryId === 'rayony' && question.id <= 220;
  const isWindowMode = !isDistrictShield;
  const shouldLayerUnderCard = isWindowMode;

  const activeCardBg = useMemo(() => {
    if (!isWindowMode) return STANDARD_CARD_BG;
    
    // If image is loaded, use detected ratio
    if (imgStatus === 'loaded') {
      return isSquareImg ? SQUARE_CARD_BG : PORTRAIT_CARD_BG;
    }
    
    // While loading, use the category/style hint
    return isPortraitStyle ? PORTRAIT_CARD_BG : SQUARE_CARD_BG;
  }, [isWindowMode, imgStatus, isSquareImg, isPortraitStyle, STANDARD_CARD_BG, SQUARE_CARD_BG, PORTRAIT_CARD_BG]);

  const shouldDisableMask = (categoryId === 'rayony' || categoryId === 'prazdniki' || categoryId === 'promisel' || categoryId === 'skulptury' || categoryId === 'yazik') && isWebp;

  const containerWidthClass = useMemo(() => {
    const isChuvashEmblem = question.imageUrl.includes('26_gerb_chuvashiya.webp');
    const isCheboksaryEmblem = question.imageUrl.includes('22_gerb_cheboksar.webp');
    let width = isWindowMode ? 'w-[82%] mt-[-3%]' : 'w-[76%]';
    if ((isSquareImg && imgStatus === 'loaded') || question.id === 701 || question.id === 702 || question.id === 703 || question.id === 704 || question.id === 705 || question.id === 706 || question.id === 707 || question.id === 708 || question.id === 709 || question.id === 710 || question.id === 711 || question.id === 712 || question.id === 713 || question.id === 315 || question.id === 318 || question.id === 319 || question.id === 320 || question.id === 321 || question.id === 322 || question.id === 323 || question.id === 324 || question.id === 325 || question.id === 326 || question.id === 327 || question.id === 328 || question.id === 329 || question.id === 330 || question.id === 331 || question.id === 332 || question.id === 333 || question.id === 334 || question.id === 335 || question.id === 336 || question.id === 337 || question.id === 338 || question.id === 339 || question.id === 340) {
      width = 'w-[84%] mt-[-2.5%]'; 
    } else if (isWebp) {
      if (isChuvashEmblem || isCheboksaryEmblem) {
        width = isWindowMode ? 'w-[84%] mt-[-2.5%]' : 'w-[84%]';
      } else if (isTallDrawing) {
        const extraLift = 'mt-[-4%]';
        width = isWindowMode ? `w-[78%] ${extraLift}` : 'w-[52%]';
      }
    }
    return width;
  }, [isWindowMode, isSquareImg, imgStatus, isWebp, isTallDrawing, question.imageUrl, question.id]);

  const textLength = question.text.length;
  const fontSizeClass = useMemo(() => {
    if (textLength > 120) return 'text-[1.85vh]';
    if (textLength > 90) return 'text-[2.05vh]';
    if (textLength > 65) return 'text-[2.25vh]';
    return 'text-[2.45vh]';
  }, [textLength]);

  return (
    <div className="flex flex-col h-full overflow-hidden relative">
      <div 
        className="absolute flex items-center justify-between z-40"
        style={{ top: '3.177%', left: '8.8%', width: '82.4%', height: '5.729%' }}
      >
        <button onClick={onNavigateToSettings} className="h-full aspect-square active:scale-90 transition-transform flex items-center justify-center">
          <img src={ICON_SETTINGS} alt="Settings" referrerPolicy="no-referrer" className="w-full h-full object-contain" />
        </button>
        <div className="flex-1 h-full mx-[4%] relative flex items-center justify-center">
          <div className="relative h-full flex items-center justify-center">
            <img src={PLASHKA_URL} alt="Plate" referrerPolicy="no-referrer" className="h-full w-auto object-contain" />
            <span className="absolute inset-0 flex items-center justify-center text-[#5d3a24] font-black text-[1.8vh] tracking-tight text-center px-4 leading-[1.1]">
              {categoryName}
            </span>
          </div>
        </div>
        <button onClick={onOpenCategoryMenu} className="h-full aspect-square active:scale-90 transition-transform flex items-center justify-center">
          <img src={ICON_MENU} alt="Menu" referrerPolicy="no-referrer" className="w-full h-full object-contain" />
        </button>
      </div>

      <div className="absolute z-10 flex flex-col items-center" style={{ 
        width: '82.4%', 
        aspectRatio: isStretchedScreen ? '1008 / 1850' : '1008 / 1766', 
        left: '8.8%', 
        bottom: '8%' 
      }}>
        {/* 1. Фоновое изображение карточки (Рамка) - Средний слой */}
        <img 
          src={activeCardBg} 
          referrerPolicy="no-referrer" 
          className={`absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-[0_5px_6px_rgba(0,0,0,0.3)] ${shouldLayerUnderCard ? 'z-30' : 'z-20'}`} 
          alt="Card BG" 
        />
        
        {/* 2. Контейнер для фотографии - Слой зависит от типа карточки */}
        <div className={`absolute inset-0 w-full h-full flex flex-col items-center px-[10%] pb-[22%] pointer-events-none ${shouldLayerUnderCard ? 'z-20' : 'z-30'}`}>
          <div style={{ height: (question.id === 301 || question.id === 338) ? '8%' : '6%' }} className="w-full flex-shrink-0" />
          <div className={`${containerWidthClass} ${isSquareImg ? 'aspect-square' : 'aspect-[3.4/4.3]'} relative flex-shrink-0 flex items-center justify-center ${question.id === 331 ? 'scale-[0.95]' : (question.id === 307 ? 'scale-[0.93]' : (question.id === 340 ? 'scale-[0.98]' : 'transform-none'))} transition-none ${shouldDisableMask || shouldLayerUnderCard ? '' : `rounded-[20px] overflow-hidden ${question.id === 701 ? 'bg-white' : 'bg-[#f3f4f6]'} shadow-inner`}`}>
             {imgStatus === 'loading' && (
               <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-8 h-8 border-4 border-[#5d3a24]/20 border-t-[#5d3a24] rounded-full animate-spin"></div>
               </div>
             )}
             <img src={getImageUrl()} alt="Question" 
               referrerPolicy="no-referrer"
               className={`w-full h-full transform-none transition-none ${shouldDisableMask || shouldLayerUnderCard ? 'object-contain' : 'object-cover'} ${imgStatus === 'loaded' ? 'opacity-100' : 'opacity-0'}`}
               onLoad={handleImageLoad}
               onError={() => setImgStatus('error')}
             />
             {imgStatus === 'error' && (
               <div className="absolute inset-0 flex items-center justify-center text-[#5d3a24]/40 text-[1.5vh] font-bold text-center px-4">
                 Ошибка загрузки фото
               </div>
             )}
          </div>
        </div>

        {/* 3. Текст вопроса и варианты ответов - Верхний слой */}
        <div className="relative w-full h-full flex flex-col items-center px-[10%] pb-[22%] z-40">
          {/* Пустое место для фотографии (чтобы текст не накладывался) */}
          <div style={{ height: (question.id === 301 || question.id === 338) ? '8%' : '6%' }} className="w-full flex-shrink-0" />
          <div className={`${containerWidthClass} ${isSquareImg ? 'aspect-square' : 'aspect-[3.4/4.3]'} relative flex-shrink-0`} />

          <div className="flex-1 w-full flex flex-col justify-center items-center text-center relative px-2 transform-none transition-none">
            <h2 className={`w-full text-[#0a0a0a] font-bold leading-[1.15] tracking-tight whitespace-pre-line transform-none transition-none ${fontSizeClass}`}>
              {question.text}
            </h2>
          </div>

          <div className="w-full space-y-[0.4vh] flex-shrink-0 relative transform-none transition-none">
            {['a', 'b', 'c', 'd'].map((key) => {
              const text = shuffledData.options[key];
              const isSelected = selectedOption === key;
              const isDefaultA = !userDidSelect && key === 'a';
              const isOptionActive = isSelected || isDefaultA;
              const highlightImg = isDefaultA ? OPTION_DEFAULT_HIGHLIGHT : OPTION_USER_HIGHLIGHT;
              const audioUrl = shuffledData.audios[key];

              return (
                <div
                  key={key}
                  role="button"
                  tabIndex={showFeedback ? -1 : 0}
                  onClick={() => {
                    if (showFeedback) return;
                    setSelectedOption(key);
                    setUserDidSelect(true);
                    stopAudio();
                  }}
                  onKeyDown={(e) => {
                    if (showFeedback) return;
                    if (e.key === 'Enter' || e.key === ' ') {
                      setSelectedOption(key);
                      setUserDidSelect(true);
                      stopAudio();
                    }
                  }}
                  className={`relative w-full aspect-[600/72] flex items-center outline-none cursor-pointer ${showFeedback ? 'pointer-events-none' : ''}`}
                >
                  <img src={OPTION_FRAME} referrerPolicy="no-referrer" className="absolute inset-0 w-full h-full object-contain pointer-events-none opacity-80" alt="Frame" />
                  {isOptionActive && (
                    <img src={highlightImg} referrerPolicy="no-referrer" className="absolute inset-0 w-full h-full object-contain pointer-events-none animate-in fade-in zoom-in-95 duration-200 scale-[1.3] transform-gpu" alt="Selected" />
                  )}
                  <span className={`relative z-10 w-full pl-[4.8vh] ${audioUrl ? 'pr-[5.5vh]' : (text.length > 25 ? 'pr-[2vh]' : 'pr-[4.8vh]')} ${text.length > 25 ? 'text-[1.8vh]' : 'text-[2.1vh]'} text-left font-bold text-black/80 leading-[1.2] select-none transition-colors duration-200 whitespace-nowrap overflow-hidden`}>
                    {text}
                  </span>

                  {/* Иконка воспроизведения звука на плашке выбранного ответа */}
                  {isOptionActive && audioUrl && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        playAudioUrl(audioUrl);
                      }}
                      className="absolute right-[-2.5%] top-1/2 -translate-y-1/2 h-[135%] aspect-square z-30 flex items-center justify-center outline-none focus:outline-none select-none cursor-pointer pointer-events-auto"
                      title="Прослушать произношение"
                      aria-label="Прослушать произношение"
                    >
                      <img
                        src={ICON_SOUND}
                        alt="Звук"
                        referrerPolicy="no-referrer"
                        className={`w-full h-full object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] transition-transform duration-200 select-none ${
                          isIconPulsing ? 'animate-sound-pulse' : 'hover:scale-105 active:scale-95'
                        }`}
                      />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="absolute bottom-[2%] left-0 w-full h-[15%] flex items-end justify-center pointer-events-none z-[60]">
        <div className="relative h-full flex items-center justify-center pointer-events-auto" style={{ width: '93.333%' }}>
          <img src={GAME_PLASHKA_URL} referrerPolicy="no-referrer" className="absolute inset-0 w-full h-full object-contain object-bottom drop-shadow-[0_5px_6px_rgba(0,0,0,0.3)]" alt="Tray BG" />
          <div className="relative w-full h-full flex items-center">
            <div style={{ width: '30%' }} className="h-full flex items-center justify-end">
              <button onClick={onBack} className="w-[49%] aspect-square rounded-full mb-[-3%] transition-all active:scale-95 translate-x-[34%]"></button>
            </div>
            <div style={{ width: '40%' }} className="h-full flex items-center justify-center">
              <button onMouseDown={() => selectedOption && !showFeedback && setIsButtonPressed(true)} onMouseUp={() => setIsButtonPressed(false)} onMouseLeave={() => setIsButtonPressed(false)}
                onClick={checkAnswer} disabled={!selectedOption || showFeedback} style={{ width: '65%' }} className="aspect-square flex items-center justify-center transition-all">
                <img src={!selectedOption ? BTN_STATE_01 : (isButtonPressed ? BTN_STATE_03 : BTN_STATE_02)} referrerPolicy="no-referrer" className="w-full h-full object-contain" alt="Confirm" />
              </button>
            </div>
            <div style={{ width: '30%' }} className="h-full flex items-center justify-start">
              <button onClick={onNavigateToDice} disabled={!diceEnabled} className={`w-[49%] aspect-square rounded-full transition-all mb-[-3%] -translate-x-[34%] ${diceEnabled ? 'active:scale-95' : 'opacity-0'}`}></button>
            </div>
          </div>
        </div>
      </div>

      {showFeedback && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div onClick={onAdvance} className="relative w-[82.4%] aspect-[1008/1766] flex flex-col items-center cursor-pointer select-none transform-gpu animate-in zoom-in-95 duration-300"
            style={{ aspectRatio: isStretchedScreen ? '1008 / 1850' : '1008 / 1766' }}
          >
            <img src={FEEDBACK_CARD_BG} referrerPolicy="no-referrer" className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-2xl" alt="Feedback BG" />
            <div className="relative z-10 w-full h-full flex flex-col items-center px-[10%] pb-[22%] pt-[20%] pointer-events-none">
              <h1 className={`text-[#5d3a24] font-black text-[3.5vh] mb-[3%] tracking-tight uppercase ${isCorrect ? 'mt-[23%]' : 'mt-[20%]'}`}>
                {isCorrect ? 'ОТЛИЧНО' : 'НЕВЕРНО'}
              </h1>
              <div className={`flex-1 w-full flex flex-col items-center justify-center ${isCorrect ? '-mt-[27%]' : '-mt-[35%]'}`}>
                <div className={`w-[65%] aspect-square flex items-center justify-center mb-[2vh] ${isCorrect ? 'mt-[3%]' : 'mt-[6%]'}`}>
                  {isCorrect ? <img src={ALMS_GIF} alt="Correct" referrerPolicy="no-referrer" className="w-full h-full object-contain" /> : (
                    <div className="relative w-full h-full flex items-center justify-center">
                      <img src={VOPROS_PART} referrerPolicy="no-referrer" className="absolute w-[60%] h-[60%] object-contain opacity-90" alt="Question Base" />
                      <img src={LUPA_PART} referrerPolicy="no-referrer" className="absolute inset-0 w-full h-full object-contain animate-searching z-10" alt="Searching Lupa" />
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-center text-center w-full mt-[5%]">
                  <p className="text-[#613F26] font-black text-[2.8vh] uppercase tracking-tight leading-[1.2] px-4 whitespace-pre-line">
                    {isCorrect ? 'ПОЛУЧИТЕ\nНАГРАДУ' : 'ПОПРОБУЙТЕ В\nСЛЕДУЮЩИЙ РАЗ'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
