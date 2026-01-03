import { ReactNode } from 'react';
import { BottomNav } from './BottomNav';

interface LayoutProps {
  children: ReactNode;
  showNav?: boolean; // Optional prop to hide nav on some screens (e.g., login, though not implemented yet)
}

export const Layout = ({ children, showNav = true }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background pb-28 md:pb-24"> {/* Add padding bottom for fixed nav */}
      <main className="p-4 md:p-6 mx-auto max-w-7xl w-full"> {/* Responsive container */}
        {children}
      </main>
      {showNav && <BottomNav />}
    </div>
  );
};
