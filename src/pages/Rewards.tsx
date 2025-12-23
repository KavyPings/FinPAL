import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProgressRing } from '@/components/common/ProgressRing';
import { BottomNavigation } from '@/components/layout/BottomNavigation';
import { useApp } from '@/contexts/AppContext';
import { 
  ArrowLeft, 
  Award,
  Gift,
  Star,
  Sparkles,
  Lock,
  Check,
  ChevronRight,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

const rewardTiers = [
  { level: 1, name: 'Beginner', pointsRequired: 0, color: 'bg-muted' },
  { level: 2, name: 'Explorer', pointsRequired: 100, color: 'bg-primary-light' },
  { level: 3, name: 'Achiever', pointsRequired: 250, color: 'bg-secondary-light' },
  { level: 4, name: 'Expert', pointsRequired: 500, color: 'bg-success-light' },
  { level: 5, name: 'Master', pointsRequired: 1000, color: 'bg-gradient-primary' },
];

const redeemableRewards = [
  { 
    id: '1', 
    title: 'Premium Insights', 
    description: 'Unlock advanced financial analysis', 
    points: 100, 
    icon: '📊',
    type: 'feature'
  },
  { 
    id: '2', 
    title: '10% Off Insurance', 
    description: 'Partner discount on term insurance', 
    points: 200, 
    icon: '🛡️',
    type: 'discount'
  },
  { 
    id: '3', 
    title: 'Free Consultation', 
    description: '30-min call with financial advisor', 
    points: 500, 
    icon: '👨‍💼',
    type: 'service'
  },
  { 
    id: '4', 
    title: 'MF Analysis Report', 
    description: 'Personalized portfolio analysis', 
    points: 300, 
    icon: '📈',
    type: 'feature'
  },
];

const Rewards = () => {
  const navigate = useNavigate();
  const { points, achievements, addPoints } = useApp();

  const currentTier = rewardTiers.reduce((acc, tier) => 
    points.total >= tier.pointsRequired ? tier : acc
  , rewardTiers[0]);

  const nextTier = rewardTiers.find(t => t.pointsRequired > points.total);
  const progressToNext = nextTier 
    ? ((points.total - currentTier.pointsRequired) / (nextTier.pointsRequired - currentTier.pointsRequired)) * 100
    : 100;

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="min-h-screen bg-background pb-24">
      
      <div className="bg-gradient-hero px-5 pt-4 pb-8 rounded-b-[2rem]">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon-sm" className="text-primary-foreground" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-primary-foreground">Rewards</h1>
            <p className="text-sm text-primary-foreground/70">Earn while you learn</p>
          </div>
        </div>

        
        <Card className="bg-primary-foreground/10 backdrop-blur-sm border-0 text-primary-foreground">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80 mb-1">Total Points</p>
                <p className="text-4xl font-extrabold">{points.total}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Award className="w-4 h-4" />
                  <span className="text-sm font-medium">{currentTier.name}</span>
                </div>
              </div>
              <div className="text-center">
                <ProgressRing progress={progressToNext} size={90} strokeWidth={8}>
                  <div className="text-center">
                    <Star className="w-6 h-6 text-secondary mx-auto" />
                    <span className="text-xs">Lv.{currentTier.level}</span>
                  </div>
                </ProgressRing>
                {nextTier && (
                  <p className="text-xs mt-2 opacity-70">
                    {nextTier.pointsRequired - points.total} to {nextTier.name}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="px-5 -mt-4 space-y-6">
        
        <Card variant="elevated">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Zap className="w-5 h-5 text-secondary" />
              How to Earn Points
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <EarnMethod icon="🎯" action="Complete your profile" points={50} />
            <EarnMethod icon="💬" action="Ask FinPal a question" points={5} />
            <EarnMethod icon="📊" action="Run a simulation" points={15} />
            <EarnMethod icon="⚖️" action="Analyze a decision" points={20} />
            <EarnMethod icon="🏆" action="Achieve a goal milestone" points={10} />
          </CardContent>
        </Card>

        
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-foreground">Achievements</h2>
            <span className="text-sm text-muted-foreground">{unlockedCount}/{achievements.length}</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {achievements.map((achievement) => (
              <Card 
                key={achievement.id}
                variant={achievement.unlocked ? 'elevated' : 'outline'}
                className={cn(
                  'text-center transition-all',
                  !achievement.unlocked && 'opacity-60'
                )}
              >
                <CardContent className="p-4">
                  <div className={cn(
                    'text-3xl mb-2',
                    !achievement.unlocked && 'grayscale'
                  )}>
                    {achievement.icon}
                  </div>
                  <p className="text-xs font-medium text-foreground line-clamp-1">
                    {achievement.title}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    +{achievement.points} pts
                  </p>
                  {achievement.unlocked && (
                    <Check className="w-4 h-4 text-success mx-auto mt-1" />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-foreground">Redeem Rewards</h2>
            <Gift className="w-5 h-5 text-secondary" />
          </div>
          <div className="space-y-3">
            {redeemableRewards.map((reward) => {
              const canRedeem = points.total >= reward.points;
              return (
                <Card 
                  key={reward.id}
                  variant="elevated"
                  className={cn(!canRedeem && 'opacity-70')}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">{reward.icon}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{reward.title}</h3>
                        <p className="text-xs text-muted-foreground">{reward.description}</p>
                      </div>
                      <Button
                        variant={canRedeem ? 'gradient' : 'muted'}
                        size="sm"
                        disabled={!canRedeem}
                      >
                        {canRedeem ? (
                          <>{reward.points} pts</>
                        ) : (
                          <Lock className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        
        {points.history.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-foreground mb-4">Recent Activity</h2>
            <Card variant="outline">
              <CardContent className="p-4 space-y-3">
                {points.history.slice(0, 5).map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{item.action}</span>
                    <span className="text-sm font-medium text-success">+{item.points}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        
        <Card className="bg-muted/50 border-0">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">
              <strong>🎁 Partner Rewards:</strong> Redeem points for discounts and services from our 
              trusted financial partners. This is how FinPal stays free while offering you value!
            </p>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  );
};

const EarnMethod = ({ 
  icon, 
  action, 
  points 
}: { 
  icon: string; 
  action: string; 
  points: number;
}) => (
  <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
    <div className="flex items-center gap-3">
      <span className="text-xl">{icon}</span>
      <span className="text-sm text-foreground">{action}</span>
    </div>
    <span className="text-sm font-bold text-primary">+{points}</span>
  </div>
);

export default Rewards;
