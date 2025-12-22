import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Target, Calculator, MessageCircle, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/dashboard', icon: Home, label: 'Home' },
  { path: '/goals', icon: Target, label: 'Goals' },
  { path: '/simulations', icon: Calculator, label: 'Simulate' },
  { path: '/chat', icon: MessageCircle, label: 'Chat' },
  { path: '/rewards', icon: Award, label: 'Rewards' },
];

export const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        const Icon = item.icon;

        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={cn('bottom-nav-item', isActive && 'active')}
          >
            <Icon className={cn('w-6 h-6', isActive && 'text-primary')} />
            <span className={cn(
              'text-xs font-medium',
              isActive ? 'text-primary' : 'text-muted-foreground'
            )}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
