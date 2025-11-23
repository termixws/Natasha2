import { Scissors, User, Calendar } from 'lucide-react';

interface HeaderProps {
  onNavigate: (section: string) => void;
  currentSection: string;
  user: { name: string } | null;
  onLogout: () => void;
}

export default function Header({ onNavigate, currentSection, user, onLogout }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 text-xl font-light tracking-wide text-gray-900 hover:text-gray-600 transition-colors"
          >
            <Scissors className="w-6 h-6" />
            <span>Salon Natasha</span>
          </button>

          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => onNavigate('services')}
              className={`text-sm font-light transition-colors ${
                currentSection === 'services'
                  ? 'text-gray-900 border-b-2 border-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Services
            </button>
            <button
              onClick={() => onNavigate('masters')}
              className={`text-sm font-light transition-colors ${
                currentSection === 'masters'
                  ? 'text-gray-900 border-b-2 border-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Masters
            </button>
            {user ? (
              <>
                <button
                  onClick={() => onNavigate('appointments')}
                  className={`flex items-center gap-2 text-sm font-light transition-colors ${
                    currentSection === 'appointments'
                      ? 'text-gray-900 border-b-2 border-gray-900'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  My Appointments
                </button>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">{user.name}</span>
                  <button
                    onClick={onLogout}
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={() => onNavigate('login')}
                className="flex items-center gap-2 text-sm font-light text-gray-600 hover:text-gray-900 transition-colors"
              >
                <User className="w-4 h-4" />
                Login
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
