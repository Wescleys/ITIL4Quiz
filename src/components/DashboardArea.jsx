import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '../supabaseClient';
import { PlayCircle, AlertCircle } from 'lucide-react';

const StatCard = ({ label, value }) => (
  <div className="glass-card p-6">
    <p className="text-zinc-400 text-sm font-medium mb-1">{label}</p>
    <p className="text-3xl font-bold text-white uppercase">{value}</p>
  </div>
);

export default function DashboardArea() {
  const [daysLeft, setDaysLeft] = useState('...');
  const [historyData, setHistoryData] = useState([]);
  const [totalStudyTime, setTotalStudyTime] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // 1. Calcular dias restantes
      const certDate = user?.user_metadata?.certification_date;
      if (certDate) {
        const today = new Date();
        const goal = new Date(certDate);
        const diffTime = goal - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setDaysLeft(diffDays > 0 ? `${diffDays} Dias` : (diffDays === 0 ? 'Hoje!' : 'Expirou'));
      } else {
        setDaysLeft('N/D');
      }

      // 2. Buscar Histórico do Banco
      const { data, error } = await supabase
        .from('quiz_results')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (data && data.length > 0 && !error) {
        const formatted = data.map(item => ({
          title: item.quiz_title,
          score: item.score,
          date: new Date(item.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
        }));
        setHistoryData(formatted);

        // Calcular tempo total de estudo
        const totalSeconds = data.reduce((acc, curr) => acc + (curr.duration || 0), 0);
        setTotalStudyTime(totalSeconds);
      } else {
        // Fallback Local
        const savedLocal = JSON.parse(localStorage.getItem('itil_quiz_history')) || [];
        setHistoryData(savedLocal);
        
        const totalSecondsLocal = savedLocal.reduce((acc, curr) => acc + (curr.duration || 0), 0);
        setTotalStudyTime(totalSecondsLocal);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const totalSimulados = historyData.length;
  const mediaAcertos = totalSimulados > 0 
    ? Math.round(historyData.reduce((acc, curr) => acc + curr.score, 0) / totalSimulados) 
    : 0;

  const formatStudyTime = (seconds) => {
    if (seconds <= 0) return "0m";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  };

  const chartData = historyData.map((item, index) => ({
    name: `S${index + 1}`,
    score: item.score
  }));

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Simulados Feitos" value={totalSimulados} />
        <StatCard label="Média de Acertos" value={totalSimulados > 0 ? `${Math.round((mediaAcertos / 100) * 40)}/40` : "0/40"} />
        <StatCard label="Tempo de Estudo" value={formatStudyTime(totalStudyTime)} />
        <StatCard label="Dias p/ Prova" value={daysLeft} />
      </div>

      <div className="glass-card p-6">
        <h3 className="text-lg font-bold mb-6 text-white">Evolução nos Simulados</h3>
        {chartData.length > 0 ? (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" stroke="#71717a" />
                <YAxis stroke="#71717a" domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#1e1e1e', border: '1px solid #333', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[300px] w-full flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 rounded-xl bg-[#121212]/50">
            <AlertCircle className="text-zinc-600 mb-3" size={40} />
            <p className="text-zinc-400 font-medium">Nenhum simulado feito ainda.</p>
          </div>
        )}
      </div>

      <div className="glass-card p-6">
        <h3 className="text-lg font-bold mb-4 text-white">Últimas Tentativas</h3>
        {historyData.length > 0 ? (
          <div className="space-y-3">
            {historyData.slice(-5).reverse().map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-[#1e1e1e] rounded-lg border border-zinc-800">
                <span className="font-medium text-zinc-200">{item.title}</span>
                <span className={`font-bold ${item.score >= 65 ? 'text-emerald-500' : 'text-red-500'}`}>
                  {Math.round((item.score / 100) * 40)}/40
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-zinc-500 text-center py-4">Nenhuma atividade registrada.</p>
        )}
      </div>
    </div>
  );
}