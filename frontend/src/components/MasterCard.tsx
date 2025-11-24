import { Star } from 'lucide-react';
import { Master } from '../lib/supabase';

interface MasterCardProps {
  master: Master;
  selected: boolean;
  onSelect: (master: Master) => void;
}

export default function MasterCard({ master, selected, onSelect }: MasterCardProps) {
  return (
    <button
      onClick={() => onSelect(master)}
      className="w-full text-left p-4 rounded-lg border-2 transition-all hover:scale-[1.02]"
      style={{
        backgroundColor: selected ? 'var(--accent)' : 'var(--bg-secondary)',
        borderColor: selected ? 'var(--accent)' : 'var(--border)',
        color: selected ? 'white' : 'var(--text-primary)',
      }}
    >
      <div className="flex items-start space-x-4">
        <img
          src={master.photo_url || 'https://images.pexels.com/photos/3785424/pexels-photo-3785424.jpeg'}
          alt={master.name}
          className="w-20 h-20 rounded-full object-cover"
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-medium mb-1">{master.name}</h3>
          <p className="text-sm mb-2 opacity-90">{master.specialization}</p>
          {master.description && (
            <p className="text-sm opacity-75 line-clamp-2 mb-2">{master.description}</p>
          )}
          <div className="flex items-center space-x-1">
            <Star size={16} fill="currentColor" />
            <span className="text-sm font-medium">{master.rating.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </button>
  );
}
