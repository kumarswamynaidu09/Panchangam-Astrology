import React from 'react';
import { motion } from 'motion/react';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  return (
    <div className="bg-primary min-h-screen flex flex-col items-center justify-center relative overflow-hidden font-body-md text-on-surface">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none" 
        style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAMVb7dw-YxXRacDl8Ufn9dpc_hCc8vZMRpr_vbRJ3cnDJ8kUyXBeCrErNXz_-PJUnKfsveAeqlU-4bFEYcPvRieeW5CmG4jwxvHgAj24Tk3fZG32dANXaKZKMa4xB0FmvrxN4Mlmhj4hmKkAb1aPj5RI7902Ffig-LJCvDDnO29F2HT3qgYhtNXUxVGYstY_U-jNAaE2kQEY025DCEiXVEVxv1UJod4hAuRE2HBi8lPu_Lukgj6qyYuA')" }}
      ></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="flex flex-col items-center z-10 text-center px-4"
      >
        <div className="w-64 h-64 md:w-80 md:h-80 rounded-full border-[3px] border-[#B8860B] overflow-hidden bg-transparent shadow-2xl mb-8 flex items-center justify-center relative">
          <img 
            className="w-full h-full object-cover scale-[1.35] origin-top translate-y-[5%]" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDP3pnrbWoHw4OeJ_dWZCwKwsBLZ4Wwff0YpJ2PsDKN7cbMFtiqWzeZk6il5oW2mr_WtUGu-EDgelSGTsHKHZWihsXXuDAMbNXWD-B758IHzf1stGjEgeJzD1raG6j4SS7SHrqDUwmYDH8U52NbQz2CFOA5d_t56S0QsLbhIWNLECtQMrFQ8wnuZF5822Uomtk9UX0QmNicE0MVsHPKYZy_1-jWkdm1yB00p1EG4elh-nZuhAjEWge00g" 
            alt="Shiva-Parvati religious motif" 
          />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-secondary-fixed mb-12 drop-shadow-lg" style={{ lineHeight: '1.4' }}>
          శ్రీ భవానీ శంకర జ్యోతిష్యాలయం
        </h1>

        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.8, duration: 0.8 }}
        >
          <button 
            onClick={onComplete}
            className="group flex items-center justify-center gap-3 bg-secondary hover:bg-secondary-fixed text-primary px-8 py-4 rounded-full font-title-md text-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            <span className="font-bold">జన్మ వివరాల కోసం ప్రవేశించండి</span>
            <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
          </button>
        </motion.div>
      </motion.div>
      
      {/* Decorative Toran at the bottom */}
      <div 
        className="absolute bottom-0 left-0 w-full h-6 opacity-80" 
        style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDFJGAgHmsStDJHqP6eVObb40cgtyD2zaJccAPN6PtCoMR01JqlR5QQQrGu115u6saT7iNu1jTswx5jFUaYbgLFcexMjmERbbbqw_Kf6zapRalGbfzVAuKJ9PaJlYG6qrpXOLw7fPgx1vwu1jkYQWf5OviiWJgnoo-3NK2V3rl65R6Oi1Pud0695N5aeBjOj-bc6dYipRDoUMY1-OkeZRe6zGKjzogNvtILpvWdVg5U_B0gOoOXt_kGcQ')", backgroundRepeat: 'repeat-x', backgroundSize: 'contain' }}
      ></div>
    </div>
  );
}
