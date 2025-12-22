import React from 'react';
import { cn } from '@/lib/utils';

interface MobileContainerProps {
  children: React.ReactNode;
  className?: string;
  showStatusBar?: boolean;
}

export const MobileContainer = ({ 
  children, 
  className,
  showStatusBar = true 
}: MobileContainerProps) => {
  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <div className={cn(
        "w-full max-w-[430px] min-h-[932px] bg-background rounded-[3rem] overflow-hidden shadow-2xl border-8 border-foreground/10 relative",
        className
      )}>
        {showStatusBar && (
          <div className="status-bar">
            <span>9:41</span>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3a9 9 0 00-9 9v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7a9 9 0 00-9-9zm0 16H5v-7a7 7 0 0114 0v7h-7z"/>
              </svg>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15.5 1h-8C6.12 1 5 2.12 5 3.5v17C5 21.88 6.12 23 7.5 23h8c1.38 0 2.5-1.12 2.5-2.5v-17C18 2.12 16.88 1 15.5 1zm-4 21c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4.5-4H7V4h9v14z"/>
              </svg>
              <span className="text-xs font-bold">100%</span>
            </div>
          </div>
        )}
        <div className="h-full overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
};
