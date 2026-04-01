import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, ChevronRight, FileText, Target, Cpu, BarChart3, BookOpen, Sparkles } from 'lucide-react';

const STEPS = [
  {
    step: 1,
    icon: FileText,
    color: '#F97316',
    bg: '#FFF7ED',
    title: 'Upload Your Resume',
    description: 'Click "Upload Resume" on the home page. Drag & drop or browse to select your PDF or DOCX file (max 5MB).',
    tip: 'Make sure your resume is up-to-date before analyzing!',
  },
  {
    step: 2,
    icon: Target,
    color: '#8B5CF6',
    bg: '#F5F3FF',
    title: 'Set Your Target',
    description: 'Choose your desired role (e.g., Frontend Developer) and optionally select target companies to tailor the analysis.',
    tip: 'More specific targets = more relevant insights.',
  },
  {
    step: 3,
    icon: Cpu,
    color: '#0891B2',
    bg: '#ECFEFF',
    title: 'AI Analysis Runs',
    description: 'Our AI engine parses your resume, extracts skills, and cross-references them with industry job requirements.',
    tip: 'This usually takes under 10 seconds!',
  },
  {
    step: 4,
    icon: BarChart3,
    color: '#16A34A',
    bg: '#F0FDF4',
    title: 'View Your Dashboard',
    description: 'See your Readiness Score (0-100), matched & unmatched skills, and an overall summary of your resume.',
    tip: 'Green = matched skills, Red = skill gaps to fill.',
  },
  {
    step: 5,
    icon: BookOpen,
    color: '#DC2626',
    bg: '#FFF1F2',
    title: 'Get Course Recommendations',
    description: 'For every skill gap, we recommend the best online courses from Udemy, Coursera, and more to level you up.',
    tip: 'Complete courses to boost your readiness score!',
  },
  {
    step: 6,
    icon: Sparkles,
    color: '#B45309',
    bg: '#FFFBEB',
    title: 'Re-analyze & Improve',
    description: 'After learning new skills, upload an updated resume and watch your readiness score climb!',
    tip: 'Keep iterating — top candidates analyze multiple times.',
  },
];

export default function HowItWorksModal({ onClose }) {
  const [currentStep, setCurrentStep] = useState(0);

  const Icon = STEPS[currentStep].icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div className="absolute inset-0 bg-warm-dark/40 backdrop-blur-sm" />

        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 30 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-warm-xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-8 py-6 border-b border-cream-200 bg-hero-gradient">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-gradient flex items-center justify-center">
                <Play className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-display text-xl font-bold text-warm-dark">How It Works</h2>
                <p className="text-warm-brown text-sm">6 simple steps to your dream job</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-cream-200 transition-colors">
              <X className="w-5 h-5 text-warm-brown" />
            </button>
          </div>

          {/* Step dots */}
          <div className="flex items-center justify-center gap-2 py-4 border-b border-cream-100">
            {STEPS.map((s, i) => (
              <button
                key={i}
                onClick={() => setCurrentStep(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === currentStep
                    ? 'w-8 h-3 bg-orange-500'
                    : i < currentStep
                    ? 'w-3 h-3 bg-green-400'
                    : 'w-3 h-3 bg-cream-300'
                }`}
              />
            ))}
          </div>

          {/* Step content */}
          <div className="px-8 py-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Icon + Step number */}
                <div className="flex items-start gap-5">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md"
                    style={{ backgroundColor: STEPS[currentStep].bg }}
                  >
                    <Icon className="w-8 h-8" style={{ color: STEPS[currentStep].color }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                        style={{
                          color: STEPS[currentStep].color,
                          backgroundColor: STEPS[currentStep].bg
                        }}
                      >
                        Step {STEPS[currentStep].step} of {STEPS.length}
                      </span>
                    </div>
                    <h3 className="font-display text-2xl font-bold text-warm-dark">
                      {STEPS[currentStep].title}
                    </h3>
                  </div>
                </div>

                {/* Description */}
                <p className="text-warm-brown text-base leading-relaxed">
                  {STEPS[currentStep].description}
                </p>

                {/* Pro tip */}
                <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200">
                  <span className="text-xl">💡</span>
                  <div>
                    <p className="text-amber-800 font-semibold text-sm">Pro Tip</p>
                    <p className="text-amber-700 text-sm mt-0.5">{STEPS[currentStep].tip}</p>
                  </div>
                </div>

                {/* Visual step path */}
                <div className="flex items-center gap-2 flex-wrap">
                  {STEPS.map((s, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <button
                        onClick={() => setCurrentStep(i)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200
                          ${i === currentStep
                            ? 'text-white shadow-sm'
                            : i < currentStep
                            ? 'bg-green-100 text-green-700'
                            : 'bg-cream-100 text-warm-brown hover:bg-cream-200'
                          }`}
                        style={i === currentStep ? { backgroundColor: STEPS[i].color } : {}}
                      >
                        {i < currentStep ? '✓' : i + 1}. {s.title.split(' ')[0]}
                      </button>
                      {i < STEPS.length - 1 && (
                        <ChevronRight className="w-3 h-3 text-cream-400" />
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="px-8 py-5 bg-cream-50 border-t border-cream-200 flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="btn-secondary text-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>
            <span className="text-warm-brown text-sm">
              {currentStep + 1} / {STEPS.length}
            </span>
            {currentStep < STEPS.length - 1 ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="btn-primary text-sm"
              >
                Next →
              </button>
            ) : (
              <button onClick={onClose} className="btn-primary text-sm">
                Got it! 🎉
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
