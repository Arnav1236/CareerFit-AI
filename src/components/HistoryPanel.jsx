import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Target, Building2, Trash2, AlertCircle, Loader2 } from 'lucide-react';
import CircularScore from './CircularScore';

const API_BASE = 'http://localhost:8000';

export default function HistoryPanel({ isOpen, onClose, onSelect }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchHistory();
    }
  }, [isOpen]);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/history`);
      if (!res.ok) throw new Error('Failed to fetch history');
      const data = await res.json();
      setHistory(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      const res = await fetch(`${API_BASE}/api/history/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setHistory((prev) => prev.filter((item) => item.id !== id));
      } else {
        throw new Error('Failed to delete');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelect = (item) => {
    try {
      const parsedData = JSON.parse(item.result_json);
      // Wait a tiny bit for the panel animation, then select
      onSelect(parsedData, item.target_role, item.companies.split(', '));
      onClose();
    } catch (e) {
      console.error("Error parsing history result JSON", e);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-warm-dark/40 backdrop-blur-sm z-50 no-print"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white shadow-warm-xl z-50 flex flex-col no-print border-l border-cream-200"
            style={{ zIndex: 100 }}
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-cream-200 flex items-center justify-between bg-cream-50">
              <div className="flex items-center gap-2 text-warm-dark">
                <Clock className="w-5 h-5 text-orange-600" />
                <h2 className="font-display font-bold text-xl">Past Analyses</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 -mr-2 text-warm-mid hover:text-warm-dark hover:bg-cream-200 rounded-lg transition-colors"
                title="Close panel"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {loading ? (
                <div className="py-12 flex flex-col items-center justify-center text-warm-mid">
                  <Loader2 className="w-8 h-8 animate-spin mb-3 text-orange-500" />
                  <p>Loading history...</p>
                </div>
              ) : error ? (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl flex items-start gap-3 border border-red-100">
                  <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">{error}</p>
                </div>
              ) : history.length === 0 ? (
                <div className="py-12 text-center text-warm-brown">
                  <div className="w-16 h-16 bg-cream-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-warm-mid" />
                  </div>
                  <p>No past analyses found.</p>
                </div>
              ) : (
                history.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative group bg-white border border-cream-200 rounded-xl p-4 hover:border-orange-300 hover:shadow-warm-md transition-all cursor-pointer overflow-hidden"
                    onClick={() => handleSelect(item)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1 min-w-0 pr-8">
                        <div className="flex items-center gap-1.5 text-sm font-semibold text-warm-dark truncate">
                          <Target className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
                          <span className="truncate" title={item.target_role}>{item.target_role}</span>
                        </div>
                        {item.companies && (
                          <div className="flex items-center gap-1.5 text-xs text-warm-mid mt-1 truncate">
                            <Building2 className="w-3 h-3 flex-shrink-0 text-warm-mid" />
                            <span className="truncate" title={item.companies}>{item.companies}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Score Badge */}
                      <div className={`flex items-center justify-center w-9 h-9 rounded-full flex-shrink-0 font-bold text-sm
                        ${item.score >= 75 ? 'bg-green-100 text-green-700' :
                          item.score >= 50 ? 'bg-orange-100 text-orange-700' :
                          item.score >= 30 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'}`}
                      >
                       {item.score}
                      </div>

                    </div>
                    
                    <div className="text-xs text-warm-mid mt-3 flex items-center justify-between">
                      {new Date(item.created_at).toLocaleDateString()}
                    </div>

                    {/* Delete button */}
                    <button
                      onClick={(e) => handleDelete(e, item.id)}
                      className="absolute top-3 right-3 p-1.5 text-red-400 opacity-0 group-hover:opacity-100 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      title="Delete analysis"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
