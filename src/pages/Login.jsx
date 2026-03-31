import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Eye, EyeOff, Mail, Lock, FileText, ArrowRight, Sparkles
} from 'lucide-react';

function SocialButton({ icon, label, onClick }) {
  return (
    <button onClick={onClick} className="social-btn">
      <span className="text-xl">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    setError('');
    // Simulate API call
    await new Promise(r => setTimeout(r, 1200));
    localStorage.setItem('resumeUser', JSON.stringify({ name: email.split('@')[0], email }));
    setLoading(false);
    navigate('/home');
  };

  const handleSocialLogin = (provider) => {
    localStorage.setItem('resumeUser', JSON.stringify({ name: provider + ' User', email: `${provider.toLowerCase()}@user.com` }));
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-warm-gradient flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 dot-pattern opacity-20" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-200/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="relative z-10 w-full max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 bg-white/90 backdrop-blur-md rounded-3xl shadow-warm-xl overflow-hidden border border-cream-200">

          {/* Left panel - Branding */}
          <div className="relative hidden md:flex flex-col justify-between p-10 bg-orange-gradient overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/3 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/3 -translate-x-1/3" />

            {/* Logo */}
            <div className="flex items-center gap-2.5 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-white/90 flex items-center justify-center shadow-md">
                <FileText className="w-5 h-5 text-orange-600" />
              </div>
              <span className="font-display text-2xl font-bold text-white">SkillGap</span>
            </div>

            {/* Features */}
            <div className="relative z-10 space-y-4">
              {[
                '🎯 AI-powered skill gap analysis',
                '📊 Real-time readiness scoring',
                '📚 Curated course recommendations',
                '🏢 100+ company job insights',
              ].map((feat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-3 text-white/90 font-medium"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-base">
                    {feat[0]}
                  </div>
                  <span className="text-sm">{feat.slice(2)}</span>
                </motion.div>
              ))}
            </div>

            {/* Tagline */}
            <div className="relative z-10">
              <p className="text-white/80 text-sm">
                Join <span className="font-bold text-white">50,000+</span> job seekers who landed their dream jobs.
              </p>
            </div>
          </div>

          {/* Right panel - Login form */}
          <div className="p-8 md:p-10">
            {/* Mobile logo */}
            <div className="flex items-center gap-2 mb-8 md:hidden">
              <div className="w-9 h-9 rounded-xl bg-orange-gradient flex items-center justify-center shadow-warm-sm">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl text-warm-dark">
                Skill<span className="text-gradient">Gap</span>
              </span>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-orange-500" />
                <span className="text-orange-600 font-semibold text-sm">Welcome back!</span>
              </div>
              <h1 className="font-display text-3xl font-bold text-warm-dark mb-1">Sign In</h1>
              <p className="text-warm-brown text-sm mb-8">
                Don't have an account?{' '}
                <Link to="/register" className="text-orange-600 font-semibold hover:text-orange-800 transition-colors">
                  Create one free
                </Link>
              </p>

              {/* Social logins */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <SocialButton icon="🔵" label="Google" onClick={() => handleSocialLogin('Google')} />
                <SocialButton icon="🟦" label="Microsoft" onClick={() => handleSocialLogin('Microsoft')} />
                <SocialButton icon="🔷" label="Facebook" onClick={() => handleSocialLogin('Facebook')} />
                <SocialButton icon="⬛" label="Apple" onClick={() => handleSocialLogin('Apple')} />
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 h-px bg-cream-200" />
                <span className="text-warm-mid text-sm font-medium">or sign in with email</span>
                <div className="flex-1 h-px bg-cream-200" />
              </div>

              {/* Email/Password form */}
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-mid" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Email address"
                    className="input-field pl-11"
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-mid" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Password"
                    className="input-field pl-11 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-warm-mid hover:text-warm-dark transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="accent-orange-500 w-4 h-4" />
                    <span className="text-warm-brown">Remember me</span>
                  </label>
                  <button type="button" className="text-orange-600 hover:text-orange-800 font-medium transition-colors">
                    Forgot password?
                  </button>
                </div>

                {error && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-600 text-sm bg-red-50 px-4 py-3 rounded-xl border border-red-200"
                  >
                    ⚠️ {error}
                  </motion.p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full flex items-center justify-center gap-2 py-3.5"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
