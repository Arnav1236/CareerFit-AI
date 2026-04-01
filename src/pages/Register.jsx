import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, FileText, ArrowRight, CheckCircle } from 'lucide-react';

function SocialButton({ icon, label, onClick }) {
  return (
    <button onClick={onClick} className="social-btn">
      <span className="text-xl">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

const PERKS = [
  'Free resume analysis',
  'Skill gap identification',
  'Course recommendations',
  'Company insights & interview prep',
  'Unlimited re-analyses',
];

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) { setError('Please fill in all fields.'); return; }
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    if (!agreed) { setError('Please accept the terms to continue.'); return; }
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 1200));
    localStorage.setItem('resumeUser', JSON.stringify({ name: form.name, email: form.email }));
    setLoading(false);
    navigate('/home');
  };

  const handleSocialSignup = (provider) => {
    localStorage.setItem('resumeUser', JSON.stringify({ name: provider + ' User', email: `${provider.toLowerCase()}@user.com` }));
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-warm-gradient flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 dot-pattern opacity-20" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-amber-200/30 rounded-full blur-3xl translate-y-1/2 translate-x-1/2" />

      <div className="relative z-10 w-full max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 bg-white/90 backdrop-blur-md rounded-3xl shadow-warm-xl overflow-hidden border border-cream-200">

          {/* Form panel */}
          <div className="p-8 md:p-10 order-2 md:order-1">
            {/* Mobile logo */}
            <div className="flex items-center gap-2 mb-6 md:hidden">
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
              <h1 className="font-display text-3xl font-bold text-warm-dark mb-1">Create Account</h1>
              <p className="text-warm-brown text-sm mb-6">
                Already have one?{' '}
                <Link to="/login" className="text-orange-600 font-semibold hover:text-orange-800 transition-colors">
                  Sign in
                </Link>
              </p>

              {/* Social signups */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <SocialButton icon="🔵" label="Google" onClick={() => handleSocialSignup('Google')} />
                <SocialButton icon="🟦" label="Microsoft" onClick={() => handleSocialSignup('Microsoft')} />
                <SocialButton icon="🔷" label="Facebook" onClick={() => handleSocialSignup('Facebook')} />
                <SocialButton icon="⬛" label="Apple" onClick={() => handleSocialSignup('Apple')} />
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 h-px bg-cream-200" />
                <span className="text-warm-mid text-xs font-medium">or register with email</span>
                <div className="flex-1 h-px bg-cream-200" />
              </div>

              <form onSubmit={handleRegister} className="space-y-3">
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-mid" />
                  <input
                    type="text"
                    value={form.name}
                    onChange={handleChange('name')}
                    placeholder="Full name"
                    className="input-field pl-11"
                  />
                </div>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-mid" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={handleChange('email')}
                    placeholder="Email address"
                    className="input-field pl-11"
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-mid" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={form.password}
                    onChange={handleChange('password')}
                    placeholder="Create password"
                    className="input-field pl-11 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-warm-mid hover:text-warm-dark"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-mid" />
                  <input
                    type="password"
                    value={form.confirm}
                    onChange={handleChange('confirm')}
                    placeholder="Confirm password"
                    className="input-field pl-11"
                  />
                </div>

                {/* Password strength */}
                {form.password && (
                  <div className="space-y-1">
                    <div className="flex gap-1">
                      {[1,2,3,4].map(i => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                            form.password.length >= i * 3
                              ? form.password.length < 6 ? 'bg-red-400'
                              : form.password.length < 9 ? 'bg-amber-400'
                              : 'bg-green-400'
                              : 'bg-cream-200'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-warm-mid">
                      {form.password.length < 6 ? '⚠️ Too short' : form.password.length < 9 ? '🔶 Moderate' : '✅ Strong password'}
                    </p>
                  </div>
                )}

                <label className="flex items-start gap-2.5 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={e => setAgreed(e.target.checked)}
                    className="accent-orange-500 w-4 h-4 mt-0.5"
                  />
                  <span className="text-sm text-warm-brown leading-snug">
                    I agree to the{' '}
                    <span className="text-orange-600 font-semibold cursor-pointer hover:text-orange-800">Terms of Service</span>
                    {' '}and{' '}
                    <span className="text-orange-600 font-semibold cursor-pointer hover:text-orange-800">Privacy Policy</span>
                  </span>
                </label>

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
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>

          {/* Right branding panel */}
          <div className="relative hidden md:flex flex-col justify-between p-10 bg-orange-gradient overflow-hidden order-1 md:order-2">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/3 -translate-x-1/3" />
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/3 translate-x-1/3" />

            <div className="flex items-center gap-2.5 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-white/90 flex items-center justify-center shadow-md">
                <FileText className="w-5 h-5 text-orange-600" />
              </div>
              <span className="font-display text-2xl font-bold text-white">SkillGap</span>
            </div>

            <div className="relative z-10 space-y-5">
              <div>
                <h2 className="font-display text-2xl font-bold text-white mb-2">
                  Everything you get
                </h2>
                <p className="text-white/80 text-sm">Join free and start analyzing today</p>
              </div>
              {PERKS.map((perk, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white/90 text-sm font-medium">{perk}</span>
                </motion.div>
              ))}
            </div>

            <div className="relative z-10">
              <div className="bg-white/20 rounded-2xl p-4">
                <p className="text-white/90 text-sm font-medium italic">
                  "SkillGap helped me identify the exact skills I was missing. Got hired at Google in 3 months!"
                </p>
                <p className="text-white/70 text-xs mt-2">— Priya S., Software Engineer at Google</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
