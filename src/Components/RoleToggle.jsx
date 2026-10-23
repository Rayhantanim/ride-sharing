import React from 'react';

const RoleToggle = ({ role, onChange }) => {
  return (
    <div className="w-full flex bg-[#F3F4F6] rounded-xl p-1">
      {[
        { id: 'passenger', label: 'Passenger', icon: '🧍' },
        { id: 'driver',    label: 'Driver',    icon: '🚗' },
      ].map((r) => (
        <button
          key={r.id}
          type="button"
          onClick={() => onChange(r.id)}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-[14px] font-semibold transition ${
            role === r.id
              ? 'bg-white text-[#8EB800] shadow-sm'
              : 'text-[#6B7280] hover:text-[#1D1D1D]'
          }`}
        >
          <span>{r.icon}</span>
          {r.label}
        </button>
      ))}
    </div>
  );
};

export default RoleToggle;