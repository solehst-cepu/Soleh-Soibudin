import { Asset, AssetStatus, AssetType, Room } from './types';

// Data simulasi berdasarkan OCR PDF yang diberikan user
export const INITIAL_ASSETS: Asset[] = [
  // Page 1 Data (Grade 1 C)
  {
    id: '1', barcode: 'AST0001511', description: 'Kipas Angin', status: AssetStatus.IN_USE, 
    location: 'Grade 1 C', type: AssetType.ELECTRONICS, marketValue: 350000, dateAcquired: '2023-01-15', lastUpdated: '2023-10-08'
  },
  {
    id: '2', barcode: 'AST0001512', description: 'Kipas Angin', status: AssetStatus.IN_USE, 
    location: 'Grade 1 C', type: AssetType.ELECTRONICS, marketValue: 350000, dateAcquired: '2023-01-15', lastUpdated: '2023-10-08'
  },
  {
    id: '3', barcode: 'AST0001524', description: 'Infocus', status: AssetStatus.IN_USE, 
    location: 'Grade 1 C', type: AssetType.ELECTRONICS, marketValue: 4500000, dateAcquired: '2022-06-20', lastUpdated: '2023-10-08'
  },
  {
    id: '4', barcode: 'AST0001537', description: 'Speaker', status: AssetStatus.IN_USE, 
    location: 'Grade 1 C', brand: 'Simbadda', model: 'Simbadda', type: AssetType.ELECTRONICS, marketValue: 800000, dateAcquired: '2023-02-10', lastUpdated: '2023-10-08'
  },
  {
    id: '5', barcode: 'AST0001477', description: 'Mading Softboard', status: AssetStatus.IN_USE, 
    location: 'Grade 1 C', type: AssetType.EQUIPMENT, marketValue: 200000, dateAcquired: '2021-08-01', lastUpdated: '2023-10-08'
  },
  {
    id: '6', barcode: 'AST0001514', description: 'White Board', status: AssetStatus.IN_USE, 
    location: 'Grade 1 C', type: AssetType.EQUIPMENT, marketValue: 500000, dateAcquired: '2021-08-01', lastUpdated: '2023-10-08'
  },
  {
    id: '7', barcode: 'AST0001509', description: 'Loker', status: AssetStatus.IN_USE, 
    location: 'Grade 1 C', type: AssetType.FURNITURE, marketValue: 1200000, dateAcquired: '2020-05-15', lastUpdated: '2023-10-08'
  },
  {
    id: '8', barcode: 'AST0001528', description: 'Lemari', status: AssetStatus.IN_USE, 
    location: 'Grade 1 C', type: AssetType.FURNITURE, marketValue: 2500000, dateAcquired: '2020-05-15', lastUpdated: '2023-10-08'
  },
  // Page 2 Data (Grade 1 C - Furniture Heavy)
  {
    id: '9', barcode: 'AST0001534', description: 'Kursi Kerja Hidrolik', status: AssetStatus.IN_USE, 
    location: 'Grade 1 C', type: AssetType.FURNITURE, marketValue: 750000, dateAcquired: '2021-11-20', lastUpdated: '2023-10-08'
  },
  {
    id: '10', barcode: 'AST0005254', description: 'Meja Belajar Segi Tiga', status: AssetStatus.IN_USE, 
    location: 'Grade 1 C', type: AssetType.FURNITURE, marketValue: 450000, dateAcquired: '2024-01-10', lastUpdated: '2024-02-15'
  },
  {
    id: '11', barcode: 'AST0004834', description: 'Kursi Belajar Coklat - New', status: AssetStatus.IN_USE, 
    location: 'Grade 1 C', type: AssetType.FURNITURE, marketValue: 300000, dateAcquired: '2024-01-10', lastUpdated: '2024-02-15'
  },
  // Page 1 Data (Grade 2 A)
  {
    id: '12', barcode: 'AST0001774', description: 'Laptop', status: AssetStatus.IN_USE, 
    location: 'Grade 2 A', brand: 'Asus', model: 'A456U', type: AssetType.ELECTRONICS, marketValue: 6000000, dateAcquired: '2019-09-12', lastUpdated: '2023-10-08'
  },
  {
    id: '13', barcode: 'AST0001775', description: 'Komputer', status: AssetStatus.IN_USE, 
    location: 'Grade 2 A', brand: 'Acer', model: 'Acer', type: AssetType.ELECTRONICS, marketValue: 5500000, dateAcquired: '2019-09-12', lastUpdated: '2023-10-08'
  },
  {
    id: '14', barcode: 'AST0001760', description: 'Rak Buku', status: AssetStatus.IN_USE, 
    location: 'Grade 2 A', type: AssetType.FURNITURE, marketValue: 850000, dateAcquired: '2020-03-01', lastUpdated: '2023-10-08'
  },
   {
    id: '15', barcode: 'AST0005545', description: 'Wastafel', status: AssetStatus.IN_USE, 
    location: 'Grade 2 A', type: AssetType.FURNITURE, marketValue: 1500000, dateAcquired: '2024-05-01', lastUpdated: '2024-05-05'
  }
];

export const INITIAL_ROOMS: Room[] = [
  { id: 'R001', name: 'Grade 1 C', category: 'Classroom' },
  { id: 'R002', name: 'Grade 2 A', category: 'Classroom' },
  { id: 'R003', name: 'Teacher Office', category: 'Office' },
  { id: 'R004', name: 'Computer Lab', category: 'Laboratory' },
  { id: 'R005', name: 'Library', category: 'Common' },
];

export const DEMO_USER = {
  id: 'u1',
  username: 'admin',
  role: 'admin' as const,
  name: 'Manager Operasional'
};