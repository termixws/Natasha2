import { Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white text-lg font-light mb-4">Salon Natasha</h3>
            <p className="text-sm font-light">
              Professional beauty services in a minimalist, relaxing environment.
            </p>
          </div>

          <div>
            <h3 className="text-white text-lg font-light mb-4">Contact</h3>
            <div className="space-y-2 text-sm font-light">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+1 234 567 8900</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>info@salonnatasha.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>123 Beauty Street, City</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-white text-lg font-light mb-4">Hours</h3>
            <div className="space-y-1 text-sm font-light">
              <p>Monday - Friday: 9:00 AM - 8:00 PM</p>
              <p>Saturday: 10:00 AM - 6:00 PM</p>
              <p>Sunday: Closed</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm font-light">
          <p>&copy; 2024 Salon Natasha. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
