import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, List, LogOut, Navigation } from 'lucide-react';
import { useShuttle } from '@/contexts/ShuttleContext';
import { NotificationCenter } from '@/components/NotificationCenter';

const DriverLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, currentUser } = useShuttle();

  const tabs = [
    { path: '/driver', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/driver/trips', icon: List, label: 'Perjalanan' },
    { path: '/driver/tracking', icon: Navigation, label: 'GPS' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto">
      <header className="bg-primary text-primary-foreground p-4 flex items-center justify-between sticky top-0 z-10">
        <div>
          <h1 className="text-lg font-bold">🚐 Driver Panel</h1>
          <p className="text-xs opacity-80">{currentUser?.name}</p>
        </div>
        <div className="flex items-center gap-1">
          <NotificationCenter role="driver" variant="light" />
          <button onClick={() => { logout(); navigate('/'); }} className="p-2 rounded-lg hover:bg-primary/80">
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-20">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-card border-t border-border">
        <div className="flex justify-around py-2">
          {tabs.map(tab => (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-colors ${isActive(tab.path) ? 'text-primary' : 'text-muted-foreground'}`}
            >
              <tab.icon className="h-5 w-5" />
              <span className="text-xs">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default DriverLayout;
