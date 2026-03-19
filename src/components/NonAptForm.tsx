import React, { useState } from 'react';
import { Material, NonAptEntry } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { Plus, Search, AlertCircle } from 'lucide-react';

interface NonAptFormProps {
  masterMaterials: Material[];
  onAddEntry: (entry: NonAptEntry) => void;
}

export const NonAptForm: React.FC<NonAptFormProps> = ({ masterMaterials, onAddEntry }) => {
  const [selectedSku, setSelectedSku] = useState('');
  const [cantidad, setCantidad] = useState<number>(0);
  const [motivo, setMotivo] = useState('');
  const [lote, setLote] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredMaster = masterMaterials.filter(m => 
    m.sku.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const material = masterMaterials.find(m => m.sku === selectedSku);
    if (!material || cantidad <= 0) return;

    const newEntry: NonAptEntry = {
      id: uuidv4(),
      materialId: material.id,
      sku: material.sku,
      descripcion: material.descripcion,
      cantidad,
      motivo,
      lote,
      fecha: new Date().toISOString(),
    };

    onAddEntry(newEntry);
    
    // Reset form
    setSelectedSku('');
    setSearchTerm('');
    setCantidad(0);
    setMotivo('');
    setLote('');
  };

  return (
    <div className="bg-slate-900/40 rounded-xl border border-slate-800 p-6 backdrop-blur-sm shadow-xl">
      <div className="flex items-center gap-2 mb-6">
        <AlertCircle className="text-emerald-500" size={20} />
        <h2 className="text-lg font-bold text-white">Registrar Material No Apto</h2>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        {/* Selector de Material */}
        <div className="relative">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
            Buscar Material (SKU/Desc)
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={14} />
            <input
              type="text"
              value={selectedSku ? selectedSku : searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setSelectedSku('');
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              placeholder="Escriba SKU..."
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 text-sm text-slate-200"
            />
          </div>
          
          {showDropdown && searchTerm && !selectedSku && (
            <div className="absolute z-20 w-full mt-1 bg-slate-900 border border-slate-800 rounded-lg shadow-2xl overflow-hidden">
              {filteredMaster.length > 0 ? (
                filteredMaster.map(m => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      setSelectedSku(m.sku);
                      setSearchTerm(m.sku);
                      setLote(m.categoria);
                      setShowDropdown(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-emerald-500/10 transition-colors border-b border-slate-800/50 last:border-0"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <div className="text-xs font-bold text-emerald-500 font-mono">{m.sku}</div>
                      {m.categoria && (
                        <div className="text-[8px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-500 border border-slate-700 uppercase font-bold tracking-tighter">
                          {m.categoria}
                        </div>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">{m.descripcion}</div>
                  </button>
                ))
              ) : (
                <div className="px-4 py-2 text-[10px] text-slate-500 italic">No se encontraron resultados</div>
              )}
            </div>
          )}
        </div>

        {/* Categoría (antes Lote) */}
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
            Categoría
          </label>
          <input
            type="text"
            value={lote}
            onChange={(e) => setLote(e.target.value)}
            placeholder="Categoría del material"
            className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 text-sm text-slate-200"
          />
        </div>

        {/* Cantidad */}
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
            Cantidad
          </label>
          <input
            type="number"
            value={cantidad || ''}
            onChange={(e) => setCantidad(Number(e.target.value))}
            placeholder="0"
            className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 text-sm text-slate-200"
          />
        </div>

        {/* Motivo */}
        <div className="lg:col-span-3">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
            Motivo / Observación
          </label>
          <input
            type="text"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            placeholder="Ej: Empaque dañado, Vencimiento..."
            className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 text-sm text-slate-200"
          />
        </div>

        {/* Botón Guardar */}
        <div className="lg:col-span-1">
          <button
            type="submit"
            disabled={!selectedSku || cantidad <= 0}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:hover:bg-emerald-600 text-white rounded-lg transition-all shadow-lg shadow-emerald-600/20 font-bold text-xs uppercase tracking-widest active:scale-95"
          >
            <Plus size={16} />
            Registrar
          </button>
        </div>
      </form>
    </div>
  );
};
