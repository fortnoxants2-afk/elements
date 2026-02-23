
import { Question } from "../types";

export const filterQuestionsByCategory = (questions: Question[], category: string): Question[] => {
  return questions.filter(q => q.category === category);
};

export const shuffleArray = <T extends unknown>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};
