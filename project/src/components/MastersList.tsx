import { Phone, Award } from 'lucide-react';
import type { Master } from '../types/api';

interface MastersListProps {
  masters: Master[];
  onUpdate: () => void;
}

export default function MastersList({ masters }: MastersListProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Our Masters</h2>
      {masters.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No masters available</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {masters.map((master) => (
            <div
              key={master.id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{master.name}</h3>
                  <p className="text-rose-600 text-sm">{master.specialization}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Award size={16} />
                  <span>{master.experience_years} years experience</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16} />
                  <span>{master.phone}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
