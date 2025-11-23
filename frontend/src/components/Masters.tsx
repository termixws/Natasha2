import { useEffect, useState } from 'react';
import { Award, Phone } from 'lucide-react';
import { masterApi } from '../services/api';
import type { Master } from '../types';

interface MastersProps {
  onSelectMaster?: (master: Master) => void;
}

export default function Masters({ onSelectMaster }: MastersProps) {
  const [masters, setMasters] = useState<Master[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMasters();
  }, []);

  const loadMasters = async () => {
    try {
      setLoading(true);
      const data = await masterApi.getAll();
      setMasters(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load masters');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="text-center text-gray-600">Loading masters...</div>
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
        <h2 className="text-4xl font-light text-gray-900 mb-4">Our Masters</h2>
        <p className="text-gray-600 font-light max-w-2xl mx-auto">
          Experienced professionals dedicated to your beauty
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {masters.map((master) => (
          <div
            key={master.id}
            className="bg-white border border-gray-200 p-6 hover:shadow-lg transition-shadow"
          >
            <div className="w-24 h-24 rounded-full bg-gray-200 mx-auto mb-4 flex items-center justify-center text-3xl font-light text-gray-600">
              {master.name.charAt(0)}
            </div>

            <h3 className="text-xl font-light text-gray-900 text-center mb-1">
              {master.name}
            </h3>
            <p className="text-sm text-gray-600 text-center mb-4">{master.specialty}</p>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-center gap-2 text-gray-600 text-sm">
                <Award className="w-4 h-4" />
                <span>{master.experience} years experience</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-gray-600 text-sm">
                <Phone className="w-4 h-4" />
                <span>{master.phone}</span>
              </div>
            </div>

            {onSelectMaster && (
              <button
                onClick={() => onSelectMaster(master)}
                className="w-full bg-gray-900 text-white py-2 text-sm font-light hover:bg-gray-800 transition-colors"
              >
                Choose Master
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
