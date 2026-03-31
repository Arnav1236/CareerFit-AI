import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { FileText, Brain, Zap, Target, CheckCircle, AlertCircle, RefreshCw, BarChart2 } from 'lucide-react';

const STEPS = [
  { icon: FileText, message: "Parsing your resume...", color: "#F97316", progress: 0 },
  { icon: Brain, message: "Extracting skills & experience...", color: "#8B5CF6", progress: 20 },
  { icon: Target, message: "Matching against job requirements...", color: "#0891B2", progress: 40 },
  { icon: Zap, message: "Generating skill gap insights...", color: "#16A34A", progress: 60 },
  { icon: BarChart2, message: "Calculating readiness score...", color: "#E11D48", progress: 80 },
  { icon: CheckCircle, message: "Finalizing your report...", color: "#16A34A", progress: 95 },
];

const STEP_DURATION_MS = 900; // time spent on each step
const API_BASE = 'http://localhost:8000';

export default function LoadingScreen() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const hasFetched = useRef(false);
  const apiResult = useRef(null);
  const apiDone = useRef(false);
  const stepRef = useRef(0);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    // ── Step-by-step progress ─────────────────────────────────────────────────
    // Advances one step every STEP_DURATION_MS, stops at the last step
    // until the API has finished, then completes.
    const advanceStep = () => {
      const next = stepRef.current + 1;

      if (next < STEPS.length) {
        stepRef.current = next;
        setCurrentStep(next);
        // Animate progress smoothly to this step's target %
        animateProgress(STEPS[next].progress);

        if (next === STEPS.length - 1) {
          // Reached last step — wait for API then finish
          waitForApiThenFinish();
        } else {
          setTimeout(advanceStep, STEP_DURATION_MS);
        }
      }
    };

    // Start first step after a brief pause
    animateProgress(STEPS[0].progress); // 0%
    setTimeout(advanceStep, STEP_DURATION_MS);

    // ── API call ──────────────────────────────────────────────────────────────
    const callApi = async () => {
      const file = state?.file;
      const role = state?.role;
      const companies = state?.companies || [];

      if (!file || !role) {
        navigate('/home');
        return;
      }

      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('role', role);
        formData.append('companies', companies.join(','));

        const response = await fetch(`${API_BASE}/api/analyze`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.detail || `Server error: ${response.status}`);
        }

        apiResult.current = await response.json();
        apiDone.current = true;

      } catch (err) {
        setError(err.message || 'Analysis failed. Please try again.');
      }
    };

    callApi();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Smoothly animate the progress bar to a target value
  const animateProgress = (target) => { setProgress(target); };

  // Called when animation reaches last step — waits for API if needed
  const waitForApiThenFinish = () => {
    const check = setInterval(() => {
      if (apiDone.current) {
        clearInterval(check);
        finish();
      }
    }, 100);
  };

  const finish = () => {
    animateProgress(100);
    setDone(true);
    setTimeout(() => {
      navigate('/dashboard', {
        state: {
          result: apiResult.current,
          role: state?.role,
          companies: state?.companies,
        },
      });
    }, 700);
  };

  const CurrentIcon = STEPS[currentStep].icon;

  // Floating particles
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 8 + 4,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 2,
  }));

  // ── Error UI ────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-screen bg-warm-gradient flex items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl shadow-warm-xl p-10 max-w-md w-full text-center"
        >
          <div className="w-20 h-20 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="font-display text-2xl font-bold text-warm-dark mb-3">Analysis Failed</h2>
          <p className="text-warm-brown mb-2 text-sm leading-relaxed">{error}</p>
          <p className="text-warm-mid text-xs mb-8">
            Make sure the backend server is running at{' '}
            <code className="bg-cream-100 px-1 py-0.5 rounded">localhost:8000</code> and the PDF is a valid text-based resume.
          </p>
          <button
            onClick={() => navigate('/home')}
            className="btn-primary flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-gradient flex items-center justify-center relative overflow-hidden">
      {/* Background dots */}
      <div className="absolute inset-0 dot-pattern opacity-30" />

      {/* Floating particles */}
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-orange-300/40"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
          animate={{ y: [0, -30, 0], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* Main card */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative z-10 bg-white/90 backdrop-blur-md rounded-3xl shadow-warm-xl border border-white/60 p-12 max-w-md w-full mx-4"
      >
        {/* Animated icon */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            {[1, 2, 3].map(i => (
              <motion.div
                key={i}
                className="absolute rounded-full border-2 border-orange-300"
                style={{ inset: -(i * 14) }}
                animate={{ scale: [1, 1.1, 1], opacity: [0.6, 0.2, 0.6] }}
                transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
              />
            ))}
            <motion.div
              key={currentStep}
              initial={{ scale: 0.5, opacity: 0, rotate: -180 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ type: 'spring', damping: 15 }}
              className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-warm-lg"
              style={{ backgroundColor: STEPS[currentStep].color }}
            >
              <CurrentIcon className="w-10 h-10 text-white" />
            </motion.div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="font-display text-2xl font-bold text-warm-dark mb-2">
            Analyzing Your Resume
          </h2>
          <AnimatePresence mode="wait">
            <motion.p
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-warm-brown"
            >
              {STEPS[currentStep].message}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-warm-brown mb-2">
            <span>Progress</span>
            <span className="font-semibold">{Math.round(progress)}%</span>
          </div>
          <div className="h-3 bg-cream-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-orange-gradient"
              initial={{ width: "0%" }} animate={{ width: `${progress}%` }} transition={{ duration: 1.2, ease: "easeInOut" }}
            />
          </div>
          {/* Step indicators */}
          <div className="flex justify-between mt-2">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: i <= currentStep
                    ? STEPS[i].color
                    : '#E5D5C5',
                  transform: i === currentStep ? 'scale(1.4)' : 'scale(1)',
                }}
              />
            ))}
          </div>
        </div>

        {/* Step list */}
        <div className="space-y-3">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            const isDone = i < currentStep || done;
            const isCurrent = i === currentStep && !done;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{
                  opacity: isCurrent ? 1 : isDone ? 0.6 : 0.3,
                  x: 0,
                }}
                transition={{ delay: i * 0.05 }}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300
                  ${isCurrent ? 'bg-orange-50' : ''}`}
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: isDone || isCurrent ? step.color + '20' : '#F5EAD8',
                  }}
                >
                  <Icon
                    className="w-3.5 h-3.5"
                    style={{ color: isDone || isCurrent ? step.color : '#A0724A' }}
                  />
                </div>
                <span className={`text-sm font-medium ${isCurrent ? 'text-warm-dark' : 'text-warm-brown'}`}>
                  {step.message}
                </span>
                {isDone && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-auto"
                  >
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* File info */}
        {state?.file && (
          <div className="mt-6 p-3 bg-cream-100 rounded-xl flex items-center gap-3">
            <FileText className="w-5 h-5 text-orange-500" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-warm-dark truncate">{state.file.name}</p>
              <p className="text-xs text-warm-brown">{state.role || 'General Analysis'}</p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}