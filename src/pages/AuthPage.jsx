import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (isSignUp) {
      // Cria a conta e já salva o Nome Completo (full_name) no Supabase
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            full_name: name
          }
        }
      });
      if (error) setMessage(`Erro: ${error.message}`);
      else setMessage('Conta criada com sucesso! Faça o login para continuar.');
    } else {
      // Faz o Login
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMessage(`Erro: Credenciais inválidas.`);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#121212] text-white">
      {/* Lado Esquerdo - Ilustração/Branding */}
      <div className="hidden md:flex md:w-1/2 bg-blue-600 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="z-10 text-center animate-in fade-in zoom-in duration-700">
          <h1 className="text-6xl font-black text-white mb-4 tracking-tighter">ITIL<span className="text-blue-950">4</span></h1>
          <p className="text-blue-100 text-xl font-medium tracking-[0.2em] uppercase">Foundation Quiz</p>
        </div>
      </div>

      {/* Lado Direito - Formulário */}
      <div className="flex-1 flex items-center justify-center p-8 animate-in fade-in slide-in-from-right-8 duration-500">
        <div className="w-full max-w-sm">
          <div className="mb-10">
            <h2 className="text-3xl font-bold mb-2 text-white">
              {isSignUp ? 'Criar Conta' : 'Bem-vindo'}
            </h2>
            <p className="text-zinc-400">
              {isSignUp ? 'Preencha os dados abaixo para se cadastrar.' : 'Insira seus dados para acessar a plataforma.'}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-5">
            {/* Campo de Nome (Apenas visível se estiver em modo Cadastro) */}
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Nome Completo</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-[#1e1e1e] border border-zinc-800 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-zinc-600"
                  placeholder="Seu nome"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">E-mail</label>
              <input 
                type="email" 
                required
                className="w-full bg-[#1e1e1e] border border-zinc-800 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-zinc-600"
                placeholder="exemplo@email.com"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-zinc-300">Senha</label>
                {!isSignUp && <a href="#" className="text-xs text-blue-500 hover:text-blue-400 hover:underline transition-all">Esqueceu a senha?</a>}
              </div>
              <input 
                type="password" 
                required
                className="w-full bg-[#1e1e1e] border border-zinc-800 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-zinc-600"
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {message && (
              <p className={`text-sm font-medium ${message.includes('Erro') ? 'text-red-400' : 'text-emerald-400'}`}>
                {message}
              </p>
            )}

            <button 
              disabled={loading} 
              className="w-full btn-primary text-white mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processando...' : (isSignUp ? 'Cadastrar' : 'Entrar na Plataforma')}
            </button>
          </form>

          {/* Botão para alternar entre Login e Cadastro */}
          <div className="mt-8 text-center">
            <button 
              onClick={() => {
                setIsSignUp(!isSignUp);
                setMessage(''); // Limpa as mensagens de erro ao trocar de tela
              }}
              className="text-zinc-400 hover:text-white text-sm transition-colors cursor-pointer"
            >
              {isSignUp ? 'Já tem uma conta? Faça login' : 'Ainda não tem conta? Cadastre-se'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}