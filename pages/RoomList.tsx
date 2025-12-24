import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { QrCode, MapPin } from 'lucide-react';
import { Room } from '../types';
import QRCodeModal from '../components/QRCodeModal';

const RoomList = () => {
  const { rooms } = useApp();
  const [qrModal, setQrModal] = useState<{ isOpen: boolean; room: Room | null }>({ isOpen: false, room: null });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Daftar Ruangan (Locations)</h1>
      <p className="text-gray-500">Manage rooms and generate Location QR Codes for check-ins.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <div key={room.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="flex justify-between items-start">
              <div className="flex gap-4">
                <div className="bg-blue-50 p-3 rounded-lg h-fit">
                  <MapPin className="text-blue-600 w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">{room.name}</h3>
                  <span className="inline-block mt-1 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                    {room.category}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setQrModal({ isOpen: true, room })}
                className="text-gray-400 hover:text-blue-600 transition"
              >
                <QrCode size={24} />
              </button>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-50 flex justify-end">
               <button 
                onClick={() => setQrModal({ isOpen: true, room })}
                className="text-sm font-medium text-blue-600 hover:text-blue-800"
               >
                 Generate QR Label
               </button>
            </div>
          </div>
        ))}
      </div>

      <QRCodeModal 
        isOpen={qrModal.isOpen}
        onClose={() => setQrModal({ ...qrModal, isOpen: false })}
        title={qrModal.room?.name || ''}
        value={qrModal.room ? `ROOM:${qrModal.room.name}` : ''}
        label="Location Tag"
      />
    </div>
  );
};

export default RoomList;