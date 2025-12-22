import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProgressRing } from '@/components/common/ProgressRing';
import { BottomNavigation } from '@/components/layout/BottomNavigation';
import { useApp } from '@/contexts/AppContext';
import { 
  ArrowLeft, 
  Plus,
  ChevronRight,
  Calendar,
  TrendingUp,
  Edit2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Goal } from '@/types/finpal';

const Goals = () => {
  const navigate = useNavigate();
  const { goals, setGoals, userProfile, addPoints, unlockAchievement } = useApp();
  const [activeTab, setActiveTab] = useState<'all' | 'short-term' | 'long-term'>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredGoals = goals.filter((goal) => {
    if (activeTab === 'all') return true;
    return goal.type === activeTab;
  });

  const totalProgress = goals.length > 0
    ? Math.round(goals.reduce((acc, g) => acc + (g.currentAmount / g.targetAmount) * 100, 0) / goals.length)
    : 0;

  const handleUpdateGoal = (goalId: string, amount: number) => {
    setGoals(
      goals.map((g) =>
        g.id === goalId
          ? { ...g, currentAmount: Math.min(g.currentAmount + amount, g.targetAmount) }
          : g
      )
    );
    addPoints(10, 'Updated goal progress');
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="px-5 pt-4 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon-sm" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-foreground">Your Goals</h1>
              <p className="text-sm text-muted-foreground">Track your financial journey</p>
            </div>
          </div>
          <Button variant="gradient" size="icon" onClick={() => setShowAddModal(true)}>
            <Plus className="w-5 h-5" />
          </Button>
        </div>

        {/* Progress Overview */}
        <Card variant="gradient" className="mb-4">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-primary-foreground/80 mb-1">Overall Progress</p>
                <p className="text-2xl font-bold text-primary-foreground">{totalProgress}% Complete</p>
                <p className="text-xs text-primary-foreground/60 mt-1">
                  {goals.length} active goals
                </p>
              </div>
              <ProgressRing progress={totalProgress} size={80} strokeWidth={8}>
                <TrendingUp className="w-6 h-6 text-primary-foreground" />
              </ProgressRing>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <div className="flex gap-2">
          {(['all', 'short-term', 'long-term'] as const).map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? 'default' : 'muted'}
              size="sm"
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'all' ? 'All' : tab === 'short-term' ? 'Short-term' : 'Long-term'}
            </Button>
          ))}
        </div>
      </div>

      {/* Goals List */}
      <div className="px-5 space-y-4">
        {filteredGoals.map((goal) => (
          <GoalCard 
            key={goal.id} 
            goal={goal} 
            onUpdate={(amount) => handleUpdateGoal(goal.id, amount)}
          />
        ))}

        {filteredGoals.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No goals in this category</p>
            <Button variant="outline" className="mt-4" onClick={() => setShowAddModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add a Goal
            </Button>
          </div>
        )}

        {/* Suggested Goals */}
        {userProfile && (
          <Card variant="outline" className="mt-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Suggested for You
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {getSuggestedGoals(userProfile).map((suggestion, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 rounded-xl bg-muted/50 cursor-pointer hover:bg-muted transition-colors"
                  onClick={() => {
                    // Add suggested goal
                    const newGoal: Goal = {
                      id: Date.now().toString(),
                      ...suggestion,
                      currentAmount: 0,
                      deadline: new Date(Date.now() + suggestion.months * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    };
                    setGoals([...goals, newGoal]);
                    addPoints(30, 'Added a new goal');
                    unlockAchievement('2');
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{suggestion.icon}</span>
                    <div>
                      <p className="font-medium text-foreground">{suggestion.title}</p>
                      <p className="text-xs text-muted-foreground">{suggestion.description}</p>
                    </div>
                  </div>
                  <Plus className="w-5 h-5 text-primary" />
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};

const GoalCard = ({ 
  goal, 
  onUpdate 
}: { 
  goal: Goal; 
  onUpdate: (amount: number) => void;
}) => {
  const progress = (goal.currentAmount / goal.targetAmount) * 100;
  const remaining = goal.targetAmount - goal.currentAmount;
  const daysLeft = Math.max(0, Math.ceil((new Date(goal.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

  const categoryColors = {
    savings: 'bg-primary-light text-primary',
    investment: 'bg-success-light text-success',
    debt: 'bg-destructive/10 text-destructive',
    emergency: 'bg-warning-light text-warning',
  };

  return (
    <Card variant="elevated" className="overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{goal.icon}</div>
            <div>
              <h3 className="font-bold text-foreground">{goal.title}</h3>
              <p className="text-xs text-muted-foreground">{goal.description}</p>
            </div>
          </div>
          <span className={cn(
            'px-2 py-1 rounded-full text-xs font-medium',
            categoryColors[goal.category]
          )}>
            {goal.type === 'short-term' ? 'Short' : 'Long'}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">
              ₹{goal.currentAmount.toLocaleString('en-IN')}
            </span>
            <span className="font-medium text-foreground">
              ₹{goal.targetAmount.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-primary rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{daysLeft} days left</span>
          </div>
          <span className="font-medium text-primary">
            ₹{(remaining / 1000).toFixed(0)}K to go
          </span>
        </div>

        {/* Quick Add */}
        <div className="flex gap-2 mt-4">
          {[1000, 5000, 10000].map((amount) => (
            <Button
              key={amount}
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => onUpdate(amount)}
            >
              +₹{amount >= 1000 ? `${amount / 1000}K` : amount}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

function getSuggestedGoals(userProfile: any) {
  const suggestions = [];

  if (!userProfile.financialGoals?.includes('Emergency Fund')) {
    suggestions.push({
      title: 'Emergency Fund',
      description: 'Save 3-6 months of expenses',
      targetAmount: 100000,
      type: 'short-term' as const,
      category: 'emergency' as const,
      icon: '🛡️',
      months: 12,
    });
  }

  if (userProfile.financialGoals?.includes('Retirement')) {
    suggestions.push({
      title: 'Retirement Corpus',
      description: 'Start building long-term wealth',
      targetAmount: 5000000,
      type: 'long-term' as const,
      category: 'investment' as const,
      icon: '🏖️',
      months: 240,
    });
  }

  suggestions.push({
    title: 'Learning Fund',
    description: 'Invest in your skills',
    targetAmount: 25000,
    type: 'short-term' as const,
    category: 'savings' as const,
    icon: '📚',
    months: 6,
  });

  return suggestions.slice(0, 3);
}

export default Goals;
