import { useState } from 'react';
import { X, User, Mail, Phone, Lock } from 'lucide-react';
import { userApi } from '../services/api';
import type { User as UserType } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: UserType) => void;
}

export default function AuthModal({ isOpen, onClose, onLogin }: AuthModalProps) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLoginMode) {
        const users = await userApi.getAll();
        const user = users.find((u) => u.email === formData.email);

        if (!user) {
          throw new Error('Invalid email or password');
        }

        onLogin(user);
        onClose();
        resetForm();
      } else {
        const newUser = await userApi.create({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        });

        onLogin(newUser);
        onClose();
        resetForm();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', phone: '', password: '' });
    setError(null);
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    resetForm();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-light text-gray-900 mb-6">
          {isLoginMode ? 'Login' : 'Sign Up'}
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLoginMode && (
            <div>
              <label className="block text-sm font-light text-gray-700 mb-2">
                Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-gray-300 pl-10 pr-3 py-2 text-sm focus:outline-none focus:border-gray-900"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-light text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full border border-gray-300 pl-10 pr-3 py-2 text-sm focus:outline-none focus:border-gray-900"
                required
              />
            </div>
          </div>

          {!isLoginMode && (
            <div>
              <label className="block text-sm font-light text-gray-700 mb-2">
                Phone
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full border border-gray-300 pl-10 pr-3 py-2 text-sm focus:outline-none focus:border-gray-900"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-light text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full border border-gray-300 pl-10 pr-3 py-2 text-sm focus:outline-none focus:border-gray-900"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white py-2 text-sm font-light hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {loading ? 'Processing...' : isLoginMode ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={toggleMode}
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            {isLoginMode
              ? "Don't have an account? Sign up"
              : 'Already have an account? Login'}
          </button>
        </div>
      </div>
    </div>
  );
}
