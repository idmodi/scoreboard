
import { useLocation } from 'react-router-dom';
import BottomNav from './BottomNav';
import TopBar from './TopBar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {!isLoginPage && <TopBar />}
      <main className="flex-1 container mx-auto px-4 py-4 max-w-4xl">
        {children}
      </main>
      {!isLoginPage && <BottomNav />}
    </div>
  );
};

export default Layout;
