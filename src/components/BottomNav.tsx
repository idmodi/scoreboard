
import { Users, Trophy, List } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';

const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-4xl">
        <div className="flex justify-around items-center h-16">
          <Link
            to="/players"
            className={`nav-item ${location.pathname === '/players' ? 'active' : ''}`}
          >
            <Users className="h-5 w-5" />
            <span>Players</span>
          </Link>
          <Link
            to="/scores"
            className={`nav-item ${location.pathname === '/scores' ? 'active' : ''}`}
          >
            <List className="h-5 w-5" />
            <span>Scores</span>
          </Link>
          <Link
            to="/leaderboard"
            className={`nav-item ${location.pathname === '/leaderboard' ? 'active' : ''}`}
          >
            <Trophy className="h-5 w-5" />
            <span>Leaderboard</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
