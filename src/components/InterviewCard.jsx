import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

const DIFFICULTY_COLORS = {
  Easy: { bg: '#F0FDF4', text: '#16A34A', border: '#BBF7D0' },
  Medium: { bg: '#FFF7ED', text: '#EA580C', border: '#FDBA74' },
  Hard: { bg: '#FFF1F2', text: '#DC2626', border: '#FECDD3' },
};

function QuestionItem({ q, index }) {
  const [open, setOpen] = useState(false);
  const colors = DIFFICULTY_COLORS[q.difficulty] || DIFFICULTY_COLORS.Easy;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="border border-cream-200 rounded-xl overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between p-4 text-left hover:bg-cream-50 transition-colors"
      >
        <div className="flex items-start gap-3 flex-1">
          <span className="text-warm-brown font-bold text-sm mt-0.5">Q{index + 1}.</span>
          <p className="font-medium text-warm-dark text-sm leading-relaxed">{q.q}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full border"
            style={{ color: colors.text, backgroundColor: colors.bg, borderColor: colors.border }}
          >
            {q.difficulty}
          </span>
          {open ? (
            <ChevronUp className="w-4 h-4 text-warm-mid" />
          ) : (
            <ChevronDown className="w-4 h-4 text-warm-mid" />
          )}
        </div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-4 pb-4 pt-1 bg-orange-50/50 border-t border-cream-200">
              <p className="text-sm text-warm-brown leading-relaxed">
                <span className="font-semibold text-orange-600">Answer: </span>
                {q.a}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function InterviewCard({ category, index }) {
  const [expanded, setExpanded] = useState(index === 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="card overflow-hidden"
    >
      {/* Category header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-5 hover:bg-cream-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold"
            style={{ backgroundColor: category.bg, color: category.color }}
          >
            {category.category[0]}
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-warm-dark">{category.category}</h3>
            <p className="text-xs text-warm-mid">{category.questions.length} questions</p>
          </div>
        </div>
        {expanded
          ? <ChevronUp className="w-5 h-5 text-warm-mid" />
          : <ChevronDown className="w-5 h-5 text-warm-mid" />
        }
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-2">
              {category.questions.map((q, i) => (
                <QuestionItem key={i} q={q} index={i} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
