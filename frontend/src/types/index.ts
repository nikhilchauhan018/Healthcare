export type UserRole = 'STAFF' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  is_staff: boolean;
  avatarInitial?: string;
}

export type PatientStatus = 'Stable' | 'Critical' | 'Recovering' | 'High Risk' | 'Pending';

export interface Patient {
  id: string;
  name: string;
  patientId: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  address?: string;
  medicalHistory?: string;
  status: PatientStatus;
  assignedDoctorName: string;
  assignedDoctorId: string;
  createdAt: string;
}

export interface Doctor {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  yearsOfExperience: number;
  patientCount: number;
  available: boolean;
}

export interface Assignment {
  id: string;
  patientId: string;
  patientName: string;
  patientCode: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialization: string;
  assignedDate: string;
  notes?: string;
}
