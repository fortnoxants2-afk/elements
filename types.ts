
export interface RawDataStructure {
  c2array: boolean;
  size: number[];
  data: string[][][];
}

export interface Question {
  id: number;
  text: string;
  options: {
    a: string;
    b: string;
    c: string;
    d: string;
  };
  correctAnswer: 'a' | 'b' | 'c' | 'd';
  category: string;
  imageUrl: string;
}

export enum AppScreen {
  MENU = 'MENU',
  CATEGORIES = 'CATEGORIES',
  QUIZ = 'QUIZ',
  SETTINGS = 'SETTINGS',
  DICE = 'DICE'
}

export interface AppSettings {
  sound: boolean;
  music: boolean;
  diceEnabled: boolean;
  imageBaseUrl: string;
  activeCategories: string[];
}

export const CATEGORY_NAMES: Record<string, string> = {
  'rayony': 'Районы и города',
  'prazdniki': 'Праздники и обряды',
  'skulptury': 'Скульптура и зодчество',
  'znamenitosti': 'Знаменитости',
  'promisel': 'Народные промыслы',
  'yazik': 'Язык'
};

export const CATEGORY_ORDER = [
  'rayony',
  'prazdniki',
  'skulptury',
  'znamenitosti',
  'promisel',
  'yazik'
];
