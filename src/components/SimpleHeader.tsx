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
        <div className="flex justify-between items-center h-16">
          {/* Left section */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleGoBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </div>

          {/* Center */}
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
            Micro CRM
          </h1>

          {/* Right section */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <User className="w-4 h-4" />
                {user?.email?.split('@')[0]}
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