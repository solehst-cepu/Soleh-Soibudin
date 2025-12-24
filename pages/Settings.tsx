import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { User, Room, Asset, AssetStatus } from '../types';
import { Save, Trash2, Plus, UserPlus, MapPin, Tag, Layout, Database, FileSpreadsheet, FileText, Printer, Upload, Image as ImageIcon } from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

type Tab = 'general' | 'users' | 'locations' | 'categories' | 'data';

const Settings = () => {
  const { 
    settings, updateSettings, 
    users, addUser, removeUser, 
    rooms, addRoom, removeRoom,
    categories, addCategory, removeCategory,
    assets, importAssets
  } = useApp();
  
  const [activeTab, setActiveTab] = useState<Tab>('users');

  // Local state for forms
  const [newUser, setNewUser] = useState({ name: '', username: '', role: 'staff' });
  const [newRoom, setNewRoom] = useState({ name: '', category: 'Classroom' });
  const [newCategory, setNewCategory] = useState('');

  // Report State
  const [reportFilterType, setReportFilterType] = useState<'All' | 'Location' | 'Category'>('All');
  const [reportFilterValue, setReportFilterValue] = useState('');

  // Handlers
  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if(newUser.name && newUser.username) {
      addUser({ id: Date.now().toString(), name: newUser.name, username: newUser.username, role: newUser.role as any });
      setNewUser({ name: '', username: '', role: 'staff' });
    }
  };

  const handleAddRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if(newRoom.name) {
      addRoom({ id: 'R' + Date.now(), name: newRoom.name, category: newRoom.category });
      setNewRoom({ name: '', category: 'Classroom' });
    }
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if(newCategory) {
      addCategory(newCategory);
      setNewCategory('');
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateSettings({ logoUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  // --- DATA EXPORT HANDLERS ---
  const getFilteredData = () => {
    if (reportFilterType === 'All') return assets;
    if (reportFilterType === 'Location') return assets.filter(a => a.location === reportFilterValue);
    if (reportFilterType === 'Category') return assets.filter(a => a.type === reportFilterValue);
    return assets;
  };

  const exportToExcel = () => {
    const data = getFilteredData().map(a => ({
      Barcode: a.barcode,
      Name: a.description,
      Type: a.type,
      Location: a.location,
      Status: a.status,
      Value: a.marketValue,
      Date: a.dateAcquired
    }));
    
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Assets");
    XLSX.writeFile(wb, `Lazuardi_Assets_${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  const exportToPDF = () => {
    const doc: any = new jsPDF();
    doc.text(`${settings.schoolName} Asset Report`, 14, 15);
    doc.text(`Filter: ${reportFilterType} ${reportFilterValue ? '- ' + reportFilterValue : ''}`, 14, 22);
    
    const data = getFilteredData().map(a => [
      a.barcode, a.description, a.location, a.type, a.status
    ]);

    doc.autoTable({
      head: [['Barcode', 'Name', 'Location', 'Type', 'Status']],
      body: data,
      startY: 25,
    });

    doc.save(`Asset_Report_${new Date().toISOString().slice(0,10)}.pdf`);
  };

  const printReport = () => {
    const data = getFilteredData();
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Asset Report</title>
          <style>
            body { font-family: sans-serif; padding: 20px; }
            h1 { text-align: center; margin-bottom: 5px; }
            p { text-align: center; color: #666; margin-top: 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 12px; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <div style="text-align:center; margin-bottom: 20px;">
             ${settings.logoUrl ? `<img src="${settings.logoUrl}" style="height: 60px; width: auto;" />` : ''}
             <h1>${settings.schoolName}</h1>
          </div>
          <p>Asset Report - ${new Date().toLocaleDateString()}</p>
          <p>Filter: ${reportFilterType} ${reportFilterValue ? '(' + reportFilterValue + ')' : ''}</p>
          <table>
            <thead>
              <tr>
                <th>Barcode</th>
                <th>Description</th>
                <th>Location</th>
                <th>Category</th>
                <th>Status</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              ${data.map(item => `
                <tr>
                  <td>${item.barcode}</td>
                  <td>${item.description}</td>
                  <td>${item.location}</td>
                  <td>${item.type}</td>
                  <td>${item.status}</td>
                  <td>${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(item.marketValue)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <script>window.onload = () => window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // --- DATA IMPORT HANDLER ---
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = evt.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet) as any[];

        const newAssets: Asset[] = jsonData.map((row: any, index: number) => ({
          id: Date.now().toString() + index,
          barcode: row.Barcode || row.barcode || `IMP-${Date.now()}-${index}`,
          description: row.Description || row.Name || row.name || 'Unknown',
          location: row.Location || row.location || 'Unknown',
          status: (row.Status || 'In Use') as AssetStatus,
          type: row.Type || row.Category || 'Other',
          marketValue: Number(row.Value || row.value || 0),
          dateAcquired: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        }));

        importAssets(newAssets);
        alert(`Successfully imported ${newAssets.length} assets.`);
        e.target.value = ''; // Reset input
      } catch (err) {
        console.error(err);
        alert('Error parsing file. Ensure it is a valid Excel or CSV file.');
      }
    };
    reader.readAsBinaryString(file);
  };

  const tabs = [
    { id: 'users', label: 'Users', icon: UserPlus },
    { id: 'locations', label: 'Locations', icon: MapPin },
    { id: 'categories', label: 'Categories', icon: Tag },
    { id: 'data', label: 'Data & Reports', icon: Database },
    { id: 'general', label: 'App Display', icon: Layout },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Settings & Configuration</h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Settings Sidebar */}
        <div className="w-full md:w-64 bg-white rounded-xl shadow-sm border border-gray-100 h-fit">
          <nav className="flex flex-col p-2">
            {tabs.map(tab => (
               <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors font-medium
                  ${activeTab === tab.id ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}
                `}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-[400px]">
          
          {/* USERS TAB */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-800 border-b pb-4">Manage Users</h2>
              
              {/* Add User Form */}
              <form onSubmit={handleAddUser} className="bg-gray-50 p-4 rounded-lg flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1 w-full">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Full Name</label>
                  <input type="text" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} className="w-full px-3 py-2 border rounded-md" placeholder="e.g. John Doe" required />
                </div>
                <div className="flex-1 w-full">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Username</label>
                  <input type="text" value={newUser.username} onChange={e => setNewUser({...newUser, username: e.target.value})} className="w-full px-3 py-2 border rounded-md" placeholder="e.g. admin" required />
                </div>
                <div className="w-full md:w-32">
                   <label className="block text-xs font-medium text-gray-500 mb-1">Role</label>
                   <select value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})} className="w-full px-3 py-2 border rounded-md bg-white">
                     <option value="admin">Admin</option>
                     <option value="staff">Staff</option>
                   </select>
                </div>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 w-full md:w-auto flex justify-center items-center gap-2">
                  <Plus size={16} /> Add
                </button>
              </form>

              {/* User List */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-100 text-gray-600 uppercase">
                    <tr>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Username</th>
                      <th className="px-4 py-3">Role</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {users.map(u => (
                      <tr key={u.id}>
                        <td className="px-4 py-3 font-medium">{u.name}</td>
                        <td className="px-4 py-3 text-gray-500">{u.username}</td>
                        <td className="px-4 py-3"><span className="bg-gray-100 px-2 py-1 rounded text-xs">{u.role}</span></td>
                        <td className="px-4 py-3 text-right">
                          <button onClick={() => { if(confirm('Delete user?')) removeUser(u.id); }} className="text-red-500 hover:text-red-700">
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* LOCATIONS TAB */}
          {activeTab === 'locations' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-800 border-b pb-4">Manage Locations (Rooms)</h2>
              
               <form onSubmit={handleAddRoom} className="bg-gray-50 p-4 rounded-lg flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1 w-full">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Room Name</label>
                  <input type="text" value={newRoom.name} onChange={e => setNewRoom({...newRoom, name: e.target.value})} className="w-full px-3 py-2 border rounded-md" placeholder="e.g. Grade 1 A" required />
                </div>
                <div className="flex-1 w-full">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Category</label>
                  <select value={newRoom.category} onChange={e => setNewRoom({...newRoom, category: e.target.value})} className="w-full px-3 py-2 border rounded-md bg-white">
                     <option value="Classroom">Classroom</option>
                     <option value="Office">Office</option>
                     <option value="Laboratory">Laboratory</option>
                     <option value="Common">Common Area</option>
                     <option value="Storage">Storage</option>
                   </select>
                </div>
                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 w-full md:w-auto flex justify-center items-center gap-2">
                  <Plus size={16} /> Add Room
                </button>
              </form>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {rooms.map(room => (
                  <div key={room.id} className="border p-3 rounded-lg flex justify-between items-center bg-gray-50 hover:bg-white hover:shadow-sm transition">
                    <div>
                      <p className="font-medium text-gray-800">{room.name}</p>
                      <p className="text-xs text-gray-500">{room.category}</p>
                    </div>
                    <button onClick={() => { if(confirm('Delete room?')) removeRoom(room.id); }} className="text-gray-400 hover:text-red-500">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CATEGORIES TAB */}
          {activeTab === 'categories' && (
             <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-800 border-b pb-4">Asset Categories</h2>
              <p className="text-sm text-gray-500">Manage the types of assets available in the system.</p>

              <form onSubmit={handleAddCategory} className="bg-gray-50 p-4 rounded-lg flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1 w-full">
                  <label className="block text-xs font-medium text-gray-500 mb-1">New Category Name</label>
                  <input type="text" value={newCategory} onChange={e => setNewCategory(e.target.value)} className="w-full px-3 py-2 border rounded-md" placeholder="e.g. Musical Instruments" required />
                </div>
                <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 w-full md:w-auto flex justify-center items-center gap-2">
                  <Plus size={16} /> Add Category
                </button>
              </form>

              <div className="flex flex-wrap gap-3">
                {categories.map(cat => (
                  <div key={cat} className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full border border-blue-100">
                    <span className="text-sm font-medium">{cat}</span>
                    <button onClick={() => { if(confirm(`Delete category ${cat}?`)) removeCategory(cat); }} className="text-blue-300 hover:text-red-500">
                       <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
             </div>
          )}

          {/* DATA & REPORTS TAB */}
          {activeTab === 'data' && (
            <div className="space-y-8">
              {/* Report Configuration */}
               <div>
                <h2 className="text-xl font-bold text-gray-800 border-b pb-4 mb-4">Print & Reports</h2>
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Report Configuration</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div>
                      <span className="block text-xs text-gray-500 mb-1">Filter By</span>
                      <select 
                        className="w-full border rounded-md px-3 py-2 bg-white"
                        value={reportFilterType}
                        onChange={(e) => {
                          setReportFilterType(e.target.value as any);
                          setReportFilterValue(''); // Reset secondary selection
                        }}
                      >
                        <option value="All">All Assets</option>
                        <option value="Location">By Location</option>
                        <option value="Category">By Category</option>
                      </select>
                    </div>

                    {reportFilterType === 'Location' && (
                      <div>
                        <span className="block text-xs text-gray-500 mb-1">Select Location</span>
                        <select 
                          className="w-full border rounded-md px-3 py-2 bg-white"
                          value={reportFilterValue}
                          onChange={(e) => setReportFilterValue(e.target.value)}
                        >
                          <option value="">Select...</option>
                          {rooms.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
                        </select>
                      </div>
                    )}

                    {reportFilterType === 'Category' && (
                      <div>
                        <span className="block text-xs text-gray-500 mb-1">Select Category</span>
                        <select 
                          className="w-full border rounded-md px-3 py-2 bg-white"
                          value={reportFilterValue}
                          onChange={(e) => setReportFilterValue(e.target.value)}
                        >
                          <option value="">Select...</option>
                          {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4">
                     <button 
                      onClick={printReport}
                      className="flex items-center gap-2 bg-slate-700 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition"
                    >
                      <Printer size={18} /> Print Report
                    </button>
                    <button 
                      onClick={exportToPDF}
                      className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                    >
                      <FileText size={18} /> Export PDF
                    </button>
                    <button 
                      onClick={exportToExcel}
                      className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                    >
                      <FileSpreadsheet size={18} /> Export Excel
                    </button>
                  </div>
                </div>
              </div>

              {/* Import Section */}
              <div>
                <h2 className="text-xl font-bold text-gray-800 border-b pb-4 mb-4">Import Data</h2>
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                      <Upload size={24} />
                    </div>
                    <div className="flex-1">
                       <h3 className="font-semibold text-gray-800">Bulk Upload Assets</h3>
                       <p className="text-sm text-gray-600 mb-4">Upload an Excel (.xlsx) or CSV file. Columns must match: Barcode, Name, Location, Status, Type, Value.</p>
                       
                       <input 
                        type="file" 
                        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                        onChange={handleFileUpload}
                        className="block w-full text-sm text-slate-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-full file:border-0
                          file:text-sm file:font-semibold
                          file:bg-blue-50 file:text-blue-700
                          hover:file:bg-blue-100
                        "
                      />
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

           {/* GENERAL TAB */}
           {activeTab === 'general' && (
             <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-800 border-b pb-4">General Settings</h2>
              
              <div className="grid gap-6 max-w-lg">
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">School / Organization Name</label>
                   <input 
                    type="text" 
                    value={settings.schoolName} 
                    onChange={(e) => updateSettings({ schoolName: e.target.value })} 
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Application Title</label>
                   <input 
                    type="text" 
                    value={settings.appName} 
                    onChange={(e) => updateSettings({ appName: e.target.value })} 
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                
                {/* Logo Upload Section */}
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">School Logo</label>
                   <div className="flex items-center gap-4">
                      <div className="w-16 h-16 border rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden relative group">
                        {settings.logoUrl ? (
                          <img src={settings.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                        ) : (
                          <ImageIcon className="text-gray-300" />
                        )}
                      </div>
                      <div className="flex-1">
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="block w-full text-sm text-slate-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border-0
                            file:text-sm file:font-semibold
                            file:bg-violet-50 file:text-violet-700
                            hover:file:bg-violet-100
                          "
                        />
                        <p className="text-xs text-gray-500 mt-1">Upload a PNG or JPG file for your school logo.</p>
                      </div>
                   </div>
                   {settings.logoUrl && (
                     <button 
                      onClick={() => updateSettings({ logoUrl: '' })} 
                      className="text-xs text-red-500 mt-2 hover:underline"
                    >
                      Remove Logo
                    </button>
                   )}
                </div>

              </div>
             </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Settings;