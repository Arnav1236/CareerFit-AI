import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Menu, X, ChevronRight, LogOut, User } from 'lucide-react';

const navLinks = [
  { label: 'Home', href: '/#home' },
  { label: 'Companies', href: '/#companies' },
  { label: 'Interview Prep', href: '/#interview' },
  { label: 'Courses', href: '/#courses' },
];

export default function Navbar({ onUploadClick }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('resumeUser') || 'null');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('resumeUser');
    navigate('/login');
  };

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMenuOpen(false);
    if (href.startsWith('/#')) {
      const id = href.slice(2);
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-md shadow-warm-sm border-b border-cream-200'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/home" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-orange-gradient flex items-center justify-center shadow-warm-sm group-hover:shadow-warm-md transition-all duration-200 group-hover:scale-105">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-warm-dark">
              Skill<span className="text-gradient">Gap</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="btn-ghost text-sm"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <button
                  onClick={onUploadClick}
                  className="btn-primary text-sm flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Analyze Resume
                </button>
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-cream-100 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-orange-gradient flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {user.name?.[0]?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <span className="text-warm-brown font-medium text-sm">{user.name}</span>
                  </button>
                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-warm-md border border-cream-200 py-2"
                      >
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-ghost text-sm">Log In</Link>
                <Link to="/register" className="btn-primary text-sm">Get Started</Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-cream-100 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/95 backdrop-blur-md border-t border-cream-200"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map(link => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="flex items-center justify-between py-3 px-3 rounded-xl hover:bg-cream-100 text-warm-dark font-medium transition-colors"
                >
                  {link.label}
                  <ChevronRight className="w-4 h-4 text-warm-mid" />
                </a>
              ))}
              <div className="pt-3 border-t border-cream-200 space-y-2">
                {user ? (
                  <button onClick={handleLogout} className="btn-secondary w-full text-sm">
                    Sign Out
                  </button>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-secondary w-full text-sm block text-center">
                      Log In
                    </Link>
                    <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-primary w-full text-sm block text-center">
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
