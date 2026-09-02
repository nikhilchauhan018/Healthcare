import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { StatCard } from './components/StatCard';
import { StatusTag } from './components/StatusTag';
import { RegisterPage } from './components/RegisterPage';
import { LoginPage } from './components/LoginPage';
import { Patient, Doctor, Assignment, User } from './types';
import { clearStoredAuth, getStoredUser } from './services/api';

const INITIAL_USER: User = {
  id: 'u1',
  name: 'Dr. Aris Thorne',
  email: 'aris.thorne@meridianhealth.org',
  role: 'STAFF',
  is_staff: false,
  avatarInitial: 'A',
};

const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'p1',
    name: 'Elena Rodriguez',
    patientId: 'PT-8821',
    age: 42,
    gender: 'Female',
    phone: '+1 (555) 234-8901',
    address: '742 Evergreen Terrace, Springfield',
    medicalHistory: 'Hypertension, managed with medication',
    status: 'Stable',
    assignedDoctorName: 'Dr. Julian Vane',
    assignedDoctorId: 'd1',
    createdAt: '2026-08-28',
  },
  {
    id: 'p2',
    name: 'Marcus Holloway',
    patientId: 'PT-9012',
    age: 38,
    gender: 'Male',
    phone: '+1 (555) 872-1092',
    address: '1048 Ocean Avenue, San Francisco',
    medicalHistory: 'Severe concussion, neurological observation',
    status: 'Critical',
    assignedDoctorName: 'Dr. Sarah Chen',
    assignedDoctorId: 'd2',
    createdAt: '2026-08-29',
  },
  {
    id: 'p3',
    name: 'Sarah Jenkins',
    patientId: 'PT-7724',
    age: 29,
    gender: 'Female',
    phone: '+1 (555) 431-7782',
    address: '221B Baker Street, London',
    medicalHistory: 'Post-appendectomy recovery',
    status: 'Recovering',
    assignedDoctorName: 'Dr. Aris Thorne',
    assignedDoctorId: 'd3',
    createdAt: '2026-08-30',
  },
  {
    id: 'p4',
    name: 'Amir Al-Farsi',
    patientId: 'PT-8110',
    age: 51,
    gender: 'Male',
    phone: '+1 (555) 902-3341',
    address: '42 Wallaby Way, Sydney',
    medicalHistory: 'Type 2 Diabetes, routine monitoring',
    status: 'Stable',
    assignedDoctorName: 'Dr. Julian Vane',
    assignedDoctorId: 'd1',
    createdAt: '2026-08-31',
  },
  {
    id: 'p5',
    name: 'Catherine Wu',
    patientId: 'PT-6591',
    age: 63,
    gender: 'Female',
    phone: '+1 (555) 671-4459',
    address: '88 King Street, Seattle',
    medicalHistory: 'Cardiac arrhythmia, high risk for stroke',
    status: 'High Risk',
    assignedDoctorName: 'Dr. Sarah Chen',
    assignedDoctorId: 'd2',
    createdAt: '2026-09-01',
  },
];

const INITIAL_DOCTORS: Doctor[] = [
  {
    id: 'd1',
    name: 'Dr. Julian Vane',
    email: 'j.vane@meridianhealth.org',
    phone: '+1 (555) 301-8821',
    specialization: 'Cardiology',
    yearsOfExperience: 14,
    patientCount: 8,
    available: true,
  },
  {
    id: 'd2',
    name: 'Dr. Sarah Chen',
    email: 's.chen@meridianhealth.org',
    phone: '+1 (555) 492-7710',
    specialization: 'Neurology',
    yearsOfExperience: 11,
    patientCount: 6,
    available: true,
  },
  {
    id: 'd3',
    name: 'Dr. Aris Thorne',
    email: 'a.thorne@meridianhealth.org',
    phone: '+1 (555) 662-9014',
    specialization: 'Internal Medicine',
    yearsOfExperience: 9,
    patientCount: 5,
    available: true,
  },
  {
    id: 'd4',
    name: 'Dr. Marcus Vance',
    email: 'm.vance@meridianhealth.org',
    phone: '+1 (555) 781-2299',
    specialization: 'Pediatrics',
    yearsOfExperience: 7,
    patientCount: 5,
    available: false,
  },
];

const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'm1',
    patientId: 'p1',
    patientName: 'Elena Rodriguez',
    patientCode: 'PT-8821',
    doctorId: 'd1',
    doctorName: 'Dr. Julian Vane',
    doctorSpecialization: 'Cardiology',
    assignedDate: '2026-08-28',
    notes: 'Routine cardiac follow-up',
  },
  {
    id: 'm2',
    patientId: 'p2',
    patientName: 'Marcus Holloway',
    patientCode: 'PT-9012',
    doctorId: 'd2',
    doctorName: 'Dr. Sarah Chen',
    doctorSpecialization: 'Neurology',
    assignedDate: '2026-08-29',
    notes: 'Neurological ICU monitoring',
  },
  {
    id: 'm3',
    patientId: 'p3',
    patientName: 'Sarah Jenkins',
    patientCode: 'PT-7724',
    doctorId: 'd3',
    doctorName: 'Dr. Aris Thorne',
    doctorSpecialization: 'Internal Medicine',
    assignedDate: '2026-08-30',
    notes: 'Post-op observation',
  },
  {
    id: 'm4',
    patientId: 'p5',
    patientName: 'Catherine Wu',
    patientCode: 'PT-6591',
    doctorId: 'd2',
    doctorName: 'Dr. Sarah Chen',
    doctorSpecialization: 'Neurology',
    assignedDate: '2026-09-01',
    notes: 'High-risk cardiology consultation',
  },
];

export default function App() {
  const [currentView, setCurrentView] = useState<'register' | 'login' | 'dashboard'>('register');
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = getStoredUser();
    return saved || INITIAL_USER;
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [doctors, setDoctors] = useState<Doctor[]>(INITIAL_DOCTORS);
  const [assignments, setAssignments] = useState<Assignment[]>(INITIAL_ASSIGNMENTS);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [showAddPatientModal, setShowAddPatientModal] = useState<boolean>(false);
  const [showAddDoctorModal, setShowAddDoctorModal] = useState<boolean>(false);
  const [showAssignModal, setShowAssignModal] = useState<boolean>(false);

  // Edit modals state
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);

  // Form states for Add Patient
  const [newPatientName, setNewPatientName] = useState<string>('');
  const [newPatientAge, setNewPatientAge] = useState<string>('');
  const [newPatientGender, setNewPatientGender] = useState<'Male' | 'Female' | 'Other'>('Female');
  const [newPatientPhone, setNewPatientPhone] = useState<string>('');
  const [newPatientAddress, setNewPatientAddress] = useState<string>('');
  const [newPatientMedicalHistory, setNewPatientMedicalHistory] = useState<string>('');
  const [newPatientDoctor, setNewPatientDoctor] = useState<string>('Dr. Julian Vane');
  const [newPatientStatus, setNewPatientStatus] = useState<Patient['status']>('Stable');

  // Form states for Add Doctor
  const [newDocName, setNewDocName] = useState<string>('');
  const [newDocSpecialization, setNewDocSpecialization] = useState<string>('Cardiology');
  const [newDocExperience, setNewDocExperience] = useState<string>('5');
  const [newDocEmail, setNewDocEmail] = useState<string>('');
  const [newDocPhone, setNewDocPhone] = useState<string>('');
  const [newDocAvailable, setNewDocAvailable] = useState<boolean>(true);

  // Form states for Assign Doctor
  const [selectedPatientId, setSelectedPatientId] = useState<string>(INITIAL_PATIENTS[0]?.id || '');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(INITIAL_DOCTORS[0]?.id || '');
  const [assignNotes, setAssignNotes] = useState<string>('');

  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    clearStoredAuth();
    setCurrentView('login');
  };

  // Filtered queries
  const filteredPatients = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.assignedDoctorName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDoctors = doctors.filter(
    (d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAssignments = assignments.filter(
    (a) =>
      a.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.doctorSpecialization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Add Patient Handler
  const handleAddPatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatientName.trim()) return;

    const matchedDoc = doctors.find((d) => d.name === newPatientDoctor);

    const newEntry: Patient = {
      id: `p-${Date.now()}`,
      name: newPatientName.trim(),
      patientId: `PT-${Math.floor(1000 + Math.random() * 9000)}`,
      age: parseInt(newPatientAge) || 35,
      gender: newPatientGender,
      phone: newPatientPhone.trim() || '+1 (555) 000-0000',
      address: newPatientAddress.trim() || 'Not specified',
      medicalHistory: newPatientMedicalHistory.trim() || 'No prior conditions recorded',
      status: newPatientStatus,
      assignedDoctorName: newPatientDoctor,
      assignedDoctorId: matchedDoc ? matchedDoc.id : 'd1',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setPatients([newEntry, ...patients]);
    setNewPatientName('');
    setNewPatientAge('');
    setNewPatientPhone('');
    setNewPatientAddress('');
    setNewPatientMedicalHistory('');
    setShowAddPatientModal(false);
  };

  // Add Doctor Handler
  const handleAddDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName.trim()) return;

    const newDoc: Doctor = {
      id: `d-${Date.now()}`,
      name: newDocName.startsWith('Dr.') ? newDocName.trim() : `Dr. ${newDocName.trim()}`,
      email: newDocEmail.trim() || `${newDocName.toLowerCase().replace(/[^a-z]/g, '')}@meridianhealth.org`,
      phone: newDocPhone.trim() || '+1 (555) 000-0000',
      specialization: newDocSpecialization.trim() || 'General Medicine',
      yearsOfExperience: parseInt(newDocExperience) || 5,
      patientCount: 0,
      available: newDocAvailable,
    };

    setDoctors([newDoc, ...doctors]);
    setNewDocName('');
    setNewDocEmail('');
    setNewDocPhone('');
    setNewDocExperience('5');
    setShowAddDoctorModal(false);
  };

  // Add Assignment Handler
  const handleAssignDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    const p = patients.find((pat) => pat.id === selectedPatientId);
    const d = doctors.find((doc) => doc.id === selectedDoctorId);
    if (!p || !d) return;

    const newAssignment: Assignment = {
      id: `m-${Date.now()}`,
      patientId: p.id,
      patientName: p.name,
      patientCode: p.patientId,
      doctorId: d.id,
      doctorName: d.name,
      doctorSpecialization: d.specialization,
      assignedDate: new Date().toISOString().split('T')[0],
      notes: assignNotes.trim() || 'Assigned via clinical portal',
    };

    setAssignments([newAssignment, ...assignments]);

    // Update patient assigned doctor
    setPatients((prev) =>
      prev.map((pat) =>
        pat.id === p.id
          ? { ...pat, assignedDoctorName: d.name, assignedDoctorId: d.id }
          : pat
      )
    );

    // Update doctor patient count
    setDoctors((prev) =>
      prev.map((doc) =>
        doc.id === d.id ? { ...doc, patientCount: doc.patientCount + 1 } : doc
      )
    );

    setAssignNotes('');
    setShowAssignModal(false);
  };

  // Update Patient
  const handleSaveEditPatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPatient) return;

    setPatients((prev) =>
      prev.map((p) => (p.id === editingPatient.id ? editingPatient : p))
    );
    setEditingPatient(null);
  };

  // Delete Patient
  const handleDeletePatient = (patientId: string) => {
    if (window.confirm('Are you sure you want to delete this patient record?')) {
      setPatients((prev) => prev.filter((p) => p.id !== patientId));
      setAssignments((prev) => prev.filter((a) => a.patientId !== patientId));
    }
  };

  // Update Doctor
  const handleSaveEditDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDoctor) return;

    setDoctors((prev) =>
      prev.map((d) => (d.id === editingDoctor.id ? editingDoctor : d))
    );
    setEditingDoctor(null);
  };

  // Delete Doctor
  const handleDeleteDoctor = (doctorId: string) => {
    if (window.confirm('Are you sure you want to delete this doctor record?')) {
      setDoctors((prev) => prev.filter((d) => d.id !== doctorId));
      setAssignments((prev) => prev.filter((a) => a.doctorId !== doctorId));
    }
  };

  // Delete Assignment
  const handleDeleteAssignment = (assignmentId: string) => {
    if (window.confirm('Are you sure you want to unassign this doctor from the patient?')) {
      setAssignments((prev) => prev.filter((a) => a.id !== assignmentId));
    }
  };

  // Top action button click router
  const handleTopActionClick = () => {
    if (activeTab === 'doctors') {
      setShowAddDoctorModal(true);
    } else if (activeTab === 'assignments') {
      setShowAssignModal(true);
    } else {
      setShowAddPatientModal(true);
    }
  };

  if (currentView === 'register') {
    return (
      <div className="relative">
        <RegisterPage
          onSuccess={handleAuthSuccess}
          onSwitchToLogin={() => setCurrentView('login')}
        />
      </div>
    );
  }

  if (currentView === 'login') {
    return (
      <div className="relative">
        <LoginPage
          onSuccess={handleAuthSuccess}
          onSwitchToRegister={() => setCurrentView('register')}
        />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-paper text-ink overflow-hidden font-sans">
      {/* 220px Left Navigation Rail */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 flex flex-col p-8 overflow-y-auto">
        {/* Top Header */}
        <header className="mb-8">
          <div className="text-[10px] tracking-[0.2em] text-inkFaint mb-2 uppercase font-mono">
            TUE, SEP 1 · CLINICAL STAFF PORTAL
          </div>
          <div className="flex items-center justify-between">
            <h2 className="text-4xl font-semibold text-ink font-serif tracking-tight">
              {activeTab === 'dashboard' && 'Dashboard Overview'}
              {activeTab === 'patients' && 'Patients Directory'}
              {activeTab === 'doctors' && 'Medical Specialists'}
              {activeTab === 'assignments' && 'Patient-Doctor Assignments'}
            </h2>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-teal bg-tealTint px-2.5 py-1 rounded-sm border border-teal/20">
                ● POSTGRESQL · SYNCED
              </span>
            </div>
          </div>
        </header>

        {/* Top Stat Strip */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            id="stat-patients"
            label="Total Patients"
            value={patients.length}
            subtext="Active patient registry"
            highlight="default"
          />
          <StatCard
            id="stat-doctors"
            label="Medical Specialists"
            value={doctors.length}
            subtext={`${doctors.filter((d) => d.available).length} currently on duty`}
            highlight="default"
          />
          <StatCard
            id="stat-assignments"
            label="Active Assignments"
            value={assignments.length}
            subtext="Doctor-patient links"
            highlight="clay"
          />
          <StatCard
            id="stat-resp-time"
            label="Critical Patients"
            value={patients.filter((p) => p.status === 'Critical' || p.status === 'High Risk').length}
            subtext="High-attention records"
            highlight="teal"
          />
        </section>

        {/* Content Table Container */}
        <section className="flex-1 bg-surface border border-line flex flex-col rounded-none min-h-0 shadow-none">
          {/* Table Toolbar */}
          <div className="p-4 border-b border-line flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-semibold font-serif text-ink">
                {activeTab === 'dashboard' && 'Recent Patient Records'}
                {activeTab === 'patients' && 'All Registered Patients'}
                {activeTab === 'doctors' && 'Doctor Directory'}
                {activeTab === 'assignments' && 'Active Patient Assignments'}
              </h3>
              <input
                id="table-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  activeTab === 'doctors'
                    ? 'Search doctor by name, spec, email...'
                    : activeTab === 'assignments'
                    ? 'Search patient or doctor...'
                    : 'Search patient by name, ID...'
                }
                className="text-xs font-sans px-3 py-1.5 border border-line bg-paper text-ink focus:outline-none focus:border-teal rounded-sm w-48 sm:w-64"
              />
            </div>
            <button
              id="top-action-button"
              onClick={handleTopActionClick}
              className="px-4 py-2 bg-teal text-white text-xs font-medium rounded-sm hover:bg-tealDeep transition-colors shadow-sm"
            >
              {activeTab === 'doctors' && '+ Add Doctor'}
              {activeTab === 'assignments' && '+ Assign Doctor'}
              {(activeTab === 'patients' || activeTab === 'dashboard') && '+ Add Patient'}
            </button>
          </div>

          {/* Table Data */}
          <div className="flex-1 overflow-x-auto overflow-y-auto">
            {/* DOCTORS TABLE */}
            {activeTab === 'doctors' && (
              <table className="w-full text-left border-collapse">
                <thead className="bg-paper text-inkFaint text-[10px] uppercase font-semibold font-mono sticky top-0">
                  <tr>
                    <th className="px-6 py-3 border-b border-line">Doctor Name</th>
                    <th className="px-6 py-3 border-b border-line">Specialization</th>
                    <th className="px-6 py-3 border-b border-line">Years Experience</th>
                    <th className="px-6 py-3 border-b border-line">Contact Details</th>
                    <th className="px-6 py-3 border-b border-line">Active Patients</th>
                    <th className="px-6 py-3 border-b border-line">Status</th>
                    <th className="px-6 py-3 border-b border-line text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line text-sm">
                  {filteredDoctors.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-inkSoft text-sm">
                        No doctors match the current search.
                      </td>
                    </tr>
                  ) : (
                    filteredDoctors.map((doc) => (
                      <tr key={doc.id} className="hover:bg-paper/40 transition-colors">
                        <td className="px-6 py-4 font-medium text-ink">
                          {doc.name}
                        </td>
                        <td className="px-6 py-4">
                          <StatusTag status={doc.specialization} />
                        </td>
                        <td className="px-6 py-4 font-mono text-ink font-semibold text-xs">
                          {doc.yearsOfExperience} years
                        </td>
                        <td className="px-6 py-4 text-xs font-mono text-inkSoft">
                          <div>{doc.email}</div>
                          <div className="text-inkFaint">{doc.phone}</div>
                        </td>
                        <td className="px-6 py-4 font-mono text-inkSoft text-xs">
                          {doc.patientCount} patients
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`text-xs font-mono font-medium px-2 py-0.5 rounded-sm ${
                              doc.available ? 'bg-tealTint text-tealDeep' : 'bg-paper text-inkFaint'
                            }`}
                          >
                            {doc.available ? 'AVAILABLE' : 'OFF DUTY'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button
                            id={`edit-doctor-${doc.id}`}
                            onClick={() => setEditingDoctor(doc)}
                            className="text-teal hover:text-tealDeep font-semibold text-xs transition-colors"
                          >
                            Edit
                          </button>
                          <span className="text-line">|</span>
                          <button
                            id={`delete-doctor-${doc.id}`}
                            onClick={() => handleDeleteDoctor(doc.id)}
                            className="text-danger hover:text-danger/80 font-semibold text-xs transition-colors"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}

            {/* ASSIGNMENTS TABLE */}
            {activeTab === 'assignments' && (
              <table className="w-full text-left border-collapse">
                <thead className="bg-paper text-inkFaint text-[10px] uppercase font-semibold font-mono sticky top-0">
                  <tr>
                    <th className="px-6 py-3 border-b border-line">Patient</th>
                    <th className="px-6 py-3 border-b border-line">Patient ID</th>
                    <th className="px-6 py-3 border-b border-line">Assigned Doctor</th>
                    <th className="px-6 py-3 border-b border-line">Specialization</th>
                    <th className="px-6 py-3 border-b border-line">Date Assigned</th>
                    <th className="px-6 py-3 border-b border-line">Notes</th>
                    <th className="px-6 py-3 border-b border-line text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line text-sm">
                  {filteredAssignments.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-inkSoft text-sm">
                        No active assignments found.
                      </td>
                    </tr>
                  ) : (
                    filteredAssignments.map((assignment) => (
                      <tr key={assignment.id} className="hover:bg-paper/40 transition-colors">
                        <td className="px-6 py-4 font-medium text-ink">
                          {assignment.patientName}
                        </td>
                        <td className="px-6 py-4 font-mono text-xs text-inkFaint">
                          {assignment.patientCode}
                        </td>
                        <td className="px-6 py-4 font-medium text-inkSoft">
                          {assignment.doctorName}
                        </td>
                        <td className="px-6 py-4">
                          <StatusTag status={assignment.doctorSpecialization} />
                        </td>
                        <td className="px-6 py-4 font-mono text-xs text-inkSoft">
                          {assignment.assignedDate}
                        </td>
                        <td className="px-6 py-4 text-xs text-inkFaint">
                          {assignment.notes || '—'}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            id={`unassign-${assignment.id}`}
                            onClick={() => handleDeleteAssignment(assignment.id)}
                            className="text-danger hover:text-danger/80 font-semibold text-xs transition-colors"
                          >
                            Unassign
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}

            {/* PATIENTS TABLE (For dashboard & patients tabs) */}
            {(activeTab === 'dashboard' || activeTab === 'patients') && (
              <table className="w-full text-left border-collapse">
                <thead className="bg-paper text-inkFaint text-[10px] uppercase font-semibold font-mono sticky top-0">
                  <tr>
                    <th className="px-6 py-3 border-b border-line">Patient Name</th>
                    <th className="px-6 py-3 border-b border-line">Patient ID</th>
                    <th className="px-6 py-3 border-b border-line">Age / Gender</th>
                    <th className="px-6 py-3 border-b border-line">Status</th>
                    <th className="px-6 py-3 border-b border-line">Assigned Doctor</th>
                    <th className="px-6 py-3 border-b border-line">Contact & Address</th>
                    <th className="px-6 py-3 border-b border-line text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line text-sm">
                  {filteredPatients.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-inkSoft text-sm">
                        No patient records match the current criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredPatients.map((patient) => (
                      <tr
                        key={patient.id}
                        id={`patient-row-${patient.patientId}`}
                        className="hover:bg-paper/40 transition-colors"
                      >
                        <td className="px-6 py-4 font-medium text-ink">
                          {patient.name}
                        </td>
                        <td className="px-6 py-4 text-inkFaint font-mono text-xs">
                          {patient.patientId}
                        </td>
                        <td className="px-6 py-4 text-xs font-mono text-inkSoft">
                          {patient.age} yrs · {patient.gender}
                        </td>
                        <td className="px-6 py-4">
                          <StatusTag status={patient.status} />
                        </td>
                        <td className="px-6 py-4 text-inkSoft font-medium">
                          {patient.assignedDoctorName}
                        </td>
                        <td className="px-6 py-4 text-xs text-inkFaint max-w-xs truncate">
                          <div>{patient.phone}</div>
                          <div className="truncate">{patient.address || '—'}</div>
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button
                            id={`edit-patient-${patient.id}`}
                            onClick={() => setEditingPatient(patient)}
                            className="text-teal hover:text-tealDeep font-semibold text-xs transition-colors"
                          >
                            Edit
                          </button>
                          <span className="text-line">|</span>
                          <button
                            id={`delete-patient-${patient.id}`}
                            onClick={() => handleDeletePatient(patient.id)}
                            className="text-danger hover:text-danger/80 font-semibold text-xs transition-colors"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>

          {/* Footer Bar */}
          <div className="p-3 bg-paper border-t border-line flex justify-between items-center px-6">
            <span className="text-[10px] text-inkFaint uppercase tracking-widest font-mono">
              MERIDIAN CLINICAL RECORDS SYSTEM · DJANGO & POSTGRESQL
            </span>
            <span className="text-[10px] text-inkFaint uppercase tracking-widest font-mono">
              {activeTab === 'doctors'
                ? `${filteredDoctors.length} Doctors Listed`
                : activeTab === 'assignments'
                ? `${filteredAssignments.length} Assignments Active`
                : `${filteredPatients.length} Patients Registered`}
            </span>
          </div>
        </section>
      </main>

      {/* ========================================================================= */}
      {/* MODAL 1: ADD DOCTOR (Asks: Name, Specialization, Experience, Email, Phone) */}
      {/* ========================================================================= */}
      {showAddDoctorModal && (
        <div
          id="add-doctor-modal-overlay"
          className="fixed inset-0 bg-ink/40 backdrop-blur-[1px] flex items-center justify-center p-4 z-50"
        >
          <div
            id="add-doctor-modal-box"
            className="bg-surface border border-line p-6 max-w-lg w-full rounded-none shadow-xl"
          >
            <div className="flex justify-between items-center pb-3 border-b border-line mb-4">
              <div>
                <h4 className="text-xl font-semibold font-serif text-ink">
                  Add Medical Specialist (Doctor)
                </h4>
                <p className="text-xs text-inkFaint font-mono mt-0.5">
                  POST /api/doctors/
                </p>
              </div>
              <button
                onClick={() => setShowAddDoctorModal(false)}
                className="text-inkFaint hover:text-ink font-mono text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddDoctor} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-mono text-inkFaint mb-1">
                  Doctor Full Name
                </label>
                <input
                  type="text"
                  required
                  value={newDocName}
                  onChange={(e) => setNewDocName(e.target.value)}
                  placeholder="e.g. Dr. Marcus Vance"
                  className="w-full text-sm px-3 py-2 border border-line bg-paper text-ink focus:outline-none focus:border-teal rounded-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-mono text-inkFaint mb-1">
                    Specialization
                  </label>
                  <select
                    value={newDocSpecialization}
                    onChange={(e) => setNewDocSpecialization(e.target.value)}
                    className="w-full text-sm px-3 py-2 border border-line bg-paper text-ink focus:outline-none focus:border-teal rounded-sm font-sans text-xs"
                  >
                    <option value="Cardiology">Cardiology</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Internal Medicine">Internal Medicine</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="Dermatology">Dermatology</option>
                    <option value="General Surgery">General Surgery</option>
                    <option value="Oncology">Oncology</option>
                    <option value="Psychiatry">Psychiatry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-mono text-inkFaint mb-1">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="60"
                    required
                    value={newDocExperience}
                    onChange={(e) => setNewDocExperience(e.target.value)}
                    placeholder="e.g. 10"
                    className="w-full text-sm px-3 py-2 border border-line bg-paper text-ink focus:outline-none focus:border-teal rounded-sm font-mono text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-mono text-inkFaint mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={newDocEmail}
                    onChange={(e) => setNewDocEmail(e.target.value)}
                    placeholder="dr.vance@hospital.org"
                    className="w-full text-sm px-3 py-2 border border-line bg-paper text-ink focus:outline-none focus:border-teal rounded-sm text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-mono text-inkFaint mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    required
                    value={newDocPhone}
                    onChange={(e) => setNewDocPhone(e.target.value)}
                    placeholder="+1 (555) 781-2299"
                    className="w-full text-sm px-3 py-2 border border-line bg-paper text-ink focus:outline-none focus:border-teal rounded-sm text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono text-inkFaint mb-1">
                  Duty Status
                </label>
                <div className="flex items-center gap-4 text-xs font-mono text-ink">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="avail"
                      checked={newDocAvailable}
                      onChange={() => setNewDocAvailable(true)}
                    />
                    Available / On Duty
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="avail"
                      checked={!newDocAvailable}
                      onChange={() => setNewDocAvailable(false)}
                    />
                    Off Duty / On Leave
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-line">
                <button
                  type="button"
                  onClick={() => setShowAddDoctorModal(false)}
                  className="px-4 py-2 border border-lineStrong text-ink text-xs font-medium rounded-sm hover:bg-paper"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal text-white text-xs font-medium rounded-sm hover:bg-tealDeep transition-colors"
                >
                  Save Doctor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: ADD PATIENT (Asks: Name, Age, Gender, Phone, Address, Status)    */}
      {/* ========================================================================= */}
      {showAddPatientModal && (
        <div
          id="add-patient-modal-overlay"
          className="fixed inset-0 bg-ink/40 backdrop-blur-[1px] flex items-center justify-center p-4 z-50"
        >
          <div
            id="add-patient-modal-box"
            className="bg-surface border border-line p-6 max-w-lg w-full rounded-none shadow-xl"
          >
            <div className="flex justify-between items-center pb-3 border-b border-line mb-4">
              <div>
                <h4 className="text-xl font-semibold font-serif text-ink">
                  Add Patient
                </h4>
                <p className="text-xs text-inkFaint font-mono mt-0.5">
                  POST /api/patients/
                </p>
              </div>
              <button
                onClick={() => setShowAddPatientModal(false)}
                className="text-inkFaint hover:text-ink font-mono text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddPatient} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-mono text-inkFaint mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={newPatientName}
                  onChange={(e) => setNewPatientName(e.target.value)}
                  placeholder="e.g. Eleanor Vance"
                  className="w-full text-sm px-3 py-2 border border-line bg-paper text-ink focus:outline-none focus:border-teal rounded-sm"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-mono text-inkFaint mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    required
                    value={newPatientAge}
                    onChange={(e) => setNewPatientAge(e.target.value)}
                    placeholder="34"
                    className="w-full text-sm px-3 py-2 border border-line bg-paper text-ink focus:outline-none focus:border-teal rounded-sm font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono text-inkFaint mb-1">
                    Gender
                  </label>
                  <select
                    value={newPatientGender}
                    onChange={(e) => setNewPatientGender(e.target.value as any)}
                    className="w-full text-sm px-3 py-2 border border-line bg-paper text-ink focus:outline-none focus:border-teal rounded-sm text-xs"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono text-inkFaint mb-1">
                    Initial Status
                  </label>
                  <select
                    value={newPatientStatus}
                    onChange={(e) => setNewPatientStatus(e.target.value as Patient['status'])}
                    className="w-full text-sm px-3 py-2 border border-line bg-paper text-ink focus:outline-none focus:border-teal rounded-sm font-mono text-xs"
                  >
                    <option value="Stable">Stable</option>
                    <option value="Recovering">Recovering</option>
                    <option value="High Risk">High Risk</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-mono text-inkFaint mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    required
                    value={newPatientPhone}
                    onChange={(e) => setNewPatientPhone(e.target.value)}
                    placeholder="+1 (555) 234-8901"
                    className="w-full text-sm px-3 py-2 border border-line bg-paper text-ink focus:outline-none focus:border-teal rounded-sm text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono text-inkFaint mb-1">
                    Assigned Doctor
                  </label>
                  <select
                    value={newPatientDoctor}
                    onChange={(e) => setNewPatientDoctor(e.target.value)}
                    className="w-full text-sm px-3 py-2 border border-line bg-paper text-ink focus:outline-none focus:border-teal rounded-sm text-xs"
                  >
                    {doctors.map((d) => (
                      <option key={d.id} value={d.name}>
                        {d.name} ({d.specialization})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono text-inkFaint mb-1">
                  Residential Address
                </label>
                <input
                  type="text"
                  value={newPatientAddress}
                  onChange={(e) => setNewPatientAddress(e.target.value)}
                  placeholder="e.g. 742 Evergreen Terrace, Springfield"
                  className="w-full text-sm px-3 py-2 border border-line bg-paper text-ink focus:outline-none focus:border-teal rounded-sm text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono text-inkFaint mb-1">
                  Medical History & Notes
                </label>
                <textarea
                  rows={2}
                  value={newPatientMedicalHistory}
                  onChange={(e) => setNewPatientMedicalHistory(e.target.value)}
                  placeholder="Known allergies, preexisting conditions, chronic illnesses..."
                  className="w-full text-sm px-3 py-2 border border-line bg-paper text-ink focus:outline-none focus:border-teal rounded-sm text-xs resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-line">
                <button
                  type="button"
                  onClick={() => setShowAddPatientModal(false)}
                  className="px-4 py-2 border border-lineStrong text-ink text-xs font-medium rounded-sm hover:bg-paper"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal text-white text-xs font-medium rounded-sm hover:bg-tealDeep transition-colors"
                >
                  Save Patient Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: ASSIGN DOCTOR TO PATIENT                                         */}
      {/* ========================================================================= */}
      {showAssignModal && (
        <div
          id="assign-doctor-modal-overlay"
          className="fixed inset-0 bg-ink/40 backdrop-blur-[1px] flex items-center justify-center p-4 z-50"
        >
          <div
            id="assign-doctor-modal-box"
            className="bg-surface border border-line p-6 max-w-md w-full rounded-none shadow-xl"
          >
            <div className="flex justify-between items-center pb-3 border-b border-line mb-4">
              <div>
                <h4 className="text-xl font-semibold font-serif text-ink">
                  Assign Doctor to Patient
                </h4>
                <p className="text-xs text-inkFaint font-mono mt-0.5">
                  POST /api/mappings/
                </p>
              </div>
              <button
                onClick={() => setShowAssignModal(false)}
                className="text-inkFaint hover:text-ink font-mono text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAssignDoctor} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-mono text-inkFaint mb-1">
                  Select Patient
                </label>
                <select
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-line bg-paper text-ink focus:outline-none focus:border-teal rounded-sm text-xs"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.patientId}) — {p.status}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono text-inkFaint mb-1">
                  Select Medical Specialist
                </label>
                <select
                  value={selectedDoctorId}
                  onChange={(e) => setSelectedDoctorId(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-line bg-paper text-ink focus:outline-none focus:border-teal rounded-sm text-xs"
                >
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.specialization}, {d.yearsOfExperience} yrs exp)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono text-inkFaint mb-1">
                  Assignment Notes
                </label>
                <input
                  type="text"
                  value={assignNotes}
                  onChange={(e) => setAssignNotes(e.target.value)}
                  placeholder="e.g. Primary cardiology consultation"
                  className="w-full text-sm px-3 py-2 border border-line bg-paper text-ink focus:outline-none focus:border-teal rounded-sm text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-line">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="px-4 py-2 border border-lineStrong text-ink text-xs font-medium rounded-sm hover:bg-paper"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal text-white text-xs font-medium rounded-sm hover:bg-tealDeep transition-colors"
                >
                  Confirm Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: EDIT PATIENT (PUT /api/patients/<id>/)                           */}
      {/* ========================================================================= */}
      {editingPatient && (
        <div
          id="edit-patient-modal-overlay"
          className="fixed inset-0 bg-ink/40 backdrop-blur-[1px] flex items-center justify-center p-4 z-50"
        >
          <div className="bg-surface border border-line p-6 max-w-lg w-full rounded-none shadow-xl">
            <div className="flex justify-between items-center pb-3 border-b border-line mb-4">
              <div>
                <h4 className="text-xl font-semibold font-serif text-ink">
                  Edit Patient Details
                </h4>
                <p className="text-xs text-inkFaint font-mono mt-0.5">
                  PUT /api/patients/{editingPatient.id}/
                </p>
              </div>
              <button
                onClick={() => setEditingPatient(null)}
                className="text-inkFaint hover:text-ink font-mono text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditPatient} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-mono text-inkFaint mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={editingPatient.name}
                  onChange={(e) => setEditingPatient({ ...editingPatient, name: e.target.value })}
                  className="w-full text-sm px-3 py-2 border border-line bg-paper text-ink focus:outline-none focus:border-teal rounded-sm"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-mono text-inkFaint mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    value={editingPatient.age}
                    onChange={(e) => setEditingPatient({ ...editingPatient, age: parseInt(e.target.value) || 0 })}
                    className="w-full text-sm px-3 py-2 border border-line bg-paper text-ink focus:outline-none focus:border-teal rounded-sm font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono text-inkFaint mb-1">
                    Gender
                  </label>
                  <select
                    value={editingPatient.gender}
                    onChange={(e) => setEditingPatient({ ...editingPatient, gender: e.target.value as any })}
                    className="w-full text-sm px-3 py-2 border border-line bg-paper text-ink focus:outline-none focus:border-teal rounded-sm text-xs"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono text-inkFaint mb-1">
                    Status
                  </label>
                  <select
                    value={editingPatient.status}
                    onChange={(e) => setEditingPatient({ ...editingPatient, status: e.target.value as any })}
                    className="w-full text-sm px-3 py-2 border border-line bg-paper text-ink focus:outline-none focus:border-teal rounded-sm font-mono text-xs"
                  >
                    <option value="Stable">Stable</option>
                    <option value="Recovering">Recovering</option>
                    <option value="High Risk">High Risk</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono text-inkFaint mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={editingPatient.phone}
                  onChange={(e) => setEditingPatient({ ...editingPatient, phone: e.target.value })}
                  className="w-full text-sm px-3 py-2 border border-line bg-paper text-ink focus:outline-none focus:border-teal rounded-sm text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono text-inkFaint mb-1">
                  Address
                </label>
                <input
                  type="text"
                  value={editingPatient.address || ''}
                  onChange={(e) => setEditingPatient({ ...editingPatient, address: e.target.value })}
                  className="w-full text-sm px-3 py-2 border border-line bg-paper text-ink focus:outline-none focus:border-teal rounded-sm text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono text-inkFaint mb-1">
                  Medical History
                </label>
                <textarea
                  rows={2}
                  value={editingPatient.medicalHistory || ''}
                  onChange={(e) => setEditingPatient({ ...editingPatient, medicalHistory: e.target.value })}
                  className="w-full text-sm px-3 py-2 border border-line bg-paper text-ink focus:outline-none focus:border-teal rounded-sm text-xs resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-line">
                <button
                  type="button"
                  onClick={() => setEditingPatient(null)}
                  className="px-4 py-2 border border-lineStrong text-ink text-xs font-medium rounded-sm hover:bg-paper"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal text-white text-xs font-medium rounded-sm hover:bg-tealDeep transition-colors"
                >
                  Update Patient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: EDIT DOCTOR (PUT /api/doctors/<id>/)                             */}
      {/* ========================================================================= */}
      {editingDoctor && (
        <div
          id="edit-doctor-modal-overlay"
          className="fixed inset-0 bg-ink/40 backdrop-blur-[1px] flex items-center justify-center p-4 z-50"
        >
          <div className="bg-surface border border-line p-6 max-w-lg w-full rounded-none shadow-xl">
            <div className="flex justify-between items-center pb-3 border-b border-line mb-4">
              <div>
                <h4 className="text-xl font-semibold font-serif text-ink">
                  Edit Doctor Details
                </h4>
                <p className="text-xs text-inkFaint font-mono mt-0.5">
                  PUT /api/doctors/{editingDoctor.id}/
                </p>
              </div>
              <button
                onClick={() => setEditingDoctor(null)}
                className="text-inkFaint hover:text-ink font-mono text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditDoctor} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-mono text-inkFaint mb-1">
                  Doctor Name
                </label>
                <input
                  type="text"
                  required
                  value={editingDoctor.name}
                  onChange={(e) => setEditingDoctor({ ...editingDoctor, name: e.target.value })}
                  className="w-full text-sm px-3 py-2 border border-line bg-paper text-ink focus:outline-none focus:border-teal rounded-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-mono text-inkFaint mb-1">
                    Specialization
                  </label>
                  <select
                    value={editingDoctor.specialization}
                    onChange={(e) => setEditingDoctor({ ...editingDoctor, specialization: e.target.value })}
                    className="w-full text-sm px-3 py-2 border border-line bg-paper text-ink focus:outline-none focus:border-teal rounded-sm text-xs"
                  >
                    <option value="Cardiology">Cardiology</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Internal Medicine">Internal Medicine</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="Dermatology">Dermatology</option>
                    <option value="General Surgery">General Surgery</option>
                    <option value="Oncology">Oncology</option>
                    <option value="Psychiatry">Psychiatry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-mono text-inkFaint mb-1">
                    Years Experience
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="60"
                    value={editingDoctor.yearsOfExperience}
                    onChange={(e) =>
                      setEditingDoctor({
                        ...editingDoctor,
                        yearsOfExperience: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full text-sm px-3 py-2 border border-line bg-paper text-ink focus:outline-none focus:border-teal rounded-sm font-mono text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-mono text-inkFaint mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editingDoctor.email}
                    onChange={(e) => setEditingDoctor({ ...editingDoctor, email: e.target.value })}
                    className="w-full text-sm px-3 py-2 border border-line bg-paper text-ink focus:outline-none focus:border-teal rounded-sm text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-mono text-inkFaint mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={editingDoctor.phone}
                    onChange={(e) => setEditingDoctor({ ...editingDoctor, phone: e.target.value })}
                    className="w-full text-sm px-3 py-2 border border-line bg-paper text-ink focus:outline-none focus:border-teal rounded-sm text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono text-inkFaint mb-1">
                  Availability
                </label>
                <div className="flex items-center gap-4 text-xs font-mono text-ink">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="edit-avail"
                      checked={editingDoctor.available}
                      onChange={() => setEditingDoctor({ ...editingDoctor, available: true })}
                    />
                    Available
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="edit-avail"
                      checked={!editingDoctor.available}
                      onChange={() => setEditingDoctor({ ...editingDoctor, available: false })}
                    />
                    Off Duty
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-line">
                <button
                  type="button"
                  onClick={() => setEditingDoctor(null)}
                  className="px-4 py-2 border border-lineStrong text-ink text-xs font-medium rounded-sm hover:bg-paper"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal text-white text-xs font-medium rounded-sm hover:bg-tealDeep transition-colors"
                >
                  Update Doctor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
