import { useState, useEffect } from 'react';
import { X, Calendar } from 'lucide-react';
import { serviceApi, masterApi, appointmentApi } from '../services/api';
import type { Service, Master } from '../types';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number | null;
  preselectedService?: Service | null;
  onSuccess: () => void;
}

export default function BookingModal({
  isOpen,
  onClose,
  userId,
  preselectedService,
  onSuccess,
}: BookingModalProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [masters, setMasters] = useState<Master[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
  const [selectedMasterId, setSelectedMasterId] = useState<number | null>(null);
  const [dateTime, setDateTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadData();
      if (preselectedService) {
        setSelectedServiceId(preselectedService.id);
      }
    }
  }, [isOpen, preselectedService]);

  const loadData = async () => {
    try {
      const [servicesData, mastersData] = await Promise.all([
        serviceApi.getAll(),
        masterApi.getAll(),
      ]);
      setServices(servicesData);
      setMasters(mastersData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      setError('Please login to book an appointment');
      return;
    }

    if (!selectedServiceId || !selectedMasterId || !dateTime) {
      setError('Please fill all fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await appointmentApi.create({
        date_time: dateTime,
        user_id: userId,
        master_id: selectedMasterId,
        service_id: selectedServiceId,
      });

      onSuccess();
      onClose();
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedServiceId(null);
    setSelectedMasterId(null);
    setDateTime('');
    setError(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-light text-gray-900 mb-6">Book Appointment</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-light text-gray-700 mb-2">
              Service
            </label>
            <select
              value={selectedServiceId || ''}
              onChange={(e) => setSelectedServiceId(Number(e.target.value))}
              className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-gray-900"
              required
            >
              <option value="">Select a service</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name} - ${service.price} ({service.duration} min)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-light text-gray-700 mb-2">
              Master
            </label>
            <select
              value={selectedMasterId || ''}
              onChange={(e) => setSelectedMasterId(Number(e.target.value))}
              className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-gray-900"
              required
            >
              <option value="">Select a master</option>
              {masters.map((master) => (
                <option key={master.id} value={master.id}>
                  {master.name} - {master.specialty}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-light text-gray-700 mb-2">
              Date & Time
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="datetime-local"
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                className="w-full border border-gray-300 pl-10 pr-3 py-2 text-sm focus:outline-none focus:border-gray-900"
                required
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 py-2 text-sm font-light hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gray-900 text-white py-2 text-sm font-light hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {loading ? 'Booking...' : 'Book Now'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
