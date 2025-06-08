import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import config from "../../config";
import { ArrowLeftIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const formContainerVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, staggerChildren: 0.1, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    x: 50,
    transition: { duration: 0.3, ease: "easeInOut" }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const PasswordStrengthIndicator = ({ password = '' }) => {
  const getStrength = () => {
    let score = 0;
    if (!password) return score;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const strength = getStrength();
  const strengthLabel = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'][strength];
  const color = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-lime-500', 'bg-green-500', 'bg-emerald-500'][strength];

  if (!password) return null;

  return (
    <motion.div variants={itemVariants} className="space-y-2 pt-2">
      <div className="flex justify-between items-center text-xs">
        <p className="font-medium text-gray-600">Password strength</p>
        <p className={`font-bold ${['text-red-500', 'text-orange-500', 'text-yellow-500', 'text-lime-500', 'text-green-500', 'text-emerald-500'][strength]}`}>{strengthLabel}</p>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-1.5">
        <motion.div
          className={`h-1.5 rounded-full ${color}`}
          initial={{ width: '0%' }}
          animate={{ width: `${(strength / 5) * 100}%` }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />
      </div>
    </motion.div>
  );
};

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1); // 1: Enter email, 2: Enter OTP and new password
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!email) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});
    try {
      const { data } = await axios.post(`${config.baseURL}/api/auth/send-reset-otp`, { email });
      setGeneratedOtp(data.otp.toString());
      toast.success(data.message);
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!otp) newErrors.otp = "OTP is required.";
    else if (otp !== generatedOtp) newErrors.otp = "The code you entered is incorrect.";
    
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (!password) newErrors.password = "New password is required.";
    else if (score < 3) newErrors.password = "Password is not strong enough.";
    
    if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});
    try {
      await axios.post(`${config.baseURL}/api/auth/reset-password`, { email, password });
      toast.success("Password has been reset successfully!");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    setErrors({});
  };

  return (
    <motion.div
      className="mx-auto w-full max-w-sm lg:w-96"
      variants={formContainerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.div key="step1" variants={formContainerVariants} initial="hidden" animate="visible" exit="exit">
            <motion.div variants={itemVariants}>
              <h2 className="text-3xl font-bold leading-9 tracking-tight text-gray-900">Forgot Password?</h2>
              <p className="mt-2 text-sm text-gray-600">
                No problem. Enter your email and we'll send you a reset code.
              </p>
            </motion.div>
            
            <motion.form onSubmit={handleSendOtp} className="mt-10 space-y-6" variants={itemVariants}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Email address</label>
                <div className="mt-2">
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={handleInputChange(setEmail)}
                    className="block w-full rounded-lg border-gray-300 py-3 px-4 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
              </div>
              <motion.button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-lg bg-blue-600 px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? "Sending Code..." : "Send Reset Code"}
              </motion.button>
            </motion.form>
          </motion.div>
        ) : (
          <motion.div key="step2" variants={formContainerVariants} initial="hidden" animate="visible" exit="exit">
             <motion.div variants={itemVariants}>
              <h2 className="text-3xl font-bold leading-9 tracking-tight text-gray-900">Create New Password</h2>
              <p className="mt-2 text-sm text-gray-600">
                A 6-digit code was sent to <span className="font-medium text-gray-800">{email}</span>.
              </p>
            </motion.div>

            <motion.form onSubmit={handleResetPassword} className="mt-10 space-y-4" variants={itemVariants}>
               <div>
                <label htmlFor="otp" className="block text-sm font-medium leading-6 text-gray-900">Verification Code</label>
                <input id="otp" type="text" placeholder="Enter 6-digit code" value={otp} onChange={handleInputChange(setOtp)} maxLength="6" className="block w-full rounded-lg border-gray-300 py-3 px-4 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm tracking-[0.3em] text-center font-mono"/>
                {errors.otp && <p className="text-red-500 text-xs mt-1">{errors.otp}</p>}
              </div>
              
              <div>
                <label htmlFor="password-new" className="block text-sm font-medium leading-6 text-gray-900">New Password</label>
                <div className="relative mt-2">
                  <input id="password-new" type={showPassword ? 'text' : 'password'} placeholder="Enter new password" value={password} onChange={handleInputChange(setPassword)} className="block w-full rounded-lg border-gray-300 py-3 px-4 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"/>
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700">
                    {showPassword ? <EyeSlashIcon className="h-5 w-5"/> : <EyeIcon className="h-5 w-5"/>}
                  </button>
                </div>
                 {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

               <PasswordStrengthIndicator password={password} />
              
               <div>
                <label htmlFor="password-confirm" className="block text-sm font-medium leading-6 text-gray-900">Confirm New Password</label>
                <input id="password-confirm" type="password" placeholder="Confirm new password" value={confirmPassword} onChange={handleInputChange(setConfirmPassword)} className="block w-full mt-2 rounded-lg border-gray-300 py-3 px-4 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"/>
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>
              
              <motion.button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-lg bg-blue-600 px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? "Resetting Password..." : "Set New Password"}
              </motion.button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div className="mt-8 text-center" variants={itemVariants}>
        <button onClick={() => step === 1 ? navigate("/login") : setStep(1)} className="text-sm font-medium text-blue-600 hover:text-blue-500 flex items-center justify-center gap-1 w-full">
          <ArrowLeftIcon className="h-4 w-4" />
          {step === 1 ? "Back to Login" : "Back to email entry"}
        </button>
      </motion.div>
    </motion.div>
  );
};

export default ForgotPassword; 