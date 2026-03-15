import React from 'react';
import { Search, Bell } from 'lucide-react';

const Topbar = ({ user }) => {
  return (
    <div className="h-20 flex items-center justify-between px-10 border-b border-white/5 sticky top-0 bg-[#0B0E14] z-50 flex-shrink-0">
      <div className="relative w-full max-w-xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8E9BAE]/40" size={18} />
        <input 
          type="text" 
          placeholder="Search resources, tests or topics..." 
          className="w-full h-11 bg-[#151921] border border-white/10 rounded-lg pl-12 pr-4 text-sm text-white placeholder-[#444] focus:outline-none focus:ring-1 focus:ring-[#2563EB]/50 transition-all"
        />
      </div>

      <div className="flex items-center gap-8">
        <button className="relative text-[#666] hover:text-white transition-colors">
          <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-blue-500 rounded-full border-2 border-[#0B0E14]"></div>
          <Bell size={20} />
        </button>

        <div className="flex items-center gap-4 pl-8 border-l border-white/5">
           <div className="text-right">
              <p className="text-sm font-bold white tracking-tight">{user?.name || 'Wesclei Silva'}</p>
              <p className="text-[10px] font-black text-[#555] uppercase tracking-widest">ITIL 4 Candidate</p>
           </div>
           <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/5">
              <img 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'Wesclei'}`} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
           </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
