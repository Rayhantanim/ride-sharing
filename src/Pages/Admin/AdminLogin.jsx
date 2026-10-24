import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/api/auth/login`, {
        identifier: form.email.trim(),
        password: form.password,
      });
      if (data.user.role !== 'admin') {
        setError('This account does not have admin access.');
        return;
      }
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center px-4">
      <div className="w-full max-w-[420px] bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-[26px] font-extrabold text-[#1D1D1D] text-center">
          Admin Access
        </h1>
        <p className="text-[13px] text-[#6B7280] text-center mt-1 mb-8">
          Sign in with your admin credentials
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Admin email"
            required
            className="w-full px-4 py-3 border border-[#E5E7EB] rounded-xl text-[14px] outline-none focus:border-[#8EB800]"
          />
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="w-full px-4 py-3 border border-[#E5E7EB] rounded-xl text-[14px] outline-none focus:border-[#8EB800]"
          />

          <div className="min-h-[20px] flex items-center">
            {error && <div className="text-red-500 text-sm">{error}</div>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1D1D1D] hover:bg-black text-white font-semibold py-3 rounded-xl text-[14px] transition disabled:opacity-60"
          >
            {loading ? 'Verifying…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;