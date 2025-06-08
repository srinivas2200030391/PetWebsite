import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../store/useAuthstore";
import { useStore } from "../store/store";
import toast from "react-hot-toast";
import axios from "axios";
import config from "../../config";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

// Animation variants for the form
const formVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
  exit: { 
    scale: 0.8, 
    opacity: 0, 
    transition: { duration: 0.5, ease: "easeInOut" }
  }
};

// Animation variants for the image panel
const imageVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut", delay: 0.2 } },
  exit: { 
    scale: 0.8, 
    opacity: 0, 
    transition: { duration: 0.5, ease: "easeInOut" }
  }
};

// Cloud animation variants
const cloudOverlayVariants = {
  hidden: { 
    clipPath: `circle(0% at 50% 50%)`, 
    opacity: 0 
  },
  visible: { 
    clipPath: `circle(150% at 50% 50%)`, 
    opacity: 1,
    transition: { 
      clipPath: { duration: 2, ease: "easeInOut" },
      opacity: { duration: 1, ease: "easeOut" }
    }
  }
};

export default function LoginPage() {
  const navigate = useNavigate();
  const { isLoggingIn, setAuthUser } = useAuthStore();
  const login = useStore((state) => state.login);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [transitionState, setTransitionState] = useState("initial"); // "initial", "scaling", "clouds", "navigating"

  // Cleanup effect to handle navigation away during transition
  useEffect(() => {
    return () => {
      // If component unmounts during transition, clean up
      if (transitionState === "scaling" || transitionState === "clouds") {
        console.log("Login component unmounted during transition, cleaning up");
        // Check if we actually completed auth before removing
        if (!localStorage.getItem("user")) {
          localStorage.removeItem("comingFromLogin");
        }
      }
    };
  }, [transitionState]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Begin the transition sequence
  const startTransition = () => {
    console.log("Starting login transition sequence");
    // Set the flag FIRST to ensure it's available when Home mounts
    localStorage.setItem("comingFromLogin", "true");
    
    setTransitionState("scaling");
    
    // After the form scales down, show the clouds
    setTimeout(() => {
      console.log("Starting cloud animation");
      setTransitionState("clouds");
      
      // After the clouds fill the screen, navigate
      setTimeout(() => {
        console.log("Navigating to home");
        navigate("/home");
      }, 2000); // Extended cloud animation duration to 2 seconds
    }, 1000); // Extended scale animation duration to 1 second
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return toast.error("Please enter both email and password.");
    }
    setLoading(true);
    try {
      const res = await axios.post(
        `${config.baseURL}/api/auth/login`,
        formData,
        { withCredentials: true }
      );
      localStorage.setItem("user", JSON.stringify(res.data));
      setAuthUser(res.data);
      login(res.data.data);
      
      // Clean, direct approach - no transition animations
      navigate("/home");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed. Please check your credentials.");
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      <AnimatePresence>
        {transitionState === "clouds" && (
          <motion.div
            className="fixed inset-0 z-50 bg-white"
            variants={cloudOverlayVariants}
            initial="hidden"
            animate="visible"
          />
        )}
      </AnimatePresence>

      <motion.div
        className="flex min-h-screen bg-white"
        initial={{ opacity: 1 }}
        animate={{ 
          opacity: transitionState === "scaling" || transitionState === "clouds" ? 0.8 : 1,
          scale: transitionState === "scaling" || transitionState === "clouds" ? 0.9 : 1,
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        {/* Left Panel: Form */}
        <div className="flex flex-1 flex-col justify-center px-4 py-8 sm:py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <motion.div 
            variants={formVariants}
            initial="hidden"
            animate={transitionState === "initial" ? "visible" : "exit"}
            className="mx-auto w-full max-w-sm lg:w-96"
          >
            <div>
              <Link to="/">
                <span className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">PETZU</span>
              </Link>
              <h2 className="mt-6 sm:mt-8 text-2xl sm:text-3xl font-bold leading-9 tracking-tight text-gray-900">
                Welcome Back
              </h2>
            </div>

            <div className="mt-8 sm:mt-10">
              <div>
                <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                      Email address
                    </label>
                    <div className="mt-2">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="block w-full rounded-md border-0 py-3 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 min-h-[44px]"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                      Password
                    </label>
                    <div className="mt-2 relative">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        required
                        value={formData.password}
                        onChange={handleInputChange}
                        className="block w-full rounded-md border-0 py-3 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 min-h-[44px]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 min-w-[44px] min-h-[44px] touch-manipulation"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeSlashIcon className="h-5 w-5"/> : <EyeIcon className="h-5 w-5"/>}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm leading-6">
                      <a href="#" className="font-semibold text-blue-600 hover:text-blue-500 py-2 inline-block">
                        Forgot password?
                      </a>
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:bg-blue-300 transition-all duration-300 active:scale-95 min-h-[44px] touch-manipulation"
                    >
                      {loading ? "Signing in..." : "Sign in"}
                    </button>
                  </div>
                </form>
                <p className="mt-4 text-sm leading-6 text-gray-500 text-center">
                Don't have an account?{' '}
                  <Link to="/signup" className="font-semibold text-blue-600 hover:text-blue-500 py-2 inline-block">
                  Sign up
                </Link>
              </p>
              </div>

              <div className="mt-8 sm:mt-10">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-sm font-medium leading-6">
                    <span className="bg-white px-6 text-gray-500">Or continue with</span>
                  </div>
                </div>

                <div className="mt-6">
                  <a
                    href="#"
                    className="flex w-full items-center justify-center gap-3 rounded-md border bg-white px-3 py-3 text-sm font-semibold text-gray-600 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:ring-transparent active:bg-gray-100 active:scale-95 min-h-[44px] touch-manipulation"
                  >
                    <img src="https://www.material-tailwind.com/logos/logo-google.png" alt="Google" className="h-5 w-5" />
                    <span className="text-sm font-semibold leading-6">Google</span>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Panel: Image */}
        <div className="relative hidden lg:block lg:flex-1">
        <motion.div 
          variants={imageVariants}
          initial="hidden"
          animate={transitionState === "initial" ? "visible" : "exit"}
            className="absolute inset-0"
        >
          <img
              className="h-full w-full object-cover"
              src="https://images.unsplash.com/photo-1615789591457-74a63395c990?q=80&w=1687&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Pet background"
          />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/40" />
            <div className="absolute inset-0 bg-blue-900/20" />
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <h3 className="text-2xl font-bold mb-2">Find Your Perfect Pet Companion</h3>
              <p className="text-white/80">Join PETZU to discover adorable pets and quality services.</p>
            </div>
        </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
