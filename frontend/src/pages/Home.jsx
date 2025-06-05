import { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Carsoule from "../components/Carsoule";
import Cart from "./Cart";
import salesimg from "../assets/salesimg.jpg";
import matingimg from "../assets/matingimg.jpeg";
import serviceimg from "../assets/serviceimg.jpg";
import aboutimg from "../assets/aboutimg.jpg";
import WishList from "./wishlist/WishList";
import Payments from "./payments/payments";
import MyProfile from './profile/MyProfile';
import boardingimg from "../assets/boardingimg.jpeg"

const Home = () => {
  const [setCartCount] = useState(0);
  const userId = 1;
  const updateCartCount = (newCount) => {
    setCartCount(newCount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4">
        <Routes>
          <Route path="/" element={<HomeDashboard />} />
          <Route
            path="/cart"
            element={<Cart userId={userId} updateCartCount={updateCartCount} />}
          />
          <Route path="/wishlist" element={<WishList />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/profile" element={<MyProfile />} />
        </Routes>
      </div>
    </div>
  );
};

// Home Dashboard component that shows the cards from your Example component
const HomeDashboard = () => {
  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    speed: 1000,
    autoplaySpeed: 3000,
    cssEase: "linear",
    pauseOnHover: true,
    centerMode: true,
    centerPadding: "60px",
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          centerPadding: "30px",
          autoplay: true,
          autoplaySpeed: 3000
        }
      }
    ]
  };

  return (
    <div className="flex flex-col gap-10 py-8 pt-20">
      <Carsoule />
      <div className="flex items-center justify-center">
        <div className="max-w-[900px] gap-5 grid grid-cols-12 grid-rows-2 px-8">
          <Link
            to="/Petshop"
            className="col-span-12 sm:col-span-4 h-[300px] transform transition duration-300 hover:scale-[1.02] hover:-translate-y-1">
            <div className="h-[250px] sm:h-[300px] relative rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <img
                alt="Card background"
                className="z-0 w-full h-full object-cover transition-transform hover:scale-110 duration-300"
                src={salesimg}
                style={{ aspectRatio: "16/9" }}
              />
              <div className="justify-center before:bg-white/10 border-white/20 border-1 overflow-hidden py-2 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10 flex items-center px-4 backdrop-blur-sm">
                <p className="text-white uppercase font-black tracking-wide text-sm leading-relaxed font-[' Winky Rough']">
                  Pets for sale
                </p>
              </div>
            </div>
          </Link>
          <Link
            to="/boardingpage"
            className="col-span-12 sm:col-span-4 h-[300px] transform transition duration-300 hover:scale-[1.02] hover:-translate-y-1">
            <div className="col-span-12 sm:col-span-4 h-[300px] relative rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <img
                alt="Card background"
                className="z-0 w-full h-full object-cover transition-transform hover:scale-110 duration-300"
                src={ boardingimg}  
                style={{ aspectRatio: "1/1" }}
              />
              <div className="justify-center before:bg-white/10 border-white/20 border-1 overflow-hidden py-2 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10 flex items-center px-4 backdrop-blur-sm">
                <p className="text-white uppercase font-black tracking-wide text-sm leading-relaxed font-[' Winky Rough']">
                  Boarding
                </p>
              </div>
            </div>
          </Link>
          <Link
            to="/matingpage"
            className="col-span-12 sm:col-span-4 h-[300px] transform transition duration-300 hover:scale-[1.02] hover:-translate-y-1">
            <div className="col-span-12 sm:col-span-4 h-[300px] relative rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <img
                alt="Card background"
                className="z-0 w-full h-full object-cover transition-transform hover:scale-110 duration-300"
                src={matingimg}
                style={{ aspectRatio: "4/3" }}
              />
              <div className="justify-center before:bg-white/10 border-white/20 border-1 overflow-hidden py-2 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10 flex items-center px-4 backdrop-blur-sm">
                <p className="text-white uppercase font-black tracking-wide text-sm leading-relaxed font-[' Winky Rough']">
                  Match fixing
                </p>
              </div>
            </div>
          </Link>
          <Link
            to="/petservices"
            className="col-span-12 sm:col-span-4 h-[300px] transform transition duration-300 hover:scale-[1.02] hover:-translate-y-1">
            <div className="w-full h-[300px] col-span-12 sm:col-span-5 relative rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <img
                alt="Card background"
                className="z-0 w-full h-full object-cover transition-transform hover:scale-110 duration-300"
                src={serviceimg}
                style={{ aspectRatio: "16/9" }}
              />
              <div className="justify-center before:bg-white/10 border-white/20 border-1 overflow-hidden py-2 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10 flex items-center px-4 backdrop-blur-sm">
                <p className="text-white uppercase font-black tracking-wide text-sm leading-relaxed font-[' Winky Rough']">
                  Pet Services
                </p>
              </div>
            </div>
          </Link>
          <Link
            to="/aboutpets"
            className="h-[300px] col-span-4 sm:col-span-7 transform transition duration-300 hover:scale-[1.02] hover:-translate-y-1">
            <div className="w-full h-[300px] col-span-4 sm:col-span-7 relative rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <img
                alt="Relaxing app background"
                className="z-0 w-full h-full object-cover transition-transform hover:scale-110 duration-300"
                src={aboutimg}
                style={{ aspectRatio: "16/9" }}
              />
              <div className="justify-center before:bg-white/10 border-white/20 border-1 overflow-hidden py-2 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10 flex items-center px-4 backdrop-blur-sm">
                <p className="text-white uppercase font-black tracking-wide text-sm leading-relaxed font-[' Winky Rough']">
                  Know about your pet
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
      {/* Center Mode Carousel Section */}
      <div className="max-w-[1200px] mx-auto px-8 py- ">
        <h2 className="text-3xl font-bold text-white mb-8 text-center py-4 px-8 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-200 uppercase tracking-wider">✨ Special Offers ✨</h2>
        <div className="slider-container py-6">
          <Slider {...settings}>
            {[1, 2, 3, 4, 5, 6, 7].map((item) => (
              <div key={item} className="px-3">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-transform hover:scale-105 my-8">
                  <img
                    src={`https://source.unsplash.com/400x300/?pet${item}`}
                    alt={`Featured Pet ${item}`}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-semibold text-gray-800">Product {item}</h3>
                    <p className="text-gray-600 mt-2">grab the products with low prices</p>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
       {/* Horizontal Offers Section */}
      <div className="max-w-[1200px] mx-auto px-2">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/3 p-8 bg-gradient-to-r from-purple-600 to-pink-500">
              <h3 className="text-3xl font-bold text-white mb-4">Special Spring Offer!</h3>
              <p className="text-white/90 text-lg mb-6">Get up to 30% off on premium pet accessories</p>
              <button className="bg-white text-purple-600 px-6 py-2 rounded-lg font-semibold hover:bg-purple-50 transition-colors">
                Shop Now
              </button>
            </div>
            <div className="md:w-2/3 p-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-4 bg-purple-50 p-4 rounded-xl">
                <div className="p-3 bg-purple-100 rounded-full">
                  🎁
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Free Treats</h4>
                  <p className="text-sm text-gray-600">With every purchase</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 bg-pink-50 p-4 rounded-xl">
                <div className="p-3 bg-pink-100 rounded-full">
                  🚚
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Free Delivery</h4>
                  <p className="text-sm text-gray-600">Orders above ₹999</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 bg-orange-50 p-4 rounded-xl">
                <div className="p-3 bg-orange-100 rounded-full">
                  ⭐
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Loyalty Points</h4>
                  <p className="text-sm text-gray-600">2x points this week</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
