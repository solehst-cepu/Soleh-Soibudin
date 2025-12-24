import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { UserCircle } from 'lucide-react';
import { Logo } from '../components/Logo';

const Login = () => {
  const { login, settings } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password) {
      // Simple mock validation
      if (password === 'admin') {
         login(username);
      } else {
         setError('Password salah. (Hint: use "admin")');
      }
    } else {
      setError('Mohon isi username dan password');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        {/* Brand Header */}
        <div className="p-8 pb-0 text-center">
          <div className="w-24 h-24 mx-auto mb-4">
             <Logo className="w-full h-full drop-shadow-md" src={settings.logoUrl} />
          </div>
          <h1 className="text-3xl font-serif font-bold text-gray-900 tracking-tight">{settings.schoolName}</h1>
          <p className="text-gray-500 mt-2 text-sm">{settings.appName}</p>
        </div>
        
        <div className="p-8 pt-6">
          <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink-0 mx-4 text-gray-400 text-xs uppercase tracking-wider">Login to Dashboard</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserCircle className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="Enter username"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Enter password"
              />
            </div>

            {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center">{error}</div>}

            <button
              type="submit"
              className="w-full bg-blue-700 text-white py-2.5 rounded-lg hover:bg-blue-800 font-medium transition duration-200 shadow-sm"
            >
              Sign In
            </button>
          </form>
          
          <div className="mt-8 text-center text-xs text-gray-400">
            &copy; {new Date().getFullYear()} {settings.schoolName}. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;