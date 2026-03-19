import React, { useState } from 'react';
import { Edit2, Trash2, X, Check } from 'lucide-react';
import { Material } from '../types';

interface MaterialGridProps {
  materials: Material[];
  onDelete: (id: string) => void;
  onUpdate: (material: Material) => void;
}

export const MaterialGrid: React.FC<MaterialGridProps> = ({ materials, onDelete, onUpdate }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Material | null>(null);

  const startEditing = (material: Material) => {
    setEditingId(material.id);
    setEditValues({ ...material });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditValues(null);
  };

  const saveEdit = () => {
    if (editValues) {
      onUpdate(editValues);
      setEditingId(null);
      setEditValues(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editValues) {
      setEditValues({
        ...editValues,
        [e.target.name]: e.target.value,
      });
    }
  };

  if (materials.length === 0) {
    return (
      <div className="bg-slate-900/40 rounded-xl border border-slate-800 p-12 text-center backdrop-blur-sm">
        <p className="text-slate-500">No hay materiales cargados. Use el botón superior para cargar un archivo Excel.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/40 rounded-xl border border-slate-800 overflow-hidden shadow-2xl backdrop-blur-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900/60 border-b border-slate-800">
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-[0.15em]">SKU</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-[0.15em]">Descripción</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-[0.15em]">Categoría</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-[0.15em] text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {materials.map((material) => (
              <tr key={material.id} className="hover:bg-emerald-500/5 transition-colors group">
                <td className="px-6 py-4">
                  {editingId === material.id ? (
                    <input
                      name="sku"
                      value={editValues?.sku}
                      onChange={handleInputChange}
                      className="w-full px-2 py-1 bg-slate-950 border border-emerald-500/30 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm text-emerald-400 font-mono"
                    />
                  ) : (
                    <span className="font-mono text-sm font-medium text-emerald-500/90">{material.sku}</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {editingId === material.id ? (
                    <input
                      name="descripcion"
                      value={editValues?.descripcion}
                      onChange={handleInputChange}
                      className="w-full px-2 py-1 bg-slate-950 border border-emerald-500/30 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm text-slate-200"
                    />
                  ) : (
                    <span className="text-sm text-slate-300">{material.descripcion}</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {editingId === material.id ? (
                    <input
                      name="categoria"
                      value={editValues?.categoria}
                      onChange={handleInputChange}
                      className="w-full px-2 py-1 bg-slate-950 border border-emerald-500/30 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm text-slate-200"
                    />
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400 uppercase tracking-wider border border-slate-700">
                      {material.categoria}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right whitespace-nowrap">
                  {editingId === material.id ? (
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={saveEdit}
                        className="p-1.5 text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-colors"
                        title="Guardar"
                      >
                        <Check size={18} />
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="p-1.5 text-slate-500 hover:bg-slate-800 rounded-lg transition-colors"
                        title="Cancelar"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0">
                      <button
                        onClick={() => startEditing(material)}
                        className="p-1.5 text-slate-500 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => onDelete(material.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
