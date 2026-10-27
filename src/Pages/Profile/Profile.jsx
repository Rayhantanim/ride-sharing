import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(
  /\/+$/,
  "",
);

const Icon = ({ name, size = 20 }) => {
  const icons = {
    back: <path d="m15 18-6-6 6-6" />,
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M5 21v-2a7 7 0 0 1 14 0v2" />
      </>
    ),
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </>
    ),
    phone: (
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.2 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.96.35 1.9.68 2.8a2 2 0 0 1-.45 2.11L8.07 9.93a16 16 0 0 0 6 6l1.3-1.27a2 2 0 0 1 2.11-.45c.9.33 1.84.56 2.8.68A2 2 0 0 1 22 16.92Z" />
    ),
    edit: (
      <>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z" />
      </>
    ),
    logout: (
      <>
        <path d="M10 17l5-5-5-5" />
        <path d="M15 12H3" />
        <path d="M21 3v18" />
      </>
    ),
    close: <path d="m18 6-12 12M6 6l12 12" />,
    check: <path d="m5 12 4 4L19 6" />,
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {icons[name] || icons.user}
    </svg>
  );
};

const InfoField = ({ label, value }) => (
  <div className="min-w-0 py-4">
    <p className="mb-1.5 text-sm font-medium text-gray-500">{label}</p>
    <p className="break-words text-base font-semibold text-gray-800">
      {value || "-"}
    </p>
  </div>
);

const Profile = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    gender: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const getToken = () => localStorage.getItem("token");

  const loadProfile = async () => {
    const token = getToken();

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await axios.get(`${API}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const profile = response.data.user;

      setUser(profile);
      setForm({
        fullName: profile.fullName || "",
        phone: profile.phone || "",
        gender: profile.gender || "",
      });

      localStorage.setItem("user", JSON.stringify(profile));
    } catch (err) {
      console.error("Profile load error:", err);

      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login", { replace: true });
        return;
      }

      setError(
        err.response?.data?.message ||
          "Could not load your profile. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleEdit = () => {
    setForm({
      fullName: user?.fullName || "",
      phone: user?.phone || "",
      gender: user?.gender || "",
    });
    setError("");
    setSuccess("");
    setIsEditing(true);
  };

  const handleSave = async (event) => {
    event.preventDefault();

    if (!form.fullName.trim() || !form.phone.trim() || !form.gender) {
      setError("Please fill in your name, phone number and gender.");
      return;
    }

    const token = getToken();

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await axios.patch(
        `${API}/api/users/me`,
        {
          fullName: form.fullName.trim(),
          phone: form.phone.trim(),
          gender: form.gender,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const updatedUser = response.data.user;

      setUser(updatedUser);
      setForm({
        fullName: updatedUser.fullName || "",
        phone: updatedUser.phone || "",
        gender: updatedUser.gender || "",
      });

      localStorage.setItem("user", JSON.stringify(updatedUser));
      setIsEditing(false);
      setSuccess("Profile updated successfully!");
    } catch (err) {
      console.error("Profile update error:", err);

      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login", { replace: true });
        return;
      }

      setError(
        err.response?.data?.message ||
          "Could not save your profile. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError("");
    setForm({
      fullName: user?.fullName || "",
      phone: user?.phone || "",
      gender: user?.gender || "",
    });
  };

  const handleLogout = () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userData");
    localStorage.removeItem("currentUser");

    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    navigate("/login", { replace: true });
  };

  const genderLabels = {
    male: "Male",
    female: "Female",
    other: "Other",
    prefer_not_to_say: "Prefer not to say",
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAFBF8]">
        <div className="text-center">
          <div className="mx-auto mb-3 h-9 w-9 animate-spin rounded-full border-[3px] border-[#E6EED6] border-t-[#8EB800]" />
          <p className="text-sm text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user && error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAFBF8] px-5">
        <div className="w-full max-w-sm text-center">
          <p role="alert" className="mb-5 text-sm text-red-600">
            {error}
          </p>
          <button
            onClick={loadProfile}
            className="w-full rounded-xl bg-[#8EB800] px-5 py-3 font-semibold text-white hover:bg-[#759800]"
          >
            Try Again
          </button>
          <button
            onClick={() => navigate("/login")}
            className="mt-4 text-sm text-gray-500 hover:text-gray-800"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-base text-gray-800 outline-none transition focus:border-[#8EB800] focus:ring-2 focus:ring-[#8EB800]/15";

  return (
    <div className="min-h-screen bg-[#FAFBF8] text-gray-900">
      <header className="border-b border-gray-100 bg-white">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6 sm:px-8 lg:px-12">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="flex h-10 w-10 items-center justify-center rounded-full text-gray-600 transition hover:bg-gray-100"
          >
            <Icon name="back" size={23} />
          </button>

          <h1 className="text-lg font-bold tracking-tight sm:text-xl">
            User Profile
          </h1>

          <div className="w-10" />
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
        {error && (
          <div
            role="alert"
            className="mb-5 flex items-start justify-between gap-3 rounded-xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-700"
          >
            <p>{error}</p>
            <button
              type="button"
              onClick={() => setError("")}
              aria-label="Dismiss error"
            >
              <Icon name="close" size={18} />
            </button>
          </div>
        )}

        {success && (
          <div
            role="status"
            className="mb-5 flex items-center justify-between gap-3 rounded-xl border border-[#E1ECCB] bg-[#F2F7E8] px-5 py-4 text-sm text-[#587600]"
          >
            <p>{success}</p>
            <button
              type="button"
              onClick={() => setSuccess("")}
              aria-label="Dismiss message"
            >
              <Icon name="close" size={18} />
            </button>
          </div>
        )}

        {/* Centered profile */}
        <section className="flex flex-col items-center pb-9 text-center">
          <div className="flex h-28 w-28 items-center justify-center rounded-full border border-[#E2EBCF] bg-[#EFF5E4] text-[#729500]">
            <Icon name="user" size={50} />
          </div>

          <h2 className="mt-5 break-words text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            {user.fullName}
          </h2>

          <p className="mt-2 text-base text-gray-500">{user.phone}</p>

          <span className="mt-4 rounded-full bg-[#EEF5E0] px-4 py-1.5 text-sm font-semibold capitalize text-[#5E7D08]">
            {user.role || "passenger"}
          </span>
        </section>

        {/* Information section */}
        <section className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white">
          <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-6 py-5 sm:px-8 lg:px-10">
            <h3 className="text-lg font-bold text-gray-900">My Information</h3>

            {!isEditing && (
              <button
                type="button"
                onClick={handleEdit}
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-[#648600] transition hover:bg-[#F3F7E9]"
              >
                <Icon name="edit" size={17} />
                Edit
              </button>
            )}
          </div>

          <div className="px-6 sm:px-8 lg:px-10">
            {isEditing ? (
              <form onSubmit={handleSave} className="space-y-5 py-7">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-gray-600">
                    Full Name
                  </span>
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={(e) =>
                      setForm({ ...form, fullName: e.target.value })
                    }
                    required
                    maxLength={100}
                    autoComplete="name"
                    className={inputClass}
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-gray-600">
                    Email
                  </span>
                  <input
                    type="email"
                    value={user.email || ""}
                    readOnly
                    className={`${inputClass} cursor-not-allowed bg-gray-50 text-gray-500`}
                  />
                  <span className="mt-2 block text-xs text-gray-400">
                    Email cannot be changed here.
                  </span>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-gray-600">
                    Phone Number
                  </span>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    required
                    maxLength={20}
                    autoComplete="tel"
                    className={inputClass}
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-gray-600">
                    Gender
                  </span>
                  <select
                    value={form.gender}
                    onChange={(e) =>
                      setForm({ ...form, gender: e.target.value })
                    }
                    required
                    className={inputClass}
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                  </select>
                </label>

                <div className="flex flex-col gap-3 pt-3 sm:flex-row">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 rounded-xl bg-[#8EB800] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#759800] disabled:opacity-60"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>

                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={saving}
                    className="flex-1 rounded-xl border border-gray-200 px-5 py-3.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-60"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="divide-y divide-gray-100">
                <InfoField label="Name" value={user.fullName} />
                <InfoField label="Email" value={user.email} />
                <InfoField label="Phone Number" value={user.phone} />
                <InfoField
                  label="Gender"
                  value={genderLabels[user.gender] || "-"}
                />
              </div>
            )}
          </div>
        </section>

        {/* Account details */}
        <section className="mt-5 rounded-2xl border border-gray-200/80 bg-white px-6 py-5 sm:px-8 lg:px-10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-base font-semibold text-gray-800">
                Account type
              </p>
              <p className="mt-1.5 text-sm text-gray-500">Your zyGo account</p>
            </div>
            <span className="rounded-lg bg-gray-50 px-4 py-2 text-sm font-semibold capitalize text-gray-700">
              {user.role || "passenger"}
            </span>
          </div>

          {user.role === "driver" && (
            <div className="mt-5 space-y-4 border-t border-gray-100 pt-5">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-gray-500">
                  Driver verification
                </span>
                <span className="text-right text-sm font-semibold capitalize text-gray-800">
                  {(user.verificationStatus || "unverified").replace(/_/g, " ")}
                </span>
              </div>

              {user.vehicle && (
                <div>
                  <p className="text-sm text-gray-500">Vehicle</p>
                  <p className="mt-1.5 text-base font-semibold text-gray-800">
                    {[user.vehicle.make, user.vehicle.model, user.vehicle.color]
                      .filter(Boolean)
                      .join(" ") || "Vehicle details not added"}
                  </p>
                </div>
              )}
            </div>
          )}
        </section>

        {!isEditing && (
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-4 text-sm font-semibold text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-60"
          >
            <Icon name="logout" size={18} />
            {isLoggingOut ? "Logging out..." : "Logout"}
          </button>
        )}

        <p className="mt-7 text-center text-sm text-gray-400">
          zyGo · Your journey, your way.
        </p>
      </main>
    </div>
  );
};

export default Profile;
