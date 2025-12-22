export interface UserProfile {
  name: string;
  incomeRange: string;
  monthlyExpenses: string;
  dependents: number;
  loanStatus: string;
  financialGoals: string[];
  location: string;
  language: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  type: 'short-term' | 'long-term';
  category: 'savings' | 'investment' | 'debt' | 'emergency';
  icon: string;
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense' | 'investment';
  amount: number;
  category: string;
  date: string;
  description: string;
}

export interface Simulation {
  id: string;
  type: 'sip' | 'rd' | 'fd' | 'loan';
  amount: number;
  duration: number;
  interestRate: number;
  result: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  points: number;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
}

export interface UserPoints {
  total: number;
  level: number;
  nextLevelPoints: number;
  history: {
    id: string;
    action: string;
    points: number;
    timestamp: Date;
  }[];
}
