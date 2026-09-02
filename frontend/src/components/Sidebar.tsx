import React from 'react';
import { User } from '../types';
import { MedicalPlusMark } from './BrandLogo';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  currentUser: User;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  currentUser,
  onLogout,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'patients', label: 'Patients' },
    { id: 'doctors', label: 'Doctors' },
    { id: 'assignments', label: 'Assignments' },
  ];

  return (
    <aside
      id="main-sidebar"
      className="w-[200px] min-w-[200px] bg-white border-r border-[#E6E1D8] flex flex-col h-full select-none justify-between"
    >
      <div>
        {/* Brand Header */}
        <div className="p-6 pt-7 pb-8 border-b border-[#F0ECE4]">
          <div className="flex items-center gap-2">
            <MedicalPlusMark size={24} />
            <div className="flex items-center">
              <span className="font-serif text-xl font-bold tracking-tight text-[#16211E]">
                Meridian
              </span>
              <span className="font-serif text-xl font-bold tracking-tight text-[#245543]">
                Health
              </span>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="pt-4 space-y-0.5">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center px-6 py-2.5 text-sm transition-colors text-left ${
                  isActive
                    ? 'bg-[#E5EFE8] text-[#1C362B] font-semibold'
                    : 'text-[#4C5651] hover:bg-[#F7F5EE] hover:text-[#182321] font-normal'
                }`}
              >
                <span className={`mr-2.5 text-base leading-none ${isActive ? 'text-[#245543]' : 'text-[#8C9690]'}`}>
                  •
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom User Display */}
      <div className="p-5 border-t border-[#E6E1D8] bg-white">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-[#182321] truncate font-sans">
              {currentUser.name || 'Dr. Asha Rao'}
            </p>
          </div>
          {onLogout && (
            <button
              id="sidebar-logout-btn"
              onClick={onLogout}
              title="Sign out"
              className="text-[#88928D] hover:text-[#A13D3D] text-xs transition-colors ml-2"
            >
              Sign out
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};

