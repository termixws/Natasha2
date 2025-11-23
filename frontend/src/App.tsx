import { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import Masters from './components/Masters';
import Footer from './components/Footer';
import BookingModal from './components/BookingModal';
import AuthModal from './components/AuthModal';
import UserAppointments from './components/UserAppointments';
import type { User, Service } from './types';

function App() {
  const [currentSection, setCurrentSection] = useState('home');
  const [user, setUser] = useState<User | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [preselectedService, setPreselectedService] = useState<Service | null>(null);

  const handleNavigate = (section: string) => {
    if (section === 'login' && !user) {
      setIsAuthModalOpen(true);
    } else if (section === 'appointments' && !user) {
      setIsAuthModalOpen(true);
    } else {
      setCurrentSection(section);
    }
  };

  const handleBookNow = () => {
    if (!user) {
      setIsAuthModalOpen(true);
    } else {
      setIsBookingModalOpen(true);
    }
  };

  const handleBookService = (service: Service) => {
    if (!user) {
      setIsAuthModalOpen(true);
    } else {
      setPreselectedService(service);
      setIsBookingModalOpen(true);
    }
  };

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentSection('home');
  };

  const handleBookingSuccess = () => {
    setPreselectedService(null);
    setCurrentSection('appointments');
  };

  return (
    <div className="min-h-screen bg-white">
      <Header
        onNavigate={handleNavigate}
        currentSection={currentSection}
        user={user}
        onLogout={handleLogout}
      />

      {currentSection === 'home' && (
        <>
          <Hero onBookNow={handleBookNow} />
          <Services onBookService={handleBookService} />
          <Masters />
        </>
      )}

      {currentSection === 'services' && (
        <Services onBookService={handleBookService} />
      )}

      {currentSection === 'masters' && <Masters />}

      {currentSection === 'appointments' && user && (
        <UserAppointments userId={user.id} />
      )}

      <Footer />

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => {
          setIsBookingModalOpen(false);
          setPreselectedService(null);
        }}
        userId={user?.id || null}
        preselectedService={preselectedService}
        onSuccess={handleBookingSuccess}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
      />
    </div>
  );
}

export default App;
