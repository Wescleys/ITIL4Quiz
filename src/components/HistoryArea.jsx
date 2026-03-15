import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { CheckCircle, XCircle, Clock, X, Search, AlertCircle } from 'lucide-react';

export default function HistoryArea({ onReviewQuiz }) {
  const [selectedReview, setSelectedReview] = useState(null);
  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    async function getHistory() {
      const { data: { user } } = await supabase.auth.getUser();
      const savedLocal = JSON.parse(localStorage.getItem('itil_quiz_history')) || [];
      
      if (user) {
        const { data, error } = await supabase
          .from('quiz_results')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (data && data.length > 0 && !error) {
          const formatted = data.map(item => ({
            id: item.id,
            title: item.quiz_title,
            score: item.score,
            date: new Date(item.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }),
            userAnswers: item.user_answers, // assumindo que adicionamos no banco dps ou ignoramos por enquanto
            questions: item.questions
          }));
          setHistoryData(formatted);
        } else {
          // Se o banco de dados do usuário estiver vazio, mostra o local
          setHistoryData([...savedLocal].reverse());
        }
      } else {
        // Fallback para quando não há usuário logado
        setHistoryData([...savedLocal].reverse());
      }
    }
    getHistory();
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 relative">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2 text-white">Seu Histórico</h2>
        <p className="text-zinc-400">Acompanhe sua evolução e revise os exames anteriores.</p>
      </div>

      {historyData.length > 0 ? (
        <div className="glass-card overflow-hidden">
          <div className="divide-y divide-zinc-800/50">
            {historyData.map((item) => {
              const passed = item.score >= 65;
              return (
                <div key={item.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      {passed ? <CheckCircle className="text-emerald-500" size={24} /> : <XCircle className="text-red-500" size={24} />}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{item.title}</h3>
                      <div className="flex items-center gap-3 text-sm text-zinc-400 mt-1">
                        <span className="flex items-center gap-1"><Clock size={14} /> {item.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm text-zinc-400">Pontuação</p>
                      <p className={`text-xl font-bold ${passed ? 'text-emerald-500' : 'text-red-500'}`}>
                        {Math.round((item.score / 100) * 40)}/40 <span className="text-sm font-normal opacity-70">({item.score}%)</span>
                      </p>
                    </div>
                    <button 
                      onClick={() => setSelectedReview(item)}
                      className="px-4 py-2 rounded-lg bg-[#121212] border border-zinc-700 text-white hover:border-blue-500 transition-colors text-sm font-semibold cursor-pointer"
                    >
                      Detalhes
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="glass-card p-12 flex flex-col items-center justify-center text-center">
          <AlertCircle className="text-zinc-600 mb-4" size={48} />
          <h3 className="text-xl font-bold text-white mb-2">Seu histórico está vazio</h3>
          <p className="text-zinc-400">Faça o seu primeiro simulado na aba "Simulados" para que ele apareça aqui.</p>
        </div>
      )}

      {selectedReview && (
        <div className="fixed inset-0 bg-[#121212]/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card max-w-lg w-full p-8 relative animate-in zoom-in-95 duration-200">
            <button onClick={() => setSelectedReview(null)} className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer">
              <X size={20} />
            </button>
            <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mb-6">
              <Search size={24} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Detalhes do Simulado</h3>
            <p className="text-zinc-400 mb-6">Informações sobre <strong>{selectedReview.title}</strong> realizado em <strong>{selectedReview.date}</strong> com pontuação de <strong>{selectedReview.score}%</strong>.</p>
            {selectedReview.userAnswers && selectedReview.questions ? (
              <button 
                onClick={() => {
                  const quizToReview = {
                    title: selectedReview.title,
                    questions: selectedReview.questions,
                    reviewMode: true,
                    initialAnswers: selectedReview.userAnswers
                  };
                  onReviewQuiz(quizToReview);
                  setSelectedReview(null);
                }}
                className="btn-primary w-full text-white cursor-pointer mb-3"
              >
                Revisar Questões
              </button>
            ) : (
              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl mb-6 text-sm text-amber-200/80 leading-relaxed">
                <strong>Nota:</strong> Este histórico é antigo ou veio de outro dispositivo. Questões específicas não estão disponíveis para revisão profunda.
              </div>
            )}
            <button onClick={() => setSelectedReview(null)} className="w-full py-3 text-zinc-500 hover:text-white transition-colors cursor-pointer text-sm font-semibold">
              Voltar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}