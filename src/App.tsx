import { useState, useEffect } from 'react';
import { LoadingScreen } from './components/LoadingScreen';
import { ExcelUpload } from './components/ExcelUpload';
import { MaterialGrid } from './components/MaterialGrid';
import { NonAptForm } from './components/NonAptForm';
import { NonAptGrid } from './components/NonAptGrid';
import { InventoryTotals } from './components/InventoryTotals';
import { Material, NonAptEntry } from './types';
import { Package, Plus, Search, Database, ClipboardList, BarChart3 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { v4 as uuidv4 } from 'uuid';

type Tab = 'master' | 'non-apt' | 'inventory';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('master');
  const [materials, setMaterials] = useState<Material[]>([]);
  const [nonAptEntries, setNonAptEntries] = useState<NonAptEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Get unique categories for filter
  const categories = ['all', ...Array.from(new Set(materials.map(m => m.categoria).filter(Boolean)))];
  useEffect(() => {
    const savedMaterials = localStorage.getItem('calico_materials');
    const savedEntries = localStorage.getItem('calico_non_apt');
    
    if (savedMaterials) {
      try {
        setMaterials(JSON.parse(savedMaterials));
      } catch (e) {
        console.error('Error loading materials', e);
      }
    }
    
    if (savedEntries) {
      try {
        setNonAptEntries(JSON.parse(savedEntries));
      } catch (e) {
        console.error('Error loading non-apt entries', e);
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('calico_materials', JSON.stringify(materials));
  }, [materials]);

  useEffect(() => {
    localStorage.setItem('calico_non_apt', JSON.stringify(nonAptEntries));
  }, [nonAptEntries]);

  const handleUpload = (newMaterials: Material[]) => {
    setMaterials((prev) => [...newMaterials, ...prev]);
  };

  const handleDeleteMaterial = (id: string) => {
    setMaterials((prev) => prev.filter((m) => m.id !== id));
  };

  const handleUpdateMaterial = (updatedMaterial: Material) => {
    setMaterials((prev) =>
      prev.map((m) => (m.id === updatedMaterial.id ? updatedMaterial : m))
    );
  };

  const handleAddNonAptEntry = (entry: NonAptEntry) => {
    setNonAptEntries([entry, ...nonAptEntries]);
  };

  const handleDeleteNonAptEntry = (id: string) => {
    setNonAptEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const addNewItem = () => {
    const newItem: Material = {
      id: uuidv4(),
      sku: '',
      descripcion: '',
      categoria: ''
    };
    setMaterials([newItem, ...materials]);
  };

  const filteredMaterials = materials.filter(
    (m) => {
      const matchesSearch = 
        m.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.categoria.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || m.categoria === selectedCategory;
      
      return matchesSearch && matchesCategory;
    }
  );

  const filteredEntries = nonAptEntries.filter(
    (e) =>
      e.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.motivo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <LoadingScreen onComplete={() => setIsLoading(false)} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Header */}
      <header className="bg-slate-900/50 backdrop-blur-md border-b border-slate-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/20">
              <Package size={24} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white leading-none">Calico S.A.</h1>
              <p className="text-xs text-slate-400 font-medium">Terminal Logística</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center bg-slate-950/50 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('master')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                activeTab === 'master' 
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Database size={14} />
              Maestro
            </button>
            <button
              onClick={() => setActiveTab('non-apt')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                activeTab === 'non-apt' 
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <ClipboardList size={14} />
              Cargas No Apto
            </button>
            <button
              onClick={() => setActiveTab('inventory')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                activeTab === 'inventory' 
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <BarChart3 size={14} />
              Inventario Total
            </button>
          </nav>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            <span className="hidden sm:inline">Sistema Activo</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex flex-col gap-8">
          
          {/* Module Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                {activeTab === 'master' ? 'Maestro de Materiales' : activeTab === 'non-apt' ? 'Registro de Material No Apto' : 'Inventario Totalizado'}
              </h2>
              <p className="text-sm text-slate-500">
                {activeTab === 'master' 
                  ? 'Gestión centralizada de SKUs y descripciones' 
                  : activeTab === 'non-apt'
                  ? 'Control de ingresos de mercadería dañada o no apta'
                  : 'Resumen consolidado de existencias en almacén'}
              </p>
            </div>
            
            {/* Mobile Nav */}
            <div className="md:hidden flex gap-2">
               <button onClick={() => setActiveTab('master')} className={`p-2 rounded-lg border ${activeTab === 'master' ? 'bg-emerald-500 border-emerald-500 text-slate-950' : 'border-slate-800 text-slate-500'}`}><Database size={20}/></button>
               <button onClick={() => setActiveTab('non-apt')} className={`p-2 rounded-lg border ${activeTab === 'non-apt' ? 'bg-emerald-500 border-emerald-500 text-slate-950' : 'border-slate-800 text-slate-500'}`}><ClipboardList size={20}/></button>
               <button onClick={() => setActiveTab('inventory')} className={`p-2 rounded-lg border ${activeTab === 'inventory' ? 'bg-emerald-500 border-emerald-500 text-slate-950' : 'border-slate-800 text-slate-500'}`}><BarChart3 size={20}/></button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'master' ? (
              <motion.div
                key="master-tab"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex flex-col gap-8"
              >
                {/* Actions Bar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/40 p-4 rounded-xl border border-slate-800 shadow-xl backdrop-blur-sm">
                  <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                      <input
                        type="text"
                        placeholder="Buscar por SKU, descripción..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-950/50 border border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all text-sm text-slate-200 placeholder:text-slate-600"
                      />
                    </div>
                    
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-4 py-2 bg-slate-950/50 border border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 text-sm text-slate-300 outline-none cursor-pointer"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat} className="bg-slate-900">
                          {cat === 'all' ? 'Todas las Categorías' : cat}
                        </option>
                      ))}
                    </select>

                    <div className="text-sm text-slate-400 font-medium whitespace-nowrap flex items-center">
                      {filteredMaterials.length} registros
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <ExcelUpload onUpload={handleUpload} />
                    <button
                      onClick={addNewItem}
                      className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-all shadow-lg shadow-emerald-600/20 font-medium text-sm active:scale-95"
                    >
                      <Plus size={18} />
                      Nuevo Item
                    </button>
                  </div>
                </div>

                <MaterialGrid
                  materials={filteredMaterials}
                  onDelete={handleDeleteMaterial}
                  onUpdate={handleUpdateMaterial}
                />
              </motion.div>
            ) : activeTab === 'non-apt' ? (
              <motion.div
                key="non-apt-tab"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col gap-8"
              >
                <NonAptForm 
                  masterMaterials={materials} 
                  onAddEntry={handleAddNonAptEntry} 
                />

                <div className="flex items-center justify-between">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                      type="text"
                      placeholder="Filtrar registros no aptos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-slate-950/50 border border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all text-sm text-slate-200 placeholder:text-slate-600"
                    />
                  </div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                    {filteredEntries.length} Movimientos
                  </div>
                </div>

                <NonAptGrid 
                  entries={filteredEntries} 
                  onDelete={handleDeleteNonAptEntry} 
                />
              </motion.div>
            ) : (
              <motion.div
                key="inventory-tab"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col gap-8"
              >
                <InventoryTotals entries={nonAptEntries} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start gap-1">
            <p className="text-slate-500 text-xs font-medium">
              © 2026 Calico S.A. - Gestión de Calidad y Almacenamiento
            </p>
            <p className="text-slate-600 text-[10px] uppercase tracking-widest font-bold">
              Terminal Logística Avanzada
            </p>
          </div>
          <div className="flex items-center gap-6 text-[10px] font-bold text-slate-700 uppercase tracking-[0.2em]">
            <span className="hover:text-emerald-500 transition-colors cursor-default">Seguridad</span>
            <span className="text-slate-800">•</span>
            <span className="hover:text-emerald-500 transition-colors cursor-default">Eficiencia</span>
            <span className="text-slate-800">•</span>
            <span className="hover:text-emerald-500 transition-colors cursor-default">Control</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
