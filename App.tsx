import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './contexts/AppContext';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AssetList from './pages/AssetList';
import AssetForm from './pages/AssetForm';
import RoomList from './pages/RoomList';
import Settings from './pages/Settings';
import { Menu } from 'lucide-react';

const Layout = ({ children }: { children?: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useApp();

  if (!user) {
    return <Login />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm z-10 p-4 flex justify-between items-center md:hidden">
          <div className="font-bold text-gray-800">Lazuardi Assets</div>
          <button onClick={() => setSidebarOpen(true)} className="p-2 text-gray-600">
            <Menu size={24} />
          </button>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8">
           {children}
        </main>
      </div>
    </div>
  );
};

// Wrapper to provide Context first
const AppContent = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/assets" element={<AssetList />} />
          <Route path="/add-asset" element={<AssetForm />} />
          <Route path="/rooms" element={<RoomList />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
};

const App = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;