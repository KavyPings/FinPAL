import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useApp } from '@/contexts/AppContext';
import { ArrowLeft, ArrowRight, Check, User, Wallet, Target, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OnboardingStep {
  id: number;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}

const steps: OnboardingStep[] = [
  { id: 1, title: 'About You', subtitle: 'Let\'s personalize your experience', icon: <User className="w-6 h-6" /> },
  { id: 2, title: 'Your Finances', subtitle: 'Help us understand your situation', icon: <Wallet className="w-6 h-6" /> },
  { id: 3, title: 'Your Goals', subtitle: 'What are you working towards?', icon: <Target className="w-6 h-6" /> },
  { id: 4, title: 'Location', subtitle: 'For region-specific insights', icon: <MapPin className="w-6 h-6" /> },
];

const incomeRanges = ['Below ₹25,000', '₹25,000 - ₹50,000', '₹50,000 - ₹1,00,000', 'Above ₹1,00,000'];
const expenseRanges = ['Below ₹15,000', '₹15,000 - ₹30,000', '₹30,000 - ₹60,000', 'Above ₹60,000'];
const loanStatuses = ['No Loans', 'Home Loan', 'Personal Loan', 'Multiple Loans'];
const financialGoals = ['Emergency Fund', 'Buy a Home', 'Retirement', 'Children\'s Education', 'Vacation', 'Investments'];
const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Other'];

const Onboarding = () => {
  const navigate = useNavigate();
  const { setUserProfile, setIsOnboarded, addPoints, unlockAchievement } = useApp();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    incomeRange: '',
    monthlyExpenses: '',
    dependents: 0,
    loanStatus: '',
    financialGoals: [] as string[],
    location: '',
    language: 'en',
  });

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      setUserProfile(formData);
      setIsOnboarded(true);
      addPoints(50, 'Completed profile setup');
      unlockAchievement('1');
      navigate('/dashboard');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleGoal = (goal: string) => {
    setFormData((prev) => ({
      ...prev,
      financialGoals: prev.financialGoals.includes(goal)
        ? prev.financialGoals.filter((g) => g !== goal)
        : [...prev.financialGoals, goal],
    }));
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.name.length >= 2;
      case 2:
        return formData.incomeRange && formData.monthlyExpenses && formData.loanStatus;
      case 3:
        return formData.financialGoals.length > 0;
      case 4:
        return formData.location !== '';
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
    
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center gap-3 mb-6">
          {currentStep > 1 && (
            <Button variant="ghost" size="icon-sm" onClick={handleBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          <div className="flex-1">
            <div className="flex gap-2">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className={cn(
                    'h-1 flex-1 rounded-full transition-colors duration-300',
                    step.id <= currentStep ? 'bg-primary' : 'bg-muted'
                  )}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-primary-light flex items-center justify-center text-primary">
            {steps[currentStep - 1].icon}
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">{steps[currentStep - 1].title}</h2>
            <p className="text-sm text-muted-foreground">{steps[currentStep - 1].subtitle}</p>
          </div>
        </div>
      </div>

      
      <div className="flex-1 px-4 pb-4 overflow-auto">
        {currentStep === 1 && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">What should we call you?</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter your name"
                className="w-full h-14 px-4 rounded-2xl bg-muted border-2 border-transparent focus:border-primary focus:outline-none text-foreground placeholder:text-muted-foreground transition-colors"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Number of dependents</label>
              <div className="flex gap-3">
                {[0, 1, 2, 3, 4].map((num) => (
                  <button
                    key={num}
                    onClick={() => setFormData({ ...formData, dependents: num })}
                    className={cn(
                      'w-14 h-14 rounded-2xl font-bold text-lg transition-all duration-200',
                      formData.dependents === num
                        ? 'bg-primary text-primary-foreground shadow-glow'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    )}
                  >
                    {num === 4 ? '4+' : num}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <label className="text-sm font-medium text-foreground mb-3 block">Monthly Income</label>
              <div className="grid grid-cols-2 gap-3">
                {incomeRanges.map((range) => (
                  <SelectOption
                    key={range}
                    label={range}
                    selected={formData.incomeRange === range}
                    onClick={() => setFormData({ ...formData, incomeRange: range })}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-3 block">Monthly Expenses</label>
              <div className="grid grid-cols-2 gap-3">
                {expenseRanges.map((range) => (
                  <SelectOption
                    key={range}
                    label={range}
                    selected={formData.monthlyExpenses === range}
                    onClick={() => setFormData({ ...formData, monthlyExpenses: range })}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-3 block">Current Loan/EMI Status</label>
              <div className="grid grid-cols-2 gap-3">
                {loanStatuses.map((status) => (
                  <SelectOption
                    key={status}
                    label={status}
                    selected={formData.loanStatus === status}
                    onClick={() => setFormData({ ...formData, loanStatus: status })}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="animate-fade-in">
            <label className="text-sm font-medium text-foreground mb-3 block">
              Select your financial goals (choose multiple)
            </label>
            <div className="grid grid-cols-2 gap-3">
              {financialGoals.map((goal) => (
                <SelectOption
                  key={goal}
                  label={goal}
                  selected={formData.financialGoals.includes(goal)}
                  onClick={() => toggleGoal(goal)}
                  showCheck
                />
              ))}
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="animate-fade-in">
            <label className="text-sm font-medium text-foreground mb-3 block">Select your city</label>
            <div className="grid grid-cols-2 gap-3">
              {cities.map((city) => (
                <SelectOption
                  key={city}
                  label={city}
                  selected={formData.location === city}
                  onClick={() => setFormData({ ...formData, location: city })}
                />
              ))}
            </div>

            <Card className="mt-6 p-4 bg-primary-light border-0">
              <p className="text-sm text-foreground">
                <span className="font-semibold">🔒 Your data is safe</span>
                <br />
                <span className="text-muted-foreground">
                  We use your information only to personalize your experience. No data is shared with third parties.
                </span>
              </p>
            </Card>
          </div>
        )}
      </div>

      
      <div className="px-4 pb-6 pt-2">
        <Button
          variant="gradient"
          size="xl"
          className="w-full"
          onClick={handleNext}
          disabled={!isStepValid()}
        >
          {currentStep === 4 ? (
            <>
              Complete Setup <Check className="w-5 h-5" />
            </>
          ) : (
            <>
              Continue <ArrowRight className="w-5 h-5" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

const SelectOption = ({
  label,
  selected,
  onClick,
  showCheck = false,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  showCheck?: boolean;
}) => (
  <button
    onClick={onClick}
    className={cn(
      'p-4 rounded-2xl text-left font-medium transition-all duration-200 relative',
      selected
        ? 'bg-primary text-primary-foreground shadow-md'
        : 'bg-muted text-foreground hover:bg-muted/80'
    )}
  >
    {label}
    {showCheck && selected && (
      <Check className="w-4 h-4 absolute top-2 right-2" />
    )}
  </button>
);

export default Onboarding;
