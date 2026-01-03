import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { BottomNav } from './BottomNav';

interface LayoutProps {
  children: ReactNode;
  showNav?: boolean;
}

export const Layout = ({ children, showNav = true }: LayoutProps) => {
  const location = useLocation();
  const hideNavRoutes: string[] = [];
  const shouldShowNav = showNav && !hideNavRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen bg-background pb-28 md:pb-24">
      <main className="px-4 py-4 md:px-6 md:py-6 mx-auto max-w-4xl w-full">
        {children}
      </main>
      {shouldShowNav && <BottomNav />}
    </div>
  );
};
