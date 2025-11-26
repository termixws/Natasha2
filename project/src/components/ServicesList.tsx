import { Clock, DollarSign } from 'lucide-react';
import type { Service } from '../types/api';

interface ServicesListProps {
  services: Service[];
  onUpdate: () => void;
}

export default function ServicesList({ services }: ServicesListProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Our Services</h2>
      {services.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No services available</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{service.name}</h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-gray-700">
                  <Clock size={16} />
                  <span>{service.duration_minutes} min</span>
                </div>
                <div className="flex items-center gap-1 text-rose-600 font-semibold">
                  <DollarSign size={16} />
                  <span>{service.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
