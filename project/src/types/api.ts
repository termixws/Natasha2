export interface User {
  id?: number;
  name: string;
  email: string;
  phone: string;
  password?: string;
}

export interface Master {
  id?: number;
  name: string;
  specialization: string;
  phone: string;
  experience_years: number;
}

export interface Service {
  id?: number;
  name: string;
  description: string;
  price: number;
  duration_minutes: number;
}

export interface Appointment {
  id?: number;
  user_id: number;
  master_id: number;
  service_id: number;
  appointment_datetime: string;
  status: string;
}
