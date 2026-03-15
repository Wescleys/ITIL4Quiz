import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabaseClient';
import { X, Award, ArrowRight, CheckCircle, XCircle, RotateCcw, Clock } from 'lucide-react';

export default function QuizOverlay({ quiz, onClose, initialAnswers = null, reviewMode = false }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(reviewMode);
  
  const [userAnswers, setUserAnswers] = useState(initialAnswers || []);
  const [isReviewing, setIsReviewing] = useState(reviewMode);
  const [timeLeft, setTimeLeft] = useState(3600); // 60 minutos
  const [timeIsUp, setTimeIsUp] = useState(false);

  useEffect(() => {
    if (!showResults && !isReviewing && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleFinishQuiz(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [showResults, isReviewing, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const questions = Array.isArray(quiz) ? quiz : (quiz?.questions || []);

  if (!questions || questions.length === 0) {
    return (
      <div className="fixed inset-0 bg-[#121212] z-50 flex items-center justify-center text-white p-4">
        <div className="text-center glass-card p-10">
          <h2 className="text-2xl font-bold mb-4">Erro ao carregar o simulado</h2>
          <p className="text-zinc-400 mb-6">Não foram encontradas perguntas neste simulado.</p>
          <button onClick={onClose} className="btn-primary w-full text-white">Voltar</button>
        </div>
      </div>
    );
  }
  const currentQuestion = questions[currentIndex];
  const questionText = currentQuestion?.text || currentQuestion?.question || "Texto não encontrado.";

  const safeOptions = Array.isArray(currentQuestion?.options) ? currentQuestion.options : [];

  const checkIsCorrect = (optionText, optionIndex, question) => {
    if (!question) return false;
    const correctAns = String(question.answer || '').trim().toUpperCase();
    const optLetter = ['A', 'B', 'C', 'D', 'E'][optionIndex];
    return correctAns === optLetter;
  };

  const handleOptionClick = (optionIndex) => {
    if (isAnswered) return;
    setSelectedOption(optionIndex);
  };

  const handleConfirm = () => {
    if (selectedOption === null) return;
    setIsAnswered(true);
    
    const isCorrect = checkIsCorrect(safeOptions[selectedOption], selectedOption, currentQuestion);
    if (isCorrect) setScore(score + 1);

    const newAnswers = [...userAnswers];
    newAnswers[currentIndex] = { selected: selectedOption, isCorrect: isCorrect };
    setUserAnswers(newAnswers);
  };

  const saveToHistory = async (finalScore, totalQuestions, durationSeconds) => {
    try {
      const percentage = Math.round((finalScore / totalQuestions) * 100);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        await supabase.from('quiz_results').insert([
          {
            user_id: user.id,
            quiz_title: quiz.title || 'Simulado ITIL 4 Foundation',
            score: percentage,
            duration: durationSeconds,
            user_answers: userAnswers,
            questions: questions
          }
        ]);
      }

      const existingHistory = JSON.parse(localStorage.getItem('itil_quiz_history')) || [];
      const newRecord = {
        id: Date.now(),
        title: quiz.title || 'Simulado ITIL 4 Foundation',
        score: percentage,
        duration: durationSeconds,
        date: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }),
        userAnswers: userAnswers,
        questions: questions
      };
      localStorage.setItem('itil_quiz_history', JSON.stringify([...existingHistory, newRecord]));
    } catch (e) {
      console.error("Erro ao salvar histórico", e);
    }
  };

  const handleFinishQuiz = (auto = false) => {
    const timeSpent = 3600 - timeLeft;
    saveToHistory(score, questions.length, timeSpent);
    if (auto) setTimeIsUp(true);
    setShowResults(true);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      handleFinishQuiz();
    }
  };

  if (isReviewing) {
    return (
      <div className="fixed inset-0 bg-[#121212] z-50 flex flex-col text-white animate-in fade-in duration-500">
        <header className="h-20 bg-[#1e1e1e]/90 backdrop-blur-md border-b border-white/5 px-6 flex items-center justify-between shrink-0 sticky top-0 z-10">
          <div>
            <h2 className="font-bold text-lg text-white">Correção do Simulado</h2>
            <p className="text-sm text-zinc-400">Revise seus erros e acertos</p>
          </div>
          <button onClick={onClose} className="btn-primary px-6 text-white text-sm cursor-pointer border-none outline-none">
            Finalizar e Sair
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="max-w-3xl mx-auto space-y-6 pb-20">
            {questions.map((q, qIndex) => {
              const uAnswer = userAnswers[qIndex];
              const qText = q.text || q.question || "Pergunta sem texto";
              const revOptions = Array.isArray(q.options) ? q.options : [];

              return (
                <div key={qIndex} className={`glass-card p-6 border-l-4 ${uAnswer?.isCorrect ? 'border-l-emerald-500' : 'border-l-red-500'}`}>
                  <div className="flex items-start gap-4 mb-4">
                    {uAnswer?.isCorrect ? <CheckCircle className="text-emerald-500 shrink-0 mt-1" /> : <XCircle className="text-red-500 shrink-0 mt-1" />}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-zinc-500 font-bold">{qIndex + 1}.</span>
                        {q.difficulty && (
                          <span className={`px-2 py-0.5 text-[9px] uppercase font-bold rounded border ${
                            q.difficulty === 'Difícil' 
                            ? 'bg-red-500/10 text-red-500 border-red-500/20' 
                            : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                          }`}>
                            {q.difficulty}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-medium text-zinc-100">
                        {qText}
                      </h3>
                    </div>
                  </div>
                  <div className="space-y-2 ml-10">
                    {revOptions.map((opt, optIndex) => {
                      const isSelected = uAnswer?.selected === optIndex;
                      const isCorrectAnswer = checkIsCorrect(opt, optIndex, q);
                      let optClass = "p-3 rounded-lg text-sm flex items-center gap-3 ";
                      if (isCorrectAnswer) optClass += "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold";
                      else if (isSelected && !isCorrectAnswer) optClass += "bg-red-500/20 text-red-400 border border-red-500/30 line-through";
                      else optClass += "bg-[#1e1e1e] text-zinc-500";

                      return (
                        <div key={optIndex} className={optClass}>
                          {isCorrectAnswer && <CheckCircle size={16} />}
                          {isSelected && !isCorrectAnswer && <XCircle size={16} />}
                          {!isCorrectAnswer && !isSelected && <div className="w-4 h-4 rounded-full border border-zinc-700"></div>}
                          <span>{opt}</span>
                        </div>
                      );
                    })}
                    {q.explanation && (
                      <div className="mt-4 p-4 bg-blue-500/5 border border-blue-500/20 rounded-lg text-sm text-zinc-300 italic">
                        <p className="font-bold text-blue-400 mb-1 not-italic">Explicação Geral:</p>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    const percentage = Math.round((score / questions.length) * 100);
    const passed = percentage >= 65;

    return (
      <div className="fixed inset-0 bg-[#121212] z-50 flex flex-col items-center justify-center text-white p-4 animate-in fade-in duration-500">
        <div className="glass-card max-w-lg w-full p-10 text-center relative overflow-hidden">
          <div className={`absolute top-0 left-0 w-full h-2 ${passed ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
          <Award size={72} className={`mx-auto mb-6 ${passed ? 'text-emerald-500' : 'text-red-500'}`} />
          <h2 className="text-3xl font-bold mb-2">{timeIsUp ? 'Tempo Esgotado!' : 'Simulado Concluído!'}</h2>
          <p className="text-zinc-400 mb-8">{timeIsUp ? 'O tempo acabou, mas seu progresso foi salvo.' : 'O seu exame foi salvo no histórico com sucesso.'}</p>
          <div className="flex justify-center gap-6 sm:gap-12 mb-10 overflow-x-auto">
            <div>
              <p className="text-zinc-500 text-[10px] mb-1 font-semibold uppercase tracking-wider">Acertos</p>
              <p className="text-2xl sm:text-3xl font-bold">{score} <span className="text-lg text-zinc-500">/ {questions.length}</span></p>
            </div>
            <div>
              <p className="text-zinc-500 text-[10px] mb-1 font-semibold uppercase tracking-wider">Tempo</p>
              <p className="text-2xl sm:text-3xl font-bold">{formatTime(3600 - timeLeft)}</p>
            </div>
            <div>
              <p className="text-zinc-500 text-[10px] mb-1 font-semibold uppercase tracking-wider">Resultado</p>
              <p className={`text-2xl sm:text-3xl font-bold ${passed ? 'text-emerald-500' : 'text-red-500'}`}>{score}/40 <span className="text-sm font-normal text-zinc-500">({percentage}%)</span></p>
            </div>
          </div>
          <div className="space-y-3">
            <button onClick={() => setIsReviewing(true)} className="w-full py-4 rounded-xl font-bold border-2 border-blue-500 text-blue-400 hover:bg-blue-500/10 transition-colors flex items-center justify-center gap-2 cursor-pointer outline-none">
              <RotateCcw size={20} />
              Ver Correção das Questões
            </button>
            <button onClick={onClose} className="w-full btn-primary text-white flex items-center justify-center gap-2 cursor-pointer border-none outline-none">
              Voltar ao Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="fixed inset-0 bg-[#121212] z-50 flex flex-col text-white animate-in slide-in-from-bottom-4 duration-300">
      <header className="h-20 bg-[#1e1e1e]/80 backdrop-blur-md border-b border-white/5 px-6 sm:px-12 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-6">
          <div>
            <h2 className="font-bold text-lg text-blue-400">Simulado ITIL 4</h2>
            <p className="text-sm text-zinc-400">Questão {currentIndex + 1} de {questions.length}</p>
          </div>
          <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-colors ${timeLeft < 300 ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-blue-500/10 border-blue-500/20 text-blue-400'}`}>
            <Clock size={16} className={timeLeft < 300 ? 'text-red-500' : 'text-blue-400'} />
            <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer text-zinc-400 hover:text-white border-none outline-none">
          <X size={24} />
        </button>
      </header>
      <div className="w-full h-1.5 bg-zinc-800"><div className="h-full bg-blue-500 transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div></div>
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center">
        <div className="max-w-3xl w-full space-y-8 pb-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="glass-card p-6 sm:p-10 shadow-lg relative">
                <div className="flex flex-wrap gap-2 mb-4">
                  {currentQuestion?.domain && (
                    <span className="px-3 py-1 bg-purple-500/10 text-purple-400 text-[10px] uppercase font-bold rounded-md border border-purple-500/20 tracking-wider">
                      {currentQuestion.domain}
                    </span>
                  )}
                  {currentQuestion?.difficulty && (
                    <span className={`px-3 py-1 text-[10px] uppercase font-bold rounded-md border tracking-wider ${
                      currentQuestion.difficulty === 'Difícil' 
                      ? 'bg-red-500/10 text-red-500 border-red-500/20' 
                      : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                    }`}>
                      {currentQuestion.difficulty}
                    </span>
                  )}
                </div>
                <h3 className="text-xl sm:text-2xl font-medium leading-relaxed text-zinc-100 whitespace-pre-wrap">
                  {questionText}
                </h3>
              </div>
              
              <div className="space-y-4">
                {safeOptions.map((option, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrectAnswer = checkIsCorrect(option, idx, currentQuestion);
                  let buttonClass = "w-full text-left p-5 rounded-xl border-2 transition-all flex items-center gap-5 text-base sm:text-lg font-medium cursor-pointer outline-none ";
                  if (!isAnswered) buttonClass += isSelected ? "bg-blue-500/10 border-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.2)]" : "bg-[#1e1e1e] border-zinc-800 hover:border-zinc-600 text-zinc-300";
                  else {
                    if (isCorrectAnswer) buttonClass += "bg-emerald-500/10 border-emerald-500 text-emerald-400";
                    else if (isSelected && !isCorrectAnswer) buttonClass += "bg-red-500/10 border-red-500 text-red-400";
                    else buttonClass += "bg-[#1e1e1e] border-zinc-800 opacity-40 text-zinc-500 cursor-not-allowed";
                  }
                  return (
                    <motion.button 
                      whileTap={{ scale: 0.98 }}
                      key={idx} 
                      onClick={() => handleOptionClick(idx)} 
                      disabled={isAnswered} 
                      className={buttonClass}
                    >
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                        isAnswered && isCorrectAnswer ? "border-emerald-500 bg-emerald-500/20" :
                        isAnswered && isSelected && !isCorrectAnswer ? "border-red-500 bg-red-500/20" :
                        isSelected ? "border-blue-500 bg-blue-500" : "border-zinc-600"
                      }`}>
                        {(isSelected || (isAnswered && isCorrectAnswer)) && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
                      </div>
                      <span className="whitespace-pre-wrap">{option}</span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence>
            {isAnswered && currentQuestion?.explanation && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden bg-[#1e1e1e] border border-blue-500/30 rounded-2xl p-6 sm:p-8"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                    <Award size={20} />
                  </div>
                  <h4 className="text-lg font-bold text-white">Explicação para Estudo</h4>
                </div>
                <p className="text-zinc-400 leading-relaxed italic text-sm sm:text-base">
                  {currentQuestion.explanation}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="pt-8 flex justify-end">
            {!isAnswered ? (
              <button onClick={handleConfirm} disabled={selectedOption === null} className={`px-8 py-4 rounded-xl font-bold transition-all text-lg border-none outline-none ${
                selectedOption !== null ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/25 cursor-pointer' : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
              }`}>
                Confirmar Resposta
              </button>
            ) : (
              <button onClick={handleNext} className="px-8 py-4 rounded-xl font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/25 transition-all flex items-center gap-3 text-lg cursor-pointer border-none outline-none">
                {currentIndex < questions.length - 1 ? 'Próxima Questão' : 'Ver Resultados'}
                <ArrowRight size={22} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}