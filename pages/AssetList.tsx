import React, { useState, useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { Search, Filter, QrCode, Download, Edit, Trash2, MapPin } from 'lucide-react';
import { Asset } from '../types';
import QRCodeModal from '../components/QRCodeModal';
import { Link } from 'react-router-dom';

const AssetList = () => {
  const { assets, deleteAsset, categories } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLocation, setFilterLocation] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [qrModal, setQrModal] = useState<{ isOpen: boolean; asset: Asset | null }>({ isOpen: false, asset: null });

  // Extract unique locations for filter
  const locations = useMemo(() => ['All', ...Array.from(new Set(assets.map(a => a.location)))], [assets]);

  // Filter Logic
  const filteredAssets = useMemo(() => {
    return assets.filter(asset => {
      const matchesSearch = 
        asset.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
        asset.barcode.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLoc = filterLocation === 'All' || asset.location === filterLocation;
      const matchesType = filterType === 'All' || asset.type === filterType;
      return matchesSearch && matchesLoc && matchesType;
    });
  }, [assets, searchTerm, filterLocation, filterType]);

  // Export Function (CSV)
  const handleExport = () => {
    const headers = ['Barcode', 'Description', 'Status', 'Location', 'Brand', 'Model', 'Serial', 'Type', 'Value', 'Date'];
    const rows = filteredAssets.map(a => [
      a.barcode,
      `"${a.description}"`, // Quote to handle commas
      a.status,
      `"${a.location}"`,
      a.brand || '',
      a.model || '',
      a.serialNumber || '',
      a.type,
      a.marketValue,
      a.dateAcquired
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Lazuardi_Assets_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Asset Inventory</h1>
        <button 
          onClick={handleExport}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition shadow-sm"
        >
          <Download size={18} />
          Export Data
        </button>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name or barcode..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>
        
        <div className="flex gap-4">
          <div className="relative min-w-[150px]">
            <select 
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              className="w-full pl-4 pr-8 py-2 border border-gray-200 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
            </select>
            <MapPin className="absolute right-3 top-2.5 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>

          <div className="relative min-w-[150px]">
             <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full pl-4 pr-8 py-2 border border-gray-200 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="All">All Types</option>
              {categories.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <Filter className="absolute right-3 top-2.5 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-sm uppercase">
              <tr>
                <th className="px-6 py-3 font-medium">Info</th>
                <th className="px-6 py-3 font-medium">Barcode</th>
                <th className="px-6 py-3 font-medium">Location</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Type</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredAssets.length > 0 ? (
                filteredAssets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{asset.description}</div>
                      <div className="text-xs text-gray-500">{asset.brand} {asset.model}</div>
                    </td>
                    <td className="px-6 py-4 font-mono text-sm text-gray-600">{asset.barcode}</td>
                    <td className="px-6 py-4 text-gray-600">{asset.location}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold
                        ${asset.status === 'In Use' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                      `}>
                        {asset.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{asset.type}</td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      <button 
                        onClick={() => setQrModal({ isOpen: true, asset })}
                        className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition"
                        title="View QR Code"
                      >
                        <QrCode size={18} />
                      </button>
                      <button 
                        className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded transition"
                        title="Edit Asset"
                      >
                         <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => { if(window.confirm('Delete this asset?')) deleteAsset(asset.id) }}
                        className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No assets found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <QRCodeModal 
        isOpen={qrModal.isOpen}
        onClose={() => setQrModal({ ...qrModal, isOpen: false })}
        title={qrModal.asset?.description || ''}
        value={qrModal.asset ? `ASSET:${qrModal.asset.barcode}` : ''}
        label={qrModal.asset?.barcode || ''}
        details={qrModal.asset ? [
          { label: 'Type', value: qrModal.asset.type },
          { label: 'Status', value: qrModal.asset.status },
          { label: 'Location', value: qrModal.asset.location },
          { label: 'Brand', value: qrModal.asset.brand || '-' },
        ] : undefined}
      />
    </div>
  );
};

export default AssetList;