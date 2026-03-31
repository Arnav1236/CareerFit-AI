import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Upload, Play, ArrowRight, Star, ChevronLeft, ChevronRight,
  Zap, Target, BookOpen, Building2, MessageSquare, Sparkles,
  TrendingUp, Users, BarChart3, Award
} from 'lucide-react';

import Navbar from '../components/Navbar';
import UploadModal from '../components/UploadModal';
import HowItWorksModal from '../components/HowItWorksModal';
import CompanyCard from '../components/CompanyCard';
import CourseCard from '../components/CourseCard';
import InterviewCard from '../components/InterviewCard';
import { companies } from '../data/companies';
import { courses } from '../data/courses';
import { interviewQuestions, tips } from '../data/interviewQuestions';

const STATS = [
  { icon: Users, value: '50K+', label: 'Job Seekers Helped', color: '#F97316' },
  { icon: Building2, value: '100+', label: 'Companies Covered', color: '#8B5CF6' },
  { icon: BarChart3, value: '95%', label: 'Accuracy Rate', color: '#16A34A' },
  { icon: Award, value: '2.8x', label: 'Higher Offer Rate', color: '#0891B2' },
];

export default function Home() {
  const [uploadOpen, setUploadOpen] = useState(false);
  const [howOpen, setHowOpen] = useState(false);
  const [tipsIndex, setTipsIndex] = useState(0);
  const [activeCompanies, setActiveCompanies] = useState(4);
  const navigate = useNavigate();

  // Auto-scroll tips
  useEffect(() => {
    const timer = setInterval(() => {
      setTipsIndex(prev => (prev + 1) % tips.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Guard: check login
  const user = JSON.parse(localStorage.getItem('resumeUser') || 'null');
  if (!user) { navigate('/login'); return null; }

  return (
    <div className="min-h-screen bg-warm-gradient">
      <Navbar onUploadClick={() => setUploadOpen(true)} />

      {/* ===== HERO SECTION ===== */}
      <section id="home" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 dot-pattern opacity-20" />
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-orange-200/25 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-200/25 rounded-full blur-3xl" />

        {/* Floating elements */}
        {['React', 'Python', 'AWS', 'SQL', 'Docker', 'TypeScript'].map((tech, i) => (
          <motion.div
            key={tech}
            className="absolute hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-full shadow-warm-sm border border-cream-200 text-warm-brown text-xs font-semibold"
            style={{
              top: `${20 + (i % 3) * 25}%`,
              left: i < 3 ? `${5 + i * 5}%` : undefined,
              right: i >= 3 ? `${5 + (i - 3) * 5}%` : undefined,
            }}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
          >
            <div className="w-2 h-2 rounded-full bg-orange-400" />
            {tech}
          </motion.div>
        ))}

        <div className="relative z-10 text-center max-w-5xl mx-auto px-4">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 border border-orange-200 text-orange-700 font-semibold text-sm mb-6"
          >
            <Sparkles className="w-4 h-4" />
            AI-Powered Resume Analysis
            <Sparkles className="w-4 h-4" />
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-5xl md:text-7xl font-bold text-warm-dark leading-tight mb-6"
          >
            Close Your
            <br />
            <span className="text-gradient">Skill Gap</span>
            <br />
            Land Your Dream Job
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-warm-brown text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10"
          >
            Upload your resume, set your target role, and get an instant AI-powered analysis
            showing exactly which skills you need to land your dream job.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <button
              id="upload-resume-btn"
              onClick={() => setUploadOpen(true)}
              className="group relative flex items-center gap-3 px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg rounded-2xl shadow-warm-lg hover:shadow-warm-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/10 translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
              <Upload className="w-5 h-5 relative z-10" />
              <span className="relative z-10">Upload Your Resume</span>
              <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              id="how-it-works-btn"
              onClick={() => setHowOpen(true)}
              className="flex items-center gap-3 px-8 py-4 bg-white/80 backdrop-blur-sm text-warm-dark font-bold text-lg rounded-2xl shadow-card border border-cream-200 hover:shadow-card-hover hover:border-orange-300 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                <Play className="w-4 h-4 text-orange-600 ml-0.5" />
              </div>
              How It Works
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
          >
            {STATS.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="glass-card p-5 hover:shadow-warm-md transition-all duration-300 hover:-translate-y-1"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 mx-auto"
                    style={{ backgroundColor: stat.color + '15' }}
                  >
                    <Icon className="w-5 h-5" style={{ color: stat.color }} />
                  </div>
                  <div className="font-display text-2xl font-bold text-warm-dark text-center">{stat.value}</div>
                  <div className="text-warm-mid text-xs text-center mt-0.5">{stat.label}</div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ===== SKILLS TIPS TICKER ===== */}
      <section className="py-8 bg-orange-500 overflow-hidden relative">
        <div className="flex items-center gap-4 px-8">
          <span className="text-white font-bold text-sm whitespace-nowrap flex items-center gap-2 flex-shrink-0">
            <Zap className="w-4 h-4" /> Resume Tips
          </span>
          <div className="relative overflow-hidden flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={tipsIndex}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                className="flex items-center gap-3"
              >
                <span className="text-xl">{tips[tipsIndex].icon}</span>
                <span className="text-white font-semibold text-sm">{tips[tipsIndex].title}:</span>
                <span className="text-white/90 text-sm">{tips[tipsIndex].tip}</span>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="flex gap-1 flex-shrink-0">
            <button onClick={() => setTipsIndex(p => (p - 1 + tips.length) % tips.length)}
              className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center">
              <ChevronLeft className="w-4 h-4 text-white" />
            </button>
            <button onClick={() => setTipsIndex(p => (p + 1) % tips.length)}
              className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center">
              <ChevronRight className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </section>

      {/* ===== COMPANIES SECTION ===== */}
      <section id="companies" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 text-orange-700 text-sm font-semibold mb-4">
              <Building2 className="w-4 h-4" />
              Top Companies
            </div>
            <h2 className="section-title mb-4">Companies We Prepare You For</h2>
            <p className="text-warm-brown max-w-2xl mx-auto">
              Get detailed insights into hiring expectations, tech stacks, salary ranges, and open roles at top tech companies worldwide.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {companies.slice(0, activeCompanies).map((c, i) => (
              <CompanyCard key={c.id} company={c} index={i} />
            ))}
          </div>

          {activeCompanies < companies.length && (
            <div className="text-center mt-8">
              <button
                onClick={() => setActiveCompanies(companies.length)}
                className="btn-secondary"
              >
                Show All Companies ({companies.length - 4} more)
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ===== INTERVIEW QUESTIONS ===== */}
      <section id="interview" className="py-20 px-4 bg-cream-100/60">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100 text-purple-700 text-sm font-semibold mb-4">
              <MessageSquare className="w-4 h-4" />
              Interview Prep
            </div>
            <h2 className="section-title mb-4">Ace Your Next Interview</h2>
            <p className="text-warm-brown max-w-2xl mx-auto">
              Curated Q&A across DSA, System Design, behavioral, and tech-specific rounds — with answers!
            </p>
          </motion.div>

          <div className="space-y-4">
            {interviewQuestions.map((cat, i) => (
              <InterviewCard key={cat.id} category={cat} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== COURSES SECTION ===== */}
      <section id="courses" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-4">
              <BookOpen className="w-4 h-4" />
              Top Courses
            </div>
            <h2 className="section-title mb-4">Level Up Your Skills</h2>
            <p className="text-warm-brown max-w-2xl mx-auto">
              Hand-picked courses from top platforms to fill the most common skill gaps in today's job market.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {courses.map((c, i) => (
              <CourseCard key={c.id} course={c} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== TIPS SECTION ===== */}
      <section className="py-20 px-4 bg-hero-gradient">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-700 text-sm font-semibold mb-4">
              <Star className="w-4 h-4" />
              Insider Tips
            </div>
            <h2 className="section-title mb-4">Resume Pro Tips</h2>
            <p className="text-warm-brown max-w-2xl mx-auto">
              Follow these proven strategies to make your resume stand out and get past ATS filters.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {tips.map((tip, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="card p-5 text-center"
              >
                <div className="text-3xl mb-3">{tip.icon}</div>
                <h3 className="font-semibold text-warm-dark mb-2">{tip.title}</h3>
                <p className="text-warm-brown text-sm leading-relaxed">{tip.tip}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="py-20 px-4 bg-orange-gradient relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
        </div>
        <div className="relative z-10 text-center max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
              Ready to Close Your Skill Gap?
            </h2>
            <p className="text-white/80 text-lg mb-8">
              Upload your resume now and get your free analysis in under 10 seconds.
            </p>
            <button
              onClick={() => setUploadOpen(true)}
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-orange-600 font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              <Upload className="w-5 h-5" />
              Analyze My Resume — It's Free
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="py-10 px-4 bg-warm-dark text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl bg-orange-gradient flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <span className="font-display text-lg font-bold text-white">SkillGap Analyzer</span>
        </div>
        <p className="text-white/50 text-sm">
          © 2025 SkillGap Analyzer. Helping job seekers land their dream jobs.
        </p>
      </footer>

      {/* Modals */}
      <AnimatePresence>
        {uploadOpen && <UploadModal onClose={() => setUploadOpen(false)} />}
        {howOpen && <HowItWorksModal onClose={() => setHowOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}
