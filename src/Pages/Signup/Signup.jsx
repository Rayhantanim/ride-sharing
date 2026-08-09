import React from 'react';
import img from '../../assets/image 107.jpg';
import { Link } from 'react-router-dom';

const Signup = () => {
  return (
    <div className="relative w-[1440px] h-[900px] mx-auto overflow-hidden bg-black">
      {/* Background Image - changed to 'object-cover' to fill screen */}
      <img
        className="absolute inset-0 w-full h-full object-cover z-0"
        src={img}
        alt="Onboarding background"
      />

      {/* Gradient Overlay - Exact match of your second gradient image */}
      <div 
        className="absolute inset-0 z-10 bg-gradient-to-b from-black via-gray-500 to-white mix-blend-multiply opacity-60 pointer-events-none"
      />

      {/* Content Wrapper - z-20 to sit above shadow */}
      <div className="absolute inset-0 z-20 flex flex-col justify-between items-center p-6">
        
        {/* Top Right: ENG - Added drop-shadow for guaranteed readability */}
        <div className="self-end flex items-center gap-1 text-white text-sm sm:text-base font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
          <span>ENG</span>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 sm:w-6 sm:h-6"
          >
            <path
              d="M19.843 7.582C20.6039 8.92999 21.0025 10.4521 21 12C21 12.778 20.901 13.533 20.716 14.253C20.2159 16.1843 19.0886 17.8948 17.511 19.116C15.9335 20.3372 13.995 20.9999 12 21M4.157 7.582C3.42 8.887 3 10.395 3 12C2.99933 12.76 3.09475 13.517 3.284 14.253C3.78408 16.1843 4.91141 17.8948 6.48898 19.116C8.06654 20.3372 10.005 20.9999 12 21M12 21C14.485 21 16.5 16.97 16.5 12C16.5 7.03 14.485 3 12 3M12 21C9.515 21 7.5 16.97 7.5 12C7.5 7.03 9.515 3 12 3M20.716 14.253C18.0492 15.7314 15.0492 16.5048 12 16.5C8.838 16.5 5.867 15.685 3.284 14.253M12 3C13.5962 2.99933 15.1639 3.42336 16.5422 4.22856C17.9205 5.03377 19.0597 6.19117 19.843 7.582M12 3C10.4038 2.99933 8.83608 3.42336 7.45781 4.22856C6.07954 5.03377 4.94031 6.19117 4.157 7.582M19.843 7.582C17.6657 9.46793 14.8805 10.5041 12 10.5C9.002 10.5 6.26 9.4 4.157 7.582"
              stroke="#EDEDED"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Center: Logo + Button */}
        <div className="flex flex-col items-center gap-6 sm:gap-8 w-full">
          
          {/* zyGo Logo */}
          <svg
            viewBox="0 0 254 108"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-3/4 max-w-[254px] h-auto drop-shadow-sm"
          >
            <path
              d="M-0.000195157 62.7L29.2598 38.5H-0.000195157V23.1H55.2198V38.5L25.7398 62.7H55.2198V78.1H-0.000195157V62.7ZM116.819 23.1V50.6C116.819 66.33 103.949 79.2 88.2189 79.2C72.4889 79.2 59.6189 66.33 59.6189 50.6V23.1H75.0189V50.6C75.0189 57.86 80.9589 63.8 88.2189 63.8C95.4789 63.8 101.419 57.86 101.419 50.6V23.1H116.819ZM101.419 79.2H116.819C116.819 94.93 103.949 107.8 88.2189 107.8C72.4889 107.8 59.6189 94.93 59.6189 79.2H75.0189C75.0189 86.46 80.9589 92.4 88.2189 92.4C95.4789 92.4 101.419 86.46 101.419 79.2ZM121.172 39.6C121.172 17.71 138.882 -2.86102e-05 160.772 -2.86102e-05C173.532 -2.86102e-05 184.862 6.04997 192.122 15.4L179.692 24.53C175.292 18.92 168.362 15.4 160.772 15.4C147.462 15.4 136.572 26.29 136.572 39.6C136.572 56.76 148.122 64.79 158.902 64.79C168.142 64.79 176.722 58.85 176.722 47.85V39.6H192.122V78.1H176.722V74.47C171.222 77.55 164.842 79.09 158.352 79.09C140.092 79.09 121.172 66.55 121.172 39.6ZM196.474 50.6C196.474 34.87 209.344 22 225.074 22C240.804 22 253.674 34.87 253.674 50.6C253.674 66.33 240.804 79.2 225.074 79.2C209.344 79.2 196.474 66.33 196.474 50.6ZM211.874 50.6C211.874 57.86 217.814 63.8 225.074 63.8C232.334 63.8 238.274 57.86 238.274 50.6C238.274 43.34 232.334 37.4 225.074 37.4C217.814 37.4 211.874 43.34 211.874 50.6Z"
              fill="#8EB800"
            />
          </svg>

          {/* Get Started Button */}
         <Link className="w-4/5 max-w-[360px] h-14 sm:h-[60px] bg-white rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-100 transition shadow-lg" to="/phone-signup"> <div >
            <span className="flex items-center gap-2 text-[#1D1D1D] font-medium text-base sm:text-lg">
              Get Started
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 sm:w-6 sm:h-6"
              >
                <path
                  d="M17.25 15.75L21 12L17.25 8.25M21 12H3"
                  stroke="#1D1D1D"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div></Link>
        </div>

        {/* Bottom Legal - Added drop-shadow to guarantee visibility over the pure white bottom of the gradient */}
        <div className="text-center text-white text-xs sm:text-sm drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
          By using this app you agree to
          <br />
          <span className="underline underline-offset-2 cursor-pointer hover:text-white/90">Privacy policies and Terms</span>
        </div>
      </div>
    </div>
  );
};

export default Signup;