import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Truck } from 'lucide-react';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 3000; // 3 seconds
    const interval = 30; // update every 30ms
    const step = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 200); // Small delay before finishing
          return 100;
        }
        return prev + step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-slate-900 flex flex-col items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center w-64 md:w-96"
      >
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-12 tracking-tighter">
          Calico S.A.
        </h1>
        
        <div className="relative mb-2 h-8">
          <motion.div
            className="absolute bottom-0 text-emerald-500"
            style={{ left: `${progress}%`, x: '-50%' }}
            transition={{ type: 'spring', bounce: 0, duration: 0.1 }}
          >
            <Truck size={24} className="fill-emerald-500/20" />
          </motion.div>
        </div>

        <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden relative shadow-[0_0_15px_rgba(0,0,0,0.5)]">
          <motion.div
            className="absolute top-0 left-0 h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
            style={{ width: `${progress}%` }}
            transition={{ type: 'spring', bounce: 0, duration: 0.1 }}
          />
        </div>
        
        <p className="text-slate-400 mt-6 font-mono text-[10px] uppercase tracking-[0.3em] font-bold">
          Iniciando Sistema de Almacén
        </p>
      </motion.div>
    </div>
  );
};
