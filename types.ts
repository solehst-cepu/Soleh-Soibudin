export enum AssetStatus {
  IN_USE = 'In Use',
  BROKEN = 'Broken',
  MAINTENANCE = 'Maintenance',
  DISPOSED = 'Disposed',
  STORAGE = 'Storage'
}

export enum AssetType {
  ELECTRONICS = 'Electronics',
  FURNITURE = 'Furniture',
  EQUIPMENT = 'Equipment',
  VEHICLE = 'Vehicle',
  OTHER = 'Other'
}

export interface Asset {
  id: string;
  barcode: string;
  description: string;
  status: AssetStatus;
  location: string;
  serialNumber?: string;
  brand?: string;
  model?: string;
  marketValue: number;
  type: string; // Changed from AssetType to string to allow custom categories
  dateAcquired: string; // ISO Date string
  lastUpdated: string;
}

export interface User {
  id: string;
  username: string;
  role: 'admin' | 'staff';
  name: string;
  password?: string; // Optional for mock auth
}

export interface Room {
  id: string;
  name: string;
  category: string;
}

export interface AppSettings {
  schoolName: string;
  appName: string;
  compactMode: boolean;
  logoUrl?: string; // Add optional logo URL
}

export interface DashboardStats {
  totalAssets: number;
  totalValue: number;
  byType: { name: string; value: number }[];
  byLocation: { name: string; value: number }[];
  recentAssets: Asset[];
}