import React from 'react';
import { BookOpen, Clock, PlayCircle } from 'lucide-react';

// Recebemos a função onStartQuiz e os dados do quiz via props do App.jsx
export default function SimuladosList({ onStartQuiz, quizData }) {
  
  // Se não houver dados ainda, mostramos um aviso
  if (!quizData || quizData.length === 0) {
    return <div className="p-8 text-zinc-400">Nenhum simulado encontrado no JSON...</div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2 text-white">Simulados Disponíveis</h2>
        <p className="text-zinc-400">Pratique com testes baseados no exame oficial ITIL 4.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizData.map((simulado, index) => (
          <div key={simulado.id || index} className="glass-card p-6 flex flex-col h-full hover:border-blue-500/50 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 mb-4">
              <BookOpen size={24} />
            </div>
            
            {/* Usa o título do JSON ou um genérico */}
            <h3 className="text-xl font-bold text-white mb-2">
              {simulado.title || `Simulado ITIL 4 - Parte ${index + 1}`}
            </h3>
            
            <div className="flex items-center gap-4 text-sm text-zinc-400 mb-6 flex-1">
              <span className="flex items-center gap-1"><Clock size={16} /> 60 min</span>
              <span>•</span>
              {/* Conta quantas perguntas tem neste bloco do JSON */}
              <span>{simulado.questions ? simulado.questions.length : 40} questões</span>
            </div>
            
            <button 
              onClick={() => onStartQuiz(simulado)} 
              className="w-full btn-primary text-white flex items-center justify-center gap-2"
            >
              <PlayCircle size={20} />
              Iniciar Simulado
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}