import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Input,
  Button,
} from "@material-tailwind/react";
import { motion } from "framer-motion";
import { useAuthStore } from '../store/useAuthstore';
import toast from 'react-hot-toast';

const cardAnimation = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      type: "spring",
      bounce: 0.3
    }
  }
};

export default function Signup() {
  const [formData, setFormData] = useState({ fullname: '', email: '', password: '' });
  const { signup, isSigningUp } = useAuthStore();
  const navigate = useNavigate();

  const validateForm = () => {
    if (!formData.fullname.trim()) return toast.error('Full name is required');
    if (!formData.email.trim()) return toast.error('Email is required');
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error('Invalid email format');
    if (!formData.password) return toast.error('Password is required');
    if (formData.password.length < 6) return toast.error('Password must be at least 6 characters');
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const sucess = validateForm();
    if(sucess === true){
      
     signup(formData);
    navigate('/home');
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
                Create Your Account
              </Typography>
              <Typography className="!text-gray-600 text-[18px] font-normal md:max-w-sm">
                Join our pet-loving community and start your journey with us.
              </Typography>
            </CardHeader>
            <CardBody>
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 md:mt-12"
              >
                <div>
                  <label htmlFor="fullname">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="block font-medium mb-2"
                    >
                      Full Name
                    </Typography>
                  </label>
                  <Input
                    id="fullname"
                    color="gray"
                    size="lg"
                    type="text"
                    name="fullname"
                    value={formData.fullname}
                    onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                    placeholder="John Doe"
                    className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200"
                    labelProps={{
                      className: "hidden",
                    }}
                    required
                  />
                </div>

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
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
                  disabled={isSigningUp}
                >
                  {isSigningUp ? "Creating Account..." : "Sign Up"}
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
                  Sign up with Google
                </Button>

                <Typography
                  variant="small"
                  className="text-center mx-auto max-w-[19rem] !font-medium !text-gray-600"
                >
                  Already have an account?{" "}
                  <Link to="/login" className="text-gray-900 font-bold">
                    Sign in
                  </Link>
                </Typography>

                <Typography
                  variant="small"
                  className="text-center mx-auto max-w-[19rem] !font-medium !text-gray-600"
                >
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
  );
}
