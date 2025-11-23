import type {
  User,
  UserCreate,
  UserUpdate,
  Master,
  Service,
  Appointment,
  AppointmentCreate,
  AppointmentUpdate,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
    throw new Error(error.detail || `HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export const userApi = {
  getAll: async (): Promise<User[]> => {
    const response = await fetch(`${API_BASE_URL}/users/`);
    return handleResponse<User[]>(response);
  },

  getById: async (id: number): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`);
    return handleResponse<User>(response);
  },

  create: async (data: UserCreate): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<User>(response);
  },

  update: async (id: number, data: UserUpdate): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<User>(response);
  },

  delete: async (id: number): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'DELETE',
    });
    return handleResponse<{ message: string }>(response);
  },
};

export const masterApi = {
  getAll: async (): Promise<Master[]> => {
    const response = await fetch(`${API_BASE_URL}/master/`);
    return handleResponse<Master[]>(response);
  },

  getById: async (id: number): Promise<Master> => {
    const response = await fetch(`${API_BASE_URL}/master/${id}`);
    return handleResponse<Master>(response);
  },
};

export const serviceApi = {
  getAll: async (): Promise<Service[]> => {
    const response = await fetch(`${API_BASE_URL}/service/`);
    return handleResponse<Service[]>(response);
  },

  getById: async (id: number): Promise<Service> => {
    const response = await fetch(`${API_BASE_URL}/service/${id}`);
    return handleResponse<Service>(response);
  },
};

export const appointmentApi = {
  getAll: async (): Promise<Appointment[]> => {
    const response = await fetch(`${API_BASE_URL}/appointment/`);
    return handleResponse<Appointment[]>(response);
  },

  getById: async (id: number): Promise<Appointment> => {
    const response = await fetch(`${API_BASE_URL}/appointment/${id}`);
    return handleResponse<Appointment>(response);
  },

  create: async (data: AppointmentCreate): Promise<Appointment> => {
    const response = await fetch(`${API_BASE_URL}/appointment/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<Appointment>(response);
  },

  update: async (id: number, data: AppointmentUpdate): Promise<Appointment> => {
    const response = await fetch(`${API_BASE_URL}/appointment/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<Appointment>(response);
  },

  delete: async (id: number): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE_URL}/appointment/${id}`, {
      method: 'DELETE',
    });
    return handleResponse<{ message: string }>(response);
  },
};
