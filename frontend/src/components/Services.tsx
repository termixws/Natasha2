import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { serviceApi } from '../services/api';
import type { Service } from '../types';

interface ServicesProps {
  onBookService: (service: Service) => void;
}

export default function Services({ onBookService }: ServicesProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      const data = await serviceApi.getAll();
      setServices(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="text-center text-gray-600">Loading services...</div>
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
      <div className="text-center mb-12">
        <h2 className="text-4xl font-light text-gray-900 mb-4">Our Services</h2>
        <p className="text-gray-600 font-light max-w-2xl mx-auto">
          Professional beauty treatments tailored to your needs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-white border border-gray-200 p-6 hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-light text-gray-900 mb-2">{service.name}</h3>
            <p className="text-gray-600 text-sm font-light mb-4">{service.description}</p>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <Clock className="w-4 h-4" />
                <span>{service.duration} min</span>
              </div>
              <span className="text-xl font-light text-gray-900">${service.price}</span>
            </div>

            <button
              onClick={() => onBookService(service)}
              className="w-full bg-gray-900 text-white py-2 text-sm font-light hover:bg-gray-800 transition-colors"
            >
              Book Now
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
