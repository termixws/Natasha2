import { Sun, Moon, LogOut, User } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { user, profile, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-primary)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <span className="text-white font-semibold text-lg">N</span>
            </div>
            <h1 className="text-2xl font-light tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Natasha Salon
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            {user && profile && (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 px-3 py-2 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  <User size={18} style={{ color: 'var(--text-secondary)' }} />
                  <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
                    {profile.full_name}
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="p-2 rounded-lg hover:opacity-80 transition-opacity"
                  style={{ backgroundColor: 'var(--bg-secondary)' }}
                  title="Sign out"
                >
                  <LogOut size={18} style={{ color: 'var(--text-secondary)' }} />
                </button>
              </div>
            )}

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:opacity-80 transition-opacity"
              style={{ backgroundColor: 'var(--bg-secondary)' }}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun size={20} style={{ color: 'var(--text-secondary)' }} />
              ) : (
                <Moon size={20} style={{ color: 'var(--text-secondary)' }} />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
