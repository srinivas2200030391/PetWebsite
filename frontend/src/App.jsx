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
//import BoardingPage from "./pages/boarding/BoardingPage";
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
          <Route
            path="/home*"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route path="/custombutton" element={<CustomButton />} />
          <Route path="/petshop" element={<Petshop />} />
          <Route path="/productoverview" element={<ProductOverview />} />
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
          <Route path="/pet/:petId" element={<PetDetail />} />
          {/* <Route
            path="/boardingpage"
            element={
              <PrivateRoute>
                <BoardingPage />
              </PrivateRoute>
            }
          /> */}
          <Route
            path="/boardingshops"
            element={
              <PrivateRoute>
                <BoardingShops />
              </PrivateRoute>
            }
          />
          {/* <Route
            path="/boardingshopfilter"
            element={
              <PrivateRoute>
                <BoardingShopFilter />
              </PrivateRoute>
            }
          /> */}
          <Route
            path="/newboardingrequest"
            element={
              <PrivateRoute>
                <NewBoardingRequest />
              </PrivateRoute>
            }
          />
          {/* <Route path="/my-pets" element={<MyPets />} /> */}
          {/* <Route path="/my-pets/:petId" element={<PetDetails />} />
          <Route path="/pet-health/:petId" element={<PetHealth />} /> */}
          
          {/* Boarding Routes */}
          {/* Main boarding landing page */}
          <Route path="/boarding" element={<BoardingShopEntry />} />
          
          {/* For backward compatibility and redirection */}
          <Route path="/boardingpage" element={<Navigate to="/boarding" />} />
          <Route path="/boardingshops" element={<BoardingShops />} />
          <Route path="/boardingshopfilter" element={<Navigate to="/boarding" />} />
          
          {/* New routes */}
          <Route path="/boardingcenter/:boardingId" element={<BoardingCenterDetail />} />
          <Route path="/newboardingrequest" element={<NewBoardingRequest />} />
          <Route path="/newboardingrequest/:vendorId" element={<NewBoardingRequest />} />
          <Route path="/add-boarding" element={<AddBoardingShop />} />
          
          <Route path="/aboutpets" element={<AboutPets />} />
          <Route path="/breeds/:item" element={<Breeds />} />
          <Route path="/pet/breeds/:item" element={<BreedDetailPage />} />
          <Route path="/petservices" element={<PetServices />} />
          <Route path="/grooming" element={<Grooming />} />
          <Route path="/matingpetslist" element={<MatingPetsList />} />
          <Route path="/healthcare" element={<HealthCarepage />} />
          <Route path="/vets" element={<Vets />} />

          {/* Public Routes */}
          
          {/* Auth Routes */}
          <Route
            path="/"
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

          <Route path="*" element={<Navigate to={"/home"} />} />
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
