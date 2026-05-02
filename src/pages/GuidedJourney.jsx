import React, { useCallback, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { journeyStages } from '../utils/journeyData';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const GuidedJourney = () => {
  const { currentStage, setCurrentStage, knowledgeLevel, user, simpleMode } = useAppContext();
  
  const stage = useMemo(() => journeyStages[currentStage], [currentStage]);

  const displayDescription = simpleMode ? stage.simpleDescription : stage.description;

  const handleNext = useCallback(() => {
    if (currentStage < journeyStages.length - 1) {
      setCurrentStage(currentStage + 1);
    }
  }, [currentStage, setCurrentStage]);

  const handlePrev = useCallback(() => {
    if (currentStage > 0) {
      setCurrentStage(currentStage - 1);
    }
  }, [currentStage, setCurrentStage]);

  const handleComplete = useCallback(() => {
    if (currentStage < journeyStages.length - 1) {
      handleNext();
    } else {
      alert("Congratulations! You've completed the election journey.");
    }
  }, [currentStage, handleNext]);

  return (
    <div className="space-y-10 pb-24">
      <section aria-label="Journey Progress Overview">
        <Card padding="p-8" className="overflow-hidden relative" hover={false}>
          <div className="absolute top-0 right-0 p-8 opacity-5" aria-hidden="true">
            <span className="material-symbols-outlined text-9xl">auto_stories</span>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10 relative z-10">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] rounded-full" aria-label={`Step ${currentStage + 1} of ${journeyStages.length}`}>
                  Step {currentStage + 1} of {journeyStages.length}
                </span>
                {!user && (
                  <span className="text-[10px] text-amber-600 font-bold flex items-center gap-1 bg-amber-50 px-3 py-1 rounded-full" aria-label="Authentication status: Not synced">
                    <span className="material-symbols-outlined text-xs" aria-hidden="true">cloud_off</span> NOT SYNCED
                  </span>
                )}
              </div>
              <h1 className="text-4xl font-black text-text-primary tracking-tight">Election Lifecycle</h1>
              <p className="text-text-secondary mt-2 font-medium">Master the democratic process one step at a time.</p>
            </div>
          
            <div className="flex items-center gap-3">
              <Button 
                onClick={handlePrev}
                disabled={currentStage === 0}
                variant="secondary"
                icon="arrow_back"
                ariaLabel="Previous Step"
                className="w-14 h-14 p-0 rounded-2xl"
              />
              <Button 
                onClick={handleNext}
                disabled={currentStage === journeyStages.length - 1}
                icon="arrow_forward"
                ariaLabel="Next Phase"
                className="h-14 px-8"
              >
                Next Phase
              </Button>
            </div>
          </div>

          {/* Premium Progress Bar */}
          <div 
            className="relative h-3 w-full bg-background rounded-full overflow-hidden shadow-inner" 
            role="progressbar" 
            aria-valuenow={((currentStage + 1) / journeyStages.length) * 100} 
            aria-valuemin="0" 
            aria-valuemax="100"
            aria-label="Journey progress"
          >
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${((currentStage + 1) / journeyStages.length) * 100}%` }}
              transition={{ type: "spring", stiffness: 50, damping: 20 }}
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-blue-400 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.4)]"
            />
          </div>
          
          <div className="grid grid-cols-6 gap-2 mt-4 px-1">
            {journeyStages.map((_, i) => (
              <div 
                key={i} 
                className={`h-1.5 rounded-full transition-all duration-500 ${i <= currentStage ? 'bg-primary/20' : 'bg-transparent'}`}
              />
            ))}
          </div>
        </Card>
      </section>

      {/* Interactive Content Stage */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStage}
          initial={{ opacity: 0, scale: 0.98, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 1.02, y: -20 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-card border border-border rounded-[2.5rem] overflow-hidden shadow-premium flex flex-col lg:flex-row min-h-[600px]"
        >
          {/* Visual Showcase Side */}
          <div className="w-full lg:w-5/12 bg-background p-12 lg:p-20 relative flex flex-col items-center justify-center overflow-hidden border-b lg:border-b-0 lg:border-r border-border" aria-hidden="true">
            <div className="absolute inset-0 opacity-[0.03] rotate-12 scale-150">
              <span className="material-symbols-outlined text-[400px]">auto_awesome</span>
            </div>
            
            <div className="relative z-10 text-center">
              <motion.div 
                initial={{ rotate: -10, scale: 0.8 }}
                animate={{ rotate: 0, scale: 1 }}
                className="w-32 h-32 bg-card rounded-[2.5rem] shadow-hover flex items-center justify-center text-primary mx-auto mb-10 border border-border"
              >
                <span className="material-symbols-outlined text-6xl">{stage.icon}</span>
              </motion.div>
              
              <h2 className="text-4xl font-black text-text-primary mb-6 leading-tight tracking-tighter">{stage.title}</h2>
              
              <div className="flex flex-wrap justify-center gap-3">
                <span className="px-4 py-2 bg-card border border-border rounded-xl text-[10px] font-black text-text-secondary uppercase tracking-widest shadow-sm">
                   LEVEL: {knowledgeLevel}
                </span>
                <span className="px-4 py-2 bg-card border border-border rounded-xl text-[10px] font-black text-primary uppercase tracking-widest shadow-sm flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">schedule</span>
                  {stage.estimatedTime || '10 MIN'}
                </span>
              </div>
            </div>
          </div>

          {/* Educational Content Side */}
          <div className="flex-1 p-8 lg:p-20 space-y-12 bg-card relative">
            <section className="space-y-6" aria-labelledby="phase-overview-title">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-8 bg-primary rounded-full"></div>
                <h3 id="phase-overview-title" className="text-2xl font-black text-text-primary tracking-tight">Phase Overview</h3>
              </div>
              <p className="text-text-secondary leading-relaxed text-xl font-medium opacity-90">
                {displayDescription}
              </p>
            </section>

            <section className="grid grid-cols-1 gap-6" aria-label="Phase steps">
              {stage.content.map((item, idx) => (
                <motion.article 
                  key={idx} 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + idx * 0.1 }}
                  className="flex gap-6 p-6 bg-background rounded-3xl border border-border hover:border-primary/50 transition-all group"
                >
                  <div className="w-12 h-12 shrink-0 bg-card border border-border rounded-2xl flex items-center justify-center text-primary font-black text-lg group-hover:bg-primary group-hover:text-white transition-all shadow-sm" aria-hidden="true">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="font-black text-text-primary text-lg mb-2 group-hover:text-primary transition-colors">{item.title}</h4>
                    <p className="text-base text-text-secondary leading-relaxed font-medium">
                      {simpleMode ? item.simple : item.text}
                    </p>
                  </div>
                </motion.article>
              ))}
            </section>

            {/* Stage Action Footer */}
            <footer className="pt-10 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-3 text-text-secondary">
                <span className="material-symbols-outlined text-accent" aria-hidden="true">verified</span>
                <p className="text-sm font-bold italic opacity-70">Mark this stage to unlock the next phase.</p>
              </div>
              <Button 
                onClick={handleComplete}
                className="w-full sm:w-auto h-16 px-10"
                icon="check_circle"
                ariaLabel="Complete current stage and move to next"
              >
                Complete Stage
              </Button>
            </footer>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default GuidedJourney;
