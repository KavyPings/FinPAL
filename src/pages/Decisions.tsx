import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BottomNavigation } from '@/components/layout/BottomNavigation';
import { useApp } from '@/contexts/AppContext';
import { 
  ArrowLeft, 
  CreditCard, 
  TrendingUp, 
  ShoppingCart, 
  Car,
  Home as HomeIcon,
  Smartphone,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  Info,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

const decisionTypes = [
  { id: 'emi', icon: <CreditCard className="w-6 h-6" />, label: 'Take an EMI', description: 'Loan or credit purchase' },
  { id: 'sip', icon: <TrendingUp className="w-6 h-6" />, label: 'Start a SIP', description: 'Systematic investment' },
  { id: 'expense', icon: <ShoppingCart className="w-6 h-6" />, label: 'Major Purchase', description: 'Big expense decision' },
  { id: 'vehicle', icon: <Car className="w-6 h-6" />, label: 'Buy a Vehicle', description: 'Car or bike purchase' },
  { id: 'property', icon: <HomeIcon className="w-6 h-6" />, label: 'Buy Property', description: 'Home or land' },
  { id: 'gadget', icon: <Smartphone className="w-6 h-6" />, label: 'Electronics', description: 'Phone, laptop, etc.' },
];

const Decisions = () => {
  const navigate = useNavigate();
  const { userProfile, addPoints } = useApp();
  const [selectedDecision, setSelectedDecision] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
  const [duration, setDuration] = useState('12');
  const [showAnalysis, setShowAnalysis] = useState(false);

  const handleAnalyze = () => {
    setShowAnalysis(true);
    addPoints(20, 'Analyzed a financial decision');
  };

  const resetAnalysis = () => {
    setShowAnalysis(false);
    setSelectedDecision(null);
    setAmount('');
    setDuration('12');
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      
      <div className="px-5 pt-4 pb-6">
        <div className="flex items-center gap-3 mb-4">
          <Button variant="ghost" size="icon-sm" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground">Decision Engine</h1>
            <p className="text-sm text-muted-foreground">Understand before you decide</p>
          </div>
        </div>
      </div>

      {!showAnalysis ? (
        <div className="px-5 animate-fade-in">
          
          <section className="mb-6">
            <h2 className="text-sm font-semibold text-muted-foreground mb-3">What decision are you considering?</h2>
            <div className="grid grid-cols-2 gap-3">
              {decisionTypes.map((decision) => (
                <Card
                  key={decision.id}
                  variant={selectedDecision === decision.id ? 'default' : 'outline'}
                  className={cn(
                    'cursor-pointer transition-all duration-200',
                    selectedDecision === decision.id && 'border-primary border-2 shadow-glow'
                  )}
                  onClick={() => setSelectedDecision(decision.id)}
                >
                  <CardContent className="p-4">
                    <div className={cn(
                      'w-10 h-10 rounded-xl flex items-center justify-center mb-2',
                      selectedDecision === decision.id ? 'bg-primary text-primary-foreground' : 'bg-primary-light text-primary'
                    )}>
                      {decision.icon}
                    </div>
                    <h3 className="font-semibold text-foreground text-sm">{decision.label}</h3>
                    <p className="text-xs text-muted-foreground">{decision.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {selectedDecision && (
            <>
              
              <section className="mb-6 animate-fade-in">
                <label className="text-sm font-semibold text-muted-foreground mb-3 block">
                  How much are you considering?
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">₹</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full h-14 pl-8 pr-4 rounded-2xl bg-muted border-2 border-transparent focus:border-primary focus:outline-none text-foreground placeholder:text-muted-foreground transition-colors text-lg font-medium"
                  />
                </div>
              </section>

              
              {(selectedDecision === 'emi' || selectedDecision === 'sip') && (
                <section className="mb-6 animate-fade-in">
                  <label className="text-sm font-semibold text-muted-foreground mb-3 block">
                    Duration (months)
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {['6', '12', '24', '36', '48', '60'].map((d) => (
                      <button
                        key={d}
                        onClick={() => setDuration(d)}
                        className={cn(
                          'px-4 py-2 rounded-xl font-medium transition-all duration-200',
                          duration === d
                            ? 'bg-primary text-primary-foreground shadow-md'
                            : 'bg-muted text-foreground hover:bg-muted/80'
                        )}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </section>
              )}

              
              <Button
                variant="gradient"
                size="xl"
                className="w-full"
                onClick={handleAnalyze}
                disabled={!amount}
              >
                <Sparkles className="w-5 h-5" />
                Analyze Impact
              </Button>
            </>
          )}
        </div>
      ) : (
        <div className="px-5 animate-fade-in">
          <AnalysisResult
            decision={selectedDecision!}
            amount={Number(amount)}
            duration={Number(duration)}
            userProfile={userProfile}
            onReset={resetAnalysis}
          />
        </div>
      )}

      <BottomNavigation />
    </div>
  );
};

const AnalysisResult = ({
  decision,
  amount,
  duration,
  userProfile,
  onReset,
}: {
  decision: string;
  amount: number;
  duration: number;
  userProfile: any;
  onReset: () => void;
}) => {
  const monthlyIncome = userProfile?.incomeRange?.includes('1,00,000') ? 100000 : 
                        userProfile?.incomeRange?.includes('50,000') ? 75000 :
                        userProfile?.incomeRange?.includes('25,000') ? 37500 : 25000;
  
  const emiAmount = decision === 'emi' ? (amount * 1.12) / duration : 0;
  const emiBurden = (emiAmount / monthlyIncome) * 100;
  
  const sipReturns = decision === 'sip' ? amount * duration * (1 + (0.12 / 12)) ** duration - amount * duration : 0;
  
  const opportunityCost = amount * 0.12 * (duration / 12);

  const insights = getInsights(decision, amount, duration, emiBurden, userProfile);

  return (
    <div className="space-y-4">
      
      <Card variant="gradient">
        <CardContent className="p-5">
          <h3 className="text-lg font-bold text-primary-foreground mb-2">Impact Analysis</h3>
          <p className="text-primary-foreground/80 text-sm">
            Based on your profile: {userProfile?.incomeRange}, {userProfile?.location}
          </p>
        </CardContent>
      </Card>

      
      <div className="grid grid-cols-2 gap-3">
        {decision === 'emi' && (
          <>
            <MetricCard
              label="Monthly EMI"
              value={`₹${emiAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
              status={emiBurden > 40 ? 'warning' : 'success'}
            />
            <MetricCard
              label="EMI Burden"
              value={`${emiBurden.toFixed(1)}%`}
              status={emiBurden > 40 ? 'warning' : 'success'}
              subtitle="of income"
            />
          </>
        )}
        {decision === 'sip' && (
          <>
            <MetricCard
              label="Est. Returns"
              value={`₹${sipReturns.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
              status="success"
            />
            <MetricCard
              label="Total Value"
              value={`₹${(amount * duration + sipReturns).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
              status="success"
              subtitle="after tenure"
            />
          </>
        )}
        <MetricCard
          label="Opportunity Cost"
          value={`₹${opportunityCost.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
          status="info"
          subtitle="if invested"
        />
        <MetricCard
          label="Inflation Impact"
          value={`-${(amount * 0.06).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
          status="warning"
          subtitle="annual erosion"
        />
      </div>

      
      <Card variant="elevated">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Key Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {insights.map((insight, index) => (
            <InsightItem key={index} {...insight} />
          ))}
        </CardContent>
      </Card>

      
      <Card className="bg-muted/50 border-0">
        <CardContent className="p-4">
          <p className="text-xs text-muted-foreground">
            <strong>📚 Educational Guidance Only:</strong> This analysis is for understanding purposes. 
            Actual returns may vary based on market conditions. Consult a certified financial advisor 
            for personalized advice.
          </p>
        </CardContent>
      </Card>

      <Button variant="outline" size="lg" className="w-full" onClick={onReset}>
        Analyze Another Decision
      </Button>
    </div>
  );
};

const MetricCard = ({
  label,
  value,
  status,
  subtitle,
}: {
  label: string;
  value: string;
  status: 'success' | 'warning' | 'info';
  subtitle?: string;
}) => {
  const colors = {
    success: 'bg-success-light text-success',
    warning: 'bg-warning-light text-warning',
    info: 'bg-info-light text-info',
  };

  return (
    <Card variant="elevated">
      <CardContent className="p-4">
        <p className="text-xs text-muted-foreground mb-1">{label}</p>
        <p className={cn('text-lg font-bold', colors[status].split(' ')[1])}>{value}</p>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </CardContent>
    </Card>
  );
};

const InsightItem = ({
  type,
  text,
}: {
  type: 'success' | 'warning' | 'info';
  text: string;
}) => {
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-success" />,
    warning: <AlertTriangle className="w-5 h-5 text-warning" />,
    info: <Info className="w-5 h-5 text-info" />,
  };

  return (
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 mt-0.5">{icons[type]}</div>
      <p className="text-sm text-foreground">{text}</p>
    </div>
  );
};

const getInsights = (
  decision: string,
  amount: number,
  duration: number,
  emiBurden: number,
  userProfile: any
) => {
  const insights: { type: 'success' | 'warning' | 'info'; text: string }[] = [];

  if (decision === 'emi') {
    if (emiBurden > 50) {
      insights.push({
        type: 'warning',
        text: `Your EMI burden would be ${emiBurden.toFixed(0)}% of income. Experts recommend keeping it below 40%.`,
      });
    } else if (emiBurden > 30) {
      insights.push({
        type: 'info',
        text: `EMI burden of ${emiBurden.toFixed(0)}% is manageable but leaves less room for savings.`,
      });
    } else {
      insights.push({
        type: 'success',
        text: `EMI burden of ${emiBurden.toFixed(0)}% is within healthy limits for your income.`,
      });
    }
  }

  if (decision === 'sip') {
    insights.push({
      type: 'success',
      text: `Starting early with SIP can leverage compounding. Even ₹${(amount).toLocaleString('en-IN')} can grow significantly over time.`,
    });
  }

  insights.push({
    type: 'info',
    text: `The opportunity cost of this decision is what you could earn if you invested this amount instead.`,
  });

  if (userProfile?.financialGoals?.includes('Emergency Fund')) {
    insights.push({
      type: 'warning',
      text: `Consider your emergency fund goal before committing. It's wise to have 3-6 months expenses saved first.`,
    });
  }

  return insights;
};

export default Decisions;
