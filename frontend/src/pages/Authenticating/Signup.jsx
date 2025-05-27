import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Input,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import axios from "axios";
import config from "../../config";

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


export default function Signup() {
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
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  const navigate = useNavigate();

  const validateForm = () => {
    if (!formData.fullName.trim()) return toast.error("Full name is required");
    if (!formData.phoneNumber.trim())
      return toast.error("Phone number is required");
    if (
      !/^\+?[\d\s\-\(\)]{10,}$/.test(formData.phoneNumber.replace(/\s/g, ""))
    ) {
      return toast.error("Invalid phone number format");
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

  const validateOtp = () => {
    if (!formData.otp.trim()) return toast.error("OTP is required");
    if (formData.otp.length !== 6) return toast.error("OTP must be 6 digits");
    return true;
  };

  // Send OTP to user's phone/email
  const sendOtp = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(`${config.baseURL}/api/auth/getotp`, {
        email: formData.gmail,
      });
      console.log(response.data);
      
      if (response.status===200) {
        setOtpSent(true);
        setShowOtpModal(true);
        toast.success("OTP sent successfully!");
        setOtp(response.data.otp);
      } else {
        toast.error(response.data.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  // Verify OTP and complete signup
  const verifyOtpAndSignup = async () => {
    try {
      setIsLoading(true);
      console.log("Verifying OTP:", formData.otp);
      console.log("Expected OTP:", otp);
      
      // First verify OTP
      if (otp == formData.otp) {
        toast.success("OTP verified successfully!");
      } else{
        toast.error("Invalid OTP");
        return;
      }

      // If OTP is valid, proceed with signup
      const signupResponse = await axios.post(`${config.baseURL}/api/auth/signup`, {
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        gmail: formData.gmail,
        username: formData.username,
        password: formData.password,
      });
      console.log("Signup response:", signupResponse.data);
      if (signupResponse.data) {
        toast.success("Account created successfully!");
        setShowOtpModal(false);
        navigate("/home");
      } else {
        toast.error(signupResponse.data.message || "Failed to create account");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      toast.error(error.response?.data?.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if (isValid === true) {
      sendOtp();
    }
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    const isValid = validateOtp();
    if (isValid === true) {
      verifyOtpAndSignup();
    }
  };

  const resendOtp = async () => {
    await sendOtp();
  };

  const closeOtpModal = () => {
    setShowOtpModal(false);
    setFormData({ ...formData, otp: "" });
  };

  return (
    <>
      <section className="px-8 min-h-screen bg-blue-gray-900 flex items-center justify-center">
        <div className="container mx-auto h-[80%] grid place-items-center">
          <motion.div
            variants={cardAnimation}
            initial="hidden"
            animate="visible">
            <Card
              shadow={false}
              className="md:px-24 md:py-14 py-8 border border-gray-300 max-w-6xl w-full">
              <CardHeader
                shadow={false}
                floated={false}
                className="text-center">
                <Typography
                  variant="h1"
                  color="blue-gray"
                  className="mb-4 !text-3xl lg:text-4xl">
                  Create Your Account
                </Typography>
                <Typography className="!text-gray-600 text-[18px] font-normal md:max-w-lg mx-auto">
                  Join our pet-loving community and start your journey with us.
                </Typography>
              </CardHeader>
              <CardBody>
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-6 md:mt-12">
                  {/* First Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="fullName">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="block font-medium mb-2">
                          Full Name
                        </Typography>
                      </label>
                      <Input
                        id="fullName"
                        color="gray"
                        size="lg"
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={(e) =>
                          setFormData({ ...formData, fullName: e.target.value })
                        }
                        placeholder="John Doe"
                        className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200"
                        labelProps={{
                          className: "hidden",
                        }}
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="phoneNumber">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="block font-medium mb-2">
                          Phone Number
                        </Typography>
                      </label>
                      <Input
                        id="phoneNumber"
                        color="gray"
                        size="lg"
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            phoneNumber: e.target.value,
                          })
                        }
                        placeholder="+1 (555) 123-4567"
                        className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200"
                        labelProps={{
                          className: "hidden",
                        }}
                        required
                      />
                    </div>
                  </div>

                  {/* Second Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="gmail">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="block font-medium mb-2">
                          Gmail
                        </Typography>
                      </label>
                      <Input
                        id="gmail"
                        color="gray"
                        size="lg"
                        type="email"
                        name="gmail"
                        value={formData.gmail}
                        onChange={(e) =>
                          setFormData({ ...formData, gmail: e.target.value })
                        }
                        placeholder="name@gmail.com"
                        className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200"
                        labelProps={{
                          className: "hidden",
                        }}
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="username">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="block font-medium mb-2">
                          Username
                        </Typography>
                      </label>
                      <Input
                        id="username"
                        color="gray"
                        size="lg"
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={(e) =>
                          setFormData({ ...formData, username: e.target.value })
                        }
                        placeholder="johndoe123"
                        className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200"
                        labelProps={{
                          className: "hidden",
                        }}
                        required
                      />
                    </div>
                  </div>

                  {/* Third Row */}
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                    <div>
                      <label htmlFor="password">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="block font-medium mb-2">
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
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        placeholder="••••••••"
                        className="w-full focus:border-t-primary border-t-blue-gray-200"
                        labelProps={{
                          className: "hidden",
                        }}
                        required
                      />
                    </div>
                  </div>

                  <Button
                    size="lg"
                    color="gray"
                    fullWidth
                    type="submit"
                    disabled={isLoading}
                    className="mt-4">
                    {isLoading ? "Sending OTP..." : "Sign Up"}
                  </Button>

                  <Button
                    variant="outlined"
                    size="lg"
                    className="flex h-12 border-blue-gray-200 items-center justify-center gap-2"
                    fullWidth>
                    <img
                      src="https://www.material-tailwind.com/logos/logo-google.png"
                      alt="google"
                      className="h-6 w-6"
                    />
                    Sign up with Google
                  </Button>

                  <Typography
                    variant="small"
                    className="text-center mx-auto max-w-[19rem] !font-medium !text-gray-600">
                    Already have an account?{" "}
                    <Link to="/login" className="text-gray-900 font-bold">
                      Sign in
                    </Link>
                  </Typography>

                  <Typography
                    variant="small"
                    className="text-center mx-auto max-w-[19rem] !font-medium !text-gray-600">
                    By signing up, you agree to our{" "}
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

      {/* OTP Verification Modal */}
      <Dialog
        open={showOtpModal}
        handler={closeOtpModal}
        size="sm"
        className="bg-white">
        <DialogHeader className="text-center">
          <Typography variant="h4" color="blue-gray" className="mx-auto">
            Verify Your Account
          </Typography>
        </DialogHeader>
        <DialogBody className="text-center">
          <Typography className="mb-6 text-gray-600">
            We've sent a 6-digit verification code to your phone number and
            email address.
          </Typography>

          <form onSubmit={handleOtpSubmit}>
            <div className="mb-6">
              <label htmlFor="otp">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="block font-medium mb-2 text-left">
                  Enter OTP
                </Typography>
              </label>
              <Input
                id="otp"
                color="gray"
                size="lg"
                type="text"
                name="otp"
                value={formData.otp}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    otp: e.target.value.replace(/\D/g, "").slice(0, 6),
                  })
                }
                placeholder="123456"
                className="w-full text-center text-2xl tracking-widest font-mono"
                labelProps={{
                  className: "hidden",
                }}
                maxLength={6}
                required
              />
            </div>

            <Typography variant="small" className="text-gray-500 mb-4">
              Didn't receive the code?{" "}
              <button
                type="button"
                onClick={resendOtp}
                disabled={isLoading}
                className="text-blue-500 hover:text-blue-700 font-medium underline">
                Resend OTP
              </button>
            </Typography>
          </form>
        </DialogBody>
        <DialogFooter className="flex gap-2">
          <Button
            variant="outlined"
            color="red"
            onClick={closeOtpModal}
            disabled={isLoading}
            className="flex-1">
            Cancel
          </Button>
          <Button
            color="green"
            onClick={handleOtpSubmit}
            disabled={isLoading}
            className="flex-1">
            {isLoading ? "Verifying..." : "Verify & Create Account"}
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
