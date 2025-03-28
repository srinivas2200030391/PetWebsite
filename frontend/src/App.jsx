import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  Navigate,
  useLocation,
} from "react-router-dom";
import Intro from "./pages/Hero";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Navbar from "./assets/Navbar";
import Home from "./pages/Home";
import Footer from "./pages/Footer";
import { useStore } from "./store/store";
import PropTypes from "prop-types";
import Petshop from "./pages/Petshop";
import Products from './pages/Products';
import ProductOverview from './assets/ProductOverView';
import MatingPage from "./pages/MatingPage";
import MatingPageFilter from "./pages/MatingPageFilter";
import MatingPets from "./pages/Matingpets";
import Form from "./pages/Form";
import PetSaleForm from "./assets/PetSaleForm";
import MatingForm from "./assets/MatingForm";
import BoardingPage from './pages/boarding/BoardingPage';
import BoardingShops from './pages/boarding/BoardingShops';
import BoardingShopFilter from './pages/boarding/BoardingShopFilter';
import CustomButton from "./assets/CustomButton";
// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useStore();

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
  const { logout, isAuthenticated } = useStore();

  // Cart count state removed as it's now in Home component

  const handleSignOut = () => {
    logout();
    navigate("/intro");
  };

  const noHeaderFooterRoutes = ['/', '/intro', '/login', '/signup'];
  const shouldShowHeaderFooter = !noHeaderFooterRoutes.includes(location.pathname);


  return (
    <div className="min-h-screen">
      {shouldShowHeaderFooter && <Navbar onSignOut={handleSignOut} />}
      <Routes>
        {isAuthenticated ? (
          <>
            {/* Protected Routes */}
            <Route path="/home/*" element={<Home />} />{" "}
            {/* Note the wildcard * to allow nested routes */}
            <Route path="/custombutton" element={<CustomButton />} />
            <Route path="/Petshop" element={<Petshop />} />
            <Route path="/products" element={<Products />} />
            <Route path="/productoverview" element={<ProductOverview />} />
            <Route path="/matingpage" element={<MatingPage />} />
            <Route path="/matingpagefilter" element={<MatingPageFilter />} />
            <Route path="/matingpets" element={<MatingPets />} />
            <Route path="/form" element={<Form />} />
            <Route path="/petsaleform" element={<PetSaleForm />} />
            <Route path="/matingform" element={<MatingForm />} />
            <Route path="/boardingpage" element={<BoardingPage />} />
            <Route path="/boardingshops" element={<BoardingShops />} />
            <Route path="/boardingshopfilter" element={<BoardingShopFilter />} />
            <Route path="/custombutton" element={<CustomButton />} />
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
      {shouldShowHeaderFooter && <Footer />}
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
