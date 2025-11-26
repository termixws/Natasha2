import { Calendar, Trash2 } from 'lucide-react';
import type { Appointment, Service, Master } from '../types/api';
import { appointmentsAPI } from '../lib/api';
import { useState } from 'react';

interface AppointmentsListProps {
  appointments: Appointment[];
  services: Service[];
  masters: Master[];
  onUpdate: () => void;
}

export default function AppointmentsList({
  appointments,
  services,
  masters,
  onUpdate,
}: AppointmentsListProps) {
  const [deleting, setDeleting] = useState<number | null>(null);

  const getServiceName = (serviceId: number) => {
    return services.find((s) => s.id === serviceId)?.name || 'Unknown Service';
  };

  const getMasterName = (masterId: number) => {
    return masters.find((m) => m.id === masterId)?.name || 'Unknown Master';
  };

  const formatDateTime = (datetime: string) => {
    return new Date(datetime).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;

    try {
      setDeleting(id);
      await appointmentsAPI.delete(id);
      onUpdate();
    } catch (error) {
      alert('Failed to cancel appointment');
    } finally {
      setDeleting(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Appointments</h2>
      {appointments.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No appointments scheduled</p>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar size={20} className="text-rose-600" />
                    <span className="font-semibold text-gray-800">
                      {formatDateTime(appointment.appointment_datetime)}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>
                      <span className="font-medium">Service:</span> {getServiceName(appointment.service_id)}
                    </p>
                    <p>
                      <span className="font-medium">Master:</span> {getMasterName(appointment.master_id)}
                    </p>
                    <div className="mt-2">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          appointment.status
                        )}`}
                      >
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(appointment.id!)}
                  disabled={deleting === appointment.id}
                  className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  title="Cancel appointment"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
