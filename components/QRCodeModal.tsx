import React from 'react';
import QRCode from 'react-qr-code';
import { X, Download, Printer } from 'lucide-react';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  value: string;
  label: string;
  details?: { label: string; value: string }[];
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({ isOpen, onClose, title, value, label, details }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const detailsHtml = details 
        ? `<div style="margin-top: 15px; width: 100%; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; text-align: left; padding: 0 10px;">
            ${details.map(d => `
              <div>
                <span style="display:block; font-size: 10px; color: #666; text-transform: uppercase;">${d.label}</span>
                <span style="display:block; font-size: 12px; font-weight: bold;">${d.value}</span>
              </div>
            `).join('')}
           </div>`
        : '';

      printWindow.document.write(`
        <html>
          <head>
            <title>Print QR Code</title>
            <style>
              body { font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; }
              .label { margin-top: 10px; font-weight: bold; font-size: 18px; text-align: center; }
              .sub-label { margin-top: 5px; color: #666; font-size: 14px; text-align: center; font-family: monospace; }
              .container { border: 1px solid #ddd; padding: 20px; border-radius: 8px; display: flex; flex-direction: column; align-items: center; width: 320px; box-sizing: border-box; }
            </style>
          </head>
          <body>
            <div class="container">
              ${document.getElementById('qr-code-svg-container')?.innerHTML}
              <div class="label">${title}</div>
              <div class="sub-label">${label}</div>
              ${detailsHtml}
            </div>
            <script>window.onload = () => window.print();</script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800">QR Code</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        
        <div className="flex flex-col items-center justify-center p-6 bg-white" id="qr-export-area">
          <div className="p-4 bg-white border rounded-lg" id="qr-code-svg-container">
            <QRCode 
              value={value} 
              size={200} 
              level="H" 
            />
          </div>
          <div className="mt-4 text-center w-full">
            <p className="font-bold text-lg text-gray-900">{title}</p>
            <p className="text-sm text-gray-500 font-mono">{label}</p>
            
            {details && details.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-3 text-left">
                {details.map((item, idx) => (
                  <div key={idx}>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">{item.label}</p>
                    <p className="text-sm font-medium text-gray-700 truncate">{item.value}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="p-4 bg-gray-50 flex gap-3 border-t">
          <button 
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            <Printer size={18} /> Print Label
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRCodeModal;