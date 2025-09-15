import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, X, Mail, Lock, LogIn, KeyRound, CheckCircle2 } from "lucide-react";
import { Helmet } from "react-helmet";
import { motion, AnimatePresence } from "framer-motion";

const Login = ({ onClose, onSwitch, onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [msg, setMsg] = useState("");
  const [successPopup, setSuccessPopup] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isAdmin = email.toLowerCase().includes("admin");
    const url = isAdmin
      ? "http://localhost:5000/api/admin/login"
      : "http://localhost:5000/api/users/login"; // directly backend URL

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success && data.user) {
        // Ensure user object exists
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", isAdmin ? "admin" : "user");
        localStorage.setItem("userId", data.user._id); 
        localStorage.setItem("userName", data.user.name); 
        setSuccessPopup(true);
        setMsg("");

        setTimeout(() => {
          setSuccessPopup(false);
          if (typeof onLogin === "function") onLogin();
          const target = isAdmin ? "/admin-dashboard" : "/user-dashboard";
          navigate(target, { replace: true });
          onClose?.();
        }, 1500);
      } else {
        setMsg("❌ " + (data.message || "Invalid credentials"));
      }
    } catch (error) {
      setMsg("❌ Server error");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/users/auth/google`;
  };

  const popupVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -50, transition: { duration: 0.3 } },
  };

  return (
    <>
      <Helmet>
        <title>Login - MyApp</title>
        <meta
          name="description"
          content="Login to access your dashboard on MyApp."
        />
      </Helmet>

      <AnimatePresence>
        {successPopup && (
          <motion.div
            variants={popupVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed top-4 left-1/2 -translate-x-1/2 z-60 bg-green-600 text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-3 max-w-md w-full"
          >
            <CheckCircle2 className="w-6 h-6" />
            <span className="font-semibold">Login Successful!</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-2"
        onClick={onClose}
      >
        <div
          className="bg-gradient-to-b from-blue-900 to-gray-900 text-white rounded-xl p-6 w-full max-w-sm shadow-xl relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-2 right-3 text-gray-400 hover:text-cyan-400"
          >
            <X className="w-6 h-6" />
          </button>

          <h2 className="text-2xl font-bold text-center mb-4 flex items-center justify-center gap-2">
            <LogIn className="w-6 h-6 text-cyan-400" /> Login
          </h2>

          {msg && (
            <p className="text-center text-sm mb-3 text-red-400">{msg}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="login-email"
                name="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-gray-400"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="login-password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-cyan-400"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400 hover:text-cyan-400"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <button className="w-full bg-cyan-600 hover:bg-cyan-500 p-2 rounded font-semibold flex items-center justify-center gap-2">
              <KeyRound className="w-5 h-5" /> Login
            </button>
          </form>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full bg-red-600 hover:bg-red-500 p-2 rounded font-semibold flex items-center justify-center gap-2 mt-2"
          >
            <img src="https://img.icons8.com/color/48/000000/google-logo.png" className="w-5 h-5" />
            Login with Google
          </button>

          <div className="mt-3 text-center text-sm">
            <p>
              New user?{" "}
              <button
                type="button"
                className="text-cyan-400 hover:underline"
                onClick={onSwitch}
              >
                Signup
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
