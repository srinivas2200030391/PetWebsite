import  { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Carsoule from "../assets/Carsoule";
import PetStore from "./PetStore";
import Cart from "./Cart";

const Home = () => {
  const [cartCount, setCartCount] = useState(0);
  const userId = 1; // Assuming this is the user ID you want to use

  const updateCartCount = (newCount) => {
    setCartCount(newCount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main content with navigation */}
      <div className="container mx-auto px-4">
        {/* Navigation tabs for Store and Cart */}
        <div className="flex justify-center my-6">
          <div className="flex space-x-4 bg-white rounded-lg shadow-sm p-1">
            <Link
              to="/home"
              className="px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors">
              Home
            </Link>
            <Link
              to="/home/store"
              className="px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors">
              Store
            </Link>
            <Link
              to="/home/cart"
              className="px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors relative">
              Cart
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Routes for Store and Cart components */}
        <Routes>
          <Route path="/" element={<HomeDashboard />} />
          <Route
            path="/store"
            element={
              <PetStore userId={userId} updateCartCount={updateCartCount} />
            }
          />
          <Route
            path="/cart"
            element={<Cart userId={userId} updateCartCount={updateCartCount} />}
          />
        </Routes>
      </div>
    </div>
  );
};

// Home Dashboard component that shows the cards from your Example component
const HomeDashboard = () => {
  return (
    <div className="flex flex-col gap-10 py-8">
      <Carsoule />
      <div className="flex items-center justify-center">
        <div className="max-w-[900px] gap-2 grid grid-cols-12 grid-rows-2 px-8">
          <Link to="/Petshop" className="col-span-12 sm:col-span-4 h-[300px]">
            <div className="col-span-12 sm:col-span-4 h-[300px] relative rounded-lg overflow-hidden shadow-md">
              <div className="absolute z-10 top-4 left-4 flex-col items-start">
                <p className="text-xs text-white/60 uppercase font-bold">
                  What to watch
                </p>
                <h4 className="text-white font-medium text-lg">
                  Stream the Acme event
                </h4>
              </div>
              <img
                alt="Card background"
                className="z-0 w-full h-full object-cover transition-transform hover:scale-110 duration-300"
                src="https://heroui.com/images/card-example-4.jpeg"
              />
            </div>
          </Link>
          <Link to="/boarding" className="col-span-12 sm:col-span-4 h-[300px]">
            <div className="col-span-12 sm:col-span-4 h-[300px] relative rounded-lg overflow-hidden shadow-md">
              <div className="absolute z-10 top-4 left-4 flex-col items-start">
                <p className="text-xs text-white/60 uppercase font-bold">
                  Plant a tree
                </p>
                <h4 className="text-white font-medium text-lg">
                  Contribute to the planet
                </h4>
              </div>
              <img
                alt="Card background"
                className="z-0 w-full h-full object-cover transition-transform hover:scale-110 duration-300"
                src="https://heroui.com/images/card-example-3.jpeg"
              />
            </div>
          </Link>
          <div className="col-span-12 sm:col-span-4 h-[300px] relative rounded-lg overflow-hidden shadow-md">
            <div className="absolute z-10 top-4 left-4 flex-col items-start">
              <p className="text-xs text-white/60 uppercase font-bold">
                Supercharged
              </p>
              <h4 className="text-white font-medium text-lg">
                Creates beauty like a beast
              </h4>
            </div>
            <img
              alt="Card background"
              className="z-0 w-full h-full object-cover transition-transform hover:scale-110 duration-300"
              src="https://heroui.com/images/card-example-2.jpeg"
            />
          </div>
          <div className="w-full h-[300px] col-span-12 sm:col-span-5 relative rounded-lg overflow-hidden shadow-md">
            <div className="absolute z-10 top-4 left-4 flex-col items-start">
              <p className="text-xs text-white/60 uppercase font-bold">New</p>
              <h4 className="text-black font-medium text-2xl">Acme camera</h4>
            </div>
            <img
              alt="Card background"
              className="z-0 w-full h-full object-cover transition-transform hover:scale-110 duration-300"
              src="https://heroui.com/images/card-example-6.jpeg"
            />
            <div className="absolute bg-white/30 bottom-0 border-t border-zinc-100/50 z-10 flex justify-between w-full p-4">
              <div>
                <p className="text-black text-xs">Available soon.</p>
                <p className="text-black text-xs">Get notified.</p>
              </div>
              <button className="bg-indigo-600 text-white px-3 py-1 rounded-full text-xs">
                Notify Me
              </button>
            </div>
          </div>
          <div className="w-full h-[300px] col-span-12 sm:col-span-7 relative rounded-lg overflow-hidden shadow-md">
            <div className="absolute z-10 top-4 left-4 flex-col items-start">
              <p className="text-xs text-white/60 uppercase font-bold">
                Your day your way
              </p>
              <h4 className="text-white/90 font-medium text-xl">
                Your checklist for better sleep
              </h4>
            </div>
            <img
              alt="Relaxing app background"
              className="z-0 w-full h-full object-cover transition-transform hover:scale-110 duration-300"
              src="https://heroui.com/images/card-example-5.jpeg"
            />
            <div className="absolute bg-black/40 bottom-0 z-10 border-t border-gray-600 w-full p-4 flex justify-between items-center">
              <div className="flex gap-2 items-center">
                <div className="rounded-full w-10 h-10 bg-black"></div>
                <div className="flex flex-col">
                  <p className="text-xs text-white/60">Breathing App</p>
                  <p className="text-xs text-white/60">
                    Get a good night&apos;s sleep.
                  </p>
                </div>
              </div>
              <button className="bg-white text-black px-3 py-1 rounded-full text-xs">
                Get App
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;