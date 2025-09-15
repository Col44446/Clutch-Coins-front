import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, CheckCircle, XCircle, RefreshCcw } from "lucide-react"; // 👈 professional icons

const OTPVerify = () => {
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [formData, setFormData] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const savedData = localStorage.getItem("signupData");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setFormData(parsedData);
      setEmail(parsedData.email);
    } else {
      navigate("/signup");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/users/signup/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, otp }),
      });
      const data = await response.json();
      if (data.success) {
        setSuccess("OTP verified! Redirecting to login...");
        localStorage.removeItem("signupData");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError(data.message || "Invalid OTP");
      }
    } catch (err) {
      setError("Failed to verify OTP");
    }
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const buttonVariants = {
    hover: { scale: 1.05, boxShadow: "0 0 12px rgba(34, 211, 238, 0.6)" },
    tap: { scale: 0.95 },
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-950 to-slate-950 flex items-center justify-center px-4"
      variants={pageVariants}
      initial="initial"
      animate="animate"
    >
      <motion.div
        className="bg-gradient-to-b from-blue-900 via-blue-950 to-slate-950 p-6 rounded-2xl shadow-2xl w-full max-w-md text-white border border-cyan-500/30 relative"
        whileHover={{ scale: 1.01 }}
      >
        <div className="flex items-center justify-center mb-6">
          <Lock className="w-8 h-8 text-cyan-400 mr-2" />
          <h2 className="text-2xl font-bold text-cyan-300 tracking-wide">Verify OTP</h2>
        </div>

        {error && (
          <p className="flex items-center justify-center text-red-400 mb-4">
            <XCircle className="w-5 h-5 mr-2" /> {error}
          </p>
        )}

        {success && (
          <p className="flex items-center justify-center text-green-400 mb-4">
            <CheckCircle className="w-5 h-5 mr-2" /> {success}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-cyan-200">Email</label>
            <input
              id="otp-email"
              name="email"
              type="email"
              value={email}
              disabled
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-cyan-200">OTP</label>
            <input
              id="otp-code"
              name="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-cyan-500/30 bg-slate-950 text-white placeholder-gray-500 shadow-sm focus:border-cyan-500 focus:ring focus:ring-cyan-400/40 p-2"
              placeholder="Enter OTP"
              required
            />
          </div>

          <motion.button
            type="submit"
            className="flex items-center justify-center gap-2 w-full bg-cyan-600 text-white py-2.5 rounded-lg hover:bg-cyan-700 transition-all duration-300"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <CheckCircle className="w-5 h-5" /> Verify OTP
          </motion.button>

          <motion.button
            type="button"
            className="flex items-center justify-center gap-2 w-full bg-gray-800 text-cyan-400 py-2.5 rounded-lg hover:bg-gray-700 transition-all duration-300"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <RefreshCcw className="w-5 h-5" /> Resend OTP (Dummy)
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default OTPVerify;
