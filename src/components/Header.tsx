import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, BarChart3, Users, Plus, Menu, X } from 'lucide-react';
import clsx from 'clsx';

interface HeaderProps {
  activeTab: 'pipeline' | 'metrics';
  onTabChange: (tab: 'pipeline' | 'metrics') => void;
  onAddProspect: () => void;
}

export const Header = ({ activeTab, onTabChange, onAddProspect }: HeaderProps) => {
  const { signOut, user } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => setIsDrawerOpen((prev) => !prev);

  return (
    <header className="bg-card border-b border-border shadow-sm relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Hamburger + Logo */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDrawer}
              className="md:hidden p-2 rounded-md hover:bg-muted"
              aria-label="Toggle Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
              Micro CRM
            </h1>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-4">
            <Button
              variant={activeTab === 'pipeline' ? 'default' : 'ghost'}
              onClick={() => onTabChange('pipeline')}
              className="flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              Pipeline
            </Button>
            <Button
              variant={activeTab === 'metrics' ? 'default' : 'ghost'}
              onClick={() => onTabChange('metrics')}
              className="flex items-center gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              Metrics
            </Button>
          </nav>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center space-x-4">
            {activeTab === 'pipeline' && (
              <Button onClick={onAddProspect} className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Prospect
              </Button>
            )}
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => window.location.href = '/profile'}
                className="flex items-center gap-2"
              >
                <Users className="w-4 h-4" />
                Profile
              </Button>
              <span className="text-sm text-muted-foreground">
                Welcome, {user?.email?.split('@')[0]}
              </span>
              <Button variant="outline" size="sm" onClick={signOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Left Drawer */}
      <div
        className={clsx(
          'fixed inset-y-0 left-0 w-64 bg-white border-r border-border p-4 z-40 transform transition-transform duration-300 ease-in-out shadow-md',
          isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Close button */}
        <div className="flex justify-between items-center mb-6">
          <span className="text-xl font-semibold">Menu</span>
          <button onClick={toggleDrawer} className="p-1 rounded hover:bg-muted">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col space-y-2">
          <Button
            variant={activeTab === 'pipeline' ? 'default' : 'ghost'}
            onClick={() => {
              onTabChange('pipeline');
              toggleDrawer();
            }}
            className="flex items-center gap-2 justify-start"
          >
            <Users className="w-4 h-4" />
            Pipeline
          </Button>
          <Button
            variant={activeTab === 'metrics' ? 'default' : 'ghost'}
            onClick={() => {
              onTabChange('metrics');
              toggleDrawer();
            }}
            className="flex items-center gap-2 justify-start"
          >
            <BarChart3 className="w-4 h-4" />
            Metrics
          </Button>

          {activeTab === 'pipeline' && (
            <Button
              onClick={() => {
                onAddProspect();
                toggleDrawer();
              }}
              className="flex items-center gap-2 justify-start"
            >
              <Plus className="w-4 h-4" />
              Add Prospect
            </Button>
          )}
        </nav>

        {/* User Section */}
        <div className="mt-6 border-t border-border pt-4 space-y-2">
          <span className="text-sm text-muted-foreground block">
            Welcome, {user?.email?.split('@')[0]}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              toggleDrawer();
              window.location.href = '/profile';
            }}
            className="flex items-center gap-2 w-full justify-start"
          >
            <Users className="w-4 h-4" />
            Profile
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              toggleDrawer();
              signOut();
            }}
            className="flex items-center gap-2 w-full justify-start"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Overlay behind drawer */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
          onClick={toggleDrawer}
        />
      )}
    </header>
  );
};
