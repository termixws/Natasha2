import { useEffect, useState } from 'react';
import { Calendar, Clock, Trash2 } from 'lucide-react';
import { appointmentApi, serviceApi, masterApi } from '../services/api';
import type { Appointment, Service, Master } from '../types';

interface UserAppointmentsProps {
  userId: number;
}

interface AppointmentWithDetails extends Appointment {
  service?: Service;
  master?: Master;
}

export default function UserAppointments({ userId }: UserAppointmentsProps) {
  const [appointments, setAppointments] = useState<AppointmentWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAppointments();
  }, [userId]);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const [allAppointments, services, masters] = await Promise.all([
        appointmentApi.getAll(),
        serviceApi.getAll(),
        masterApi.getAll(),
      ]);

      const userAppointments = allAppointments
        .filter((apt) => apt.user_id === userId)
        .map((apt) => ({
          ...apt,
          service: services.find((s) => s.id === apt.service_id),
          master: masters.find((m) => m.id === apt.master_id),
        }));

      setAppointments(userAppointments);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    try {
      await appointmentApi.delete(id);
      setAppointments(appointments.filter((apt) => apt.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel appointment');
    }
  };

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
  };

  if (loading) {
    return (
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="text-center text-gray-600">Loading appointments...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="text-center text-red-600">{error}</div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <div className="mb-12">
        <h2 className="text-4xl font-light text-gray-900 mb-4">My Appointments</h2>
        <p className="text-gray-600 font-light">
          Manage your upcoming beauty appointments
        </p>
      </div>

      {appointments.length === 0 ? (
        <div className="text-center py-12 bg-gray-50">
          <p className="text-gray-600 font-light">You have no appointments yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {appointments.map((appointment) => {
            const { date, time } = formatDateTime(appointment.date_time);
            return (
              <div
                key={appointment.id}
                className="bg-white border border-gray-200 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-light text-gray-900 mb-1">
                      {appointment.service?.name || 'Service'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      with {appointment.master?.name || 'Master'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(appointment.id)}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>{date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>{time}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Status</span>
                    <span
                      className={`px-2 py-1 text-xs ${
                        appointment.status === 'confirmed'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {appointment.status}
                    </span>
                  </div>
                  {appointment.service && (
                    <div className="flex justify-between items-center text-sm mt-2">
                      <span className="text-gray-600">Price</span>
                      <span className="font-light text-gray-900">
                        ${appointment.service.price}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
