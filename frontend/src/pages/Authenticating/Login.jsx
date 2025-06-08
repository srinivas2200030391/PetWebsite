import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/useAuthstore";
import { useStore } from "../store/store";
import toast from "react-hot-toast";
import axios from "axios";
import config from "../../config";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

// Animation variants
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
    scale: 0.95,
    transition: { 
      duration: 0.4, 
      ease: "easeInOut", 
      opacity: { duration: 0.3 },
      x: { duration: 0.5, ease: "easeOut" },
      scale: { duration: 0.3, ease: "easeIn" }
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function LoginPage() {
  const navigate = useNavigate();
  const { setAuthUser } = useAuthStore();
  const login = useStore((state) => state.login);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Please enter your email address.";
    }
    if (!formData.password) {
      newErrors.password = "Please enter your password.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
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
      setTimeout(() => {
        navigate("/home", { state: { from: "login" } });
      }, 1500);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Login failed. Please check your credentials."
      );
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const toastId = toast.loading("Redirecting to Google...");
    setTimeout(() => {
      toast.dismiss(toastId);
      toast.error("Google sign-in is not yet implemented.", { duration: 3000 });
    }, 2000);
  };

  return (
          <motion.div
      variants={formContainerVariants}
            initial="hidden"
            animate="visible"
      exit="exit"
            className="mx-auto w-full max-w-sm lg:w-96"
          >
      <motion.div variants={itemVariants}>
              <Link to="/">
          <motion.span 
            layoutId="logo"
            className="text-3xl font-bold tracking-tight text-gray-900"
          >
            PETZU
          </motion.span>
              </Link>
        <h2 className="mt-8 text-3xl font-bold leading-9 tracking-tight text-gray-900">
                Welcome Back
              </h2>
        <p className="mt-2 text-sm text-gray-600">
          Ready to pamper your pet? Sign in to continue.
        </p>
      </motion.div>

      <motion.div variants={itemVariants} className="mt-10">
        <form onSubmit={handleSubmit} className="space-y-6">
              <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Email or Username
                    </label>
                    <div className="mt-2">
                      <input
                        id="email"
                        name="email"
                type="text"
                autoComplete="username"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                className="block w-full rounded-lg border-gray-300 py-3 px-4 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email}</p>
              )}
                    </div>
                  </div>

                  <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
                      Password
                    </label>
                    <div className="mt-2 relative">
                      <input
                        id="password"
                        name="password"
                type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        required
                        value={formData.password}
                        onChange={handleInputChange}
                className="block w-full rounded-lg border-gray-300 py-3 px-4 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 transition-colors"
                aria-label={
                  showPassword ? "Hide password" : "Show password"
                }
                      >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
                      </button>
                    </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password}</p>
            )}
                  </div>

                  <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link
                to="/forgot-password"
                className="font-semibold text-blue-600 hover:text-blue-500"
              >
                        Forgot password?
              </Link>
                    </div>
                  </div>

                  <div>
            <motion.button
                      type="submit"
                      disabled={loading}
              className="flex w-full justify-center rounded-lg bg-blue-600 px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
                    >
                      {loading ? "Signing in..." : "Sign in"}
            </motion.button>
                  </div>
                </form>

        <p className="mt-8 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-semibold leading-6 text-blue-600 hover:text-blue-500"
          >
            Sign up for free
                </Link>
              </p>

        <div className="mt-8">
                <div className="relative">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <div className="w-full border-t border-gray-300" />
                  </div>
            <div className="relative flex justify-center text-sm font-medium">
              <span className="bg-gray-50 px-4 text-gray-500">
                Or continue with
              </span>
                  </div>
                </div>

                <div className="mt-6">
            <motion.button
              onClick={handleGoogleLogin}
              className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm font-semibold text-gray-800 shadow-sm hover:bg-gray-100 focus-visible:ring-transparent"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
        >
          <img
                src="https://www.material-tailwind.com/logos/logo-google.png"
                alt="Google"
                className="h-5 w-5"
              />
              <span>Sign in with Google</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
