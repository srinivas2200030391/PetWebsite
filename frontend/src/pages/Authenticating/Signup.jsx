import { useState, Fragment } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Dialog, Transition } from "@headlessui/react";
import toast from "react-hot-toast";
import axios from "axios";
import config from "../../config";
import { EyeIcon, EyeSlashIcon, XMarkIcon } from "@heroicons/react/24/outline";

const formVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const imageVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut", delay: 0.2 } },
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
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const navigate = useNavigate();

  const validateForm = () => {
    if (!formData.fullName.trim()) return toast.error("Full name is required");
    if (!formData.phoneNumber.trim())
      return toast.error("Phone number is required");
    
    // Stricter phone number validation - must be exactly 10 digits
    const phoneDigits = formData.phoneNumber.replace(/\D/g, "");
    if (phoneDigits.length !== 10) {
      return toast.error("Phone number must be exactly 10 digits");
    }
    
    if (!formData.gmail.trim()) return toast.error("Gmail is required");
    if (!/^[^\s@]+@gmail\.com$/.test(formData.gmail)) {
      return toast.error("Please enter a valid Gmail address");
    }
    if (!formData.username.trim()) return toast.error("Username is required");
    if (formData.username.length < 3)
      return toast.error("Username must be at least 3 characters");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6)
      return toast.error("Password must be at least 6 characters");
    return true;
  };

  const sendOtp = async () => {
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const response = await axios.post(`${config.baseURL}/api/auth/getotp`, { email: formData.gmail, phone: formData.phoneNumber });
      if (response.status === 200 && response.data.success) {
        // Store OTP and convert to string to ensure consistent comparison later
        const receivedOtp = response.data.otp ? response.data.otp.toString() : "";
        setGeneratedOtp(receivedOtp);
        console.log("OTP received and stored:", receivedOtp);
        
        setShowOtpModal(true);
        toast.success("OTP sent to your email!");
      } else {
        toast.error(response.data.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error("OTP request error:", error);
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };
  
  const verifyOtpAndSignup = async () => {
    if (formData.otp.length !== 6) return toast.error("OTP must be 6 digits.");
    setIsLoading(true);
    
    try {
      // First verify that OTP matches
      if (formData.otp !== generatedOtp.toString()) {
        toast.error("Invalid OTP. Please enter the correct code.");
        setIsLoading(false);
        return;
      }
      
      // Proceed with signup only if OTP is correct
      const signupData = {
        fullName: formData.fullName,
        email: formData.gmail,
        phone: formData.phoneNumber,
        username: formData.username,
        password: formData.password,
      };
      
      const signupResponse = await axios.post(`${config.baseURL}/api/auth/signup`, signupData);
      
      if (signupResponse.data) {
        toast.success("Account created successfully!");
        setShowOtpModal(false);
        navigate("/login");
      } else {
        toast.error("Failed to create account");
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error(error.response?.data?.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendOtp();
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    verifyOtpAndSignup();
  };
  
  return (
    <>
      <motion.div
        className="flex min-h-screen bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.75 }}
      >
        {/* Left Panel: Image */}
        <motion.div 
          variants={imageVariants}
          initial="hidden"
          animate="visible"
          className="relative hidden w-0 flex-1 lg:block"
        >
          <img
            className="absolute inset-0 h-full w-full object-cover"
            src="https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=2835&auto=format&fit=crop"
            alt="A cute pug"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"/>
        </motion.div>

        {/* Right Panel: Form */}
        <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <motion.div 
            variants={formVariants}
            initial="hidden"
            animate="visible"
            className="mx-auto w-full max-w-sm lg:w-96"
          >
            <div>
              <Link to="/">
                <span className="text-3xl font-bold text-gray-900 tracking-tight">PETZU</span>
              </Link>
              <h2 className="mt-8 text-3xl font-bold leading-9 tracking-tight text-gray-900">
                Create an account
              </h2>
            </div>

            <div className="mt-10">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <input name="fullName" type="text" placeholder="Full Name" required onChange={handleInputChange} className="block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"/>
                    <input name="username" type="text" placeholder="Username" required onChange={handleInputChange} className="block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"/>
                </div>
                <input name="gmail" type="email" placeholder="Email Address" required onChange={handleInputChange} className="block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"/>
                <input name="phoneNumber" type="tel" placeholder="Phone Number" required onChange={handleInputChange} className="block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"/>
                <div className="relative">
                  <input name="password" type={showPassword ? 'text' : 'password'} placeholder="Password" required onChange={handleInputChange} className="block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"/>
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600">
                      {showPassword ? <EyeSlashIcon className="h-5 w-5"/> : <EyeIcon className="h-5 w-5"/>}
                  </button>
                </div>

                <button type="submit" disabled={isLoading} className="mt-6 flex w-full justify-center rounded-md bg-blue-600 px-3 py-2.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 disabled:bg-blue-300 transition-all">
                  {isLoading ? 'Sending OTP...' : 'Create Account'}
                </button>
              </form>

              <p className="mt-2 text-sm leading-6 text-gray-500 text-center">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-500">
                  Sign in
                </Link>
              </p>
              <div className="mt-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
                  <div className="relative flex justify-center text-sm font-medium"><span className="bg-white px-6 text-gray-500">Or</span></div>
                </div>
                <div className="mt-6">
                  <a href="#" className="flex w-full items-center justify-center gap-3 rounded-md border bg-white px-3 py-2 text-sm font-semibold text-gray-600 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                    <img src="https://www.material-tailwind.com/logos/logo-google.png" alt="Google" className="h-5 w-5" />
                    <span>Sign up with Google</span>
                  </a>
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* OTP Modal */}
      <Transition appear show={showOtpModal} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setShowOtpModal(false)}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-bold leading-6 text-gray-900 flex justify-between items-center">
                    Verify Your Account
                    <button onClick={() => setShowOtpModal(false)} className="p-1 rounded-full hover:bg-gray-100">
                      <XMarkIcon className="h-5 w-5 text-gray-500"/>
                    </button>
                  </Dialog.Title>
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">
                      Enter the 6-digit verification code sent to {formData.gmail}.
                    </p>
                    <form onSubmit={handleOtpSubmit} className="mt-4 space-y-4">
                      <input
                        name="otp"
                        type="text"
                        maxLength="6"
                        value={formData.otp}
                        onChange={(e) => setFormData(prev => ({ ...prev, otp: e.target.value.replace(/\D/g, "") }))}
                        className="w-full text-center text-2xl tracking-[0.5em] font-mono rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="_ _ _ _ _ _"
                      />
                       <p className="text-xs text-center text-gray-500">
                        Didn't receive the code?{' '}
                        <button type="button" onClick={sendOtp} disabled={isLoading} className="font-medium text-blue-600 hover:underline">
                          Resend OTP
                        </button>
                      </p>
                    </form>
                  </div>
                  <div className="mt-6 flex justify-end gap-3">
                    <button type="button" onClick={() => setShowOtpModal(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-transparent rounded-md hover:bg-gray-200">
                      Cancel
                    </button>
                    <button type="button" onClick={handleOtpSubmit} disabled={isLoading} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:bg-blue-300">
                      {isLoading ? 'Verifying...' : 'Verify & Create'}
                    </button>
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
