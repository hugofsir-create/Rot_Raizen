import React, { useRef } from 'react';
import * as XLSX from 'xlsx';
import { Upload, FileSpreadsheet } from 'lucide-react';
import { Material } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface ExcelUploadProps {
  onUpload: (materials: Material[]) => void;
}

export const ExcelUpload: React.FC<ExcelUploadProps> = ({ onUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];

      const parsedMaterials: Material[] = jsonData.map((row) => ({
        id: uuidv4(),
        sku: String(row.sku || row.SKU || ''),
        descripcion: String(row.descripcion || row.Descripcion || row.DESCRIPCION || ''),
        categoria: String(row.categoria || row.Categoria || row.CATEGORIA || ''),
      })).filter(m => m.sku || m.descripcion);

      onUpload(parsedMaterials);
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="flex items-center gap-4">
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
        ref={fileInputRef}
        className="hidden"
        id="excel-upload"
      />
      <label
        htmlFor="excel-upload"
        className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 rounded-lg cursor-pointer transition-all shadow-lg font-medium text-sm active:scale-95"
      >
        <Upload size={18} />
        Cargar Excel
      </label>
      <div className="flex items-center gap-2 text-slate-600 text-[10px] uppercase font-bold tracking-widest">
        <FileSpreadsheet size={14} className="text-emerald-500/50" />
        <span>Formatos: .xlsx, .xls</span>
      </div>
    </div>
  );
};
