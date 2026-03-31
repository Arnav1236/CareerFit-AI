import { useState, useRef, useCallback } from 'react';
import { 
  Upload, FileText, Building, X, Loader2, CheckCircle2, 
  XCircle, ChevronRight, BookOpen, Target, Briefcase, Zap, 
  ExternalLink, MessageSquare, ArrowLeft 
} from 'lucide-react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer 
} from 'recharts';

// --- MOCK DATA FALLBACK (Used if FastAPI is offline) ---
const mockAiResponse = {
  candidateName: "Student",
  targetRole: "Software Engineer",
  targetCompany: "Google",
  matchScore: 78,
  matchedSkills: ["React.js", "Python", "HTML/CSS", "Git"],
  missingSkills: ["System Design", "Docker", "AWS", "GraphQL"],
  chartData: [
    { subject: 'Frontend', A: 90, fullMark: 100 },
    { subject: 'Backend', A: 40, fullMark: 100 },
    { subject: 'Architecture', A: 50, fullMark: 100 },
    { subject: 'DevOps', A: 20, fullMark: 100 },
    { subject: 'Problem Solving', A: 85, fullMark: 100 },
  ],
  roadmap: [
    { week: "Week 1", focus: "Docker & Containerization", resource: "Official Docs", link: "https://docs.docker.com/", type: "Documentation" },
    { week: "Week 2", focus: "Cloud Basics (AWS EC2/S3)", resource: "AWS Skill Builder", link: "https://explore.skillbuilder.aws/", type: "Course" },
    { week: "Week 3", focus: "System Design Principles", resource: "ByteByteGo", link: "https://bytebytego.com/", type: "Practice" }
  ],
  interviewQuestions: [
    "How would you containerize a Python FastAPI backend and a React frontend?",
    "Explain the difference between vertical and horizontal scaling.",
    "Design a URL shortening service like Bitly. What database would you choose and why?"
  ]
};

export default function App() {
  // --- STATE MANAGEMENT ---
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [company, setCompany] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiData, setAiData] = useState(null); // Holds the final result
  const fileInputRef = useRef(null);

  // --- DRAG & DROP HANDLERS ---
  const handleDragOver = useCallback((e) => { e.preventDefault(); setIsDragging(true); }, []);
  const handleDragLeave = useCallback((e) => { e.preventDefault(); setIsDragging(false); }, []);
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile);
    } else {
      alert("Please upload a PDF file only.");
    }
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) setFile(selectedFile);
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // --- API CONNECTION TO FASTAPI ---
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please upload a resume first!");
    
    setIsAnalyzing(true); // Start Loading Screen

    // Package data for backend
    const formData = new FormData();
    formData.append("resume_pdf", file);
    formData.append("job_description", jobDescription);
    formData.append("target_companies", company);

    try {
      // Send to FastAPI (Ensure your backend is running on port 8000)
      const response = await fetch("http://127.0.0.1:8000/analyze-resume-pdf", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Backend returned an error.");

      // Receive real data and update UI
      const resultData = await response.json();
      // FIX 1: Check if Python reported a success
      if (resultData.success && resultData.analysis) {
        // FIX 2: Unwrap the data from the "analysis" key!
        setAiData(resultData.analysis);
      } else if (resultData.error) {
        // If Gemini messed up the JSON, show the error instead of crashing
        alert("AI Error: " + resultData.error + "\n\nRaw Response: " + resultData.raw_response);
        setIsAnalyzing(false);
      } else {
        throw new Error("Unexpected data format from backend");
      }
      
    } catch (error) {
      console.error("API Error:", error);
      alert("Could not connect to FastAPI. Loading Mock Data for demonstration.");
      // FALLBACK: Load mock data so the UI doesn't break during a presentation
      setTimeout(() => setAiData(mockAiResponse), 1500); 
    } finally {
      setIsAnalyzing(false); // Stop Loading Screen
    }
  };

  // ==========================================
  // VIEW 1: THE RESULTS DASHBOARD
  // ==========================================
  if (aiData) {
    return (
      <div className="min-h-screen w-full bg-[#0B0F19] text-slate-300 font-sans p-4 sm:p-8">
        <header className="max-w-7xl mx-auto mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <button 
              onClick={() => setAiData(null)}
              className="flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Analyze Another Resume
            </button>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Zap className="text-blue-500 fill-blue-500 w-8 h-8" /> CareerFit Analysis
            </h1>
            <p className="text-slate-400 mt-1 flex items-center gap-2">
              <Briefcase className="w-4 h-4" /> {aiData.targetRole || "Role Not Specified"} <span className="text-slate-600">|</span> 
              <Target className="w-4 h-4" /> Target: <span className="text-white font-medium">{aiData.targetCompany || "Auto-Ranked"}</span>
            </p>
          </div>
          <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold transition-all shadow-[0_0_20px_rgba(37,99,235,0.2)]">
            Export PDF Report
          </button>
        </header>

        <main className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-500">
          
          {/* Match Score Card */}
          <div className="bg-[#111827] rounded-3xl p-8 border border-slate-800 shadow-xl flex flex-col items-center relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
            <h2 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-6 z-10">Match Score</h2>
            <div className="relative flex items-center justify-center z-10">
              <svg className="w-40 h-40 transform -rotate-90">
                <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-800" />
                <circle 
                  cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" 
                  strokeDasharray="440" 
                  strokeDashoffset={440 - (440 * aiData.matchScore) / 100}
                  strokeLinecap="round"
                  className={`${aiData.matchScore > 75 ? 'text-emerald-500' : 'text-blue-500'} transition-all duration-1000 ease-out`} 
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-5xl font-black text-white">{aiData.matchScore}%</span>
              </div>
            </div>
          </div>

          {/* Radar Chart */}
          <div className="bg-[#111827] rounded-3xl p-6 border border-slate-800">
            <h2 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-4">Skill Analysis</h2>
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={aiData.chartData}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <Radar name="Skills" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Missing Skills */}
          <div className="bg-[#111827] rounded-3xl p-6 border border-slate-800 flex flex-col gap-6">
            <div>
              <h2 className="text-emerald-400 text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Verified Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {aiData.matchedSkills.map((skill, i) => (
                  <span key={i} className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-xs font-medium">{skill}</span>
                ))}
              </div>
            </div>
            <div className="w-full h-px bg-slate-800"></div>
            <div>
              <h2 className="text-rose-400 text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
                <XCircle className="w-4 h-4" /> Missing Requirements
              </h2>
              <div className="flex flex-wrap gap-2">
                {aiData.missingSkills.map((skill, i) => (
                  <span key={i} className="px-3 py-1 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-full text-xs font-medium">{skill}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Roadmap */}
          <div className="md:col-span-2 bg-[#111827] rounded-3xl p-8 border border-slate-800">
            <h2 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-6 flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> Personalized Study Roadmap
            </h2>
            <div className="space-y-4">
              {aiData.roadmap.map((step, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-slate-800/40 border border-slate-700/50 gap-4 group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 shrink-0 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-sm border border-blue-500/20">W{i+1}</div>
                    <div>
                      <h3 className="text-white font-medium">{step.focus}</h3>
                      <p className="text-sm text-slate-400">{step.type} • {step.resource}</p>
                    </div>
                  </div>
                  <a href={step.link} target="_blank" rel="noreferrer" className="shrink-0 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-medium transition-all group-hover:-translate-y-0.5">
                    Start Learning <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Interview Prep */}
          <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 rounded-3xl p-8 border border-indigo-500/20">
            <h2 className="text-indigo-300 text-sm font-bold uppercase tracking-wider mb-6 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" /> AI Interview Prep
            </h2>
            <div className="space-y-4">
              {aiData.interviewQuestions.map((q, i) => (
                <div key={i} className="p-4 rounded-2xl bg-black/20 border border-white/5">
                  <p className="text-sm text-indigo-100 leading-relaxed"><span className="text-indigo-400 font-bold mr-2">Q{i+1}.</span>{q}</p>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: THE UPLOAD SCREEN (DARK MODE)
  // ==========================================
  return (
    <div className="min-h-screen w-full bg-[#0B0F19] text-slate-200 font-sans relative overflow-hidden flex flex-col items-center justify-center py-12 px-4 sm:px-6">
      
      {/* Dark Mode Branding */}
      <div className="text-center mb-10 z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
          <Zap className="h-4 w-4 text-blue-400" />
          <span className="text-sm text-blue-400 font-medium">AI Career Intelligence</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-white">CareerFit AI</h1>
        <p className="text-slate-400 max-w-lg mx-auto">Upload your resume and target role to instantly generate a personalized learning roadmap.</p>
      </div>

      <div className="w-full max-w-2xl bg-[#111827] rounded-[2rem] p-8 sm:p-12 shadow-2xl border border-slate-800 z-10">
        <form onSubmit={handleUpload} className="space-y-8">

          {/* 1. Upload Resume */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">Upload Resume (PDF)</label>
            {!file ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative flex flex-col items-center justify-center w-full py-10 px-4 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300 ${
                  isDragging ? "border-blue-500 bg-blue-500/10" : "border-slate-700 hover:border-slate-500 hover:bg-slate-800/50 bg-slate-900/50"
                }`}
              >
                <Upload className="w-8 h-8 mb-3 text-slate-500" />
                <p className="text-sm text-slate-300 font-medium mb-1">{isDragging ? 'Drop file here' : 'Click or drag PDF'}</p>
                <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-800/50 border border-slate-700">
                <div className="flex items-center gap-4 overflow-hidden">
                  <div className="p-2.5 bg-slate-900 rounded-xl text-blue-400"><FileText className="w-5 h-5" /></div>
                  <div className="truncate">
                    <p className="text-sm font-medium text-white truncate">{file.name}</p>
                    <p className="text-xs text-slate-400">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <button type="button" onClick={removeFile} className="p-2 rounded-full text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"><X className="w-4 h-4" /></button>
              </div>
            )}
          </div>

          {/* 2. Job Description */}
          <div>
            <label className="flex items-center justify-between text-sm font-medium text-slate-300 mb-3">
              <span>Job Description</span> <span className="text-slate-500 font-normal">Optional</span>
            </label>
            <textarea
              rows="4"
              placeholder="Paste the target role responsibilities..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl bg-slate-900/50 border border-slate-700 focus:bg-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm text-white placeholder:text-slate-600 resize-y transition-all"
            />
          </div>

          {/* 3. Target Company */}
          <div>
            <label className="flex items-center justify-between text-sm font-medium text-slate-300 mb-3">
              <span>Target Company</span> <span className="text-slate-500 font-normal">Optional</span>
            </label>
            <div className="relative">
              <Building className="absolute inset-y-0 left-4 my-auto h-4 w-4 text-slate-500 pointer-events-none" />
              <input
                type="text"
                placeholder="e.g. Google, TCS (Leave blank for Auto-Rank)"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full pl-11 pr-5 py-4 rounded-2xl bg-slate-900/50 border border-slate-700 focus:bg-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm text-white placeholder:text-slate-600 transition-all"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={!file || isAnalyzing}
              className={`w-full flex items-center justify-center gap-2 py-4 px-4 rounded-xl text-sm font-bold transition-all duration-300 ${
                !file 
                  ? "bg-slate-800 text-slate-500 cursor-not-allowed" 
                  : "bg-blue-600 text-white hover:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.3)]"
              }`}
            >
              {isAnalyzing ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Processing AI Analysis...</>
              ) : (
                'Generate Learning Roadmap'
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

