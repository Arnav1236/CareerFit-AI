import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  CheckCircle2, XCircle, ArrowLeft, Download, RefreshCw,
  BookOpen, Briefcase, GraduationCap, ChevronDown, ChevronUp,
  Star, ExternalLink, Sparkles, TrendingUp, AlertTriangle, Info
} from 'lucide-react';

import CircularScore from '../components/CircularScore';
import Navbar from '../components/Navbar';



const IMPORTANCE_COLORS = {
  Critical: { bg: '#FFF1F2', text: '#BE123C', border: '#FECDD3', dot: '#E11D48' },
  High:     { bg: '#FFF7ED', text: '#C2410C', border: '#FDBA74', dot: '#F97316' },
  Medium:   { bg: '#FEFCE8', text: '#A16207', border: '#FDE047', dot: '#CA8A04' },
};

function SkillRow({ item, index }) {
  const [open, setOpen] = useState(false);
  const colors = IMPORTANCE_COLORS[item.importance];
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06 }}
      className="border border-red-100 rounded-xl overflow-hidden"
    >
      <div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-red-50/50 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-3">
          <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <span className="font-semibold text-warm-dark">{item.skill}</span>
          <span
            className="text-xs font-bold px-2.5 py-0.5 rounded-full border"
            style={{ color: colors.text, backgroundColor: colors.bg, borderColor: colors.border }}
          >
            {item.importance}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-warm-mid hidden sm:block">Course available</span>
          {open ? <ChevronUp className="w-4 h-4 text-warm-mid" /> : <ChevronDown className="w-4 h-4 text-warm-mid" />}
        </div>
      </div>
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="border-t border-red-100 bg-red-50/30 px-4 py-4"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-warm-brown font-medium mb-1">Recommended Course</p>
              <p className="text-warm-dark font-semibold">{item.course.title}</p>
              <p className="text-warm-mid text-sm mt-0.5">{item.course.provider} · {item.course.price}</p>
            </div>
            <a
              href={item.course.url}
              target="_blank"
              rel="noreferrer"
              className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              Enroll
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default function Dashboard() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const result = state?.result;
  const [uploadOpen, setUploadOpen] = useState(false);

  // Guard: if no result, send back home
  if (!result) {
    return (
      <div className="min-h-screen bg-warm-gradient flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-warm-xl p-10 max-w-md w-full text-center">
          <h2 className="font-display text-2xl font-bold text-warm-dark mb-4">No Analysis Found</h2>
          <p className="text-warm-brown mb-6">Please upload your resume to get started.</p>
          <button onClick={() => navigate('/home')} className="btn-primary">Go Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-gradient">
      <Navbar onUploadClick={() => navigate('/home')} />

      <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

        {/* ── Page header ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10"
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={() => navigate('/home')}
                className="flex items-center gap-1 text-warm-brown hover:text-orange-600 text-sm font-medium transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </button>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-warm-dark">
              Your Analysis Dashboard
            </h1>
            {state?.role && (
              <p className="text-warm-brown mt-1">
                Analyzed for: <span className="font-semibold text-orange-600">{state.role}</span>
                {state.companies?.length > 0 && ` · ${state.companies.join(', ')}`}
              </p>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/home')}
              className="btn-secondary text-sm flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Re-analyze
            </button>
            <button className="btn-primary text-sm flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export PDF
            </button>
          </div>
        </motion.div>

        {/* ── Top row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

          {/* Circular Score */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="card p-8 flex flex-col items-center justify-center"
          >
            <CircularScore score={result.score} size={220} />
          </motion.div>

          {/* Summary */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="card p-6 lg:col-span-2"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-orange-600" />
              </div>
              <h2 className="font-semibold text-warm-dark text-lg">Resume Overview</h2>
            </div>
            <p className="text-warm-brown leading-relaxed text-sm mb-5">{result.summary}</p>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Matched Skills', value: result.matchedSkills.length, color: '#16A34A', bg: '#F0FDF4' },
                { label: 'Skill Gaps', value: result.unmatchedSkills.length, color: '#DC2626', bg: '#FFF1F2' },
                { label: 'Readiness', value: `${result.score}%`, color: '#F97316', bg: '#FFF7ED' },
              ].map(s => (
                <div key={s.label} className="text-center p-3 rounded-xl" style={{ backgroundColor: s.bg }}>
                  <div className="font-display text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-xs text-warm-mid mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Skills Analysis ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

          {/* Matched Skills */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="card p-6"
          >
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              </div>
              <h2 className="font-semibold text-warm-dark text-lg">Matched Skills</h2>
              <span className="ml-auto bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full">
                {result.matchedSkills.length} skills
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {result.matchedSkills.map((skill, i) => (
                <motion.span
                  key={skill}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="badge-matched"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {skill}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Unmatched Skills */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="card p-6"
          >
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                <XCircle className="w-4 h-4 text-red-500" />
              </div>
              <h2 className="font-semibold text-warm-dark text-lg">Skill Gaps</h2>
              <span className="ml-auto bg-red-100 text-red-600 text-xs font-bold px-2.5 py-1 rounded-full">
                {result.unmatchedSkills.length} gaps
              </span>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {result.unmatchedSkills.map((item, i) => (
                <motion.span
                  key={item.skill}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="badge-unmatched"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  {item.skill}
                </motion.span>
              ))}
            </div>
            <p className="text-xs text-warm-mid">
              Click each skill below for course recommendations ↓
            </p>
          </motion.div>
        </div>

        {/* ── Detailed Skill Gaps with Courses ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="card p-6 mb-8"
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-amber-600" />
            </div>
            <h2 className="font-semibold text-warm-dark text-lg">Skill Gaps & Recommended Courses</h2>
            <div className="ml-auto flex items-center gap-1.5 text-xs text-warm-mid">
              <Info className="w-3.5 h-3.5" />
              Click each row to see course
            </div>
          </div>
          <div className="space-y-3">
            {result.unmatchedSkills.map((item, i) => (
              <SkillRow key={item.skill} item={item} index={i} />
            ))}
          </div>
        </motion.div>

        {/* ── Strengths + Improvements ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card p-6"
          >
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                <Star className="w-4 h-4 text-green-600" />
              </div>
              <h2 className="font-semibold text-warm-dark">Your Strengths</h2>
            </div>
            <div className="space-y-3">
              {result.topStrengths.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.08 }}
                  className="flex items-start gap-2.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-warm-brown text-sm">{s}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="card p-6"
          >
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
              </div>
              <h2 className="font-semibold text-warm-dark">Areas to Improve</h2>
            </div>
            <div className="space-y-3">
              {result.improvements.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.55 + i * 0.08 }}
                  className="flex items-start gap-2.5"
                >
                  <TrendingUp className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span className="text-warm-brown text-sm">{s}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Experience & Education ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="card p-6"
          >
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-blue-600" />
              </div>
              <h2 className="font-semibold text-warm-dark">Work Experience</h2>
            </div>
            <div className="space-y-4">
              {result.experience.map((exp, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-warm-dark text-sm">{exp.role}</p>
                    <p className="text-warm-brown text-sm">{exp.company}</p>
                    <p className="text-warm-mid text-xs mt-0.5">{exp.duration} · {exp.year}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
            className="card p-6"
          >
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-purple-600" />
              </div>
              <h2 className="font-semibold text-warm-dark">Education</h2>
            </div>
            {result.education.map((edu, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-warm-dark text-sm">{edu.degree}</p>
                  <p className="text-warm-brown text-sm">{edu.institution}</p>
                  <p className="text-warm-mid text-xs mt-0.5">{edu.score} · {edu.year}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="card p-8 text-center bg-orange-gradient"
        >
          <h2 className="font-display text-2xl font-bold text-white mb-3">
            Improve & Re-analyze
          </h2>
          <p className="text-white/80 mb-6">
            Work on your skill gaps, update your resume, and watch your readiness score climb!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/home')}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-orange-600 font-bold rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
            >
              <RefreshCw className="w-4 h-4" />
              Upload New Resume
            </button>
            <button className="flex items-center justify-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 text-white font-bold rounded-xl transition-all duration-300 hover:-translate-y-0.5">
              <Download className="w-4 h-4" />
              Download Report
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
