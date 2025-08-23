import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, X, Mail, Lock, User, Calendar, CheckCircle2 } from "lucide-react";

const Signup = ({ onClose, onSwitch }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    dob: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [successPopup, setSuccessPopup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/users/signup/request`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();
      if (data.success) {
        setSuccessPopup(true);
        localStorage.setItem("signupData", JSON.stringify(formData));
        setTimeout(() => {
          setSuccessPopup(false);
          onClose?.();
          navigate("/otp-verify");
        }, 2000);
      } else {
        setError(data.message || "Something went wrong");
      }
    } catch (err) {
      setError("Failed to send signup request");
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/users/auth/google`;
  };

  // Animation variants for the success popup
  const popupVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, y: -50, transition: { duration: 0.3, ease: "easeIn" } },
  };

  return (
    <>
      {/* Success Popup */}
      <AnimatePresence>
        {successPopup && (
          <motion.div
            variants={popupVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed top-4 left-1/2 -translate-x-1/2 z-60 bg-gradient-to-r from-green-600 to-green-800 text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-3 max-w-md w-full"
          >
            <CheckCircle2 className="w-6 h-6 text-white" />
            <span className="font-semibold">OTP sent to your email! Redirecting...</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        aria-modal="true"
        role="dialog"
      >
        <motion.div
          className="bg-gradient-to-b from-blue-900 via-blue-950 to-slate-950 p-4 rounded-xl shadow-2xl max-w-md w-full relative border border-cyan-500/20"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.85 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-cyan-300 hover:text-white transition-colors"
            aria-label="Close Signup Form"
          >
            <X size={20} />
          </button>

          <h2 className="text-lg font-bold text-center mb-4 text-cyan-200">
            Create Your Account
          </h2>

          {error && <p className="text-red-400 text-center mb-2 text-sm">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-3 text-sm">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-gray-300">
                Name
              </label>
              <div className="relative">
                <User className="absolute left-2 top-2 text-gray-500" size={16} />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="pl-7 mt-1 block w-full rounded-md bg-gray-300 text-black placeholder-gray-500 shadow-sm focus:border-cyan-500 focus:ring focus:ring-cyan-200 p-1.5 text-sm"
                  placeholder="Enter your name"
                  autoComplete="name"
                  required
                />
              </div>
            </div>

            {/* Email + DOB in one row */}
            <div className="grid grid-cols-2 gap-3">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-gray-300">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-2 top-2 text-gray-500" size={16} />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-7 mt-1 block w-full rounded-md bg-gray-300 text-black placeholder-gray-500 shadow-sm focus:border-cyan-500 focus:ring focus:ring-cyan-200 p-1.5 text-sm"
                    placeholder="Email"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              {/* DOB */}
              <div>
                <label htmlFor="dob" className="block text-gray-300">
                  DOB
                </label>
                <div className="relative">
                  <Calendar className="absolute left-2 top-2 text-gray-500" size={16} />
                  <input
                    type="date"
                    id="dob"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className="pl-7 mt-1 block w-full rounded-md bg-gray-300 text-black shadow-sm focus:border-cyan-500 focus:ring focus:ring-cyan-200 p-1.5 text-sm"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-gray-300">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-2 top-2 text-gray-500" size={16} />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-7 pr-8 mt-1 block w-full rounded-md bg-gray-300 text-black placeholder-gray-500 shadow-sm focus:border-cyan-500 focus:ring focus:ring-cyan-200 p-1.5 text-sm"
                  placeholder="Password"
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-gray-300">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-2 top-2 text-gray-500" size={16} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="pl-7 pr-8 mt-1 block w-full rounded-md bg-gray-300 text-black placeholder-gray-500 shadow-sm focus:border-cyan-500 focus:ring focus:ring-cyan-200 p-1.5 text-sm"
                  placeholder="Confirm"
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
                  aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              className="w-full bg-cyan-600 text-white py-1.5 rounded-md font-medium hover:bg-cyan-700 transition-all text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Sign Up
            </motion.button>

            {/* Google Signup */}
            <button
              onClick={handleGoogleSignup}
              className="w-full mt-3 bg-white text-gray-800 hover:bg-gray-100 p-2 rounded flex items-center justify-center gap-2"
            >
              <img
                src="https://www.svgrepo.com/show/355037/google.svg"
                alt="google"
                className="w-5 h-5"
              />
              Continue with Google
            </button>

            <p className="text-center text-xs text-gray-400 mt-2">
              Already have an account?{" "}
              <button
                type="button"
                className="text-cyan-400 hover:underline"
                onClick={onSwitch}
              >
                Login
              </button>
            </p>
          </form>
        </motion.div>
      </motion.div>
    </>
  );
};

export default Signup;