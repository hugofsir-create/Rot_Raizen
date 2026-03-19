import React from 'react';
import { NonAptEntry } from '../types';
import { Trash2, Calendar, Package, Hash } from 'lucide-react';

interface NonAptGridProps {
  entries: NonAptEntry[];
  onDelete: (id: string) => void;
}

export const NonAptGrid: React.FC<NonAptGridProps> = ({ entries, onDelete }) => {
  if (entries.length === 0) {
    return (
      <div className="bg-slate-900/40 rounded-xl border border-slate-800 p-12 text-center backdrop-blur-sm">
        <p className="text-slate-500">No hay registros de material no apto.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {entries.map((entry) => (
        <div 
          key={entry.id}
          className="bg-slate-900/40 rounded-xl border border-slate-800 p-5 backdrop-blur-sm shadow-xl hover:border-emerald-500/30 transition-all group relative overflow-hidden"
        >
          {/* Decorative background element */}
          <div className="absolute -right-4 -top-4 text-emerald-500/5 transform rotate-12 group-hover:text-emerald-500/10 transition-colors">
            <Package size={120} />
          </div>

          <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-1 font-mono">
                {entry.sku}
              </div>
              <h3 className="text-sm font-bold text-slate-200 line-clamp-1">{entry.descripcion}</h3>
            </div>
            <button
              onClick={() => onDelete(entry.id)}
              className="p-1.5 text-slate-600 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4 relative z-10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-slate-950 rounded flex items-center justify-center text-emerald-500/70">
                <Hash size={14} />
              </div>
              <div>
                <div className="text-[9px] text-slate-500 uppercase font-bold tracking-tighter">Cantidad</div>
                <div className="text-sm font-bold text-slate-200">{entry.cantidad}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-slate-950 rounded flex items-center justify-center text-emerald-500/70">
                <Calendar size={14} />
              </div>
              <div>
                <div className="text-[9px] text-slate-500 uppercase font-bold tracking-tighter">Fecha</div>
                <div className="text-xs font-medium text-slate-400">
                  {new Date(entry.fecha).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2 relative z-10">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-slate-500 font-bold uppercase tracking-widest">Categoría:</span>
              <span className="text-slate-300 font-mono">{entry.lote || 'N/A'}</span>
            </div>
            <div className="bg-slate-950/50 rounded p-2 border border-slate-800/50">
              <div className="text-[9px] text-slate-600 uppercase font-bold tracking-widest mb-1">Motivo</div>
              <p className="text-xs text-slate-400 italic line-clamp-2">"{entry.motivo || 'Sin observaciones'}"</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
