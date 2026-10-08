import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

/* ───────────────────────── Icons ───────────────────────── */

const BackIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1D1D1D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 18L9 12L15 6" />
  </svg>
);

const UserIcon = () => (
  <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="#8EB800" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const FacebookIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="#1877F2">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const InstagramIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1D1D1D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="#1D1D1D" />
  </svg>
);

const XIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="#1D1D1D">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

/* ───────────────────────── Social Row ───────────────────────── */
const SocialRow = ({ icon, name, id, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-4 px-5 py-4 bg-white border border-[#E5E7EB] rounded-2xl hover:border-[#8EB800] hover:shadow-sm transition text-left"
  >
    <div className="w-11 h-11 rounded-full bg-[#F3F4F6] flex items-center justify-center shrink-0">
      {icon}
    </div>
    <div className="flex flex-col">
      <span className="text-[15px] font-semibold text-[#1D1D1D]">{name}</span>
      <span className="text-[13px] text-[#9CA3AF]">{id}</span>
    </div>
  </button>
);

/* ───────────────────────── Info Field ───────────────────────── */
const InfoField = ({ label, value }) => (
  <div className="flex flex-col gap-1">
    <span className="text-[13px] text-[#6B7280] font-medium">{label}</span>
    <span className="text-[16px] text-[#1D1D1D] font-medium underline-offset-4">
      {value}
    </span>
  </div>
);

/* ───────────────────────── Main Component ───────────────────────── */
const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    fullName: 'Your name',
    phone: '01234567890',
    email: 'youremail@gmail.com',
  });
  const [loading, setLoading] = useState(false);

  const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  /* Load the user from localStorage (already saved at signup/login) */
  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {}
    }

    // Optional: refresh from backend
    // const token = localStorage.getItem('token');
    // if (token) {
    //   axios
    //     .get(`${API}/api/users/me`, {
    //       headers: { Authorization: `Bearer ${token}` },
    //     })
    //     .then(({ data }) => setUser(data.user))
    //     .catch(() => {});
    // }
  }, []);

  const socialLinks = [
    { icon: <FacebookIcon />, name: 'Facebook', id: 'Facebook ID' },
    { icon: <InstagramIcon />, name: 'Instagram', id: 'Instagram ID' },
    { icon: <XIcon />, name: 'X', id: 'X ID' },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* ── Header ─────────────────────────────────────────── */}
      <header className="w-full border-b border-[#F0F1F3]">
        <div className="max-w-[1400px] mx-auto px-8 py-6 flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition"
          >
            <BackIcon />
          </button>
          <h1 className="flex-1 text-center text-[26px] md:text-[28px] font-extrabold text-[#1D1D1D] tracking-tight">
            User Profile
          </h1>
          <div className="w-10" />
        </div>
      </header>

      {/* ── Main Content ───────────────────────────────────── */}
      <main className="w-full max-w-[1400px] mx-auto px-8 py-10 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* ═══ LEFT: Avatar + My Information (span 5) ═══ */}
          <section className="lg:col-span-5 flex flex-col items-center lg:items-start">

            {/* Avatar + name block */}
            <div className="flex flex-col items-center gap-4 mb-10 w-full">
              <div className="w-[140px] h-[140px] rounded-full bg-[#E6F1D9] flex items-center justify-center">
                <UserIcon />
              </div>
              <div className="text-center">
                <p className="text-[20px] font-bold text-[#1D1D1D]">
                  {user.fullName}
                </p>
                <p className="text-[15px] text-[#4B5563] mt-1">{user.phone}</p>
              </div>
            </div>

            {/* My Information */}
            <div className="w-full max-w-[460px] mx-auto lg:mx-0">
              <h2 className="text-[24px] font-extrabold text-[#1D1D1D] tracking-tight mb-6">
                My Information
              </h2>

              <div className="flex flex-col gap-6">
                <InfoField label="Name" value={user.fullName || '-'} />
                <InfoField label="Email" value={user.email || '-'} />
                <InfoField label="Phone Number" value={user.phone || '-'} />
              </div>

              <button
                onClick={() => navigate('/edit-profile')}
                className="w-full mt-10 bg-[#7DA600] hover:bg-[#6F9400] text-white font-semibold py-4 rounded-full text-[16px] transition shadow-sm"
              >
                Edit Profile
              </button>
            </div>
          </section>

          {/* ═══ RIGHT: Social connections (span 7) ═══ */}
          <section className="lg:col-span-7 flex flex-col">
            <div className="bg-[#FAFAFA] rounded-2xl p-8 w-full">
              <h2 className="text-[22px] font-bold text-[#1D1D1D] tracking-tight mb-6">
                Connect with social media
              </h2>

              <div className="flex flex-col gap-4">
                {socialLinks.map((s) => (
                  <SocialRow
                    key={s.name}
                    icon={s.icon}
                    name={s.name}
                    id={s.id}
                    onClick={() => console.log('Connect', s.name)}
                  />
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Profile;