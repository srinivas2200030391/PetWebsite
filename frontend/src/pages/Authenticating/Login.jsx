import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Input,
  Button,
} from "@material-tailwind/react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthstore";
import { useStore } from "../store/store";
import toast from "react-hot-toast";
import axios from "axios";
import config from "../../config";
import { CpuChipIcon } from "@heroicons/react/24/solid";

// Add animation variants
const cardAnimation = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      type: "spring",
      bounce: 0.3,
    },
  },
};

export default function LoginCard() {
  const navigate = useNavigate();
  const { isLoggingIn } = useAuthStore();
  const login = useStore((state) => state.login);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        `${config.baseURL}/api/auth/login`,
        formData,
        { withCredentials: true }
      );
      localStorage.setItem("user", JSON.stringify(res.data));
      console.log("Login response:", res.data.data);
      login(res.data.data); // Update the store with the user data
      toast.success("User logged in successfully!");
      location.reload();
      navigate("/home");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="px-8 min-h-screen bg-blue-gray-900 flex items-center justify-center">
      <div className="container mx-auto h-screen grid place-items-center">
        <motion.div
          variants={cardAnimation}
          initial="hidden"
          animate="visible"
        >
          <Card
            shadow={false}
            className="md:px-24 md:py-14 py-8 border border-gray-300"
          >
            <CardHeader shadow={false} floated={false} className="text-center">
              <Typography
                variant="h1"
                color="blue-gray"
                className="mb-4 !text-3xl lg:text-4xl"
              >
                Welcome Back
              </Typography>
              <Typography className="!text-gray-600 text-[18px] font-normal md:max-w-sm">
                Sign in to access your account and continue your pet journey.
              </Typography>
            </CardHeader>
            <CardBody>
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 md:mt-12"
              >
                <div>
                  <label htmlFor="email">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="block font-medium mb-2"
                    >
                      Your Email
                    </Typography>
                  </label>
                  <Input
                    id="email"
                    color="gray"
                    size="lg"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="name@mail.com"
                    className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200"
                    labelProps={{
                      className: "hidden",
                    }}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="password">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="block font-medium mb-2"
                    >
                      Password
                    </Typography>
                  </label>
                  <Input
                    id="password"
                    color="gray"
                    size="lg"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="w-full focus:border-t-primary border-t-blue-gray-200"
                    labelProps={{
                      className: "hidden",
                    }}
                    required
                  />
                </div>

                <Button
                  size="lg"
                  color="gray"
                  fullWidth
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Continue"}
                </Button>

                <Button
                  variant="outlined"
                  size="lg"
                  className="flex h-12 border-blue-gray-200 items-center justify-center gap-2"
                  fullWidth
                >
                  <img
                    src="https://www.material-tailwind.com/logos/logo-google.png"
                    alt="google"
                    className="h-6 w-6"
                  />
                  Sign in with Google
                </Button>

                <Typography
                  variant="small"
                  className="text-center mx-auto max-w-[19rem] !font-medium !text-gray-600"
                >
                  Don&apos;t have an account?{" "}
                  <Link to="/signup" className="text-gray-900 font-bold">
                    Sign up
                  </Link>
                </Typography>

                <Typography
                  variant="small"
                  className="text-center mx-auto max-w-[19rem] !font-medium !text-gray-600"
                >
                  By signing in, you agree to our{" "}
                  <a href="#" className="text-gray-900">
                    Terms of Service
                  </a>{" "}
                  &{" "}
                  <a href="#" className="text-gray-900">
                    Privacy Policy
                  </a>
                </Typography>
              </form>
            </CardBody>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
