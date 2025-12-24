import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Box, PlusSquare, MapPin, LogOut, Settings } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Logo } from './Logo';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const { logout, settings } = useApp();

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/assets', icon: Box, label: 'Asset List' },
    { to: '/add-asset', icon: PlusSquare, label: 'Input Asset' },
    { to: '/rooms', icon: MapPin, label: 'Ruangan' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-30 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
        flex flex-col h-full
      `}>
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 flex-shrink-0">
                <Logo className="w-full h-full" src={settings.logoUrl} />
             </div>
             <div className="overflow-hidden">
                <h1 className="text-lg font-bold tracking-tight truncate">{settings.schoolName}</h1>
                <p className="text-xs text-slate-400 truncate">{settings.appName}</p>
             </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                ${isActive ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
              `}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700">
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;