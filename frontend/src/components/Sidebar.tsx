import React from 'react';
import { User } from '../types';

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
    { id: 'dashboard', label: 'Dashboard', icon: '○' },
    { id: 'patients', label: 'Patients', icon: '□' },
    { id: 'doctors', label: 'Doctors', icon: '△' },
    { id: 'assignments', label: 'Assignments', icon: '◇' },
  ];

  return (
    <aside
      id="main-sidebar"
      className="w-[220px] min-w-[220px] bg-surface border-r border-line flex flex-col h-full select-none"
    >
      {/* Brand Header */}
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-teal font-serif tracking-tight">
          Meridian
        </h1>
        <p className="text-[10px] tracking-widest text-inkFaint mt-1 font-mono uppercase">
          HEALTHCARE v1.0
        </p>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-link-${item.id}`}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium transition-colors text-left ${
                isActive
                  ? 'bg-tealTint text-tealDeep rounded-sm'
                  : 'text-inkSoft hover:bg-paper hover:text-ink rounded-sm'
              }`}
            >
              <span className="mr-3 font-mono text-xs opacity-75">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Pinned User Footer */}
      <div className="p-4 border-t border-line bg-surface">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-8 h-8 bg-teal rounded-sm flex items-center justify-center text-white font-semibold text-sm shrink-0">
              {currentUser.avatarInitial || currentUser.name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-ink truncate">
                {currentUser.name}
              </p>
              <p className="text-[10px] text-inkFaint font-mono uppercase tracking-wider">
                {currentUser.role === 'ADMIN' ? 'ADMINISTRATOR' : 'STAFF'}
              </p>
            </div>
          </div>
          {onLogout && (
            <button
              id="sidebar-logout-btn"
              onClick={onLogout}
              title="Sign out"
              className="ml-2 text-inkFaint hover:text-danger text-xs font-mono px-1.5 py-1 rounded hover:bg-paper transition-colors"
            >
              Exit
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
