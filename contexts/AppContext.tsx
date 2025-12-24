import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Asset, User, Room, DashboardStats, AssetType, AppSettings } from '../types';
import { INITIAL_ASSETS, INITIAL_ROOMS, DEMO_USER } from '../constants';

interface AppContextType {
  user: User | null;
  assets: Asset[];
  rooms: Room[];
  users: User[];
  categories: string[];
  settings: AppSettings;
  
  // Auth
  login: (username: string) => void;
  logout: () => void;
  
  // Asset Actions
  addAsset: (asset: Asset) => void;
  updateAsset: (asset: Asset) => void;
  deleteAsset: (id: string) => void;
  importAssets: (newAssets: Asset[]) => void;
  
  // Management Actions
  addUser: (user: User) => void;
  removeUser: (id: string) => void;
  addRoom: (room: Room) => void;
  removeRoom: (id: string) => void;
  addCategory: (category: string) => void;
  removeCategory: (category: string) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  
  // Stats
  getDashboardStats: () => DashboardStats;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children?: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  
  // Data States
  const [assets, setAssets] = useState<Asset[]>(INITIAL_ASSETS);
  const [rooms, setRooms] = useState<Room[]>(INITIAL_ROOMS);
  const [users, setUsers] = useState<User[]>([DEMO_USER]);
  const [categories, setCategories] = useState<string[]>(Object.values(AssetType));
  
  // App Settings State
  const [settings, setSettings] = useState<AppSettings>({
    schoolName: 'Lazuardi',
    appName: 'Asset Management',
    compactMode: false,
    logoUrl: '' // Default empty
  });

  // Load User & Settings from LocalStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('lazuardi_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    const storedSettings = localStorage.getItem('lazuardi_settings');
    if (storedSettings) {
      setSettings(JSON.parse(storedSettings));
    }
  }, []);

  const login = (username: string) => {
    // Check against users list
    const foundUser = users.find(u => u.username === username) || { ...DEMO_USER, username };
    setUser(foundUser);
    localStorage.setItem('lazuardi_user', JSON.stringify(foundUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('lazuardi_user');
  };

  // --- Asset Methods ---
  const addAsset = (asset: Asset) => {
    setAssets((prev) => [asset, ...prev]);
  };

  const updateAsset = (updatedAsset: Asset) => {
    setAssets((prev) => prev.map((a) => (a.id === updatedAsset.id ? updatedAsset : a)));
  };

  const deleteAsset = (id: string) => {
    setAssets((prev) => prev.filter((a) => a.id !== id));
  };

  const importAssets = (newAssets: Asset[]) => {
    setAssets(prev => [...newAssets, ...prev]);
  };

  // --- Management Methods ---
  const addUser = (newUser: User) => {
    setUsers(prev => [...prev, newUser]);
  };

  const removeUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const addRoom = (newRoom: Room) => {
    setRooms(prev => [...prev, newRoom]);
  };

  const removeRoom = (id: string) => {
    setRooms(prev => prev.filter(r => r.id !== id));
  };

  const addCategory = (category: string) => {
    if (!categories.includes(category)) {
      setCategories(prev => [...prev, category]);
    }
  };

  const removeCategory = (category: string) => {
    setCategories(prev => prev.filter(c => c !== category));
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem('lazuardi_settings', JSON.stringify(updated));
      return updated;
    });
  };

  // --- Stats ---
  const getDashboardStats = (): DashboardStats => {
    const totalAssets = assets.length;
    const totalValue = assets.reduce((sum, asset) => sum + (asset.marketValue || 0), 0);

    // Group by Type (Dynamic Categories)
    const typeMap = new Map<string, number>();
    categories.forEach(c => typeMap.set(c, 0)); // Init with 0
    
    assets.forEach(asset => {
      const current = typeMap.get(asset.type) || 0;
      typeMap.set(asset.type, current + 1);
    });
    const byType = Array.from(typeMap.entries())
      .map(([name, value]) => ({ name, value }))
      .filter(item => item.value > 0); // Only show used categories in chart

    // Group by Location
    const locMap = new Map<string, number>();
    assets.forEach(asset => {
      const current = locMap.get(asset.location) || 0;
      locMap.set(asset.location, current + 1);
    });
    const byLocation = Array.from(locMap.entries()).map(([name, value]) => ({ name, value }));

    const recentAssets = [...assets]
      .sort((a, b) => new Date(b.dateAcquired).getTime() - new Date(a.dateAcquired).getTime())
      .slice(0, 5);

    return { totalAssets, totalValue, byType, byLocation, recentAssets };
  };

  return (
    <AppContext.Provider value={{ 
      user, assets, rooms, users, categories, settings,
      login, logout, 
      addAsset, updateAsset, deleteAsset, importAssets,
      addUser, removeUser, addRoom, removeRoom, addCategory, removeCategory, updateSettings,
      getDashboardStats 
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};