export interface QuestionOption {
  id: string; // 'A' | 'B' | 'C' | 'D'
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export interface Question {
  id: string;
  unitId: number;
  topicId: string; // e.g., '1.4'
  questionText: string;
  options: QuestionOption[];
}

export interface UnitBadge {
  unitId: number;
  title: string;
  icon: string;
  description: string;
}
