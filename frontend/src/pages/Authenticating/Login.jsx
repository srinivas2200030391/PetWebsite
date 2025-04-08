import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Checkbox,
  Button,
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthstore"; 
import axios from "axios";
import config from "../../config";

export default function LoginCard() {
  const navigate = useNavigate();
  const { login, isLoggingIn } = useAuthStore(); 
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // if (!email || !password) {
    //   return toast.error("Please fill in all fields.");
    // }
    // }
    // if (!/\S+@\S+\.\S+/.test(email)) {
    //   return toast.error("Invalid email format.");
    // }
    // if (password.length < 6) {
    //   return toast.error("Password must be at least 6 characters.");
    // }
    const success = await axios.post(`${config.baseURL}/api/auth/login`,formData);
    if (success) {
    navigate("/home"); 
    }

  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(155, 143, 143, 0.8), rgba(255, 255, 255, 0.8)), 
        url('https://th.bing.com/th/id/OIP.nLlxitLDCgisRaAh44NfPgHaGX?w=220&h=189&c=7&r=0&o=5&dpr=2&pid=1.7')`,
      }}
    >
      <div className="flex justify-center items-center h-screen">
        <Card className="w-96 shadow-xl">
          <CardHeader
            variant="gradient"
            color="gray"
            className="mb-4 grid h-28 place-items-center"
          >
            <Typography variant="h3" color="white">
              Sign In
            </Typography>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardBody className="flex flex-col gap-4">
              <Input
                label="Email"
                size="lg"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <Input
                label="Password"
                size="lg"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              <div className="-ml-2.5">
                <Checkbox
                  label="Remember Me"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                />
              </div>
            </CardBody>
            <CardFooter className="pt-0">
              <Button
                variant="gradient"
                fullWidth
                type="submit"
                disabled={isLoggingIn}
              >
                {isLoggingIn ? "Logging in..." : "Login"}
              </Button>
              <Typography variant="small" className="mt-6 flex justify-center">
                Don&apos;t have an account?
                <Typography
                  as={Link}
                  to="/signup"
                  variant="small"
                  color="blue-gray"
                  className="ml-1 font-bold"
                >
                  Sign up
                </Typography>
              </Typography>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
