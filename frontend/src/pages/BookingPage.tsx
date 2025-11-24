import { useState, useEffect } from 'react';
import { Calendar, ArrowRight, ArrowLeft } from 'lucide-react';
import { supabase, Master, Service } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import MasterCard from '../components/MasterCard';
import ServiceCard from '../components/ServiceCard';

interface BookingPageProps {
  onBookingComplete: () => void;
}

export default function BookingPage({ onBookingComplete }: BookingPageProps) {
  const [step, setStep] = useState(1);
  const [masters, setMasters] = useState<Master[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedMaster, setSelectedMaster] = useState<Master | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    loadMasters();
    loadServices();
  }, []);

  const loadMasters = async () => {
    const { data, error } = await supabase
      .from('masters')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) {
      console.error('Error loading masters:', error);
    } else {
      setMasters(data || []);
    }
  };

  const loadServices = async () => {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) {
      console.error('Error loading services:', error);
    } else {
      setServices(data || []);
    }
  };

  const getAvailableTimes = () => {
    const times = [];
    for (let hour = 9; hour <= 18; hour++) {
      times.push(`${hour.toString().padStart(2, '0')}:00`);
      if (hour < 18) {
        times.push(`${hour.toString().padStart(2, '0')}:30`);
      }
    }
    return times;
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const handleSubmit = async () => {
    if (!user || !selectedMaster || !selectedService || !selectedDate || !selectedTime) {
      setError('Please complete all required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.from('bookings').insert({
        user_id: user.id,
        master_id: selectedMaster.id,
        service_id: selectedService.id,
        booking_date: selectedDate,
        booking_time: selectedTime,
        notes: notes || null,
        status: 'pending',
      });

      if (error) throw error;

      onBookingComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    if (step === 1) return selectedMaster !== null;
    if (step === 2) return selectedService !== null;
    if (step === 3) return selectedDate !== '' && selectedTime !== '';
    return false;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-light mb-4" style={{ color: 'var(--text-primary)' }}>
          Book Appointment
        </h1>
        <div className="flex items-center space-x-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all"
                style={{
                  backgroundColor: step >= s ? 'var(--accent)' : 'var(--bg-tertiary)',
                  color: step >= s ? 'white' : 'var(--text-tertiary)',
                }}
              >
                {s}
              </div>
              {s < 3 && (
                <div
                  className="w-16 h-1 mx-2"
                  style={{
                    backgroundColor: step > s ? 'var(--accent)' : 'var(--bg-tertiary)',
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {step === 1 && (
        <div>
          <h2 className="text-2xl font-light mb-6" style={{ color: 'var(--text-primary)' }}>
            Select Master
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {masters.map((master) => (
              <MasterCard
                key={master.id}
                master={master}
                selected={selectedMaster?.id === master.id}
                onSelect={setSelectedMaster}
              />
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 className="text-2xl font-light mb-6" style={{ color: 'var(--text-primary)' }}>
            Select Service
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                selected={selectedService?.id === service.id}
                onSelect={setSelectedService}
              />
            ))}
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <h2 className="text-2xl font-light mb-6" style={{ color: 'var(--text-primary)' }}>
            Select Date & Time
          </h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={getMinDate()}
                className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  borderColor: 'var(--border)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                Time
              </label>
              <div className="grid grid-cols-4 gap-2">
                {getAvailableTimes().map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className="px-4 py-2 rounded-lg border transition-all hover:scale-105"
                    style={{
                      backgroundColor: selectedTime === time ? 'var(--accent)' : 'var(--bg-secondary)',
                      borderColor: selectedTime === time ? 'var(--accent)' : 'var(--border)',
                      color: selectedTime === time ? 'white' : 'var(--text-primary)',
                    }}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                Additional Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  borderColor: 'var(--border)',
                  color: 'var(--text-primary)',
                }}
                placeholder="Any special requests or notes..."
              />
            </div>

            <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <h3 className="font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
                Booking Summary
              </h3>
              <div className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <div className="flex justify-between">
                  <span>Master:</span>
                  <span className="font-medium">{selectedMaster?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service:</span>
                  <span className="font-medium">{selectedService?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span className="font-medium">{selectedService?.duration_minutes} min</span>
                </div>
                <div className="flex justify-between">
                  <span>Price:</span>
                  <span className="font-medium">${selectedService?.price.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-6 p-3 rounded-lg text-sm" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--error)' }}>
          {error}
        </div>
      )}

      <div className="flex justify-between mt-8">
        <button
          onClick={() => setStep(step - 1)}
          disabled={step === 1}
          className="px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-all hover:opacity-80 disabled:opacity-30"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
          }}
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>

        {step < 3 ? (
          <button
            onClick={() => setStep(step + 1)}
            disabled={!canProceed()}
            className="px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-all hover:opacity-90 disabled:opacity-50"
            style={{
              backgroundColor: 'var(--accent)',
              color: 'white',
            }}
          >
            <span>Next</span>
            <ArrowRight size={20} />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!canProceed() || loading}
            className="px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-all hover:opacity-90 disabled:opacity-50"
            style={{
              backgroundColor: 'var(--accent)',
              color: 'white',
            }}
          >
            <Calendar size={20} />
            <span>{loading ? 'Booking...' : 'Confirm Booking'}</span>
          </button>
        )}
      </div>
    </div>
  );
}
