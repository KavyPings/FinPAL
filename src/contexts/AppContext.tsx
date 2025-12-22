import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserProfile, Goal, ChatMessage, UserPoints, Achievement } from '@/types/finpal';

interface AppContextType {
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile) => void;
  isOnboarded: boolean;
  setIsOnboarded: (value: boolean) => void;
  goals: Goal[];
  setGoals: (goals: Goal[]) => void;
  chatHistory: ChatMessage[];
  addChatMessage: (message: ChatMessage) => void;
  points: UserPoints;
  addPoints: (amount: number, action: string) => void;
  achievements: Achievement[];
  unlockAchievement: (id: string) => void;
  currentLanguage: string;
  setCurrentLanguage: (lang: string) => void;
}

const defaultPoints: UserPoints = {
  total: 0,
  level: 1,
  nextLevelPoints: 100,
  history: [],
};

const defaultAchievements: Achievement[] = [
  { id: '1', title: 'First Steps', description: 'Complete your profile', points: 50, icon: '🎯', unlocked: false },
  { id: '2', title: 'Goal Setter', description: 'Set your first financial goal', points: 30, icon: '🏆', unlocked: false },
  { id: '3', title: 'Curious Mind', description: 'Ask 5 questions to FinPal', points: 40, icon: '💡', unlocked: false },
  { id: '4', title: 'Simulator Pro', description: 'Run 3 simulations', points: 50, icon: '📊', unlocked: false },
  { id: '5', title: 'Decision Maker', description: 'Analyze 3 financial decisions', points: 60, icon: '⚖️', unlocked: false },
  { id: '6', title: 'Weekly Warrior', description: 'Use FinPal for 7 days', points: 100, icon: '🔥', unlocked: false },
];

const defaultGoals: Goal[] = [
  {
    id: '1',
    title: 'Emergency Fund',
    description: 'Build 3 months of expenses',
    targetAmount: 90000,
    currentAmount: 25000,
    deadline: '2025-12-31',
    type: 'short-term',
    category: 'emergency',
    icon: '🛡️',
  },
  {
    id: '2',
    title: 'Vacation Fund',
    description: 'Save for annual family vacation',
    targetAmount: 50000,
    currentAmount: 12000,
    deadline: '2025-06-30',
    type: 'short-term',
    category: 'savings',
    icon: '✈️',
  },
  {
    id: '3',
    title: 'Retirement Corpus',
    description: 'Build long-term wealth',
    targetAmount: 10000000,
    currentAmount: 350000,
    deadline: '2045-12-31',
    type: 'long-term',
    category: 'investment',
    icon: '🏖️',
  },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [goals, setGoals] = useState<Goal[]>(defaultGoals);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [points, setPoints] = useState<UserPoints>(defaultPoints);
  const [achievements, setAchievements] = useState<Achievement[]>(defaultAchievements);
  const [currentLanguage, setCurrentLanguage] = useState('en');

  const addChatMessage = (message: ChatMessage) => {
    setChatHistory((prev) => [...prev, message]);
  };

  const addPoints = (amount: number, action: string) => {
    setPoints((prev) => {
      const newTotal = prev.total + amount;
      const newLevel = Math.floor(newTotal / 100) + 1;
      return {
        ...prev,
        total: newTotal,
        level: newLevel,
        nextLevelPoints: newLevel * 100,
        history: [
          { id: Date.now().toString(), action, points: amount, timestamp: new Date() },
          ...prev.history,
        ],
      };
    });
  };

  const unlockAchievement = (id: string) => {
    setAchievements((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, unlocked: true, unlockedAt: new Date() } : a
      )
    );
  };

  return (
    <AppContext.Provider
      value={{
        userProfile,
        setUserProfile,
        isOnboarded,
        setIsOnboarded,
        goals,
        setGoals,
        chatHistory,
        addChatMessage,
        points,
        addPoints,
        achievements,
        unlockAchievement,
        currentLanguage,
        setCurrentLanguage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
