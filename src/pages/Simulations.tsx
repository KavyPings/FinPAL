import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BottomNavigation } from '@/components/layout/BottomNavigation';
import { useApp } from '@/contexts/AppContext';
import { 
  ArrowLeft, 
  TrendingUp, 
  PiggyBank, 
  Landmark,
  CreditCard,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';

type SimulationType = 'sip-rd-fd' | 'loan-tenure';

const Simulations = () => {
  const navigate = useNavigate();
  const { addPoints } = useApp();
  const [activeSimulation, setActiveSimulation] = useState<SimulationType>('sip-rd-fd');
  
  
  const [amount, setAmount] = useState(5000);
  const [duration, setDuration] = useState(60);
  const [sipRate, setSipRate] = useState(12);
  const [rdRate, setRdRate] = useState(7);
  const [fdRate, setFdRate] = useState(6.5);

  
  const [loanAmount, setLoanAmount] = useState(500000);
  const [loanRate, setLoanRate] = useState(10);
  const [loanTenure, setLoanTenure] = useState(36);

  const chartData = useMemo(() => {
    if (activeSimulation === 'sip-rd-fd') {
      const data = [];
      for (let month = 0; month <= duration; month += Math.max(1, Math.floor(duration / 12))) {
        const sipValue = calculateSIPValue(amount, sipRate, month);
        const rdValue = calculateRDValue(amount, rdRate, month);
        const fdValue = calculateFDValue(amount * month, fdRate, month);
        data.push({
          month: `${month}m`,
          SIP: Math.round(sipValue),
          RD: Math.round(rdValue),
          FD: Math.round(fdValue),
        });
      }
      return data;
    } else {
      const data = [];
      const tenures = [12, 24, 36, 48, 60, 72];
      for (const tenure of tenures) {
        const totalInterest = calculateLoanInterest(loanAmount, loanRate, tenure);
        const monthlyEMI = calculateEMI(loanAmount, loanRate, tenure);
        data.push({
          tenure: `${tenure}m`,
          'Total Interest': Math.round(totalInterest),
          'Monthly EMI': Math.round(monthlyEMI),
        });
      }
      return data;
    }
  }, [amount, duration, sipRate, rdRate, fdRate, loanAmount, loanRate, loanTenure, activeSimulation]);

  const handleSimulationRun = () => {
    addPoints(15, 'Ran a simulation');
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      
      <div className="px-5 pt-4 pb-4">
        <div className="flex items-center gap-3 mb-4">
          <Button variant="ghost" size="icon-sm" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground">Simulations</h1>
            <p className="text-sm text-muted-foreground">Compare and understand options</p>
          </div>
        </div>

        
        <div className="flex gap-2">
          <Button
            variant={activeSimulation === 'sip-rd-fd' ? 'default' : 'muted'}
            size="sm"
            onClick={() => setActiveSimulation('sip-rd-fd')}
          >
            <TrendingUp className="w-4 h-4 mr-1" />
            SIP vs RD vs FD
          </Button>
          <Button
            variant={activeSimulation === 'loan-tenure' ? 'default' : 'muted'}
            size="sm"
            onClick={() => setActiveSimulation('loan-tenure')}
          >
            <CreditCard className="w-4 h-4 mr-1" />
            Loan Tenure
          </Button>
        </div>
      </div>

      <div className="px-5 space-y-4">
        {activeSimulation === 'sip-rd-fd' ? (
          <>
            
            <SliderControl
              label="Monthly Investment"
              value={amount}
              onChange={(v) => { setAmount(v); handleSimulationRun(); }}
              min={1000}
              max={50000}
              step={1000}
              format={(v) => `₹${v.toLocaleString('en-IN')}`}
            />

            
            <SliderControl
              label="Duration"
              value={duration}
              onChange={(v) => { setDuration(v); handleSimulationRun(); }}
              min={12}
              max={120}
              step={12}
              format={(v) => `${v} months`}
            />

            
            <Card variant="elevated">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Growth Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="sipGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="rdGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="fdGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(200, 85%, 50%)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(200, 85%, 50%)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                      <YAxis 
                        tick={{ fontSize: 10 }} 
                        axisLine={false} 
                        tickLine={false}
                        tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L`}
                      />
                      <Tooltip 
                        formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`}
                        contentStyle={{ 
                          borderRadius: '12px', 
                          border: 'none', 
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                        }}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="SIP"
                        stroke="hsl(160, 84%, 39%)"
                        strokeWidth={2}
                        fill="url(#sipGradient)"
                      />
                      <Area
                        type="monotone"
                        dataKey="RD"
                        stroke="hsl(38, 92%, 50%)"
                        strokeWidth={2}
                        fill="url(#rdGradient)"
                      />
                      <Area
                        type="monotone"
                        dataKey="FD"
                        stroke="hsl(200, 85%, 50%)"
                        strokeWidth={2}
                        fill="url(#fdGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            
            <div className="grid grid-cols-3 gap-3">
              <ResultCard
                icon={<TrendingUp className="w-5 h-5" />}
                label="SIP"
                value={calculateSIPValue(amount, sipRate, duration)}
                rate={sipRate}
                color="primary"
              />
              <ResultCard
                icon={<PiggyBank className="w-5 h-5" />}
                label="RD"
                value={calculateRDValue(amount, rdRate, duration)}
                rate={rdRate}
                color="secondary"
              />
              <ResultCard
                icon={<Landmark className="w-5 h-5" />}
                label="FD"
                value={calculateFDValue(amount * duration, fdRate, duration)}
                rate={fdRate}
                color="info"
              />
            </div>
          </>
        ) : (
          <>
            
            <SliderControl
              label="Loan Amount"
              value={loanAmount}
              onChange={(v) => { setLoanAmount(v); handleSimulationRun(); }}
              min={100000}
              max={5000000}
              step={50000}
              format={(v) => `₹${(v / 100000).toFixed(1)}L`}
            />

            
            <SliderControl
              label="Interest Rate"
              value={loanRate}
              onChange={(v) => { setLoanRate(v); handleSimulationRun(); }}
              min={7}
              max={18}
              step={0.5}
              format={(v) => `${v}%`}
            />

            
            <Card variant="elevated">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Tenure vs Interest</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="interestGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(0, 72%, 51%)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(0, 72%, 51%)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="tenure" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                      <YAxis 
                        tick={{ fontSize: 10 }} 
                        axisLine={false} 
                        tickLine={false}
                        tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`}
                      />
                      <Tooltip 
                        formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`}
                        contentStyle={{ 
                          borderRadius: '12px', 
                          border: 'none', 
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                        }}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="Total Interest"
                        stroke="hsl(0, 72%, 51%)"
                        strokeWidth={2}
                        fill="url(#interestGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            
            <div className="grid grid-cols-2 gap-3">
              {[24, 36, 48, 60].map((tenure) => {
                const emi = calculateEMI(loanAmount, loanRate, tenure);
                const totalInterest = calculateLoanInterest(loanAmount, loanRate, tenure);
                return (
                  <Card 
                    key={tenure} 
                    variant={loanTenure === tenure ? 'default' : 'outline'}
                    className={cn(
                      'cursor-pointer transition-all',
                      loanTenure === tenure && 'border-primary border-2'
                    )}
                    onClick={() => setLoanTenure(tenure)}
                  >
                    <CardContent className="p-4">
                      <p className="text-sm font-medium text-muted-foreground">{tenure} months</p>
                      <p className="text-lg font-bold text-foreground">
                        ₹{Math.round(emi).toLocaleString('en-IN')}/mo
                      </p>
                      <p className="text-xs text-destructive">
                        Interest: ₹{Math.round(totalInterest).toLocaleString('en-IN')}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </>
        )}

        
        <Card className="bg-muted/50 border-0">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">
              📊 <strong>Simulation Only:</strong> These are estimates based on historical averages. 
              Actual returns depend on market conditions and may vary.
            </p>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  );
};

const SliderControl = ({
  label,
  value,
  onChange,
  min,
  max,
  step,
  format,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  format: (value: number) => string;
}) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <span className="text-lg font-bold text-primary">{format(value)}</span>
    </div>
    <input
      type="range"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      min={min}
      max={max}
      step={step}
      className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
    />
    <div className="flex justify-between text-xs text-muted-foreground">
      <span>{format(min)}</span>
      <span>{format(max)}</span>
    </div>
  </div>
);

const ResultCard = ({
  icon,
  label,
  value,
  rate,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  rate: number;
  color: 'primary' | 'secondary' | 'info';
}) => {
  const colors = {
    primary: 'bg-primary-light text-primary',
    secondary: 'bg-secondary-light text-secondary',
    info: 'bg-info-light text-info',
  };

  return (
    <Card variant="elevated">
      <CardContent className="p-3 text-center">
        <div className={cn('w-8 h-8 rounded-xl mx-auto mb-2 flex items-center justify-center', colors[color])}>
          {icon}
        </div>
        <p className="text-xs text-muted-foreground mb-1">{label} @ {rate}%</p>
        <p className="text-sm font-bold text-foreground">
          ₹{(value / 100000).toFixed(2)}L
        </p>
      </CardContent>
    </Card>
  );
};

function calculateSIPValue(monthly: number, rate: number, months: number): number {
  const r = rate / 100 / 12;
  return monthly * ((Math.pow(1 + r, months) - 1) / r) * (1 + r);
}

function calculateRDValue(monthly: number, rate: number, months: number): number {
  const r = rate / 100 / 4;
  const quarters = months / 3;
  return monthly * 3 * ((Math.pow(1 + r, quarters) - 1) / r) * (1 + r);
}

function calculateFDValue(principal: number, rate: number, months: number): number {
  const years = months / 12;
  return principal * Math.pow(1 + rate / 100 / 4, 4 * years);
}

function calculateEMI(principal: number, rate: number, months: number): number {
  const r = rate / 100 / 12;
  return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}

function calculateLoanInterest(principal: number, rate: number, months: number): number {
  const emi = calculateEMI(principal, rate, months);
  return emi * months - principal;
}

export default Simulations;
