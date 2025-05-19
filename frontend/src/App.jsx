import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./pages/Footer";
import Intro from "./pages/Intro";
import Login from "./pages/Authenticating/Login";
import Signup from "./pages/Authenticating/Signup";
import Home from "./pages/Home";
import Petshop from "./pages/petshop/Petshop";
import ProductOverview from "./pages/petshop/ProductOverView";
import MatingPage from "./pages/Mating/MatingPage";
import MatingPetsList from "./pages/Mating/MatingPetsList";
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
import PrivateRoute from "./components/PrivateRoute"; // 🍭 import it
import MyPet from './pages/My_Pet/MyPet';
import PetDetails from './pages/My_Pet/PetDetails';
import PetHealth from './../../backend/models/petHealth';

const App = () => {
  const { authUser, checkAuth, ischeckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (ischeckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

    return (
      <ProductProvider>
        <div className="min-h-screen">
          <Navbar />
          <Routes>
            {/* Private Routes */}
            <Route
              path="/home*"
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
              path="/productoverview"
              element={
                <PrivateRoute>
                  <ProductOverview />
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
              path="/matingpetslist"
              element={
                <PrivateRoute>
                  <MatingPetsList />
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
    
            {/* Public Routes */}
            <Route
              path="/"
              element={!authUser ? <Intro /> : <Navigate to="/home" />}
            />
            <Route
              path="/intro"
              element={!authUser ? <Intro /> : <Navigate to="/home" />}
            />
            <Route
              path="/login"
              element={!authUser ? <Login /> : <Navigate to="/home" />}
            />
            <Route
              path="/signup"
              element={!authUser ? <Signup /> : <Navigate to="/home" />}
            />
    
            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/home" />} />
          </Routes>
          <Toaster />
          {authUser && <Footer />}
        </div>
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
