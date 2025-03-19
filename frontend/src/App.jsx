import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  Navigate,
  useLocation,
} from "react-router-dom";
import Image from "./image";
import Intro from "./pages/Hero";
import Login from "./pages/Login";
import CustomButton from "./assets/CustomButton";
import Signup from "./pages/Signup";
import Navbar from "./assets/Navbar";
import Home from "./pages/Home";
import Footer from "./pages/Footer";
import { useAuthStore } from "./store/store";
import PropTypes from "prop-types";
import Petshop from "./pages/Petshop";
import Products from './pages/Products';
import Boarding from './pages/Boarding';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

function App() {
  const navigate = useNavigate();
  const location = useLocation(); // Get current route
  const { logout, isAuthenticated } = useAuthStore();

  const handleSignOut = () => {
    logout();
    navigate("/intro");
  };

  return (
    <div className="min-h-screen">
      <Navbar onSignOut={handleSignOut} />
      <Routes>
        {isAuthenticated ? (
          <>
            {/* Protected Routes */}
            <Route path="/home" element={<Home />} />
            <Route path="/images" element={<Image />} />
            <Route path="/custombutton" element={<CustomButton />} />
            <Route path="/Petshop" element={<Petshop />} />
            <Route path="/products" element={<Products />} />
            <Route path="/boarding" element={<Boarding />} />
            {/* Redirect authenticated users trying to access public routes */}
            <Route path="*" element={<Navigate to="/home" replace />} />
          </>
        ) : (
          <>
            {/* Public Routes */}
            <Route path="/" element={<Intro />} />
            <Route path="/intro" element={<Intro />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            {/* Redirect unauthenticated users trying to access protected routes */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        )}
      </Routes>
      {/* Hide footer if the route is '/' */}
      {location.pathname !== "/" && <Footer />}
    </div>
  );
}

export default function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
