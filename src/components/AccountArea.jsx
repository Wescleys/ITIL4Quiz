import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { User, Mail, Shield, Lock, Key, Edit2, Calendar } from 'lucide-react';

export default function AccountArea() {
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('Carregando...');
  
  const [newPassword, setNewPassword] = useState('');
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState('');

  const [newDisplayName, setNewDisplayName] = useState('');
  const [newCertDate, setNewCertDate] = useState('');
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setEmail(user.email);
        const savedName = user.user_metadata?.full_name || 'Especialista ITIL';
        const savedDate = user.user_metadata?.certification_date || '';
        setDisplayName(savedName);
        setNewDisplayName(savedName);
        setNewCertDate(savedDate);
      }
    });
  }, []);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setLoadingPassword(true);
    setPasswordMessage('');
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) setPasswordMessage(`Erro: ${error.message}`);
    else { setPasswordMessage('Senha atualizada com sucesso!'); setNewPassword(''); }
    setLoadingPassword(false);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoadingProfile(true);
    setProfileMessage('');
    
    const { error } = await supabase.auth.updateUser({
      data: { full_name: newDisplayName, certification_date: newCertDate }
    });

    if (error) setProfileMessage(`Erro: ${error.message}`);
    else {
      setDisplayName(newDisplayName);
      setProfileMessage('Perfil atualizado com sucesso!');
    }
    setLoadingProfile(false);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2 text-white">Meu Perfil</h2>
        <p className="text-zinc-400">Gerencie as informações e a segurança da sua conta.</p>
      </div>

      <div className="glass-card p-8 flex flex-col md:flex-row items-center gap-8">
        <div className="w-24 h-24 rounded-full bg-blue-500/10 border-2 border-blue-500 flex items-center justify-center shrink-0">
          <User size={40} className="text-blue-500" />
        </div>
        <div className="text-center md:text-left flex-1">
          <h3 className="text-2xl font-bold text-white mb-1">{displayName}</h3>
          <p className="text-zinc-400 flex items-center justify-center md:justify-start gap-2">
            <Mail size={16} /> {email || 'Carregando...'}
          </p>
        </div>
        <div>
          <span className="px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-sm font-bold flex items-center gap-2">
            <Shield size={16} /> Aluno Premium
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Cartão: Alterar Dados (Nome e Data) */}
        <div className="glass-card p-8">
          <div className="flex items-center gap-3 mb-6">
            <Edit2 className="text-blue-500" size={24} />
            <h4 className="text-lg font-bold text-white">Dados Pessoais & Metas</h4>
          </div>
          
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-500 mb-2 uppercase">Nome de Exibição</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                <input type="text" required value={newDisplayName} onChange={(e) => setNewDisplayName(e.target.value)}
                  className="w-full bg-[#121212] border border-zinc-800 rounded-lg pl-10 pr-4 py-3 text-white focus:border-blue-500 outline-none transition-all" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-500 mb-2 uppercase">Data da Certificação (Meta)</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                <input type="date" value={newCertDate} onChange={(e) => setNewCertDate(e.target.value)}
                  className="w-full bg-[#121212] border border-zinc-800 rounded-lg pl-10 pr-4 py-3 text-white focus:border-blue-500 outline-none transition-all [color-scheme:dark]" />
              </div>
            </div>
            
            {profileMessage && <p className={`text-sm font-medium ${profileMessage.includes('Erro') ? 'text-red-400' : 'text-emerald-400'}`}>{profileMessage}</p>}

            <button disabled={loadingProfile || !newDisplayName} className="btn-primary w-full text-white mt-4 disabled:opacity-50">
              {loadingProfile ? 'Salvando...' : 'Salvar Dados'}
            </button>
          </form>
        </div>

        {/* Cartão: Alterar Senha */}
        <div className="glass-card p-8">
          <div className="flex items-center gap-3 mb-6">
            <Lock className="text-blue-500" size={24} />
            <h4 className="text-lg font-bold text-white">Alterar Senha</h4>
          </div>
          
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-500 mb-2 uppercase">Nova Senha</label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                <input type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Digite a nova senha"
                  className="w-full bg-[#121212] border border-zinc-800 rounded-lg pl-10 pr-4 py-3 text-white focus:border-blue-500 outline-none transition-all" />
              </div>
            </div>
            
            {passwordMessage && <p className={`text-sm font-medium ${passwordMessage.includes('Erro') ? 'text-red-400' : 'text-emerald-400'}`}>{passwordMessage}</p>}

            <button disabled={loadingPassword || !newPassword} className="btn-primary w-full text-white mt-4 disabled:opacity-50">
              {loadingPassword ? 'Atualizando...' : 'Salvar Nova Senha'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}