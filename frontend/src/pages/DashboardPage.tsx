import { useState, useEffect } from 'react';
import { Calendar, Clock, User, X, Plus } from 'lucide-react';
import { supabase, Booking } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface DashboardPageProps {
  onNewBooking: () => void;
}

export default function DashboardPage({ onNewBooking }: DashboardPageProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadBookings();
    }
  }, [user]);

  const loadBookings = async () => {
    if (!user) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        master:masters(*),
        service:services(*)
      `)
      .eq('user_id', user.id)
      .order('booking_date', { ascending: true })
      .order('booking_time', { ascending: true });

    if (error) {
      console.error('Error loading bookings:', error);
    } else {
      setBookings(data || []);
    }
    setLoading(false);
  };

  const handleCancelBooking = async (bookingId: string) => {
    setCancellingId(bookingId);
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId);

      if (error) throw error;
      await loadBookings();
    } catch (error) {
      console.error('Error cancelling booking:', error);
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'var(--success)';
      case 'pending':
        return 'var(--accent)';
      case 'cancelled':
        return 'var(--error)';
      case 'completed':
        return 'var(--text-tertiary)';
      default:
        return 'var(--text-secondary)';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const upcomingBookings = bookings.filter(b =>
    b.status !== 'cancelled' &&
    b.status !== 'completed' &&
    new Date(`${b.booking_date}T${b.booking_time}`) >= new Date()
  );

  const pastBookings = bookings.filter(b =>
    b.status === 'completed' ||
    b.status === 'cancelled' ||
    new Date(`${b.booking_date}T${b.booking_time}`) < new Date()
  );

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent mx-auto mb-4"
               style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }}></div>
          <p style={{ color: 'var(--text-secondary)' }}>Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-light" style={{ color: 'var(--text-primary)' }}>
          My Appointments
        </h1>
        <button
          onClick={onNewBooking}
          className="px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-all hover:opacity-90"
          style={{ backgroundColor: 'var(--accent)', color: 'white' }}
        >
          <Plus size={20} />
          <span>New Booking</span>
        </button>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-16">
          <Calendar size={64} className="mx-auto mb-4 opacity-50" style={{ color: 'var(--text-tertiary)' }} />
          <h2 className="text-xl font-light mb-2" style={{ color: 'var(--text-primary)' }}>
            No bookings yet
          </h2>
          <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
            Book your first appointment to get started
          </p>
          <button
            onClick={onNewBooking}
            className="px-6 py-3 rounded-lg font-medium transition-all hover:opacity-90"
            style={{ backgroundColor: 'var(--accent)', color: 'white' }}
          >
            Book Now
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {upcomingBookings.length > 0 && (
            <section>
              <h2 className="text-xl font-light mb-4" style={{ color: 'var(--text-primary)' }}>
                Upcoming Appointments
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                {upcomingBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="p-6 rounded-lg border"
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      borderColor: 'var(--border)',
                    }}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div
                        className="px-3 py-1 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: 'var(--bg-tertiary)',
                          color: getStatusColor(booking.status),
                        }}
                      >
                        {booking.status.toUpperCase()}
                      </div>
                      {booking.status === 'pending' && (
                        <button
                          onClick={() => handleCancelBooking(booking.id)}
                          disabled={cancellingId === booking.id}
                          className="p-1 rounded hover:opacity-70 transition-opacity"
                          title="Cancel booking"
                        >
                          <X size={20} style={{ color: 'var(--error)' }} />
                        </button>
                      )}
                    </div>

                    <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                      {booking.service?.name}
                    </h3>

                    <div className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      <div className="flex items-center space-x-2">
                        <User size={16} />
                        <span>{booking.master?.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar size={16} />
                        <span>{formatDate(booking.booking_date)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock size={16} />
                        <span>{booking.booking_time}</span>
                      </div>
                    </div>

                    {booking.notes && (
                      <div className="mt-4 pt-4 border-t text-sm" style={{ borderColor: 'var(--border)', color: 'var(--text-tertiary)' }}>
                        <p className="italic">"{booking.notes}"</p>
                      </div>
                    )}

                    <div className="mt-4 pt-4 border-t flex justify-between items-center" style={{ borderColor: 'var(--border)' }}>
                      <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                        {booking.service?.duration_minutes} minutes
                      </span>
                      <span className="text-lg font-medium" style={{ color: 'var(--accent)' }}>
                        ${booking.service?.price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {pastBookings.length > 0 && (
            <section>
              <h2 className="text-xl font-light mb-4" style={{ color: 'var(--text-primary)' }}>
                Past Appointments
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                {pastBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="p-6 rounded-lg border opacity-75"
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      borderColor: 'var(--border)',
                    }}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div
                        className="px-3 py-1 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: 'var(--bg-tertiary)',
                          color: getStatusColor(booking.status),
                        }}
                      >
                        {booking.status.toUpperCase()}
                      </div>
                    </div>

                    <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                      {booking.service?.name}
                    </h3>

                    <div className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      <div className="flex items-center space-x-2">
                        <User size={16} />
                        <span>{booking.master?.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar size={16} />
                        <span>{formatDate(booking.booking_date)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock size={16} />
                        <span>{booking.booking_time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
