import React, { useState, useEffect, useRef } from 'react';
import caricon from '../../src/assets/cam-in-pin.png';
import { Link } from 'react-router-dom';

const EmergencyRideSwitch = () => {
  // ============================================================
  // ⚙️ STATE & CONFIGURATION — Edit these values to customize
  // ============================================================
  const TOTAL_TIME = 30; // ⏱️ Total countdown duration in seconds
  const BRAND_COLOR = '#5B9E00'; // 🎨 Primary brand green (change hex to rebrand)

  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const intervalRef = useRef(null);

  // ============================================================
  // ⏳ COUNTDOWN TIMER LOGIC — Handles the 30s auto-cancel window
  // ============================================================
  useEffect(() => {
    if (isTimerActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setIsTimerActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isTimerActive]);

  // 👉 Handler for the main "Request New Driver" button
  const handleRequestDriver = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTimeLeft(TOTAL_TIME);
    setIsTimerActive(true);
  };

  // 👉 Handler for the "Cancel" text button
  const handleCancel = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsTimerActive(false);
    setTimeLeft(TOTAL_TIME);
  };

  // ============================================================
  // 🔵 PROGRESS RING MATH — Controls the circular countdown ring
  // ============================================================
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const progress = timeLeft / TOTAL_TIME;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    // ============================================================
    // 🖥️ OUTER WRAPPER — Neutral bg for desktop, centers mobile card
    // ============================================================
    <div className="min-h-screen bg-gray-100 flex items-center justify-center font-sans antialiased">

      {/* ============================================================
          📱 MOBILE VIEWPORT CARD
          ============================================================ */}
      <div className="w-full max-w-1/2 min-h-screen md:min-h-0 md:h-[750px] md:rounded-3xl md:shadow-2xl bg-white flex flex-col justify-between relative overflow-hidden">

        {/* ============================================================
            🔝 HEADER SECTION (FIXED)
            - Removed debug `bg-amber-500` background
            - Removed unwanted `border-4` on back button
            - Title now properly centered on all screen sizes
            - Uses a 3-column grid so back button, title, and right
              spacer sit in balance (title stays centered)
            ============================================================ */}
        <header className="grid grid-cols-[auto_1fr_auto] items-center gap-3 px-4 sm:px-5 pt-5 pb-3">

          {/* LEFT: Back arrow — links to previous page */}
          <Link
            to="/"
            className="p-2 -ml-2 rounded-full text-gray-700
                       hover:bg-gray-100 active:scale-95 transition-all
                       focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300"
            aria-label="Go back"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M15 19L8 12L15 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>

          {/* CENTER: Title — truncates gracefully if space is tight */}
          <h1 className="text-center text-base sm:text-lg font-bold text-gray-800 truncate">
            Emergency Ride Switch
          </h1>

          {/* RIGHT: Invisible spacer to keep the title perfectly centered */}
          <div className="w-10 h-10" aria-hidden="true" />
        </header>

        {/* ============================================================
            🚗 HERO ILLUSTRATION
            ============================================================ */}
        <div className="bg-gray-50 mx-4 sm:mx-5 rounded-2xl py-6 px-4 flex items-center justify-center">
          <svg
            viewBox="0 0 320 140"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full max-w-[300px] h-auto"
          >
            <path
              d="M60 70 C 100 20, 140 20, 160 70 S 220 120, 260 70"
              stroke={BRAND_COLOR}
              strokeWidth="2.5"
              strokeDasharray="6 6"
              strokeLinecap="round"
              fill="none"
              opacity="0.7"
            />

            {/* Left location pin */}
            <g transform="translate(45, 55)">
              <path
                d="M15 0C6.716 0 0 6.716 0 15C0 26.25 15 40 15 40C15 40 30 26.25 30 15C30 6.716 23.284 0 15 0Z"
                fill={BRAND_COLOR}
              />
              <circle cx="15" cy="15" r="6" fill="white" />
            </g>

            {/* Right location pin */}
            <g transform="translate(245, 55)">
              <path
                d="M15 0C6.716 0 0 6.716 0 15C0 26.25 15 40 15 40C15 40 30 26.25 30 15C30 6.716 23.284 0 15 0Z"
                fill={BRAND_COLOR}
              />
              <circle cx="15" cy="15" r="6" fill="white" />
            </g>

            {/* Green sports car */}
            <g transform="translate(135, 62)">
              <path
                d="M4 14 L8 6 C9 4, 11 3, 13 3 L38 3 C40 3, 42 4, 43 6 L47 14 L52 15 C54 15.5, 55 17, 55 19 L55 22 C55 23.1, 54.1 24, 53 24 L-3 24 C-4.1 24, -5 23.1, -5 22 L-5 19 C-5 17, -4 15.5, -2 15 Z"
                fill={BRAND_COLOR}
              />
              <path d="M10 7 L12 12 L38 12 L40 7 Z" fill="#B7E066" opacity="0.85" />
              <circle cx="12" cy="24" r="4.5" fill="#1F2937" />
              <circle cx="12" cy="24" r="2" fill="#9CA3AF" />
              <circle cx="40" cy="24" r="4.5" fill="#1F2937" />
              <circle cx="40" cy="24" r="2" fill="#9CA3AF" />
              <line x1="-12" y1="10" x2="-6" y2="10" stroke={BRAND_COLOR} strokeWidth="2" strokeLinecap="round" opacity="0.5" />
              <line x1="-14" y1="16" x2="-6" y2="16" stroke={BRAND_COLOR} strokeWidth="2" strokeLinecap="round" opacity="0.7" />
              <line x1="-12" y1="22" x2="-6" y2="22" stroke={BRAND_COLOR} strokeWidth="2" strokeLinecap="round" opacity="0.5" />
            </g>
          </svg> 
        </div>

        {/* ============================================================
            💬 CORE MESSAGE
            ============================================================ */}
        <div className="px-6 sm:px-8 py-5 sm:py-6 text-center">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 leading-snug">
            Get a new Driver if you feel unsafe or uncomfortable
          </h2>
          <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-gray-500 leading-relaxed">
            Your safety is our top priority. Request a new driver instantly, no questions asked.
          </p>
        </div>

        {/* ============================================================
            🔘 PRIMARY CTA BUTTON
            ============================================================ */}
        <div className="px-4 sm:px-5">
          <button
            type="button"
            onClick={handleRequestDriver}
            disabled={isTimerActive}
            style={!isTimerActive ? { backgroundColor: BRAND_COLOR } : {}}
            className={`w-full h-13 sm:h-14 rounded-full font-bold text-sm sm:text-base text-white
                       transition-all duration-200 ease-out
                       ${
                         isTimerActive
                           ? 'bg-gray-300 cursor-not-allowed'
                           : 'hover:brightness-95 active:scale-[0.97] shadow-lg'
                       }`}
          >
            {isTimerActive ? 'Request Sent...' : 'Request New Driver'}
          </button>
        </div>

        {/* ============================================================
            ⏱️ SAFETY CANCELLATION STATUS BOX
            ============================================================ */}
        <div className="px-4 sm:px-5 pt-4 sm:pt-5 pb-5 sm:pb-6">
          <div className="flex items-center justify-between gap-3 sm:gap-4 bg-gray-50 border border-gray-200 rounded-2xl px-4 sm:px-5 py-4">

            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-semibold text-gray-800 leading-snug">
                You Can Cancel The Request Within {TOTAL_TIME}s
              </p>
              {isTimerActive && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="mt-2 text-xs font-bold text-red-500 hover:text-red-600 underline underline-offset-2 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>

            <div className="relative flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 56 56">
                <circle cx="28" cy="28" r={radius} fill="none" stroke="#E5E7EB" strokeWidth="4" />
                <circle
                  cx="28"
                  cy="28"
                  r={radius}
                  fill="none"
                  stroke={BRAND_COLOR}
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  style={{ transition: 'stroke-dashoffset 1s linear' }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[10px] sm:text-xs font-bold text-gray-800 tabular-nums">
                  {timeLeft}s
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EmergencyRideSwitch;