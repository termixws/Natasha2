import type { User, Master, Service, Appointment } from '../types/api';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8080';

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
    throw new Error(error.detail || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export const usersAPI = {
  getAll: () => fetchAPI<User[]>('/users/'),
  getById: (id: number) => fetchAPI<User>(`/users/${id}`),
  create: (user: Omit<User, 'id'>) =>
    fetchAPI<User>('/users/', {
      method: 'POST',
      body: JSON.stringify(user),
    }),
  update: (id: number, user: Partial<User>) =>
    fetchAPI<User>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(user),
    }),
  delete: (id: number) =>
    fetchAPI<{ message: string }>(`/users/${id}`, {
      method: 'DELETE',
    }),
};

export const mastersAPI = {
  getAll: () => fetchAPI<Master[]>('/master/'),
  getById: (id: number) => fetchAPI<Master>(`/master/${id}`),
  create: (master: Omit<Master, 'id'>) =>
    fetchAPI<Master>('/master/', {
      method: 'POST',
      body: JSON.stringify(master),
    }),
  update: (id: number, master: Partial<Master>) =>
    fetchAPI<Master>(`/master/${id}`, {
      method: 'PUT',
      body: JSON.stringify(master),
    }),
  delete: (id: number) =>
    fetchAPI<{ message: string }>(`/master/${id}`, {
      method: 'DELETE',
    }),
};

export const servicesAPI = {
  getAll: () => fetchAPI<Service[]>('/service/'),
  getById: (id: number) => fetchAPI<Service>(`/service/${id}`),
  create: (service: Omit<Service, 'id'>) =>
    fetchAPI<Service>('/service/', {
      method: 'POST',
      body: JSON.stringify(service),
    }),
  update: (id: number, service: Partial<Service>) =>
    fetchAPI<Service>(`/service/${id}`, {
      method: 'PUT',
      body: JSON.stringify(service),
    }),
  delete: (id: number) =>
    fetchAPI<{ message: string }>(`/service/${id}`, {
      method: 'DELETE',
    }),
};

export const appointmentsAPI = {
  getAll: () => fetchAPI<Appointment[]>('/appointment/'),
  getById: (id: number) => fetchAPI<Appointment>(`/appointment/${id}`),
  create: (appointment: Omit<Appointment, 'id'>) =>
    fetchAPI<Appointment>('/appointment/', {
      method: 'POST',
      body: JSON.stringify(appointment),
    }),
  update: (id: number, appointment: Partial<Appointment>) =>
    fetchAPI<Appointment>(`/appointment/${id}`, {
      method: 'PUT',
      body: JSON.stringify(appointment),
    }),
  delete: (id: number) =>
    fetchAPI<{ message: string }>(`/appointment/${id}`, {
      method: 'DELETE',
    }),
};
