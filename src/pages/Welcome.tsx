import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Wallet, TrendingUp, Shield, Sparkles } from 'lucide-react';

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-16 pb-8 text-center">
        <div className="animate-float mb-8">
          <div className="w-24 h-24 rounded-3xl bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center shadow-glow">
            <Wallet className="w-12 h-12 text-primary-foreground" />
          </div>
        </div>
        
        <h1 className="text-4xl font-extrabold text-primary-foreground mb-3 animate-fade-in">
          FinPal
        </h1>
        <p className="text-primary-foreground/90 text-lg font-medium mb-2 animate-fade-in-delay-1">
          Your Financial Understanding Partner
        </p>
        <p className="text-primary-foreground/70 text-sm max-w-xs animate-fade-in-delay-2">
          Make smarter money decisions with personalized insights and guidance
        </p>
      </div>

      {/* Features Preview */}
      <div className="bg-card rounded-t-[2.5rem] px-6 py-8 animate-slide-up">
        <div className="grid grid-cols-3 gap-4 mb-8">
          <FeatureCard 
            icon={<TrendingUp className="w-6 h-6" />}
            label="Understand Impact"
          />
          <FeatureCard 
            icon={<Shield className="w-6 h-6" />}
            label="Plan Ahead"
          />
          <FeatureCard 
            icon={<Sparkles className="w-6 h-6" />}
            label="Learn & Grow"
          />
        </div>

        <Button 
          variant="gradient" 
          size="xl" 
          className="w-full mb-4"
          onClick={() => navigate('/onboarding')}
        >
          Get Started
        </Button>
        
        <p className="text-center text-xs text-muted-foreground">
          Takes only 2 minutes to set up
        </p>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-primary-light">
    <div className="text-primary">{icon}</div>
    <span className="text-xs font-medium text-foreground text-center">{label}</span>
  </div>
);

export default Welcome;
