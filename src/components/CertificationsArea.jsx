import React from 'react';
import { Award, Lock, CheckCircle } from 'lucide-react';

const CertificationsArea = ({ history }) => {
  // Lógica de liberação da Certificação Alvo
  // Critério ITIL Foundation: Média > 65% em pelo menos 3 exames concluídos
  const totalExams = history?.length || 0;
  
  const averagePct = totalExams > 0 
    ? history.reduce((acc, curr) => acc + (curr.score / curr.total), 0) / totalExams 
    : 0;
    
  const isUnlocked = totalExams >= 3 && averagePct >= 0.65;

  return (
    <div className="dashboard-body">
      <div className="section-title mb-8">Trilha de Certificação</div>
      
      <div className={`relative overflow-hidden rounded-xl border ${isUnlocked ? 'border-emerald-500/30' : 'border-[#222]'} bg-[#0a0a0a] p-8`}>
        {/* Decorative Grid Line */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] opacity-20 pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center">
          <div className={`w-24 h-24 rounded-2xl flex items-center justify-center shrink-0 ${isUnlocked ? 'bg-emerald-500/10 text-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.2)]' : 'bg-[#111] text-[#444]'}`}>
            <Award size={48} />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className={`text-2xl font-bold ${isUnlocked ? 'text-white' : 'text-[#888]'}`}>ITIL 4 Foundation</h2>
              {isUnlocked ? (
                <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/20">Apto para Exame</span>
              ) : (
                <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-[#222] text-[#666] rounded-full border border-[#333] flex items-center gap-1"><Lock size={10} /> Bloqueado</span>
              )}
            </div>
            <p className="text-[#666] text-sm leading-relaxed max-w-2xl mb-6">
              A certificação de entrada (Foundation) valida o seu conhecimento na estrutura do ITIL 4 de gerenciamento de serviços. Para desbloquear sua aptidão, atinja uma média de segurança em nossos simulados.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#111] p-4 rounded-lg border border-[#1a1a1a]">
                <div className="text-xs text-[#666] uppercase tracking-wider mb-1 font-semibold">Requisito 1</div>
                <div className="flex items-center gap-2">
                  <div className={`text-sm font-medium ${totalExams >= 3 ? 'text-emerald-500' : 'text-white'}`}>Mínimo 3 exames</div>
                  {totalExams >= 3 && <CheckCircle size={14} className="text-emerald-500" />}
                </div>
                <div className="text-xs text-[#555] mt-1">Atual: {totalExams}</div>
              </div>
              <div className="bg-[#111] p-4 rounded-lg border border-[#1a1a1a]">
                <div className="text-xs text-[#666] uppercase tracking-wider mb-1 font-semibold">Requisito 2</div>
                <div className="flex items-center gap-2">
                  <div className={`text-sm font-medium ${averagePct >= 0.65 ? 'text-emerald-500' : 'text-white'}`}>Média >= 65%</div>
                  {averagePct >= 0.65 && <CheckCircle size={14} className="text-emerald-500" />}
                </div>
                <div className="text-xs text-[#555] mt-1">Atual: {Math.round(averagePct * 100)}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificationsArea;
