import { Clock, DollarSign } from 'lucide-react';
import { Service } from '../lib/supabase';

interface ServiceCardProps {
  service: Service;
  selected: boolean;
  onSelect: (service: Service) => void;
}

export default function ServiceCard({ service, selected, onSelect }: ServiceCardProps) {
  return (
    <button
      onClick={() => onSelect(service)}
      className="w-full text-left p-4 rounded-lg border-2 transition-all hover:scale-[1.02]"
      style={{
        backgroundColor: selected ? 'var(--accent)' : 'var(--bg-secondary)',
        borderColor: selected ? 'var(--accent)' : 'var(--border)',
        color: selected ? 'white' : 'var(--text-primary)',
      }}
    >
      <h3 className="text-lg font-medium mb-2">{service.name}</h3>
      {service.description && (
        <p className="text-sm opacity-90 mb-3">{service.description}</p>
      )}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-1">
          <Clock size={16} />
          <span>{service.duration_minutes} min</span>
        </div>
        <div className="flex items-center space-x-1 font-medium">
          <DollarSign size={16} />
          <span>{service.price.toFixed(2)}</span>
        </div>
      </div>
    </button>
  );
}
