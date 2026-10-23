import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AdminVerifications = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('pending');
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const token = localStorage.getItem('token');
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${API}/api/admin/verifications?status=${filter}`,
        authHeader
      );
      setVerifications(data.verifications);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return navigate('/admin/login');
    load();
    // eslint-disable-next-line
  }, [filter]);

  const approve = async (id) => {
    await axios.post(`${API}/api/admin/verifications/${id}/approve`, {}, authHeader);
    load();
    setSelected(null);
  };

  const reject = async (id) => {
    const reason = prompt('Rejection reason:');
    if (!reason) return;
    await axios.post(
      `${API}/api/admin/verifications/${id}/reject`,
      { reason },
      authHeader
    );
    load();
    setSelected(null);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-8">
      <div className="max-w-[1200px] mx-auto">
        <h1 className="text-[28px] font-bold text-[#1D1D1D] mb-6">
          Driver Verifications
        </h1>

        <div className="flex gap-2 mb-6">
          {['pending', 'approved', 'rejected'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-lg text-[14px] font-semibold transition ${
                filter === s
                  ? 'bg-[#8EB800] text-white'
                  : 'bg-white text-[#1D1D1D] border border-[#E5E7EB]'
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <p>Loading…</p>
        ) : verifications.length === 0 ? (
          <p className="text-[#6B7280]">No {filter} verifications.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {verifications.map((v) => (
              <div key={v._id} className="bg-white rounded-2xl border border-[#E5E7EB] p-6">
                <p className="font-bold text-[#1D1D1D]">{v.driver?.fullName}</p>
                <p className="text-[13px] text-[#6B7280]">{v.driver?.email}</p>
                <p className="text-[13px] text-[#6B7280] mt-1">
                  Submitted {new Date(v.submittedAt).toLocaleString()}
                </p>

                <div className="grid grid-cols-2 gap-2 my-4">
                  {['nidFront', 'nidBack', 'licenceFront', 'licenceBack'].map((k) => (
                    <a key={k} href={`${API}${v[k]}`} target="_blank" rel="noreferrer">
                      <img
                        src={`${API}${v[k]}`}
                        alt={k}
                        className="w-full h-24 object-cover rounded-lg border border-[#E5E7EB]"
                      />
                    </a>
                  ))}
                </div>

                {v.status === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => approve(v._id)}
                      className="flex-1 bg-[#8EB800] text-white font-semibold py-2 rounded-lg text-[14px]"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => reject(v._id)}
                      className="flex-1 bg-white border border-red-400 text-red-500 font-semibold py-2 rounded-lg text-[14px]"
                    >
                      Reject
                    </button>
                  </div>
                )}

                {v.status === 'rejected' && (
                  <p className="text-[13px] text-red-500">
                    Reason: {v.rejectionReason}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminVerifications;