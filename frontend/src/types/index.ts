export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export interface UserCreate {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface UserUpdate {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
}

export interface Master {
  id: number;
  name: string;
  sex: string;
  phone: string;
  experience: number;
  specialty: string;
}

export interface MasterCreate {
  name: string;
  sex: string;
  phone: string;
  experience: number;
  specialty: string;
}

export interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number;
}

export interface ServiceCreate {
  name: string;
  description: string;
  price: number;
  duration: number;
}

export interface Appointment {
  id: number;
  date_time: string;
  status: string;
  user_id: number;
  master_id: number;
  service_id: number;
}

export interface AppointmentCreate {
  date_time: string;
  user_id: number;
  master_id: number;
  service_id: number;
}

export interface AppointmentUpdate {
  date_time?: string;
  status?: string;
  user_id?: number;
  master_id?: number;
  service_id?: number;
}
