import { useState, useEffect } from 'react';
import { Calendar, Users, Scissors, Clock } from 'lucide-react';
import { servicesAPI, mastersAPI, appointmentsAPI } from './lib/api';
import type { Service, Master, Appointment } from './types/api';
import ServicesList from './components/ServicesList';
import MastersList from './components/MastersList';
import AppointmentsList from './components/AppointmentsList';
import BookingForm from './components/BookingForm';

type Tab = 'services' | 'masters' | 'appointments' | 'book';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('services');
  const [services, setServices] = useState<Service[]>([]);
  const [masters, setMasters] = useState<Master[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [servicesData, mastersData, appointmentsData] = await Promise.all([
        servicesAPI.getAll(),
        mastersAPI.getAll(),
        appointmentsAPI.getAll(),
      ]);
      setServices(servicesData);
      setMasters(mastersData);
      setAppointments(appointmentsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleBookingSuccess = () => {
    loadData();
    setActiveTab('appointments');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-teal-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <div className="text-red-600 text-center">
            <h2 className="text-xl font-semibold mb-2">Connection Error</h2>
            <p className="mb-4">{error}</p>
            <button
              onClick={loadData}
              className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-teal-50">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <Scissors className="text-rose-600" />
            Salon Natasha
          </h1>
          <p className="text-gray-600">Professional Beauty Services</p>
        </header>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="flex border-b border-gray-200 overflow-x-auto">
            <button
              onClick={() => setActiveTab('services')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                activeTab === 'services'
                  ? 'bg-rose-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Scissors size={20} />
              Services
            </button>
            <button
              onClick={() => setActiveTab('masters')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                activeTab === 'masters'
                  ? 'bg-rose-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Users size={20} />
              Masters
            </button>
            <button
              onClick={() => setActiveTab('appointments')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                activeTab === 'appointments'
                  ? 'bg-rose-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Clock size={20} />
              Appointments
            </button>
            <button
              onClick={() => setActiveTab('book')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                activeTab === 'book'
                  ? 'bg-rose-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Calendar size={20} />
              Book Now
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'services' && <ServicesList services={services} onUpdate={loadData} />}
            {activeTab === 'masters' && <MastersList masters={masters} onUpdate={loadData} />}
            {activeTab === 'appointments' && (
              <AppointmentsList
                appointments={appointments}
                services={services}
                masters={masters}
                onUpdate={loadData}
              />
            )}
            {activeTab === 'book' && (
              <BookingForm
                services={services}
                masters={masters}
                onSuccess={handleBookingSuccess}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
