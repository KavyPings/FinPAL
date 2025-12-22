import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BottomNavigation } from '@/components/layout/BottomNavigation';
import { useApp } from '@/contexts/AppContext';
import { 
  ArrowLeft, 
  Send, 
  Sparkles,
  TrendingUp,
  PiggyBank,
  CreditCard,
  Target
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChatMessage } from '@/types/finpal';

const suggestedQuestions = [
  { icon: <CreditCard className="w-4 h-4" />, text: "Can I afford this EMI?" },
  { icon: <PiggyBank className="w-4 h-4" />, text: "Why aren't my savings growing?" },
  { icon: <TrendingUp className="w-4 h-4" />, text: "Should I start a SIP?" },
  { icon: <Target className="w-4 h-4" />, text: "How to build emergency fund?" },
];

const Chat = () => {
  const navigate = useNavigate();
  const { userProfile, chatHistory, addChatMessage, addPoints } = useApp();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handleSend = async (message: string = input) => {
    if (!message.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date(),
    };
    addChatMessage(userMessage);
    setInput('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const response = generateResponse(message, userProfile);
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      addChatMessage(assistantMessage);
      setIsTyping(false);
      addPoints(5, 'Asked FinPal a question');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col pb-24">
      {/* Header */}
      <div className="px-5 pt-4 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon-sm" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">FinPal</h1>
              <p className="text-xs text-muted-foreground">Your financial guide</p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto px-5 py-4 space-y-4">
        {chatHistory.length === 0 && (
          <div className="animate-fade-in">
            <Card variant="gradient" className="mb-6">
              <CardContent className="p-5">
                <h3 className="font-bold text-primary-foreground mb-2">
                  Hi {userProfile?.name || 'there'}! 👋
                </h3>
                <p className="text-sm text-primary-foreground/80">
                  I'm here to help you understand your finances better. 
                  Ask me anything about budgeting, investments, or financial decisions!
                </p>
              </CardContent>
            </Card>

            <p className="text-sm font-medium text-muted-foreground mb-3">Try asking:</p>
            <div className="grid grid-cols-2 gap-2">
              {suggestedQuestions.map((q, index) => (
                <button
                  key={index}
                  onClick={() => handleSend(q.text)}
                  className="flex items-center gap-2 p-3 rounded-xl bg-muted hover:bg-muted/80 text-left transition-colors"
                >
                  <div className="text-primary">{q.icon}</div>
                  <span className="text-xs font-medium text-foreground">{q.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {chatHistory.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {isTyping && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-5 py-4 border-t border-border bg-background">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask FinPal anything..."
            className="flex-1 h-12 px-4 rounded-2xl bg-muted border-2 border-transparent focus:border-primary focus:outline-none text-foreground placeholder:text-muted-foreground transition-colors"
          />
          <Button 
            variant="gradient" 
            size="icon" 
            className="h-12 w-12"
            onClick={() => handleSend()}
            disabled={!input.trim()}
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

const MessageBubble = ({ message }: { message: ChatMessage }) => {
  const isUser = message.role === 'user';

  return (
    <div className={cn('flex items-start gap-3', isUser && 'flex-row-reverse')}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-4 h-4 text-primary-foreground" />
        </div>
      )}
      <div
        className={cn(
          'max-w-[80%] rounded-2xl px-4 py-3',
          isUser
            ? 'bg-primary text-primary-foreground rounded-tr-sm'
            : 'bg-muted text-foreground rounded-tl-sm'
        )}
      >
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  );
};

function generateResponse(question: string, userProfile: any): string {
  const lowerQ = question.toLowerCase();
  const name = userProfile?.name || 'there';
  const income = userProfile?.incomeRange || 'your income';
  const goals = userProfile?.financialGoals || [];

  if (lowerQ.includes('emi') || lowerQ.includes('afford')) {
    return `Great question, ${name}! 💡

Based on your income range (${income}), financial experts recommend keeping your total EMI burden below 40% of your monthly income.

Here's how to think about it:
• Calculate your current EMIs
• Add the new EMI you're considering
• If total exceeds 40%, it might strain your budget

Would you like me to help you run a simulation to see the exact impact? You can use the Simulate feature!

📚 Remember: This is educational guidance to help you understand, not financial advice.`;
  }

  if (lowerQ.includes('savings') || lowerQ.includes('growing')) {
    return `${name}, this is a common concern! Let me explain why savings might feel stagnant:

**Key factors affecting your savings:**

1️⃣ **Inflation Impact**: Money in regular savings loses 6-7% purchasing power yearly

2️⃣ **Low Interest Rates**: Traditional savings accounts offer 2.5-4%, which barely beats inflation

3️⃣ **Lifestyle Creep**: Expenses often grow with income

**What you can consider:**
• Separate spending from savings in different accounts
• Explore higher-return options like SIPs or FDs
• Review and reduce non-essential expenses

Would you like to compare different saving instruments in our Simulator?

📚 This is to help you understand your options better!`;
  }

  if (lowerQ.includes('sip') || lowerQ.includes('invest')) {
    return `Starting a SIP is a great way to build wealth over time, ${name}! 🌱

**Why SIP works:**
• Rupee cost averaging reduces timing risk
• Small amounts grow big with compounding
• Disciplined investing habit

**Based on your goals** (${goals.slice(0, 2).join(', ') || 'building wealth'}):
• Start with an amount you won't miss
• Even ₹500-1000/month makes a difference
• Increase gradually as income grows

**Example**: ₹5,000/month for 10 years at 12% returns ≈ ₹11.6 lakhs!

Try our Simulator to see projections for different amounts!

📚 This helps you understand SIP concepts, not a specific investment recommendation.`;
  }

  if (lowerQ.includes('emergency') || lowerQ.includes('fund')) {
    return `Building an emergency fund is one of the smartest financial moves, ${name}! 🛡️

**Why it matters:**
• Protects against unexpected expenses
• Prevents debt during tough times
• Gives peace of mind

**How much to target:**
• Aim for 3-6 months of essential expenses
• For your profile, consider starting with ₹50,000-1,00,000

**How to build it:**
1. Set a fixed monthly amount
2. Keep it in a liquid/savings account
3. Don't touch it for regular expenses

I see you have this as a goal! You're on the right track. 

📚 This is educational guidance to help you plan.`;
  }

  // Default response
  return `Thanks for your question, ${name}! 🤔

I'm designed to help you understand financial concepts and impacts. While I can't provide specific investment advice, I can help explain:

• How different financial instruments work
• The impact of decisions on your finances
• Concepts like compounding, EMI burden, etc.

Try asking about:
- "Can I afford this EMI?"
- "How does SIP work?"
- "What's the impact of inflation?"

📚 All my responses are for educational understanding only.`;
}

export default Chat;
