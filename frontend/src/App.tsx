import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { RegisterPage } from './components/RegisterPage';
import { LoginPage } from './components/LoginPage';
import { Patient, Doctor, Assignment, User } from './types';
import {
  clearStoredAuth,
  getStoredUser,
  getStoredAuthStatus,
  getStoredPatients,
  saveStoredPatients,
  getStoredDoctors,
  saveStoredDoctors,
  getStoredAssignments,
  saveStoredAssignments,
  getPatientsApi,
  createPatientApi,
  updatePatientApi,
  deletePatientApi,
  getDoctorsApi,
  createDoctorApi,
  updateDoctorApi,
  deleteDoctorApi,
  getMappingsApi,
  createMappingApi,
  deleteMappingApi,
} from './services/api';

const INITIAL_USER: User = {
  id: 'u1',
  name: 'Dr. Asha Rao',
  email: 'asha.rao@clinic.com',
  role: 'STAFF',
  is_staff: false,
  avatarInitial: 'A',
};

const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'pt_9f21ac',
    name: 'Neha Kapoor',
    patientId: 'pt_9f21ac',
    age: 34,
    gender: 'Female',
    phone: '98202 xxxxx',
    address: 'Bandra West, Mumbai',
    medicalHistory: 'Mild asthma, allergy to penicillin',
    status: 'Stable',
    assignedDoctorName: 'Dr. Mehta',
    assignedDoctorId: 'd1',
    createdAt: '2026-08-28',
  },
  {
    id: 'pt_3c88de',
    name: 'Rohan Verma',
    patientId: 'pt_3c88de',
    age: 58,
    gender: 'Male',
    phone: '99887 xxxxx',
    address: 'Koramangala, Bengaluru',
    medicalHistory: 'Post-operative recovery, routine vitals check',
    status: 'Stable',
    assignedDoctorName: '',
    assignedDoctorId: '',
    createdAt: '2026-08-29',
  },
  {
    id: 'pt_71bb02',
    name: 'Farah Sheikh',
    patientId: 'pt_71bb02',
    age: 29,
    gender: 'Female',
    phone: '97001 xxxxx',
    address: 'Jubilee Hills, Hyderabad',
    medicalHistory: 'Dermatological assessment',
    status: 'Stable',
    assignedDoctorName: 'Dr. Iyer',
    assignedDoctorId: 'd2',
    createdAt: '2026-08-30',
  },
  {
    id: 'pt_50aa19',
    name: 'Karan Malhotra',
    patientId: 'pt_50aa19',
    age: 45,
    gender: 'Male',
    phone: '96554 xxxxx',
    address: 'Vasant Vihar, New Delhi',
    medicalHistory: 'Hypertension management & neuro consultation',
    status: 'Stable',
    assignedDoctorName: 'Dr. Mehta, Dr. Sen',
    assignedDoctorId: 'd1,d3',
    createdAt: '2026-09-01',
  },
];

const INITIAL_DOCTORS: Doctor[] = [
  {
    id: 'd1',
    name: 'Dr. Rakesh Mehta',
    email: 'mehta@clinic.com',
    phone: '98201 11223',
    specialization: 'Cardiology',
    yearsOfExperience: 12,
    patientCount: 8,
    available: true,
  },
  {
    id: 'd2',
    name: 'Dr. Priya Iyer',
    email: 'iyer@clinic.com',
    phone: '97002 33445',
    specialization: 'Dermatology',
    yearsOfExperience: 7,
    patientCount: 5,
    available: true,
  },
  {
    id: 'd3',
    name: 'Dr. Arjun Sen',
    email: 'sen@clinic.com',
    phone: '96551 55667',
    specialization: 'Neurology',
    yearsOfExperience: 15,
    patientCount: 3,
    available: true,
  },
];

const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'm1',
    patientId: 'pt_9f21ac',
    patientName: 'Neha Kapoor',
    patientCode: 'pt_9f21ac',
    doctorId: 'd1',
    doctorName: 'Dr. Rakesh Mehta',
    doctorSpecialization: 'Cardiology',
    assignedDate: '2026-08-28',
    notes: 'Cardiac health monitoring',
  },
  {
    id: 'm2',
    patientId: 'pt_71bb02',
    patientName: 'Farah Sheikh',
    patientCode: 'pt_71bb02',
    doctorId: 'd2',
    doctorName: 'Dr. Priya Iyer',
    doctorSpecialization: 'Dermatology',
    assignedDate: '2026-08-30',
    notes: 'Skin evaluation review',
  },
  {
    id: 'm3',
    patientId: 'pt_50aa19',
    patientName: 'Karan Malhotra',
    patientCode: 'pt_50aa19',
    doctorId: 'd1',
    doctorName: 'Dr. Rakesh Mehta',
    doctorSpecialization: 'Cardiology',
    assignedDate: '2026-09-01',
    notes: 'Hypertension consultation',
  },
  {
    id: 'm4',
    patientId: 'pt_50aa19',
    patientName: 'Karan Malhotra',
    patientCode: 'pt_50aa19',
    doctorId: 'd3',
    doctorName: 'Dr. Arjun Sen',
    doctorSpecialization: 'Neurology',
    assignedDate: '2026-09-01',
    notes: 'Neurological routine follow-up',
  },
];

export default function App() {
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = getStoredUser();
    return saved || INITIAL_USER;
  });

  const [currentView, setCurrentView] = useState<'register' | 'login' | 'dashboard'>(() => {
    const authStatus = getStoredAuthStatus();
    // Only show login if the user explicitly signed out
    return authStatus === false ? 'login' : 'dashboard';
  });

  const [activeTab, setActiveTab] = useState<string>(() => {
    try {
      return localStorage.getItem('meridian_active_tab') || 'dashboard';
    } catch {
      return 'dashboard';
    }
  });

  const [patients, setPatients] = useState<Patient[]>(() => {
    return getStoredPatients(INITIAL_PATIENTS);
  });

  const [doctors, setDoctors] = useState<Doctor[]>(() => {
    return getStoredDoctors(INITIAL_DOCTORS);
  });

  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    return getStoredAssignments(INITIAL_ASSIGNMENTS);
  });

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
  const [newPatientDoctor, setNewPatientDoctor] = useState<string>('');
  const [newPatientStatus, setNewPatientStatus] = useState<Patient['status']>('Stable');

  // Form states for Add Doctor
  const [newDocName, setNewDocName] = useState<string>('');
  const [newDocSpecialization, setNewDocSpecialization] = useState<string>('Cardiology');
  const [newDocExperience, setNewDocExperience] = useState<string>('10');
  const [newDocEmail, setNewDocEmail] = useState<string>('');
  const [newDocPhone, setNewDocPhone] = useState<string>('');
  const [newDocAvailable, setNewDocAvailable] = useState<boolean>(true);

  // Form states for Assign Doctor
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('');
  const [assignNotes, setAssignNotes] = useState<string>('');

  // Tab switching with persistence
  const handleSelectTab = (tab: string) => {
    setActiveTab(tab);
    setSearchQuery('');
    try {
      localStorage.setItem('meridian_active_tab', tab);
    } catch {
      // ignore
    }
  };

  // Initial fetch from backend if connected
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patData, docData, mapData] = await Promise.all([
          getPatientsApi().catch(() => null),
          getDoctorsApi().catch(() => null),
          getMappingsApi().catch(() => null),
        ]);

        if (patData && Array.isArray(patData) && patData.length > 0) {
          const formattedPatients: Patient[] = patData.map((p: any) => ({
            id: p.id || `pt_${Math.random().toString(16).substring(2, 8)}`,
            name: p.name,
            patientId: p.patientId || p.patient_id || (p.id ? `pt_${String(p.id).substring(0, 6)}` : 'pt_rec'),
            age: Number(p.age) || 30,
            gender: p.gender || 'Female',
            phone: p.phone || p.phone_number || '',
            address: p.address || '',
            medicalHistory: p.medicalHistory || p.medical_history || '',
            status: p.status || 'Stable',
            assignedDoctorName: p.assignedDoctorName || p.assigned_doctor_name || '',
            assignedDoctorId: p.assignedDoctorId || p.assigned_doctor_id || '',
            createdAt: p.createdAt || p.created_at || new Date().toISOString().split('T')[0],
          }));
          setPatients(formattedPatients);
          saveStoredPatients(formattedPatients);
        }

        if (docData && Array.isArray(docData) && docData.length > 0) {
          const formattedDocs: Doctor[] = docData.map((d: any) => ({
            id: d.id || `doc_${Math.random().toString(16).substring(2, 8)}`,
            name: d.name.startsWith('Dr.') ? d.name : `Dr. ${d.name}`,
            email: d.email,
            phone: d.phone || d.phone_number || '',
            specialization: d.specialization || 'Cardiology',
            yearsOfExperience: Number(d.yearsOfExperience || d.years_of_experience || 5),
            patientCount: Number(d.patientCount || d.patient_count || 0),
            available: d.available !== undefined ? d.available : true,
          }));
          setDoctors(formattedDocs);
          saveStoredDoctors(formattedDocs);
        }

        if (mapData && Array.isArray(mapData) && mapData.length > 0) {
          const formattedMaps: Assignment[] = mapData.map((m: any) => ({
            id: m.id || `map_${Date.now()}`,
            patientId: m.patientId || m.patient || '',
            patientName: m.patientName || m.patient_name || '',
            patientCode: m.patientCode || m.patient || '',
            doctorId: m.doctorId || m.doctor || '',
            doctorName: m.doctorName || m.doctor_name || '',
            doctorSpecialization: m.doctorSpecialization || m.doctor_specialization || 'General',
            assignedDate: m.assignedDate || (m.created_at ? m.created_at.split('T')[0] : new Date().toISOString().split('T')[0]),
            notes: m.notes || '',
          }));
          setAssignments(formattedMaps);
          saveStoredAssignments(formattedMaps);
        }
      } catch (err) {
        console.info('Using local offline cache dataset.');
      }
    };
    fetchData();
  }, []);

  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    clearStoredAuth();
    setCurrentView('login');
  };

  // Helper to extract doctor pills for a patient
  const getDoctorPillsForPatient = (patient: Patient) => {
    const assignedMaps = assignments.filter((a) => a.patientId === patient.id || a.patientCode === patient.patientId);
    if (assignedMaps.length > 0) {
      return assignedMaps.map((a) => ({
        id: a.doctorId,
        label: a.doctorName.replace(/^(Dr\.\s*)/i, 'Dr. '),
      }));
    }

    if (patient.assignedDoctorName && patient.assignedDoctorName.trim()) {
      return patient.assignedDoctorName.split(',').map((docStr, idx) => ({
        id: `doc-${idx}`,
        label: docStr.trim().startsWith('Dr.') ? docStr.trim() : `Dr. ${docStr.trim()}`,
      }));
    }

    return [];
  };

  // Filtered queries
  const filteredPatients = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.assignedDoctorName && p.assignedDoctorName.toLowerCase().includes(searchQuery.toLowerCase()))
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
  const handleAddPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatientName.trim()) return;

    const shortId = `pt_${Math.random().toString(16).substring(2, 8)}`;
    const matchedDoc = doctors.find((d) => d.id === newPatientDoctor || d.name === newPatientDoctor);

    const newEntry: Patient = {
      id: shortId,
      name: newPatientName.trim(),
      patientId: shortId,
      age: parseInt(newPatientAge) || 30,
      gender: newPatientGender,
      phone: newPatientPhone.trim() || '98000 xxxxx',
      address: newPatientAddress.trim() || 'Not specified',
      medicalHistory: newPatientMedicalHistory.trim() || 'No prior conditions recorded',
      status: newPatientStatus,
      assignedDoctorName: matchedDoc ? matchedDoc.name.replace(/^Dr\.\s*/, 'Dr. ') : '',
      assignedDoctorId: matchedDoc ? matchedDoc.id : '',
      createdAt: new Date().toISOString().split('T')[0],
    };

    const updated = [newEntry, ...patients];
    setPatients(updated);
    saveStoredPatients(updated);

    try {
      await createPatientApi({
        name: newEntry.name,
        age: newEntry.age,
        gender: newEntry.gender,
        phone: newEntry.phone,
        address: newEntry.address,
        medical_history: newEntry.medicalHistory,
      });
    } catch (err) {
      console.info('Created patient in local state.');
    }

    setNewPatientName('');
    setNewPatientAge('');
    setNewPatientPhone('');
    setNewPatientAddress('');
    setNewPatientMedicalHistory('');
    setNewPatientDoctor('');
    setShowAddPatientModal(false);
  };

  // Add Doctor Handler
  const handleAddDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName.trim()) return;

    const formattedName = newDocName.startsWith('Dr.') ? newDocName.trim() : `Dr. ${newDocName.trim()}`;
    const newDoc: Doctor = {
      id: `doc_${Math.random().toString(16).substring(2, 8)}`,
      name: formattedName,
      email: newDocEmail.trim() || `${newDocName.toLowerCase().replace(/[^a-z]/g, '')}@clinic.com`,
      phone: newDocPhone.trim() || '98000 xxxxx',
      specialization: newDocSpecialization.trim() || 'Cardiology',
      yearsOfExperience: parseInt(newDocExperience) || 5,
      patientCount: 0,
      available: newDocAvailable,
    };

    const updated = [newDoc, ...doctors];
    setDoctors(updated);
    saveStoredDoctors(updated);

    try {
      await createDoctorApi({
        name: newDoc.name,
        email: newDoc.email,
        phone: newDoc.phone,
        specialization: newDoc.specialization,
        years_of_experience: newDoc.yearsOfExperience,
        is_active: newDoc.available,
      });
    } catch (err) {
      console.info('Created doctor in local state.');
    }

    setNewDocName('');
    setNewDocEmail('');
    setNewDocPhone('');
    setNewDocExperience('10');
    setShowAddDoctorModal(false);
  };

  // Add Assignment Handler
  const handleAssignDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    const p = patients.find((pat) => pat.id === selectedPatientId);
    const d = doctors.find((doc) => doc.id === selectedDoctorId);
    if (!p || !d) return;

    const newAssignment: Assignment = {
      id: `map_${Date.now()}`,
      patientId: p.id,
      patientName: p.name,
      patientCode: p.patientId,
      doctorId: d.id,
      doctorName: d.name,
      doctorSpecialization: d.specialization,
      assignedDate: new Date().toISOString().split('T')[0],
      notes: assignNotes.trim() || 'Consultation assignment',
    };

    const updatedAssignments = [newAssignment, ...assignments];
    setAssignments(updatedAssignments);
    saveStoredAssignments(updatedAssignments);

    // Update patient assigned doctor string
    const updatedPatients = patients.map((pat) => {
      if (pat.id === p.id) {
        const existing = pat.assignedDoctorName ? pat.assignedDoctorName.split(',').map((x) => x.trim()) : [];
        const docShort = d.name.replace(/^Dr\.\s*/i, 'Dr. ');
        if (!existing.includes(docShort)) {
          existing.push(docShort);
        }
        return {
          ...pat,
          assignedDoctorName: existing.join(', '),
          assignedDoctorId: d.id,
        };
      }
      return pat;
    });
    setPatients(updatedPatients);
    saveStoredPatients(updatedPatients);

    // Update doctor count
    const updatedDoctors = doctors.map((doc) => (doc.id === d.id ? { ...doc, patientCount: doc.patientCount + 1 } : doc));
    setDoctors(updatedDoctors);
    saveStoredDoctors(updatedDoctors);

    try {
      await createMappingApi({
        patient: p.id,
        doctor: d.id,
        notes: assignNotes.trim(),
      });
    } catch (err) {
      console.info('Assigned doctor in local state.');
    }

    setAssignNotes('');
    setShowAssignModal(false);
  };

  // Update Patient
  const handleSaveEditPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPatient) return;

    const updated = patients.map((p) => (p.id === editingPatient.id ? editingPatient : p));
    setPatients(updated);
    saveStoredPatients(updated);

    try {
      await updatePatientApi(editingPatient.id, {
        name: editingPatient.name,
        age: editingPatient.age,
        gender: editingPatient.gender,
        phone: editingPatient.phone,
        address: editingPatient.address,
        medical_history: editingPatient.medicalHistory,
      });
    } catch (err) {
      console.info('Updated patient in local state.');
    }

    setEditingPatient(null);
  };

  // Delete Patient
  const handleDeletePatient = async (patientId: string) => {
    if (window.confirm('Are you sure you want to delete this patient record?')) {
      const updatedPatients = patients.filter((p) => p.id !== patientId);
      const updatedAssignments = assignments.filter((a) => a.patientId !== patientId);
      setPatients(updatedPatients);
      saveStoredPatients(updatedPatients);
      setAssignments(updatedAssignments);
      saveStoredAssignments(updatedAssignments);
      try {
        await deletePatientApi(patientId);
      } catch (err) {
        console.info('Deleted patient in local state.');
      }
    }
  };

  // Update Doctor
  const handleSaveEditDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDoctor) return;

    const updated = doctors.map((d) => (d.id === editingDoctor.id ? editingDoctor : d));
    setDoctors(updated);
    saveStoredDoctors(updated);

    try {
      await updateDoctorApi(editingDoctor.id, {
        name: editingDoctor.name,
        email: editingDoctor.email,
        phone: editingDoctor.phone,
        specialization: editingDoctor.specialization,
        years_of_experience: editingDoctor.yearsOfExperience,
        is_active: editingDoctor.available,
      });
    } catch (err) {
      console.info('Updated doctor in local state.');
    }

    setEditingDoctor(null);
  };

  // Delete Doctor
  const handleDeleteDoctor = async (doctorId: string) => {
    if (window.confirm('Are you sure you want to delete this doctor record?')) {
      const updatedDoctors = doctors.filter((d) => d.id !== doctorId);
      const updatedAssignments = assignments.filter((a) => a.doctorId !== doctorId);
      setDoctors(updatedDoctors);
      saveStoredDoctors(updatedDoctors);
      setAssignments(updatedAssignments);
      saveStoredAssignments(updatedAssignments);
      try {
        await deleteDoctorApi(doctorId);
      } catch (err) {
        console.info('Deleted doctor in local state.');
      }
    }
  };

  // Delete Assignment
  const handleDeleteAssignment = async (assignmentId: string) => {
    if (window.confirm('Are you sure you want to unassign this doctor from the patient?')) {
      const updated = assignments.filter((a) => a.id !== assignmentId);
      setAssignments(updated);
      saveStoredAssignments(updated);
      try {
        await deleteMappingApi(assignmentId);
      } catch (err) {
        console.info('Deleted assignment in local state.');
      }
    }
  };

  // Top action button click router
  const handleTopActionClick = () => {
    if (activeTab === 'doctors') {
      setShowAddDoctorModal(true);
    } else if (activeTab === 'assignments') {
      if (patients.length > 0) setSelectedPatientId(patients[0].id);
      if (doctors.length > 0) setSelectedDoctorId(doctors[0].id);
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

  // Calculate current records count
  const recordCount =
    activeTab === 'doctors'
      ? doctors.length
      : activeTab === 'assignments'
      ? assignments.length
      : patients.length;

  return (
    <div className="flex h-screen w-full bg-[#FAF8F3] text-[#182321] overflow-hidden font-sans">
      {/* 200px Left Navigation Rail */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 flex flex-col p-8 px-10 overflow-y-auto">
        {activeTab === 'dashboard' ? (
          /* ===================================================================== */
          /* DASHBOARD VIEW (Matching Reference Design)                            */
          /* ===================================================================== */
          <div>
            {/* Dashboard Header */}
            <header className="mb-6">
              <div className="text-xs font-mono text-[#8C867E] tracking-widest uppercase mb-1">
                TUE, SEP 1 · REGULAR USER VIEW
              </div>
              <div className="flex items-center justify-between">
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#182321] tracking-tight">
                  Good morning, {currentUser.name ? currentUser.name.replace(/^Dr\.?\s*/i, '').trim().split(' ')[0] : 'Asha'}
                </h1>
                <button
                  id="dashboard-add-patient-btn"
                  onClick={() => setShowAddPatientModal(true)}
                  className="bg-[#245543] hover:bg-[#1C4435] text-white px-5 py-2.5 rounded text-sm font-medium transition-colors shadow-sm flex items-center gap-1.5"
                >
                  + Add patient
                </button>
              </div>
            </header>

            {/* 4 Metric Cards Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border border-[#E8E3DA] bg-white divide-y sm:divide-y-0 sm:divide-x divide-[#E8E3DA] mb-8">
              {/* Card 1: Your patients */}
              <div className="p-6">
                <div className="text-xs font-sans text-[#807A72]">Your patients</div>
                <div className="text-3xl font-bold font-sans text-[#182321] my-2">
                  {patients.length || 37}
                </div>
                <div className="text-xs font-mono text-[#245543]">
                  +4 this week
                </div>
              </div>

              {/* Card 2: Doctors on record */}
              <div className="p-6">
                <div className="text-xs font-sans text-[#807A72]">Doctors on record</div>
                <div className="text-3xl font-bold font-sans text-[#182321] my-2">
                  {doctors.length || 12}
                </div>
                <div className="text-xs font-mono text-[#245543]">
                  2 specialties added
                </div>
              </div>

              {/* Card 3: Open assignments */}
              <div className="p-6">
                <div className="text-xs font-sans text-[#807A72]">Open assignments</div>
                <div className="text-3xl font-bold font-sans text-[#182321] my-2">
                  {assignments.length || 29}
                </div>
                <div className="text-xs font-mono text-[#245543]">
                  {patients.filter((p) => getDoctorPillsForPatient(p).length === 0).length || 8} unassigned
                </div>
              </div>

              {/* Card 4: Avg. response time */}
              <div className="p-6">
                <div className="text-xs font-sans text-[#807A72]">Avg. response time</div>
                <div className="text-3xl font-bold font-sans text-[#182321] my-2">
                  118ms
                </div>
                <div className="text-xs font-mono text-[#245543]">
                  within target
                </div>
              </div>
            </div>

            {/* Recently Added Patients Table Section */}
            <section className="bg-white border border-[#E8E3DA] rounded-none shadow-none flex flex-col">
              <div className="px-6 py-4 border-b border-[#EBE6DC] flex items-center justify-between">
                <h2 className="text-base font-bold text-[#182321] font-sans">
                  Recently added patients
                </h2>
                <button
                  id="dashboard-view-all-patients-btn"
                  onClick={() => handleSelectTab('patients')}
                  className="text-xs px-3.5 py-1.5 border border-[#D9D3C7] rounded text-[#182321] hover:bg-[#FAF8F3] transition-colors"
                >
                  View all
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#EBE6DC] text-xs font-normal text-[#807A72]">
                      <th className="px-6 py-3.5 font-normal">Patient</th>
                      <th className="px-6 py-3.5 font-normal">Age / Gender</th>
                      <th className="px-6 py-3.5 font-normal">Assigned doctor</th>
                      <th className="px-6 py-3.5 font-normal">Added</th>
                      <th className="px-6 py-3.5 font-normal text-right"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EBE6DC] text-sm">
                    {patients.slice(0, 5).map((patient, idx) => {
                      const docPills = getDoctorPillsForPatient(patient);
                      const addedText =
                        idx === 0
                          ? '2 hours ago'
                          : idx === 1
                          ? 'Yesterday'
                          : idx === 2
                          ? '3 days ago'
                          : idx === 3
                          ? '4 days ago'
                          : '5 days ago';

                      return (
                        <tr key={patient.id} className="hover:bg-[#FAF8F3]/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-semibold text-[#182321] text-sm">{patient.name}</div>
                            <div className="text-xs font-mono text-[#8C938E] mt-0.5">ID · {patient.patientId}</div>
                          </td>
                          <td className="px-6 py-4 text-sm text-[#38423E]">
                            {patient.age} · {patient.gender}
                          </td>
                          <td className="px-6 py-4">
                            {docPills.length === 0 ? (
                              <span className="inline-flex items-center px-2.5 py-1 rounded bg-[#FBECE4] text-[#A85A32] text-xs font-medium">
                                Unassigned
                              </span>
                            ) : (
                              <div className="flex flex-wrap gap-1.5">
                                {docPills.map((pill) => (
                                  <span
                                    key={pill.id}
                                    className="inline-flex items-center px-2.5 py-1 rounded bg-[#E4EDE7] text-[#245543] text-xs font-medium"
                                  >
                                    {pill.label}
                                  </span>
                                ))}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 text-xs font-mono text-[#8C938E]">
                            {addedText}
                          </td>
                          <td className="px-6 py-4 text-right text-xs">
                            <button
                              id={`view-patient-${patient.id}`}
                              onClick={() => setEditingPatient(patient)}
                              className="text-[#555] hover:text-[#245543] transition-colors"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        ) : (
          /* ===================================================================== */
          /* PATIENTS / DOCTORS / ASSIGNMENTS MANAGEMENT VIEW                      */
          /* ===================================================================== */
          <>
            {/* Top Header */}
            <header className="mb-6">
              <div className="text-xs font-mono text-[#8C867E] tracking-widest uppercase mb-1">
                {recordCount} RECORDS
              </div>
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-serif font-bold text-[#182321] tracking-tight">
                  {activeTab === 'patients' && 'Patients'}
                  {activeTab === 'doctors' && 'Doctors'}
                  {activeTab === 'assignments' && 'Assignments'}
                </h1>
                <button
                  id="top-action-button"
                  onClick={handleTopActionClick}
                  className="bg-[#245543] hover:bg-[#1C4435] text-white px-5 py-2 rounded text-sm font-medium transition-colors shadow-sm flex items-center gap-1.5"
                >
                  {activeTab === 'doctors' && '+ Add doctor'}
                  {activeTab === 'assignments' && '+ Assign doctor'}
                  {activeTab === 'patients' && '+ Add patient'}
                </button>
              </div>
            </header>

            {/* Content Table Container */}
            <section className="bg-white border border-[#E8E3DA] rounded-none shadow-none flex flex-col">
              {/* Table Header Bar */}
              <div className="px-6 py-4 border-b border-[#EBE6DC] flex flex-wrap items-center justify-between gap-4">
                <h2 className="text-base font-bold text-[#182321] font-sans">
                  {activeTab === 'patients' && "All patients you've added"}
                  {activeTab === 'doctors' && 'All registered doctors'}
                  {activeTab === 'assignments' && 'All patient-doctor assignments'}
                </h2>
                <div>
                  <input
                    id="table-search-input"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={
                      activeTab === 'doctors'
                        ? 'Filter by specialization...'
                        : activeTab === 'assignments'
                        ? 'Search by patient or doctor...'
                        : 'Search by name or phone...'
                    }
                    className="text-xs font-sans px-3.5 py-1.5 border border-[#D9D3C7] bg-white text-[#182321] placeholder-[#9E988E] focus:outline-none focus:border-[#245543] rounded w-64"
                  />
                </div>
              </div>

              {/* Table Data */}
              <div className="overflow-x-auto">
                {/* DOCTORS TABLE (Screenshot 2) */}
                {activeTab === 'doctors' && (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#EBE6DC] text-xs font-normal text-[#807A72]">
                        <th className="px-6 py-3.5 font-normal">Doctor</th>
                        <th className="px-6 py-3.5 font-normal">Specialization</th>
                        <th className="px-6 py-3.5 font-normal">Experience</th>
                        <th className="px-6 py-3.5 font-normal">Patients</th>
                        <th className="px-6 py-3.5 font-normal text-right"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EBE6DC] text-sm">
                      {filteredDoctors.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-[#8C867E]">
                            No doctors match the current search.
                          </td>
                        </tr>
                      ) : (
                        filteredDoctors.map((doc) => (
                          <tr key={doc.id} className="hover:bg-[#FAF8F3]/50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="font-semibold text-[#182321] text-sm">{doc.name}</div>
                              <div className="text-xs text-[#8C938E] mt-0.5">{doc.email}</div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center px-3 py-1 rounded bg-[#E4EDE7] text-[#245543] text-xs font-medium">
                                {doc.specialization}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-[#38423E]">
                              {doc.yearsOfExperience} years
                            </td>
                            <td className="px-6 py-4 text-sm text-[#38423E]">
                              {doc.patientCount} patients
                            </td>
                            <td className="px-6 py-4 text-right space-x-3 text-xs">
                              <button
                                id={`edit-doctor-${doc.id}`}
                                onClick={() => setEditingDoctor(doc)}
                                className="text-[#38423E] hover:text-[#245543] transition-colors"
                              >
                                Edit
                              </button>
                              <button
                                id={`delete-doctor-${doc.id}`}
                                onClick={() => handleDeleteDoctor(doc.id)}
                                className="text-[#38423E] hover:text-[#A13D3D] transition-colors"
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
                    <thead>
                      <tr className="border-b border-[#EBE6DC] text-xs font-normal text-[#807A72]">
                        <th className="px-6 py-3.5 font-normal">Patient</th>
                        <th className="px-6 py-3.5 font-normal">Assigned Doctor</th>
                        <th className="px-6 py-3.5 font-normal">Specialization</th>
                        <th className="px-6 py-3.5 font-normal">Assigned Date</th>
                        <th className="px-6 py-3.5 font-normal">Notes</th>
                        <th className="px-6 py-3.5 font-normal text-right"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EBE6DC] text-sm">
                      {filteredAssignments.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center text-[#8C867E]">
                            No assignments found.
                          </td>
                        </tr>
                      ) : (
                        filteredAssignments.map((assignment) => (
                          <tr key={assignment.id} className="hover:bg-[#FAF8F3]/50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="text-xs font-mono text-[#8C938E]">{assignment.patientCode}</div>
                              <div className="font-semibold text-[#182321] text-sm">{assignment.patientName}</div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center px-2.5 py-1 rounded bg-[#E4EDE7] text-[#245543] text-xs font-medium">
                                {assignment.doctorName}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-xs text-[#38423E]">{assignment.doctorSpecialization}</span>
                            </td>
                            <td className="px-6 py-4 text-xs font-mono text-[#38423E]">
                              {assignment.assignedDate}
                            </td>
                            <td className="px-6 py-4 text-xs text-[#8C938E]">
                              {assignment.notes || '—'}
                            </td>
                            <td className="px-6 py-4 text-right text-xs">
                              <button
                                id={`unassign-${assignment.id}`}
                                onClick={() => handleDeleteAssignment(assignment.id)}
                                className="text-[#38423E] hover:text-[#A13D3D] transition-colors"
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                )}

                {/* PATIENTS TABLE (Screenshot 1) */}
                {activeTab === 'patients' && (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#EBE6DC] text-xs font-normal text-[#807A72]">
                        <th className="px-6 py-3.5 font-normal">Patient</th>
                        <th className="px-6 py-3.5 font-normal">Age / Gender</th>
                        <th className="px-6 py-3.5 font-normal">Phone</th>
                        <th className="px-6 py-3.5 font-normal">Doctor(s)</th>
                        <th className="px-6 py-3.5 font-normal text-right"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EBE6DC] text-sm">
                      {filteredPatients.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-[#8C867E]">
                            No patient records match the current criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredPatients.map((patient) => {
                          const docPills = getDoctorPillsForPatient(patient);
                          return (
                            <tr key={patient.id} className="hover:bg-[#FAF8F3]/50 transition-colors">
                              <td className="px-6 py-4">
                                <div className="text-xs font-mono text-[#8C938E]">{patient.patientId}</div>
                                <div className="font-semibold text-[#182321] text-sm">{patient.name}</div>
                              </td>
                              <td className="px-6 py-4 text-sm text-[#38423E]">
                                {patient.age} · {patient.gender}
                              </td>
                              <td className="px-6 py-4 text-sm font-mono text-[#38423E]">
                                {patient.phone}
                              </td>
                              <td className="px-6 py-4">
                                {docPills.length === 0 ? (
                                  <span className="inline-flex items-center px-2.5 py-1 rounded bg-[#FBECE4] text-[#A85A32] text-xs font-medium">
                                    Unassigned
                                  </span>
                                ) : (
                                  <div className="flex flex-wrap gap-1.5">
                                    {docPills.map((pill) => (
                                      <span
                                        key={pill.id}
                                        className="inline-flex items-center px-2.5 py-1 rounded bg-[#E4EDE7] text-[#245543] text-xs font-medium"
                                      >
                                        {pill.label}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </td>
                              <td className="px-6 py-4 text-right space-x-3 text-xs">
                                <button
                                  id={`edit-patient-${patient.id}`}
                                  onClick={() => setEditingPatient(patient)}
                                  className="text-[#38423E] hover:text-[#245543] transition-colors"
                                >
                                  Edit
                                </button>
                                <button
                                  id={`delete-patient-${patient.id}`}
                                  onClick={() => handleDeletePatient(patient.id)}
                                  className="text-[#38423E] hover:text-[#A13D3D] transition-colors"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </section>
          </>
        )}
      </main>

      {/* ========================================================================= */}
      {/* MODAL: ADD DOCTOR                                                         */}
      {/* ========================================================================= */}
      {showAddDoctorModal && (
        <div
          id="add-doctor-modal-overlay"
          className="fixed inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center p-4 z-50"
        >
          <div
            id="add-doctor-modal-box"
            className="bg-white border border-[#E8E3DA] p-6 max-w-lg w-full rounded shadow-xl"
          >
            <div className="flex justify-between items-center pb-3 border-b border-[#EBE6DC] mb-4">
              <h3 className="text-xl font-serif font-bold text-[#182321]">
                Add Doctor
              </h3>
              <button
                onClick={() => setShowAddDoctorModal(false)}
                className="text-[#8C938E] hover:text-[#182321] text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddDoctor} className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-mono text-[#8C938E] mb-1">
                  Doctor Name
                </label>
                <input
                  type="text"
                  required
                  value={newDocName}
                  onChange={(e) => setNewDocName(e.target.value)}
                  placeholder="e.g. Dr. Rakesh Mehta"
                  className="w-full text-sm px-3 py-2 border border-[#D9D3C7] bg-[#FAF8F3] text-[#182321] focus:outline-none focus:border-[#245543] rounded"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase font-mono text-[#8C938E] mb-1">
                    Specialization
                  </label>
                  <select
                    value={newDocSpecialization}
                    onChange={(e) => setNewDocSpecialization(e.target.value)}
                    className="w-full text-sm px-3 py-2 border border-[#D9D3C7] bg-[#FAF8F3] text-[#182321] focus:outline-none focus:border-[#245543] rounded"
                  >
                    <option value="Cardiology">Cardiology</option>
                    <option value="Dermatology">Dermatology</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Internal Medicine">Internal Medicine</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="General Surgery">General Surgery</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase font-mono text-[#8C938E] mb-1">
                    Years Experience
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="60"
                    required
                    value={newDocExperience}
                    onChange={(e) => setNewDocExperience(e.target.value)}
                    placeholder="12"
                    className="w-full text-sm px-3 py-2 border border-[#D9D3C7] bg-[#FAF8F3] text-[#182321] focus:outline-none focus:border-[#245543] rounded font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase font-mono text-[#8C938E] mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={newDocEmail}
                    onChange={(e) => setNewDocEmail(e.target.value)}
                    placeholder="mehta@clinic.com"
                    className="w-full text-sm px-3 py-2 border border-[#D9D3C7] bg-[#FAF8F3] text-[#182321] focus:outline-none focus:border-[#245543] rounded"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-mono text-[#8C938E] mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    required
                    value={newDocPhone}
                    onChange={(e) => setNewDocPhone(e.target.value)}
                    placeholder="98201 11223"
                    className="w-full text-sm px-3 py-2 border border-[#D9D3C7] bg-[#FAF8F3] text-[#182321] focus:outline-none focus:border-[#245543] rounded font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-[#EBE6DC]">
                <button
                  type="button"
                  onClick={() => setShowAddDoctorModal(false)}
                  className="px-4 py-2 border border-[#D9D3C7] text-[#182321] text-xs font-medium rounded hover:bg-[#FAF8F3]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#245543] hover:bg-[#1C4435] text-white text-xs font-medium rounded transition-colors"
                >
                  Save Doctor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD PATIENT                                                        */}
      {/* ========================================================================= */}
      {showAddPatientModal && (
        <div
          id="add-patient-modal-overlay"
          className="fixed inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center p-4 z-50"
        >
          <div
            id="add-patient-modal-box"
            className="bg-white border border-[#E8E3DA] p-6 max-w-lg w-full rounded shadow-xl"
          >
            <div className="flex justify-between items-center pb-3 border-b border-[#EBE6DC] mb-4">
              <h3 className="text-xl font-serif font-bold text-[#182321]">
                Add Patient
              </h3>
              <button
                onClick={() => setShowAddPatientModal(false)}
                className="text-[#8C938E] hover:text-[#182321] text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddPatient} className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-mono text-[#8C938E] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={newPatientName}
                  onChange={(e) => setNewPatientName(e.target.value)}
                  placeholder="e.g. Neha Kapoor"
                  className="w-full text-sm px-3 py-2 border border-[#D9D3C7] bg-[#FAF8F3] text-[#182321] focus:outline-none focus:border-[#245543] rounded"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase font-mono text-[#8C938E] mb-1">
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
                    className="w-full text-sm px-3 py-2 border border-[#D9D3C7] bg-[#FAF8F3] text-[#182321] focus:outline-none focus:border-[#245543] rounded font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase font-mono text-[#8C938E] mb-1">
                    Gender
                  </label>
                  <select
                    value={newPatientGender}
                    onChange={(e) => setNewPatientGender(e.target.value as any)}
                    className="w-full text-sm px-3 py-2 border border-[#D9D3C7] bg-[#FAF8F3] text-[#182321] focus:outline-none focus:border-[#245543] rounded"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase font-mono text-[#8C938E] mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    required
                    value={newPatientPhone}
                    onChange={(e) => setNewPatientPhone(e.target.value)}
                    placeholder="98202 xxxxx"
                    className="w-full text-sm px-3 py-2 border border-[#D9D3C7] bg-[#FAF8F3] text-[#182321] focus:outline-none focus:border-[#245543] rounded font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase font-mono text-[#8C938E] mb-1">
                    Assign Doctor (Optional)
                  </label>
                  <select
                    value={newPatientDoctor}
                    onChange={(e) => setNewPatientDoctor(e.target.value)}
                    className="w-full text-sm px-3 py-2 border border-[#D9D3C7] bg-[#FAF8F3] text-[#182321] focus:outline-none focus:border-[#245543] rounded"
                  >
                    <option value="">Leave Unassigned</option>
                    {doctors.map((d) => (
                      <option key={d.id} value={d.name}>
                        {d.name} ({d.specialization})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase font-mono text-[#8C938E] mb-1">
                  Address
                </label>
                <input
                  type="text"
                  value={newPatientAddress}
                  onChange={(e) => setNewPatientAddress(e.target.value)}
                  placeholder="e.g. Bandra West, Mumbai"
                  className="w-full text-sm px-3 py-2 border border-[#D9D3C7] bg-[#FAF8F3] text-[#182321] focus:outline-none focus:border-[#245543] rounded"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-[#EBE6DC]">
                <button
                  type="button"
                  onClick={() => setShowAddPatientModal(false)}
                  className="px-4 py-2 border border-[#D9D3C7] text-[#182321] text-xs font-medium rounded hover:bg-[#FAF8F3]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#245543] hover:bg-[#1C4435] text-white text-xs font-medium rounded transition-colors"
                >
                  Save Patient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ASSIGN DOCTOR TO PATIENT                                           */}
      {/* ========================================================================= */}
      {showAssignModal && (
        <div
          id="assign-modal-overlay"
          className="fixed inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center p-4 z-50"
        >
          <div
            id="assign-modal-box"
            className="bg-white border border-[#E8E3DA] p-6 max-w-lg w-full rounded shadow-xl"
          >
            <div className="flex justify-between items-center pb-3 border-b border-[#EBE6DC] mb-4">
              <h3 className="text-xl font-serif font-bold text-[#182321]">
                Assign Doctor to Patient
              </h3>
              <button
                onClick={() => setShowAssignModal(false)}
                className="text-[#8C938E] hover:text-[#182321] text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAssignDoctor} className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-mono text-[#8C938E] mb-1">
                  Select Patient
                </label>
                <select
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-[#D9D3C7] bg-[#FAF8F3] text-[#182321] focus:outline-none focus:border-[#245543] rounded"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.patientId})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase font-mono text-[#8C938E] mb-1">
                  Select Doctor
                </label>
                <select
                  value={selectedDoctorId}
                  onChange={(e) => setSelectedDoctorId(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-[#D9D3C7] bg-[#FAF8F3] text-[#182321] focus:outline-none focus:border-[#245543] rounded"
                >
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} — {d.specialization}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase font-mono text-[#8C938E] mb-1">
                  Assignment Notes
                </label>
                <input
                  type="text"
                  value={assignNotes}
                  onChange={(e) => setAssignNotes(e.target.value)}
                  placeholder="e.g. Regular consultation & treatment plan"
                  className="w-full text-sm px-3 py-2 border border-[#D9D3C7] bg-[#FAF8F3] text-[#182321] focus:outline-none focus:border-[#245543] rounded"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-[#EBE6DC]">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="px-4 py-2 border border-[#D9D3C7] text-[#182321] text-xs font-medium rounded hover:bg-[#FAF8F3]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#245543] hover:bg-[#1C4435] text-white text-xs font-medium rounded transition-colors"
                >
                  Confirm Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: EDIT PATIENT                                                       */}
      {/* ========================================================================= */}
      {editingPatient && (
        <div
          id="edit-patient-modal-overlay"
          className="fixed inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center p-4 z-50"
        >
          <div
            id="edit-patient-modal-box"
            className="bg-white border border-[#E8E3DA] p-6 max-w-lg w-full rounded shadow-xl"
          >
            <div className="flex justify-between items-center pb-3 border-b border-[#EBE6DC] mb-4">
              <h3 className="text-xl font-serif font-bold text-[#182321]">
                Edit Patient Record
              </h3>
              <button
                onClick={() => setEditingPatient(null)}
                className="text-[#8C938E] hover:text-[#182321] text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditPatient} className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-mono text-[#8C938E] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={editingPatient.name}
                  onChange={(e) => setEditingPatient({ ...editingPatient, name: e.target.value })}
                  className="w-full text-sm px-3 py-2 border border-[#D9D3C7] bg-[#FAF8F3] text-[#182321] focus:outline-none focus:border-[#245543] rounded"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase font-mono text-[#8C938E] mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    required
                    value={editingPatient.age}
                    onChange={(e) => setEditingPatient({ ...editingPatient, age: parseInt(e.target.value) || 0 })}
                    className="w-full text-sm px-3 py-2 border border-[#D9D3C7] bg-[#FAF8F3] text-[#182321] focus:outline-none focus:border-[#245543] rounded font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase font-mono text-[#8C938E] mb-1">
                    Gender
                  </label>
                  <select
                    value={editingPatient.gender}
                    onChange={(e) => setEditingPatient({ ...editingPatient, gender: e.target.value as any })}
                    className="w-full text-sm px-3 py-2 border border-[#D9D3C7] bg-[#FAF8F3] text-[#182321] focus:outline-none focus:border-[#245543] rounded"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase font-mono text-[#8C938E] mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  required
                  value={editingPatient.phone}
                  onChange={(e) => setEditingPatient({ ...editingPatient, phone: e.target.value })}
                  className="w-full text-sm px-3 py-2 border border-[#D9D3C7] bg-[#FAF8F3] text-[#182321] focus:outline-none focus:border-[#245543] rounded font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-[#EBE6DC]">
                <button
                  type="button"
                  onClick={() => setEditingPatient(null)}
                  className="px-4 py-2 border border-[#D9D3C7] text-[#182321] text-xs font-medium rounded hover:bg-[#FAF8F3]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#245543] hover:bg-[#1C4435] text-white text-xs font-medium rounded transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: EDIT DOCTOR                                                        */}
      {/* ========================================================================= */}
      {editingDoctor && (
        <div
          id="edit-doctor-modal-overlay"
          className="fixed inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center p-4 z-50"
        >
          <div
            id="edit-doctor-modal-box"
            className="bg-white border border-[#E8E3DA] p-6 max-w-lg w-full rounded shadow-xl"
          >
            <div className="flex justify-between items-center pb-3 border-b border-[#EBE6DC] mb-4">
              <h3 className="text-xl font-serif font-bold text-[#182321]">
                Edit Doctor
              </h3>
              <button
                onClick={() => setEditingDoctor(null)}
                className="text-[#8C938E] hover:text-[#182321] text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditDoctor} className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-mono text-[#8C938E] mb-1">
                  Doctor Name
                </label>
                <input
                  type="text"
                  required
                  value={editingDoctor.name}
                  onChange={(e) => setEditingDoctor({ ...editingDoctor, name: e.target.value })}
                  className="w-full text-sm px-3 py-2 border border-[#D9D3C7] bg-[#FAF8F3] text-[#182321] focus:outline-none focus:border-[#245543] rounded"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase font-mono text-[#8C938E] mb-1">
                    Specialization
                  </label>
                  <select
                    value={editingDoctor.specialization}
                    onChange={(e) => setEditingDoctor({ ...editingDoctor, specialization: e.target.value })}
                    className="w-full text-sm px-3 py-2 border border-[#D9D3C7] bg-[#FAF8F3] text-[#182321] focus:outline-none focus:border-[#245543] rounded"
                  >
                    <option value="Cardiology">Cardiology</option>
                    <option value="Dermatology">Dermatology</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Internal Medicine">Internal Medicine</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="General Surgery">General Surgery</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase font-mono text-[#8C938E] mb-1">
                    Years Experience
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="60"
                    required
                    value={editingDoctor.yearsOfExperience}
                    onChange={(e) => setEditingDoctor({ ...editingDoctor, yearsOfExperience: parseInt(e.target.value) || 0 })}
                    className="w-full text-sm px-3 py-2 border border-[#D9D3C7] bg-[#FAF8F3] text-[#182321] focus:outline-none focus:border-[#245543] rounded font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-[#EBE6DC]">
                <button
                  type="button"
                  onClick={() => setEditingDoctor(null)}
                  className="px-4 py-2 border border-[#D9D3C7] text-[#182321] text-xs font-medium rounded hover:bg-[#FAF8F3]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#245543] hover:bg-[#1C4435] text-white text-xs font-medium rounded transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
