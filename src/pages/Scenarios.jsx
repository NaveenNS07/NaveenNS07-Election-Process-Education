import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatBox from '../components/chat/ChatBox';

const scenarios = [
  {
    id: 1,
    title: 'Lost Voter ID',
    question: 'I lost my voter registration card/ID just before election day. Can I still vote?',
    solution: 'In most jurisdictions, you can still vote by showing alternative government-issued photo IDs (like a passport or driver\'s license). Many polling places also offer "provisional ballots" which are counted once your eligibility is verified.',
    steps: ['Verify your polling location', 'Bring any government ID', 'Ask for a provisional ballot if needed'],
    icon: 'id_card'
  },
  {
    id: 2,
    title: 'Work Schedule Conflict',
    question: 'My shift starts before polls open and ends after they close. What are my rights?',
    solution: 'Many states/countries have laws requiring employers to give workers paid time off to vote. You should notify your supervisor at least 2 days in advance. Alternatively, check if "Early Voting" or "Mail-in Ballots" are available in your area.',
    steps: ['Check local voting leave laws', 'Notify employer in advance', 'Explore early voting options'],
    icon: 'work'
  },
  {
    id: 3,
    title: 'Moved Recently',
    question: 'I moved to a new address last month and didn\'t update my registration.',
    solution: 'Depending on your location, you may still be able to vote at your old polling place for a transition period, or use "Same-Day Registration" if available. Check if your current address is within the same voting district.',
    steps: ['Check same-day registration availability', 'Verify district boundaries', 'Contact local election office'],
    icon: 'home_pin'
  }
];

const Scenarios = () => {
  const [selected, setSelected] = useState(null);
  const [showAIChat, setShowAIChat] = useState(false);

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-text-primary tracking-tight">Scenario Help</h1>
          <p className="text-text-secondary mt-2 text-lg">Expert solutions for real-world voting challenges.</p>
        </div>
        <button 
          onClick={() => setShowAIChat(!showAIChat)}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-md active:scale-95 ${
            showAIChat 
              ? 'bg-background border border-border text-text-primary' 
              : 'bg-primary text-white hover:bg-primary-dark'
          }`}
          aria-label={showAIChat ? "Back to scenario library" : "Ask AI a custom scenario"}
        >
          <span className="material-symbols-outlined" aria-hidden="true">{showAIChat ? 'close' : 'psychology'}</span>
          {showAIChat ? 'Back to Library' : 'Ask AI Custom Case'}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {showAIChat ? (
          <motion.div
            key="ai-chat"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="h-[600px]"
          >
            <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 mb-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm">
                <span className="material-symbols-outlined text-3xl animate-pulse">auto_awesome</span>
              </div>
              <div>
                <h3 className="text-primary font-black">AI Scenario Solver Active</h3>
                <p className="text-xs text-text-secondary">Describe your unique situation below and VoteWise AI will generate a custom action plan.</p>
              </div>
            </div>
            <ChatBox mode="scenario" placeholder="Describe your situation (e.g., 'I am a student living in a dorm...')" />
          </motion.div>
        ) : (
          <motion.div
            key="library"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-10"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {scenarios.map((s) => (
                <div
                  key={s.id}
                  onClick={() => setSelected(s)}
                  className={`card p-8 cursor-pointer group relative overflow-hidden ${selected?.id === s.id ? 'ring-2 ring-primary border-primary bg-primary/[0.02]' : ''}`}
                >
                  <div className={`w-14 h-14 rounded-2xl mb-6 flex items-center justify-center transition-all duration-500 ${selected?.id === s.id ? 'bg-primary text-white rotate-6' : 'bg-background text-primary'}`}>
                    <span className="material-symbols-outlined text-3xl">{s.icon}</span>
                  </div>
                  <h3 className="text-xl font-black text-text-primary mb-3 group-hover:text-primary transition-colors">{s.title}</h3>
                  <p className="text-sm text-text-secondary line-clamp-2 leading-relaxed mb-6">
                    {s.question}
                  </p>
                  <div className="flex items-center text-xs font-black text-primary tracking-widest uppercase group-hover:translate-x-2 transition-transform">
                    SOLVE CHALLENGE
                    <span className="material-symbols-outlined text-sm ml-2">arrow_right_alt</span>
                  </div>
                </div>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {selected ? (
                <motion.div
                  key={selected.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 30 }}
                  className="bg-card border border-border rounded-3xl overflow-hidden shadow-2xl transition-colors duration-500"
                >
                  <div className="p-8 md:p-16">
                    <div className="flex flex-col md:flex-row md:items-center gap-6 mb-12 pb-12 border-b border-border">
                      <div className="w-20 h-20 bg-primary/10 text-primary rounded-3xl flex items-center justify-center shadow-inner">
                        <span className="material-symbols-outlined text-5xl">{selected.icon}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2 block">Case Study {selected.id}</span>
                        <h2 className="text-3xl font-black text-text-primary leading-tight">{selected.title}</h2>
                        <p className="text-text-secondary mt-3 text-lg font-medium italic opacity-80 leading-relaxed">"{selected.question}"</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
                      <div className="lg:col-span-3 space-y-8">
                        <h3 className="text-2xl font-black text-text-primary flex items-center gap-3">
                          <span className="w-2 h-8 bg-accent rounded-full"></span>
                          The Solution
                        </h3>
                        <div className="p-8 bg-accent/5 border border-accent/20 rounded-3xl relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-4 opacity-5">
                            <span className="material-symbols-outlined text-8xl">verified</span>
                          </div>
                          <p className="text-text-primary leading-relaxed text-lg relative z-10">
                            {selected.solution}
                          </p>
                        </div>
                      </div>

                      <div className="lg:col-span-2 space-y-8">
                        <h3 className="text-2xl font-black text-text-primary flex items-center gap-3">
                          <span className="w-2 h-8 bg-primary rounded-full"></span>
                          Action Plan
                        </h3>
                        <div className="space-y-4">
                          {selected.steps.map((step, i) => (
                            <motion.div 
                              key={i} 
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.1 }}
                              className="flex items-center gap-5 p-5 bg-background rounded-2xl border border-border hover:border-primary transition-all group"
                            >
                              <div className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center text-sm font-black text-text-secondary group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all">
                                0{i + 1}
                              </div>
                              <span className="font-bold text-text-primary group-hover:text-primary transition-colors">{step}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="bg-background/50 border-4 border-dashed border-border rounded-3xl p-24 text-center">
                  <div className="w-24 h-24 bg-card rounded-[2.5rem] flex items-center justify-center text-border/50 mx-auto mb-8 shadow-inner">
                    <span className="material-symbols-outlined text-5xl">touch_app</span>
                  </div>
                  <h3 className="text-text-secondary text-xl font-bold mb-2">Select a scenario above</h3>
                  <p className="text-text-secondary opacity-60 max-w-sm mx-auto">Click on any challenge to see the official solution and step-by-step action plan.</p>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Scenarios;
