import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Asset, AssetStatus, AssetType } from '../types';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';

const AssetForm = () => {
  const { addAsset, rooms, categories } = useApp();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<Partial<Asset>>({
    status: AssetStatus.IN_USE,
    type: categories[0] || 'Furniture',
    dateAcquired: new Date().toISOString().split('T')[0],
    location: rooms[0]?.name || ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.barcode || !formData.description || !formData.location) {
      alert('Please fill required fields (Barcode, Description, Location)');
      return;
    }

    const newAsset: Asset = {
      id: Date.now().toString(),
      barcode: formData.barcode,
      description: formData.description,
      location: formData.location,
      status: formData.status as AssetStatus,
      type: formData.type || 'Other',
      marketValue: Number(formData.marketValue) || 0,
      brand: formData.brand || '',
      model: formData.model || '',
      serialNumber: formData.serialNumber || '',
      dateAcquired: formData.dateAcquired || new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };

    addAsset(newAsset);
    alert('Asset added successfully!');
    navigate('/assets');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-500 hover:text-gray-800 mb-6 transition"
      >
        <ArrowLeft size={20} className="mr-2" /> Back to List
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800">Input New Asset</h2>
          <p className="text-sm text-gray-500">Add inventory item to Lazuardi database</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-700 border-b pb-2">Identification</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Barcode ID *</label>
                <input
                  type="text"
                  name="barcode"
                  required
                  placeholder="e.g., AST0001511"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description / Name *</label>
                <input
                  type="text"
                  name="description"
                  required
                  placeholder="e.g., Kipas Angin"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Serial Number</label>
                <input
                  type="text"
                  name="serialNumber"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Categorization */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-700 border-b pb-2">Details</h3>

               <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type / Category *</label>
                <select
                  name="type"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  onChange={handleChange}
                  value={formData.type}
                >
                  {categories.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                <select
                  name="location"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  onChange={handleChange}
                  value={formData.location}
                >
                  <option value="">Select Room</option>
                  {rooms.map(r => <option key={r.id} value={r.name}>{r.name} ({r.category})</option>)}
                </select>
              </div>

              <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                 <select
                  name="status"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  onChange={handleChange}
                  value={formData.status}
                >
                  {Object.values(AssetStatus).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            {/* Value & Specs */}
             <div className="space-y-4 md:col-span-2">
              <h3 className="font-semibold text-gray-700 border-b pb-2">Specification & Value</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                  <input type="text" name="brand" className="w-full px-4 py-2 border border-gray-300 rounded-lg" onChange={handleChange} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                  <input type="text" name="model" className="w-full px-4 py-2 border border-gray-300 rounded-lg" onChange={handleChange} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Market Value (IDR)</label>
                  <input type="number" name="marketValue" className="w-full px-4 py-2 border border-gray-300 rounded-lg" onChange={handleChange} />
                </div>
              </div>
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date Acquired</label>
                  <input type="date" name="dateAcquired" value={formData.dateAcquired} className="w-full px-4 py-2 border border-gray-300 rounded-lg" onChange={handleChange} />
               </div>
            </div>
          </div>

          <div className="pt-6 border-t flex justify-end gap-3">
            <button type="button" onClick={() => navigate('/assets')} className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
              <Save size={18} /> Save Asset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssetForm;