import React from 'react';
import { NonAptEntry } from '../types';
import { Download, Package, TrendingUp, Layers } from 'lucide-react';
import * as XLSX from 'xlsx';

interface InventoryTotalsProps {
  entries: NonAptEntry[];
}

interface TotalRow {
  sku: string;
  descripcion: string;
  categoria: string;
  totalCantidad: number;
  movimientos: number;
}

export const InventoryTotals: React.FC<InventoryTotalsProps> = ({ entries }) => {
  // Group by SKU
  const totalsMap: Record<string, TotalRow> = {};
  entries.forEach(entry => {
    const key = entry.sku;
    if (!totalsMap[key]) {
      totalsMap[key] = {
        sku: entry.sku,
        descripcion: entry.descripcion,
        categoria: entry.lote || 'N/A', // Using 'lote' field which stores category
        totalCantidad: 0,
        movimientos: 0,
      };
    }
    totalsMap[key].totalCantidad += entry.cantidad;
    totalsMap[key].movimientos += 1;
  });

  const totals = Object.values(totalsMap).sort((a, b) => b.totalCantidad - a.totalCantidad);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      totals.map(t => ({
        'SKU': t.sku,
        'Descripción': t.descripcion,
        'Categoría': t.categoria,
        'Total Cantidad': t.totalCantidad,
        'Nro. Movimientos': t.movimientos
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inventario Total");
    XLSX.writeFile(workbook, `Inventario_Total_Calico_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const totalGeneral = totals.reduce((sum, t) => sum + t.totalCantidad, 0);
  const totalSkus = totals.length;

  if (totals.length === 0) {
    return (
      <div className="bg-slate-900/40 rounded-xl border border-slate-800 p-12 text-center backdrop-blur-sm">
        <p className="text-slate-500">No hay datos de inventario para totalizar.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-xl backdrop-blur-sm shadow-xl flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-500">
            <TrendingUp size={24} />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Unidades</div>
            <div className="text-2xl font-bold text-white">{totalGeneral}</div>
          </div>
        </div>
        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-xl backdrop-blur-sm shadow-xl flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-500">
            <Layers size={24} />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">SKUs Únicos</div>
            <div className="text-2xl font-bold text-white">{totalSkus}</div>
          </div>
        </div>
        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-xl backdrop-blur-sm shadow-xl flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-500">
            <Package size={24} />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Movimientos</div>
            <div className="text-2xl font-bold text-white">{entries.length}</div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-slate-900/40 rounded-xl border border-slate-800 overflow-hidden shadow-2xl backdrop-blur-sm">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest">Resumen de Inventario</h3>
          <button
            onClick={exportToExcel}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-all shadow-lg shadow-emerald-600/20 font-bold text-xs uppercase tracking-widest active:scale-95"
          >
            <Download size={16} />
            Exportar Excel
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/60 border-b border-slate-800">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-[0.15em]">SKU</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-[0.15em]">Descripción</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-[0.15em]">Categoría</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-[0.15em] text-center">Movimientos</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-[0.15em] text-right">Total Cantidad</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {totals.map((row) => (
                <tr key={row.sku} className="hover:bg-emerald-500/5 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm font-medium text-emerald-500/90">{row.sku}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-300">{row.descripcion}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400 uppercase tracking-wider border border-slate-700">
                      {row.categoria}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm text-slate-400 font-bold">{row.movimientos}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm font-bold text-white">{row.totalCantidad}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
