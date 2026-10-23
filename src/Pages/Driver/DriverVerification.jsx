import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const DriverVerification = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    nidNumber: '',
    licenceNumber: '',
    licenceExpiry: '',
    nidFront: null,
    nidBack: null,
    licenceFront: null,
    licenceBack: null,
  });

  const token = localStorage.getItem('token');
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    (async () => {
      try {
        const { data } = await axios.get(`${API}/api/verification/me`, authHeader);
        setStatus(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load');
      } finally {
        setLoading(false);
      }
    })();
  }, [token, navigate]);

  const handleFileChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.nidFront || !form.nidBack || !form.licenceFront || !form.licenceBack) {
      setError('Please upload all four required documents.');
      return;
    }

    setSubmitting(true);

    try {
      const fd = new FormData();
      fd.append('nidFront', form.nidFront);
      fd.append('nidBack', form.nidBack);
      fd.append('licenceFront', form.licenceFront);
      fd.append('licenceBack', form.licenceBack);
      fd.append('nidNumber', form.nidNumber);
      fd.append('licenceNumber', form.licenceNumber);
      if (form.licenceExpiry) fd.append('licenceExpiry', form.licenceExpiry);

      const { data } = await axios.post(`${API}/api/verification/submit`, fd, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess('Submitted! Awaiting admin review.');
      setStatus({
        verificationStatus: 'pending',
        verification: data.verification,
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading…</div>;
  }

  /* ───── Approved ───── */
  if (status?.verificationStatus === 'approved') {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-10 max-w-md text-center shadow-sm">
          <div className="text-[#8EB800] text-6xl mb-4">✅</div>
          <h1 className="text-[24px] font-bold text-[#1D1D1D] mb-2">You're verified!</h1>
          <p className="text-[#6B7280] mb-6">Your documents have been approved.</p>
          <button
            onClick={() => navigate('/driver')}
            className="w-full bg-[#8EB800] hover:bg-[#7aa300] text-white font-semibold py-3 rounded-xl transition"
          >
            Go to Driver Dashboard
          </button>
        </div>
      </div>
    );
  }

  /* ───── Pending ───── */
  if (status?.verificationStatus === 'pending') {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-10 max-w-md text-center shadow-sm">
          <div className="text-[#F59E0B] text-6xl mb-4">⏳</div>
          <h1 className="text-[24px] font-bold text-[#1D1D1D] mb-2">Under review</h1>
          <p className="text-[#6B7280]">
            Your documents are being reviewed by our team. This usually takes up to 24 hours.
          </p>
        </div>
      </div>
    );
  }

  /* ───── Rejected ───── */
  const rejectionReason =
    status?.verificationStatus === 'rejected'
      ? status.verification?.rejectionReason
      : null;

  /* ───── Unverified / Rejected → Show upload form ───── */
  return (
    <div className="min-h-screen bg-[#F9FAFB] py-8 px-4">
      <div className="max-w-[600px] mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="text-[#6B7280] hover:text-[#1D1D1D] mb-6"
        >
          ← Back
        </button>

        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8 shadow-sm">
          <h1 className="text-[24px] font-bold text-[#1D1D1D] mb-2">
            Verify your identity
          </h1>
          <p className="text-[14px] text-[#6B7280] mb-6">
            To start accepting rides, please upload your NID and driving licence.
          </p>

          {rejectionReason && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 text-[14px]">
              <strong>Previous rejection:</strong> {rejectionReason}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* NID section */}
            <div>
              <h3 className="text-[15px] font-bold text-[#1D1D1D] mb-3">
                NID Card
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <FileInput
                  label="Front side"
                  name="nidFront"
                  onChange={handleFileChange}
                  file={form.nidFront}
                />
                <FileInput
                  label="Back side"
                  name="nidBack"
                  onChange={handleFileChange}
                  file={form.nidBack}
                />
              </div>
              <input
                type="text"
                placeholder="NID number (optional)"
                value={form.nidNumber}
                onChange={(e) => setForm({ ...form, nidNumber: e.target.value })}
                className="w-full mt-3 px-4 py-3 border border-[#E5E7EB] rounded-xl text-[14px] outline-none focus:border-[#8EB800]"
              />
            </div>

            {/* Licence section */}
            <div>
              <h3 className="text-[15px] font-bold text-[#1D1D1D] mb-3">
                Driving Licence
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <FileInput
                  label="Front side"
                  name="licenceFront"
                  onChange={handleFileChange}
                  file={form.licenceFront}
                />
                <FileInput
                  label="Back side"
                  name="licenceBack"
                  onChange={handleFileChange}
                  file={form.licenceBack}
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mt-3">
                <input
                  type="text"
                  placeholder="Licence number"
                  value={form.licenceNumber}
                  onChange={(e) => setForm({ ...form, licenceNumber: e.target.value })}
                  className="w-full px-4 py-3 border border-[#E5E7EB] rounded-xl text-[14px] outline-none focus:border-[#8EB800]"
                />
                <input
                  type="date"
                  value={form.licenceExpiry}
                  onChange={(e) => setForm({ ...form, licenceExpiry: e.target.value })}
                  className="w-full px-4 py-3 border border-[#E5E7EB] rounded-xl text-[14px] outline-none focus:border-[#8EB800]"
                />
              </div>
            </div>

            {error && <div className="text-red-500 text-sm">{error}</div>}
            {success && <div className="text-[#8EB800] text-sm font-medium">{success}</div>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#8EB800] hover:bg-[#7aa300] text-white font-semibold py-4 rounded-xl transition disabled:opacity-60"
            >
              {submitting ? 'Uploading…' : 'Submit for verification'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const FileInput = ({ label, name, onChange, file }) => (
  <div>
    <label className="block text-[12px] font-medium text-[#6B7280] mb-1">
      {label}
    </label>
    <label className="flex items-center justify-center w-full h-24 border-2 border-dashed border-[#E5E7EB] rounded-xl cursor-pointer hover:border-[#8EB800] transition">
      <input
        type="file"
        name={name}
        accept="image/*,application/pdf"
        onChange={onChange}
        className="hidden"
      />
      <span className="text-[12px] text-[#6B7280] text-center px-2">
        {file ? file.name : 'Click to upload'}
      </span>
    </label>
  </div>
);

export default DriverVerification;