import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Img from "../assets/forgetPass.png";

const ForgetPass = () => {
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const digits = phone.replace(/\D/g, "");

    if (digits.length < 8) {
      setError("Please enter a valid phone number");
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.post(`${API}/api/auth/send-otp`, {
        phone: phone.trim(),
      });

      console.log("📤 OTP sent to", phone);

      if (data.devCode) {
        console.log("🔐 DEV OTP code:", data.devCode);
      }

      navigate("/verify-otp", {
        state: {
          phone: phone.trim(),
        },
      });
    } catch (err) {
      console.error("❌ send-otp error:", err.response?.data || err.message);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to send OTP. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-sm p-8">
        {/* Image */}
        <div className="flex justify-center mb-6">
          <img
            src={Img}
            alt="Forgot Password"
            className="w-48 h-48 object-contain"
          />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Forgot Password?
        </h1>

        <p className="text-center text-gray-500 text-sm mb-8">
          Enter your phone number and we'll send you an OTP to reset your
          password.
        </p>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-xl bg-red-50 text-red-600 px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Phone Number
          </label>

          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter your phone number"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#82A800] transition"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#7DA600] text-white font-bold py-4 rounded-full text-[16px] hover:bg-[#6F9400] transition shadow-sm disabled:opacity-60 disabled:cursor-not-allowed mt-6"
          >
            {loading ? "Sending OTP..." : "Reset"}
          </button>
        </form>

        {/* Login Link */}
        <div className="text-center text-[14px] text-[#6B7280] mt-6">
          Remember your password?{" "}
          <Link
            to="/login"
            className="text-[#8EB800] font-semibold hover:underline"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgetPass;
