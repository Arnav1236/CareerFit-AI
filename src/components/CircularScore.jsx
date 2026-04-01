import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const getScoreColor = (score) => {
  if (score >= 75) return { stroke: '#16A34A', text: '#15803D', label: 'Excellent', bg: 'rgba(22,163,74,0.08)' };
  if (score >= 50) return { stroke: '#F97316', text: '#EA580C', label: 'Good', bg: 'rgba(249,115,22,0.08)' };
  if (score >= 30) return { stroke: '#EAB308', text: '#CA8A04', label: 'Fair', bg: 'rgba(234,179,8,0.08)' };
  return { stroke: '#DC2626', text: '#B91C1C', label: 'Needs Work', bg: 'rgba(220,38,38,0.08)' };
};

export default function CircularScore({ score = 72, size = 220, animated = true }) {
  const [displayScore, setDisplayScore] = useState(0);
  const radius = (size - 28) / 2;
  const circumference = 2 * Math.PI * radius;
  const colors = getScoreColor(score);
  const offset = circumference - (displayScore / 100) * circumference;

  useEffect(() => {
    if (!animated) { setDisplayScore(score); return; }
    let start = 0;
    const duration = 1500;
    const step = (timestamp) => {
      if (!step.startTime) step.startTime = timestamp;
      const progress = Math.min((timestamp - step.startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setDisplayScore(Math.round(eased * score));
      if (progress < 1) requestAnimationFrame(step);
    };
    const rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [score, animated]);

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="flex flex-col items-center gap-4"
    >
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background glow */}
        <div
          className="absolute inset-0 rounded-full blur-2xl opacity-30"
          style={{ background: colors.bg, transform: 'scale(0.85)' }}
        />

        {/* SVG ring */}
        <svg width={size} height={size} className="drop-shadow-sm">
          {/* Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#F5EAD8"
            strokeWidth="14"
          />
          {/* Progress */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={colors.stroke}
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{
              transform: 'rotate(-90deg)',
              transformOrigin: '50% 50%',
              transition: 'stroke-dashoffset 0.1s ease',
            }}
          />
          {/* Decorative dots */}
          {[0, 25, 50, 75].map((pct) => {
            const angle = (pct / 100) * 360 - 90;
            const rad = (angle * Math.PI) / 180;
            const cx = size / 2 + radius * Math.cos(rad);
            const cy = size / 2 + radius * Math.sin(rad);
            return (
              <circle key={pct} cx={cx} cy={cy} r="3" fill="#D4B896" opacity="0.6" />
            );
          })}
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-5xl font-display font-bold" style={{ color: colors.text }}>
            {displayScore}
          </div>
          <div className="text-sm text-warm-brown font-medium mt-1">/ 100</div>
          <div
            className="mt-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide"
            style={{ color: colors.text, backgroundColor: colors.bg }}
          >
            {colors.label}
          </div>
        </div>
      </div>

      <p className="text-warm-brown text-sm font-medium text-center">
        Resume Readiness Score
      </p>

      {/* Scale indicators */}
      <div className="flex gap-4 text-xs">
        {[
          { label: 'Needs Work', color: '#DC2626', range: '0-29' },
          { label: 'Fair', color: '#EAB308', range: '30-49' },
          { label: 'Good', color: '#F97316', range: '50-74' },
          { label: 'Excellent', color: '#16A34A', range: '75-100' },
        ].map(({ label, color, range }) => (
          <div key={label} className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-warm-mid">{label}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
