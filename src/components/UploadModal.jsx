import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import {
  X, Upload, FileText, Target, Building2,
  ChevronDown, AlertCircle, CheckCircle2, Loader2
} from 'lucide-react';

const FALLBACK_ROLES = [
  "Frontend Developer", "Backend Developer", "Full Stack Developer",
  "Data Scientist", "ML Engineer", "DevOps Engineer", "Cloud Architect",
  "Mobile Developer (iOS/Android)", "Product Manager", "UI/UX Designer",
  "QA Engineer", "Cybersecurity Engineer", "Blockchain Developer", "Game Developer",
];

const FALLBACK_COMPANIES = [
  "Google", "Amazon", "Microsoft", "Meta", "Apple", "Netflix",
  "Spotify", "Uber", "Airbnb", "Twitter (X)", "LinkedIn",
  "Salesforce", "Adobe", "Oracle", "IBM", "Intel", "Nvidia",
  "TCS", "Infosys", "Wipro", "Accenture",
];

const API_BASE = 'http://localhost:8000';

export default function UploadModal({ onClose }) {
  const [file, setFile] = useState(null);
  const [role, setRole] = useState('');
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [companySearch, setCompanySearch] = useState('');
  const [companyDropOpen, setCompanyDropOpen] = useState(false);
  const [roleDropOpen, setRoleDropOpen] = useState(false);
  const [error, setError] = useState('');

  const [roles, setRoles] = useState(FALLBACK_ROLES);
  const [companies, setCompanies] = useState(FALLBACK_COMPANIES);
  const [loadingData, setLoadingData] = useState(true);

  const navigate = useNavigate();

  // Fetch roles and companies from backend on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);
      try {
        const [rolesRes, companiesRes] = await Promise.all([
          fetch(`${API_BASE}/api/roles`),
          fetch(`${API_BASE}/api/companies`),
        ]);

        if (rolesRes.ok) {
          const rolesData = await rolesRes.json();
          if (rolesData.length > 0) {
            setRoles(rolesData.map(r => r.title));
          }
        }

        if (companiesRes.ok) {
          const companiesData = await companiesRes.json();
          if (companiesData.length > 0) {
            setCompanies(companiesData.map(c => c.name));
          }
        }
      } catch {
        // Backend may not be running — use fallback data silently
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, []);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      setError('Please upload a PDF file only.');
      return;
    }
    setFile(acceptedFiles[0]);
    setError('');
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  });

  const toggleCompany = (company) => {
    setSelectedCompanies(prev =>
      prev.includes(company) ? prev.filter(c => c !== company) : [...prev, company]
    );
  };

  const filteredCompanies = companies.filter(c =>
    c.toLowerCase().includes(companySearch.toLowerCase()) &&
    !selectedCompanies.includes(c)
  );

  const handleAnalyze = () => {
    if (!file) { setError('Please upload your resume first.'); return; }
    if (!role) { setError('Please select your targeted role.'); return; }
    setError('');
    onClose();
    // Pass the actual File object so LoadingScreen can POST it
    navigate('/loading', { state: { file, role, companies: selectedCompanies } });
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-warm-dark/40 backdrop-blur-sm" />

        {/* Modal Card */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 40 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-warm-xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative px-8 pt-8 pb-6 bg-hero-gradient border-b border-cream-200">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-display text-2xl font-bold text-warm-dark">
                  Analyze Your Resume
                </h2>
                <p className="text-warm-brown mt-1 text-sm">
                  Upload your resume and set your target to get personalized insights.
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-cream-200 transition-colors text-warm-brown"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {/* Step indicators */}
            <div className="flex items-center gap-2 mt-4">
              {['Upload Resume', 'Set Target', 'Analyze'].map((step, i) => (
                <div key={step} className="flex items-center gap-2">
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold
                    ${i === 0 && file ? 'bg-green-100 text-green-700' :
                      i === 1 && role ? 'bg-green-100 text-green-700' :
                      i === 0 ? 'bg-orange-100 text-orange-600' :
                      'bg-cream-200 text-warm-brown'}`}>
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold
                      ${(i === 0 && file) || (i === 1 && role) ? 'bg-green-500 text-white' :
                        i === 0 ? 'bg-orange-500 text-white' : 'bg-cream-400 text-white'}`}>
                      {(i === 0 && file) || (i === 1 && role) ? '✓' : i + 1}
                    </span>
                    {step}
                  </div>
                  {i < 2 && <div className="w-4 h-px bg-cream-300" />}
                </div>
              ))}
            </div>
          </div>

          {/* Body */}
          <div className="px-8 py-6 space-y-6 max-h-[65vh] overflow-y-auto">

            {/* Drag & Drop Zone */}
            <div>
              <label className="block text-sm font-semibold text-warm-dark mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4 text-orange-500" />
                Your Resume
              </label>
              <div
                {...getRootProps()}
                className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300
                  ${isDragActive
                    ? 'border-orange-500 bg-orange-50'
                    : file
                    ? 'border-green-400 bg-green-50'
                    : 'border-cream-300 bg-cream-50 hover:border-orange-400 hover:bg-orange-50/50'
                  }`}
              >
                <input {...getInputProps()} />
                <motion.div
                  animate={isDragActive ? { scale: 1.05 } : { scale: 1 }}
                  className="flex flex-col items-center gap-3"
                >
                  {file ? (
                    <>
                      <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center">
                        <CheckCircle2 className="w-7 h-7 text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-green-700">{file.name}</p>
                        <p className="text-green-600 text-sm mt-0.5">
                          {(file.size / 1024).toFixed(1)} KB · Click to change
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors
                        ${isDragActive ? 'bg-orange-100' : 'bg-cream-200'}`}>
                        <Upload className={`w-7 h-7 ${isDragActive ? 'text-orange-600' : 'text-warm-brown'}`} />
                      </div>
                      <div>
                        <p className="font-semibold text-warm-dark">
                          {isDragActive ? 'Drop your resume here!' : 'Drag & drop your resume'}
                        </p>
                        <p className="text-warm-mid text-sm mt-1">
                          or <span className="text-orange-600 font-semibold">browse files</span>
                        </p>
                        <p className="text-warm-mid/70 text-xs mt-2">PDF only · Max 10MB</p>
                      </div>
                    </>
                  )}
                </motion.div>
              </div>
            </div>

            {/* Target Role */}
            <div>
              <label className="block text-sm font-semibold text-warm-dark mb-2 flex items-center gap-2">
                <Target className="w-4 h-4 text-orange-500" />
                Targeted Role
              </label>
              <div className="relative">
                <button
                  onClick={() => setRoleDropOpen(!roleDropOpen)}
                  className="w-full input-field text-left flex items-center justify-between"
                >
                  {loadingData ? (
                    <span className="text-warm-mid/60 flex items-center gap-2">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Loading roles...
                    </span>
                  ) : (
                    <span className={role ? 'text-warm-dark' : 'text-warm-mid/60'}>
                      {role || 'Select your target role...'}
                    </span>
                  )}
                  <ChevronDown className={`w-4 h-4 text-warm-mid transition-transform ${roleDropOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {roleDropOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-warm-md border border-cream-200 py-2 z-10 max-h-48 overflow-y-auto"
                    >
                      {roles.map(r => (
                        <button
                          key={r}
                          onClick={() => { setRole(r); setRoleDropOpen(false); }}
                          className="w-full text-left px-4 py-2.5 text-sm text-warm-dark hover:bg-orange-50 hover:text-orange-700 transition-colors"
                        >
                          {r}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Target Companies */}
            <div>
              <label className="block text-sm font-semibold text-warm-dark mb-2 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-orange-500" />
                Targeted Companies
                <span className="text-warm-mid font-normal">(optional)</span>
              </label>

              {/* Selected chips */}
              {selectedCompanies.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedCompanies.map(c => (
                    <span
                      key={c}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium"
                    >
                      {c}
                      <button
                        onClick={() => toggleCompany(c)}
                        className="hover:text-orange-900 ml-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <div className="relative">
                <input
                  type="text"
                  value={companySearch}
                  onChange={e => { setCompanySearch(e.target.value); setCompanyDropOpen(true); }}
                  onFocus={() => setCompanyDropOpen(true)}
                  placeholder={loadingData ? 'Loading companies...' : 'Search and add companies...'}
                  className="input-field"
                  disabled={loadingData}
                />
                <AnimatePresence>
                  {companyDropOpen && filteredCompanies.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-warm-md border border-cream-200 py-2 z-10 max-h-36 overflow-y-auto"
                    >
                      {filteredCompanies.map(c => (
                        <button
                          key={c}
                          onClick={() => { toggleCompany(c); setCompanySearch(''); }}
                          className="w-full text-left px-4 py-2 text-sm text-warm-dark hover:bg-orange-50 hover:text-orange-700 transition-colors"
                        >
                          {c}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 p-3 bg-red-50 rounded-xl border border-red-200 text-red-700 text-sm"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="px-8 py-5 bg-cream-50 border-t border-cream-200 flex items-center justify-between gap-4">
            <button onClick={onClose} className="btn-secondary text-sm">
              Cancel
            </button>
            <button
              onClick={handleAnalyze}
              className="btn-primary text-sm flex items-center gap-2 flex-1 justify-center"
            >
              <FileText className="w-4 h-4" />
              Analyze My Resume
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
