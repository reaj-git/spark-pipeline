import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, ArrowLeft, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SimpleHeader = () => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/');
  };

  return (
    <header className="bg-card border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 gap-y-4 sm:gap-y-0">
          {/* Left section */}
          <div className="flex justify-between sm:justify-start items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleGoBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Dashboard</span>
            </Button>
          </div>

          {/* Center */}
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent text-center sm:text-left">
            Micro CRM
          </h1>

          {/* Right section */}
          <div className="flex flex-col sm:flex-row items-center sm:space-x-4 gap-2 sm:gap-0">
            <span className="text-sm text-muted-foreground flex items-center gap-2">
              <User className="w-4 h-4" />
              {user?.email?.split('@')[0]}
            </span>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
