
const BASE_URL = 'https://raw.githubusercontent.com/fortnoxants2-afk/Chuvash/main/Figma/sounds/';

class AudioService {
  private music: HTMLAudioElement | null = null;
  private sounds: Record<string, HTMLAudioElement> = {};
  private musicEnabled: boolean = true;
  private soundEnabled: boolean = true;

  constructor() {
    if (typeof window !== 'undefined') {
      // Инициализируем фоновую музыку
      this.music = new Audio(`${BASE_URL}bg.webm`);
      this.music.loop = true;
      this.music.volume = 0.4;

      // Предзагрузка эффектов
      const effects = ['dice', 'yes', 'no'];
      effects.forEach(name => {
        this.sounds[name] = new Audio(`${BASE_URL}${name}.webm`);
      });
    }
  }

  setMusicEnabled(enabled: boolean) {
    this.musicEnabled = enabled;
    if (!enabled) {
      this.music?.pause();
    } else if (this.music?.paused && this.musicEnabled) {
      this.music.play().catch(() => {
        console.log("Music play blocked by browser policy, waiting for interaction");
      });
    }
  }

  setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
  }

  playMusic() {
    if (this.musicEnabled && this.music?.paused) {
      this.music.play().catch(() => {});
    }
  }

  playEffect(name: 'dice' | 'yes' | 'no') {
    if (this.soundEnabled && this.sounds[name]) {
      const sound = this.sounds[name];
      sound.currentTime = 0;
      sound.play().catch(() => {});
    }
  }
}

export const audioService = new AudioService();
