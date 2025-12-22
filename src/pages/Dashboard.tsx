import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProgressRing } from '@/components/common/ProgressRing';
import { BottomNavigation } from '@/components/layout/BottomNavigation';
import { useApp } from '@/contexts/AppContext';
import { 
  TrendingUp, 
  Target, 
  Calculator, 
  MessageCircle, 
  ChevronRight, 
  Sparkles,
  Award,
  Bell,
  Globe
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Dashboard = () => {
  const navigate = useNavigate();
  const { userProfile, goals, points } = useApp();
  
  const shortTermGoals = goals.filter(g => g.type === 'short-term');
  const longTermGoals = goals.filter(g => g.type === 'long-term');
  
  const overallProgress = goals.length > 0 
    ? Math.round(goals.reduce((acc, g) => acc + (g.currentAmount / g.targetAmount) * 100, 0) / goals.length)
    : 0;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-gradient-hero px-5 pt-4 pb-8 rounded-b-[2rem]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary-foreground/70" />
            <span className="text-sm text-primary-foreground/70">EN</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center">
              <Bell className="w-5 h-5 text-primary-foreground" />
            </button>
            <button 
              onClick={() => navigate('/rewards')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground"
            >
              <Award className="w-4 h-4" />
              <span className="text-sm font-bold">{points.total}</span>
            </button>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-primary-foreground/70 text-sm mb-1">Good morning,</p>
          <h1 className="text-2xl font-bold text-primary-foreground">
            {userProfile?.name || 'Friend'} 👋
          </h1>
        </div>

        {/* Financial Context Card */}
        <Card className="bg-primary-foreground/10 backdrop-blur-sm border-0 text-primary-foreground">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80 mb-1">Your Financial Health</p>
                <p className="text-xl font-bold">Looking Good!</p>
                <p className="text-xs opacity-70 mt-1">
                  {userProfile?.incomeRange} • {userProfile?.location}
                </p>
              </div>
              <ProgressRing progress={overallProgress} size={70} strokeWidth={6}>
                <span className="text-xs font-bold text-primary-foreground">{overallProgress}%</span>
              </ProgressRing>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="px-5 -mt-4">
        <div className="grid grid-cols-4 gap-3 mb-6">
          <QuickAction 
            icon={<Calculator className="w-5 h-5" />}
            label="Simulate"
            onClick={() => navigate('/simulations')}
          />
          <QuickAction 
            icon={<TrendingUp className="w-5 h-5" />}
            label="Decisions"
            onClick={() => navigate('/decisions')}
          />
          <QuickAction 
            icon={<MessageCircle className="w-5 h-5" />}
            label="Ask FinPal"
            onClick={() => navigate('/chat')}
          />
          <QuickAction 
            icon={<Sparkles className="w-5 h-5" />}
            label="Learn"
            onClick={() => navigate('/chat')}
            highlight
          />
        </div>

        {/* Goals Overview */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-foreground">Your Goals</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate('/goals')}>
              View All <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Short-term Goals */}
          <div className="mb-4">
            <p className="text-sm font-medium text-muted-foreground mb-3">Short-term</p>
            <div className="space-y-3">
              {shortTermGoals.slice(0, 2).map((goal) => (
                <GoalCard key={goal.id} goal={goal} />
              ))}
            </div>
          </div>

          {/* Long-term Goals */}
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-3">Long-term</p>
            <div className="space-y-3">
              {longTermGoals.slice(0, 1).map((goal) => (
                <GoalCard key={goal.id} goal={goal} />
              ))}
            </div>
          </div>
        </section>

        {/* Tip of the Day */}
        <Card variant="gradient" className="mb-6">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-foreground/20 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-bold text-primary-foreground mb-1">Tip of the Day</h3>
                <p className="text-sm text-primary-foreground/80">
                  Starting a SIP with just ₹500/month can grow to ₹12,000+ in 5 years at 12% returns. Small steps lead to big results!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Decision Prompt */}
        <Card 
          variant="outline" 
          className="cursor-pointer hover:border-primary transition-colors"
          onClick={() => navigate('/decisions')}
        >
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-secondary-light flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">Analyze a Decision</h3>
                  <p className="text-sm text-muted-foreground">Understand the impact before you act</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  );
};

const QuickAction = ({ 
  icon, 
  label, 
  onClick, 
  highlight = false 
}: { 
  icon: React.ReactNode; 
  label: string; 
  onClick: () => void;
  highlight?: boolean;
}) => (
  <button
    onClick={onClick}
    className={cn(
      'flex flex-col items-center gap-2 p-3 rounded-2xl transition-all duration-200 active:scale-95',
      highlight 
        ? 'bg-secondary text-secondary-foreground shadow-md' 
        : 'bg-card shadow-card hover:shadow-elevated'
    )}
  >
    {icon}
    <span className="text-xs font-medium">{label}</span>
  </button>
);

const GoalCard = ({ goal }: { goal: any }) => {
  const progress = (goal.currentAmount / goal.targetAmount) * 100;
  
  return (
    <Card variant="elevated" className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="text-2xl">{goal.icon}</div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-foreground truncate">{goal.title}</h4>
            <p className="text-xs text-muted-foreground">{goal.description}</p>
          </div>
          <ProgressRing progress={progress} size={50} strokeWidth={5}>
            <span className="text-[10px] font-bold">{Math.round(progress)}%</span>
          </ProgressRing>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs">
          <span className="text-muted-foreground">
            ₹{(goal.currentAmount / 1000).toFixed(0)}K / ₹{(goal.targetAmount / 1000).toFixed(0)}K
          </span>
          <span className="text-primary font-medium">
            ₹{((goal.targetAmount - goal.currentAmount) / 1000).toFixed(0)}K to go
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default Dashboard;
