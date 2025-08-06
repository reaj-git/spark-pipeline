import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, BarChart3, Users, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface HeaderProps {
  activeTab: 'pipeline' | 'metrics';
  onTabChange: (tab: 'pipeline' | 'metrics') => void;
  onAddProspect: () => void;
}

export const Header = ({ activeTab, onTabChange, onAddProspect }: HeaderProps) => {
  const { signOut, user } = useAuth();

  return (
    <header className="bg-card border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
                Micro CRM
              </h1>
              <Badge variant="secondary" className="ml-3 text-xs">
                Beta
              </Badge>
            </div>

            <nav className="flex space-x-4">
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
          </div>

          <div className="flex items-center space-x-4">
            {activeTab === 'pipeline' && (
              <Button onClick={onAddProspect} className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Prospect
              </Button>
            )}
            
            <div className="flex items-center space-x-3">
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
    </header>
  );
};