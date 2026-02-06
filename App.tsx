
import React, { useState, useCallback, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Biometrics, MoodAnalysis, Recommendation } from './types';
import { INITIAL_BIOMETRICS, MOOD_PRESETS } from './constants';
import { analyzeMoodAndAct } from './services/geminiService';
import BiometricSlider from './components/BiometricSlider';
import RecommendationCard from './components/RecommendationCard';

const App: React.FC = () => {
  const [biometrics, setBiometrics] = useState<Biometrics>(INITIAL_BIOMETRICS);
  const [analysis, setAnalysis] = useState<MoodAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedRecId, setSelectedRecId] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setAnalysis(null);
    setSelectedRecId(null);
    try {
      const result = await analyzeMoodAndAct(biometrics);
      setAnalysis(result);
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateBiometric = (key: keyof Biometrics, value: number) => {
    setBiometrics(prev => ({ ...prev, [key]: value }));
  };

  const applyPreset = (presetData: Biometrics) => {
    setBiometrics(presetData);
  };

  // Mock data for the sparkline chart
  const chartData = [
    { time: '8am', value: 65 },
    { time: '10am', value: 85 },
    { time: '12pm', value: 78 },
    { time: '2pm', value: biometrics.heartRate },
    { time: '4pm', value: 72 },
    { time: '6pm', value: 70 },
  ];

  return (
    <div className="min-h-screen pb-20 overflow-x-hidden">
      {/* Header */}
      <nav className="border-b border-white/5 py-4 px-6 md:px-12 flex items-center justify-between sticky top-0 z-50 bg-black/80 backdrop-blur-md">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-lg">M</div>
          <h1 className="text-lg font-semibold tracking-tight">Mood Engine</h1>
        </div>
        <button 
          onClick={handleAnalyze}
          disabled={loading}
          className="accent-gradient px-6 py-2 rounded-full font-semibold text-sm hover:opacity-90 transition-all disabled:opacity-50"
        >
          {loading ? 'Synthesizing...' : 'Sync & Analyze'}
        </button>
      </nav>

      <main className="max-w-7xl mx-auto px-6 md:px-12 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Biometrics Input */}
          <div className="lg:col-span-4 space-y-8">
            <section>
              <h2 className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em] mb-6">Biometric Feed</h2>
              <div className="glass p-6 rounded-3xl space-y-6">
                
                {/* Visual Chart representation */}
                <div className="h-32 w-full mb-8">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <Area type="monotone" dataKey="value" stroke="#6366f1" fillOpacity={1} fill="url(#colorVal)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <BiometricSlider label="Heart Rate" min={40} max={180} value={biometrics.heartRate} unit="bpm" onChange={(v) => updateBiometric('heartRate', v)} />
                <BiometricSlider label="Stress Level" min={0} max={100} value={biometrics.stressLevel} unit="%" onChange={(v) => updateBiometric('stressLevel', v)} />
                <BiometricSlider label="Sleep Last Night" min={0} max={12} value={biometrics.sleepDuration} unit="h" onChange={(v) => updateBiometric('sleepDuration', v)} />
                <BiometricSlider label="Meetings Today" min={0} max={12} value={biometrics.meetingsDuration} unit="h" onChange={(v) => updateBiometric('meetingsDuration', v)} />
                <BiometricSlider label="Daily Steps" min={0} max={20000} value={biometrics.steps} unit="" onChange={(v) => updateBiometric('steps', v)} />
              </div>
            </section>

            <section>
              <h2 className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em] mb-4">Quick Sim</h2>
              <div className="flex flex-wrap gap-2">
                {MOOD_PRESETS.map((p) => (
                  <button
                    key={p.name}
                    onClick={() => applyPreset(p.data)}
                    className="text-[10px] bg-white/5 border border-white/10 px-3 py-1.5 rounded-full hover:bg-indigo-500/10 hover:border-indigo-500/40 transition-colors"
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column: Results & Analysis */}
          <div className="lg:col-span-8">
            {!analysis && !loading && (
              <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center animate-pulse">
                  <svg className="w-10 h-10 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">Waiting for input</h3>
                  <p className="text-gray-500 max-w-sm">Adjust your biometrics or select a preset to generate a mood-based action plan.</p>
                </div>
              </div>
            )}

            {loading && (
              <div className="h-[60vh] flex flex-col items-center justify-center space-y-8">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-ping"></div>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-indigo-400 font-medium animate-pulse">Crunching cortisol levels...</p>
                  <p className="text-gray-500 text-sm mt-1">Our AI is designing your perfect evening.</p>
                </div>
              </div>
            )}

            {analysis && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <header className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <span className="bg-indigo-500/20 text-indigo-400 text-xs font-bold px-3 py-1 rounded-full uppercase">Current State</span>
                    <span className="text-gray-500">—</span>
                    <span className="text-gray-200 font-medium">{analysis.dominantMood}</span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
                    {analysis.summary}
                  </h2>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {analysis.recommendations.map((rec) => (
                    <RecommendationCard 
                      key={rec.id} 
                      rec={rec} 
                      isSelected={selectedRecId === rec.id}
                      onSelect={() => setSelectedRecId(rec.id)}
                    />
                  ))}
                </div>

                {selectedRecId && (
                  <div className="glass p-8 rounded-3xl border-indigo-500/20 bg-indigo-500/5 animate-in zoom-in-95 duration-300">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="text-lg font-bold">Action Confirmed</h4>
                      <button 
                        onClick={() => setSelectedRecId(null)}
                        className="text-gray-500 hover:text-white"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="flex flex-col md:flex-row gap-6 items-center">
                      <div className="text-6xl bg-white/5 w-24 h-24 rounded-2xl flex items-center justify-center">
                        {analysis.recommendations.find(r => r.id === selectedRecId)?.icon}
                      </div>
                      <div className="flex-1 space-y-2">
                        <p className="text-gray-400">Executing sequence for <span className="text-indigo-400 font-bold">{analysis.recommendations.find(r => r.id === selectedRecId)?.title}</span>.</p>
                        <p className="text-sm text-gray-500 italic">This action will help regulate your HRV and reduce autonomic stress levels by approximately 15%.</p>
                      </div>
                      <button className="accent-gradient px-8 py-3 rounded-xl font-bold shadow-lg shadow-indigo-500/20 whitespace-nowrap">
                        Let's Go
                      </button>
                    </div>
                  </div>
                )}
                
                <footer className="pt-10 border-t border-white/5">
                  <div className="flex items-center space-x-4 opacity-50 grayscale hover:grayscale-0 transition-all cursor-default">
                    <div className="text-xs font-medium">Synced with Apple Health • Oura • Fitbit</div>
                    <div className="w-px h-4 bg-white/20"></div>
                    <div className="text-[10px] text-gray-500 italic">Recommendations tailored via Gemini Engine v3.0</div>
                  </div>
                </footer>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Floating Action Hint */}
      {analysis && !selectedRecId && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 glass px-6 py-3 rounded-full border-white/10 shadow-2xl animate-bounce">
          <p className="text-sm font-medium text-indigo-300">Pick one to break the cycle ↓</p>
        </div>
      )}
    </div>
  );
};

export default App;
