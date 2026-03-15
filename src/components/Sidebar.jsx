import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, History, User, LogOut } from 'lucide-react';
import { supabase } from '../supabaseClient';

const NavItem = ({ icon: Icon, label, to }) => (
  <NavLink 
    to={to}
    className={({ isActive }) => `
      w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all mb-1 text-sm font-semibold
      ${isActive 
        ? 'bg-blue-600 text-white shadow-[0_4px_20px_rgba(59,130,246,0.3)]' 
        : 'text-zinc-400 hover:bg-[#1e1e1e] hover:text-white'}
    `}
  >
    <Icon size={20} />
    {label}
  </NavLink>
);

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-[#121212] border-r border-white/5 flex flex-col p-6 shrink-0 hidden md:flex z-50">
      <div className="mb-10 px-2 flex items-center gap-3">
        <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center font-black text-white shadow-lg">
          IT
        </div>
        <h2 className="text-2xl font-black tracking-tight text-white">ITIL<span className="text-blue-500">4</span></h2>
      </div>

      <nav className="flex-1 space-y-1">
        <NavItem icon={LayoutDashboard} label="Dashboard" to="/" />
        <NavItem icon={BookOpen} label="Simulados" to="/simulados" />
        <NavItem icon={History} label="Meu Histórico" to="/history" />
      </nav>

      {/* Seção inferior com Perfil e Sair */}
      <div className="pt-6 border-t border-white/5 mt-auto flex flex-col gap-1">
        <NavItem icon={User} label="Perfil" to="/account" />
        
        <button 
          onClick={() => supabase.auth.signOut()}
          className="w-full flex items-center gap-3 px-4 py-3.5 text-zinc-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all text-sm font-semibold cursor-pointer"
        >
          <LogOut size={20} />
          Sair da Conta
        </button>
      </div>
    </aside>
  );
}