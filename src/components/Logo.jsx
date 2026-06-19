/**
 * CareerFit Logo — Stylized resume/document with upward career-growth arrow.
 * Uses the existing warm-orange brand palette.
 *
 * Props:
 *   size      — number, px dimension for the icon box (default 36)
 *   className — extra Tailwind/CSS classes for the wrapping div
 *   white     — bool, renders logo in white-only (for orange bg panels)
 */
export default function Logo({ size = 36, className = '', white = false }) {
  const s = size;

  return (
    <div
      className={`flex-shrink-0 ${className}`}
      style={{ width: s, height: s }}
      aria-label="CareerFit AI logo"
    >
      {white ? (
        /* ── White version (used on orange gradient backgrounds) ── */
        <svg
          width={s}
          height={s}
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Document body */}
          <rect x="5" y="3" width="20" height="26" rx="3" fill="white" fillOpacity="0.95" />
          {/* Folded corner */}
          <path d="M21 3 L25 7 L21 7 Z" fill="white" fillOpacity="0.6" />
          {/* Horizontal lines (resume content) */}
          <rect x="8" y="11" width="11" height="1.5" rx="0.75" fill="white" fillOpacity="0.5" />
          <rect x="8" y="14.5" width="14" height="1.5" rx="0.75" fill="white" fillOpacity="0.5" />
          <rect x="8" y="18" width="9" height="1.5" rx="0.75" fill="white" fillOpacity="0.5" />

          {/* Growth chart arrow — bottom right, overlapping document */}
          <rect x="17" y="20" width="14" height="13" rx="3" fill="white" fillOpacity="0.2" />
          {/* Chart bars */}
          <rect x="19.5" y="27.5" width="2.5" height="3.5" rx="0.8" fill="white" fillOpacity="0.9" />
          <rect x="23" y="25" width="2.5" height="6" rx="0.8" fill="white" fillOpacity="0.9" />
          <rect x="26.5" y="22" width="2.5" height="9" rx="0.8" fill="white" fillOpacity="0.9" />
          {/* Uptrend line */}
          <path
            d="M20.75 27 L24.25 24.5 L27.75 21.5"
            stroke="white"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fillOpacity="0"
          />
          {/* Arrow head */}
          <path
            d="M26 21 L28.5 21 L28.5 23.5"
            stroke="white"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        /* ── Color version (gradient background icon) ── */
        <svg
          width={s}
          height={s}
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="logoGrad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#EA580C" />
              <stop offset="55%" stopColor="#F97316" />
              <stop offset="100%" stopColor="#FB923C" />
            </linearGradient>
            <linearGradient id="chartGrad" x1="17" y1="20" x2="31" y2="33" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#C2410C" />
              <stop offset="100%" stopColor="#F97316" />
            </linearGradient>
          </defs>

          {/* Document body */}
          <rect x="4" y="2" width="20" height="26" rx="3" fill="url(#logoGrad)" />
          {/* Folded top-right corner */}
          <path d="M20 2 L24 6 L20 6 Z" fill="#C2410C" fillOpacity="0.7" />
          {/* Document lines (resume text rows) */}
          <rect x="7" y="9.5" width="11" height="1.6" rx="0.8" fill="white" fillOpacity="0.55" />
          <rect x="7" y="13" width="14" height="1.6" rx="0.8" fill="white" fillOpacity="0.55" />
          <rect x="7" y="16.5" width="8" height="1.6" rx="0.8" fill="white" fillOpacity="0.55" />
          <rect x="7" y="20" width="11" height="1.6" rx="0.8" fill="white" fillOpacity="0.35" />

          {/* Growth chart card — overlapping badge */}
          <rect x="16" y="19" width="16" height="15" rx="3.5" fill="white" />
          <rect x="16" y="19" width="16" height="15" rx="3.5" stroke="#FDBA74" strokeWidth="1" />

          {/* Chart bars inside badge */}
          <rect x="18.5" y="27" width="2.5" height="4.5" rx="0.7" fill="url(#chartGrad)" fillOpacity="0.75" />
          <rect x="22"   y="24.5" width="2.5" height="7" rx="0.7" fill="url(#chartGrad)" fillOpacity="0.85" />
          <rect x="25.5" y="21.5" width="2.5" height="10" rx="0.7" fill="url(#logoGrad)" />

          {/* Uptrend line */}
          <path
            d="M19.75 26.5 L23.25 24 L26.75 21"
            stroke="#EA580C"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Arrow tip */}
          <path
            d="M25.2 20.5 L27.5 20.5 L27.5 22.8"
            stroke="#EA580C"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
  );
}
