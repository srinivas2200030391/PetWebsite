import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./pages/Footer";
import Intro from "./pages/Intro";
import Login from "./pages/Authenticating/Login";
import Signup from "./pages/Authenticating/Signup";
import AuthLayout from "./pages/Authenticating/AuthLayout";
import Home from "./pages/Home";
import Petshop from "./pages/petshop/Petshop";
import MatingPage from "./pages/Mating/MatingPage";
import Form from "./components/AppointmentFrom";
import PetSaleForm from "./components/PetSaleForm";
import MatingForm from "./components/MatingForm";
import BoardingShops from "./pages/boarding/BoardingShops";
import BoardingShopEntry from "./pages/boarding/BoardingShopEntry";
import BoardingCenterDetail from "./pages/boarding/BoardingCenterDetail";
import AddBoardingShop from "./pages/boarding/AddBoardingShop";
import CustomButton from "./components/CustomButton";
import AboutPets from "./pages/About/AboutPets";
import { useAuthStore } from "./pages/store/useAuthstore";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import Breeds from "./pages/About/Breeds";
import BreedDetailPage from "./pages/About/BreedDetailPage";
import { ProductProvider } from "./context/ProductContext";
import PetServices from "./pages/Services/PetServices";
import Grooming from "./pages/Services/GroomingPage";
import HealthCarepage from "./pages/Health_Care/HealthCarepage";
import Vets from "./pages/Health_Care/Vets";
import PetDetail from "./pages/petshop/PetDetail";
import NewBoardingRequest from "./pages/boarding/NewBoardingRequest";
import PrivateRoute from "./components/PrivateRoute";
import MyPet from './pages/My_Pet/MyPet';
import PetDetails from './pages/My_Pet/PetDetails';
import PetHealth from './pages/My_Pet/PetHealth';
import { AnimatePresence } from "framer-motion";
import ForgotPassword from "./pages/Authenticating/ForgotPassword";
import BottomNavbar from "./components/BottomNavbar";

const App = () => {
  const { authUser, checkAuth, ischeckingAuth } = useAuthStore();
  const location = useLocation();
  
  const authRoutes = ["/login", "/signup", "/forgot-password"];
  const showNavAndFooter = !authRoutes.includes(location.pathname);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Simple check to ensure events are properly bound after navigation
  useEffect(() => {
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 100);
  }, []);

  if (ischeckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

    return (
      <ProductProvider>
        <div className="min-h-screen">
          {showNavAndFooter && <Navbar />}
          <AnimatePresence 
            mode="wait"
            onExitComplete={() => window.scrollTo(0, 0)}
          >
            <Routes location={location} key={location.pathname}>
            {/* Private Routes */}
            <Route
              path="/home/*"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />
            <Route
              path="/custombutton"
              element={
                <PrivateRoute>
                  <CustomButton />
                </PrivateRoute>
              }
            />
            <Route
              path="/petshop"
              element={
                <PrivateRoute>
                  <Petshop />
                </PrivateRoute>
              }
            />
            <Route
              path="/matingpage"
              element={
                <PrivateRoute>
                  <MatingPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/form"
              element={
                <PrivateRoute>
                  <Form />
                </PrivateRoute>
              }
            />
            <Route
              path="/petsaleform"
              element={
                <PrivateRoute>
                  <PetSaleForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/matingform"
              element={
                <PrivateRoute>
                  <MatingForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/pet/:petId"
              element={
                <PrivateRoute>
                  <PetDetail />
                </PrivateRoute>
              }
            />
            <Route
              path="/boardingshops"
              element={
                <PrivateRoute>
                  <BoardingShops />
                </PrivateRoute>
              }
            />
            <Route
              path="/newboardingrequest"
              element={
                <PrivateRoute>
                  <NewBoardingRequest />
                </PrivateRoute>
              }
            />
            <Route
              path="/my-pets"
              element={
                <PrivateRoute>
                  <MyPet />
                </PrivateRoute>
              }
            />
            <Route
              path="/my-pets/:petId"
              element={
                <PrivateRoute>
                  <PetDetails />
                </PrivateRoute>
              }
            />
            <Route
              path="/pet-health/:petId"
              element={
                <PrivateRoute>
                  <PetHealth />
                </PrivateRoute>
              }
            />
            <Route
              path="/boarding"
              element={
                <PrivateRoute>
                  <BoardingShopEntry />
                </PrivateRoute>
              }
            />
            <Route
              path="/boardingpage"
              element={<Navigate to="/boarding" />}
            />
            <Route
              path="/boardingshopfilter"
              element={<Navigate to="/boarding" />}
            />
            <Route
              path="/boardingcenter/:boardingId"
              element={
                <PrivateRoute>
                  <BoardingCenterDetail />
                </PrivateRoute>
              }
            />
            <Route
              path="/newboardingrequest/:vendorId"
              element={
                <PrivateRoute>
                  <NewBoardingRequest />
                </PrivateRoute>
              }
            />
            <Route
              path="/add-boarding"
              element={
                <PrivateRoute>
                  <AddBoardingShop />
                </PrivateRoute>
              }
            />
            <Route
              path="/aboutpets"
              element={
                <PrivateRoute>
                  <AboutPets />
                </PrivateRoute>
              }
            />
            <Route
              path="/breeds/:item"
              element={
                <PrivateRoute>
                  <Breeds />
                </PrivateRoute>
              }
            />
            <Route
              path="/pet/breeds/:item"
              element={
                <PrivateRoute>
                  <BreedDetailPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/petservices"
              element={
                <PrivateRoute>
                  <PetServices />
                </PrivateRoute>
              }
            />
            <Route
              path="/grooming"
              element={
                <PrivateRoute>
                  <Grooming />
                </PrivateRoute>
              }
            />
            <Route
              path="/healthcare"
              element={
                <PrivateRoute>
                  <HealthCarepage />
                </PrivateRoute>
              }
            />
            <Route
              path="/vets"
              element={
                <PrivateRoute>
                  <Vets />
                </PrivateRoute>
              }
            />

              {/* Authentication Routes */}
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
              </Route>
    
            {/* Public Routes */}
            <Route path="/" element={<Intro />} />
            <Route path="/intro" element={<Intro />} />
    
            {/* Catch-all */}
              <Route path="*" element={<Navigate to={authUser ? "/home" : "/"} />} />
          </Routes>
          </AnimatePresence>
          {showNavAndFooter && <BottomNavbar />}
          {showNavAndFooter && <Footer />}
        </div>
        <Toaster />
      </ProductProvider>
    );
    
};

export default function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
