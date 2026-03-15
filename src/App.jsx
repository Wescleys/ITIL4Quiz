import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Link } from 'react-router-dom';
import { supabase } from './supabaseClient';
import Sidebar from './components/Sidebar';
import DashboardArea from './components/DashboardArea';
import SimuladosList from './components/SimuladosList';
import HistoryArea from './components/HistoryArea';
import AccountArea from './components/AccountArea';
import QuizOverlay from './components/QuizOverlay';
import AuthPage from './pages/AuthPage';
import { motion, AnimatePresence } from 'framer-motion';
import { User as UserIcon, Calendar, CheckCircle } from 'lucide-react'; 

import quizData from './data/full_quiz_data.json'; 

export default function App() {
  const [session, setSession] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const location = useLocation();

  // Estados do Modal de Primeiro Acesso
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [examDate, setExamDate] = useState('');
  const [isSavingDate, setIsSavingDate] = useState(false);
  const [userName, setUserName] = useState('');

  const checkUserSetup = async (currentSession) => {
    if (currentSession) {
      // Usar a sessão diretamente para pegar os metadados mais rápidos
      const user = currentSession.user;
      setUserName(user?.user_metadata?.full_name || 'Especialista');
      
      const date = user?.user_metadata?.certification_date;
      if (!date) {
        setShowWelcomeModal(true);
      } else {
        setShowWelcomeModal(false);
      }
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) checkUserSetup(session);
      setIsAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) checkUserSetup(session);
      setIsAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSaveInitialDate = async () => {
    if (!examDate) return;
    setIsSavingDate(true);
    
    const { data, error } = await supabase.auth.updateUser({
      data: { certification_date: examDate }
    });
    
    if (!error) {
      setShowWelcomeModal(false);
      // Forçar atualização da sessão local para o app "saber" que já tem a data
      setSession(prev => ({
        ...prev,
        user: {
          ...prev.user,
          user_metadata: {
            ...prev.user.user_metadata,
            certification_date: examDate
          }
        }
      }));
    } else {
      console.error("Erro ao salvar data:", error);
    }
    setIsSavingDate(false);
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!session) return <AuthPage />;

  if (activeQuiz) {
    const isObject = typeof activeQuiz === 'object' && activeQuiz !== null && !Array.isArray(activeQuiz) && activeQuiz.questions;
    const quizToPass = isObject ? activeQuiz : activeQuiz;
    const initialAnswers = activeQuiz.initialAnswers || null;
    const reviewMode = activeQuiz.reviewMode || false;

    return (
      <QuizOverlay 
        quiz={activeQuiz} 
        onClose={() => setActiveQuiz(null)} 
        initialAnswers={initialAnswers}
        reviewMode={reviewMode}
      />
    );
  }

  const getPageTitle = (pathname) => {
    switch (pathname) {
      case '/': return 'Dashboard';
      case '/simulados': return 'Simulados';
      case '/history': return 'Meu Histórico';
      case '/account': return 'Perfil';
      default: return 'ITIL 4 Quiz';
    }
  };

  return (
    <div className="flex min-h-screen bg-[#121212] text-white">
      <Sidebar />
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="h-20 border-b border-white/5 bg-[#121212]/90 backdrop-blur-md flex items-center justify-end px-8 shrink-0">
          <h1 className="text-2xl font-bold capitalize text-white mr-auto text-shadow-sm">
            {getPageTitle(location.pathname)}
          </h1>
          <Link to="/account" className="w-10 h-10 rounded-full bg-[#1e1e1e] border border-zinc-700 flex items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-500/10 transition-all">
            <UserIcon size={18} className="text-zinc-400" />
          </Link>
        </header>

        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <Routes location={location}>
                <Route path="/" element={<DashboardArea onStartQuiz={setActiveQuiz} />} />
                <Route path="/simulados" element={<SimuladosList onStartQuiz={setActiveQuiz} quizData={quizData} />} />
                <Route path="/history" element={<HistoryArea onReviewQuiz={setActiveQuiz} />} />
                <Route path="/account" element={<AccountArea />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </div>

        {showWelcomeModal && (
          <div className="fixed inset-0 bg-[#121212]/95 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="glass-card max-w-md w-full p-8 relative animate-in zoom-in-95 duration-500">
              <div className="w-16 h-16 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mb-6 mx-auto border-2 border-blue-500/20">
                <Calendar size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2 text-center">Meta de Estudos</h3>
              <p className="text-zinc-400 mb-6 text-center text-sm leading-relaxed">
                Quando você pretende fazer a prova ITIL 4 Foundation?
              </p>
              <div className="space-y-4">
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                  <input type="date" value={examDate} onChange={(e) => setExamDate(e.target.value)}
                    className="w-full bg-[#1a1a1a] border border-zinc-800 rounded-lg pl-10 pr-4 py-3 text-white focus:border-blue-500 outline-none transition-all [color-scheme:dark]" 
                  />
                </div>
                <button onClick={handleSaveInitialDate} disabled={isSavingDate || !examDate}
                  className="btn-primary w-full text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mt-2">
                  {isSavingDate ? 'Salvando...' : 'Definir Meta'}
                </button>
                <button onClick={() => setShowWelcomeModal(false)} className="w-full py-3 text-sm text-zinc-500 hover:text-white transition-colors cursor-pointer">
                  Pular por enquanto
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}