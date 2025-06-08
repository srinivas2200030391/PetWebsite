import { useState, Fragment } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Dialog, Transition } from "@headlessui/react";
import toast from "react-hot-toast";
import axios from "axios";
import config from "../../config";
import { EyeIcon, EyeSlashIcon, XMarkIcon } from "@heroicons/react/24/outline";

// Animation variants
const formContainerVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, staggerChildren: 0.05, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    x: -50,
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

export default function SignupPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    gmail: "",
    username: "",
    password: "",
    otp: "",
  });
  const [errors, setErrors] = useState({});
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else {
      const phoneDigits = formData.phoneNumber.replace(/\D/g, "");
      if (phoneDigits.length !== 10) {
        newErrors.phoneNumber = "Phone number must be exactly 10 digits";
      }
    }
    if (!formData.gmail.trim()) {
      newErrors.gmail = "Gmail is required";
    } else if (!/^[^\s@]+@gmail\.com$/.test(formData.gmail)) {
      newErrors.gmail = "Please enter a valid Gmail address";
    }
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters long.";
    } else if (formData.username.length > 20) {
      newErrors.username = "Username cannot be more than 20 characters long.";
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = "Invalid username format";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    } else {
      let score = 0;
      if (formData.password.length >= 12) score++;
      if (/[A-Z]/.test(formData.password)) score++;
      if (/[0-9]/.test(formData.password)) score++;
      if (/[^A-Za-z0-9]/.test(formData.password)) score++;
      if (score < 3) { // Corresponds to 'Good' strength, requires at least 3 of the criteria
        newErrors.password = "Password is not strong enough";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sendOtp = async () => {
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const response = await axios.post(`${config.baseURL}/api/auth/getotp`, { email: formData.gmail, phone: formData.phoneNumber, username: formData.username });
      if (response.status === 200 && response.data.success) {
        const receivedOtp = response.data.otp ? response.data.otp.toString() : "";
        setGeneratedOtp(receivedOtp);
        setShowOtpModal(true);
        toast.success("OTP sent to your email!");
      } else {
        toast.error(response.data.message || "Failed to send OTP");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };
  
  const verifyOtpAndSignup = async () => {
    if (formData.otp.length !== 6) return toast.error("OTP must be 6 digits.");
    setIsLoading(true);
    
    try {
      if (formData.otp !== generatedOtp.toString()) {
        toast.error("Invalid OTP. Please enter the correct code.");
        setIsLoading(false);
        return;
      }
      
      const signupData = {
        fullName: formData.fullName,
        email: formData.gmail,
        phone: formData.phoneNumber,
        username: formData.username,
        password: formData.password,
      };
      
      const signupResponse = await axios.post(`${config.baseURL}/api/auth/signup`, signupData);
      
      if (signupResponse.data) {
        toast.success("Account created successfully! Please log in.");
        setShowOtpModal(false);
        navigate("/login");
      } else {
        toast.error("Failed to create account");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendOtp();
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    verifyOtpAndSignup();
  };

  const handleGoogleSignup = () => {
    const toastId = toast.loading("Redirecting to Google...");
    setTimeout(() => {
      toast.dismiss(toastId);
      toast.error("Google sign-up is not yet implemented.", { duration: 3000 });
    }, 2000);
  };
  
  return (
    <>
      <motion.div
        className="mx-auto w-full max-w-sm lg:w-96"
        variants={formContainerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <motion.div variants={itemVariants}>
            <Link to="/">
            <span className="text-3xl font-bold tracking-tight text-gray-900">PETZU</span>
            </Link>
            <h2 className="mt-8 text-3xl font-bold leading-9 tracking-tight text-gray-900">
            Create an account
            </h2>
            <p className="mt-2 text-sm text-gray-600">
            Join our pet-loving community. It's free!
            </p>
        </motion.div>

        <motion.div variants={itemVariants} className="mt-10">
            <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input name="fullName" type="text" placeholder="Full Name" required value={formData.fullName} onChange={handleInputChange} className="block w-full rounded-lg border-gray-300 py-3 px-4 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"/>
                {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
              </div>
              <div>
                <input name="username" type="text" placeholder="Username " required value={formData.username} onChange={handleInputChange} className="block w-full rounded-lg border-gray-300 py-3 px-4 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"/>
                {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
              </div>
            </div>
            <div>
              <input name="gmail" type="email" placeholder="Email Address" required value={formData.gmail} onChange={handleInputChange} className="block w-full rounded-lg border-gray-300 py-3 px-4 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"/>
              {errors.gmail && <p className="text-red-500 text-xs mt-1">{errors.gmail}</p>}
            </div>
            <div>
              <input name="phoneNumber" type="tel" placeholder="Phone Number" required value={formData.phoneNumber} onChange={handleInputChange} className="block w-full rounded-lg border-gray-300 py-3 px-4 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"/>
              {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
            </div>
            <div className="relative">
                <input name="password" type={showPassword ? 'text' : 'password'} placeholder="Password" required value={formData.password} onChange={handleInputChange} className="block w-full rounded-lg border-gray-300 py-3 px-4 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"/>
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700">
                    {showPassword ? <EyeSlashIcon className="h-5 w-5"/> : <EyeIcon className="h-5 w-5"/>}
                </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs -mt-2 mb-2">{errors.password}</p>}

            <PasswordStrengthIndicator password={formData.password} />

            <motion.button type="submit" disabled={isLoading} className="flex w-full justify-center rounded-lg bg-blue-600 px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                {isLoading ? 'Sending OTP...' : 'Create Account'}
            </motion.button>
            </form>
            
            <p className="mt-8 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold leading-6 text-blue-600 hover:text-blue-500">
                Sign in
            </Link>
            </p>

            <div className="mt-8">
            <div className="relative">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300" /></div>
                <div className="relative flex justify-center text-sm font-medium"><span className="bg-gray-50 px-4 text-gray-500">Or</span></div>
            </div>
            <div className="mt-6">
                <motion.button onClick={handleGoogleSignup} className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm font-semibold text-gray-800 shadow-sm hover:bg-gray-100 focus-visible:ring-transparent" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <img src="https://www.material-tailwind.com/logos/logo-google.png" alt="Google" className="h-5 w-5" />
                <span>Sign up with Google</span>
                </motion.button>
            </div>
            </div>
        </motion.div>
      </motion.div>

      {/* OTP Modal */}
      <Transition appear show={showOtpModal} as={Fragment}>
        <Dialog as="div" className="relative z-50 font-sans" onClose={() => setShowOtpModal(false)}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-xl font-bold leading-6 text-gray-900 flex justify-between items-center">
                    Verify Your Account
                    <button onClick={() => setShowOtpModal(false)} className="p-1 rounded-full hover:bg-gray-100 transition-colors">
                      <XMarkIcon className="h-6 w-6 text-gray-500"/>
                    </button>
                  </Dialog.Title>
                  <div className="mt-4">
                    <p className="text-sm text-gray-600">
                      Enter the 6-digit verification code sent to <span className="font-medium text-gray-800">{formData.gmail}</span>.
                    </p>
                    <form onSubmit={handleOtpSubmit} className="mt-6 space-y-4">
                      <input
                        name="otp"
                        type="text"
                        maxLength="6"
                        value={formData.otp}
                        onChange={(e) => setFormData(prev => ({ ...prev, otp: e.target.value.replace(/\D/g, "") }))}
                        className="w-full text-center text-3xl tracking-[0.3em] font-mono rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3"
                        placeholder="______"
                      />
                       <p className="text-xs text-center text-gray-500">
                        Didn't receive the code?{' '}
                        <button type="button" onClick={sendOtp} disabled={isLoading} className="font-medium text-blue-600 hover:underline disabled:text-gray-400 disabled:no-underline">
                          Resend OTP
                        </button>
                      </p>
                    </form>
                  </div>
                  <div className="mt-8 flex justify-end gap-3">
                    <motion.button type="button" onClick={() => setShowOtpModal(false)} className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 border border-transparent rounded-lg hover:bg-gray-200 transition-colors" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      Cancel
                    </motion.button>
                    <motion.button type="button" onClick={handleOtpSubmit} disabled={isLoading} className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-500 disabled:opacity-50 transition-colors" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      {isLoading ? 'Verifying...' : 'Verify & Create'}
                    </motion.button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

