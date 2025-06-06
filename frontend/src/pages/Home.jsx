import { useState, useEffect, useRef } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Carsoule from "../components/Carsoule";
import Cart from "./Cart";
import salesimg from "../assets/salesimg.jpg";
import matingimg from "../assets/matingimg.jpeg";
import WishList from "./wishlist/WishList";
import Payments from "./payments/payments";
import MyProfile from './profile/MyProfile';
import { 
  ArrowRightIcon, 
  ShieldCheckIcon, 
  CheckCircleIcon, 
  SparklesIcon,
  HeartIcon,
  ShoppingBagIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from "@heroicons/react/24/outline";

const Home = () => {
  const [setCartCount] = useState(0);
  const [comingFromLogin, setComingFromLogin] = useState(false);
  const userId = 1;
  
  // Check if we're coming from login page
  useEffect(() => {
    const fromLogin = localStorage.getItem("comingFromLogin") === "true";
    console.log("Home mounted, comingFromLogin:", fromLogin);
    
    if (fromLogin) {
      setComingFromLogin(true);
      // Give a small delay before removing the flag
      setTimeout(() => {
        localStorage.removeItem("comingFromLogin");
        console.log("Removed comingFromLogin flag from localStorage");
      }, 500);
    }
  }, []);
  
  const updateCartCount = (newCount) => {
    setCartCount(newCount);
  };

  // Cloud animation variants for exit
  const cloudOverlayVariants = {
    visible: { 
      opacity: 1,
    },
    hidden: { 
      opacity: 0,
      transition: { duration: 2.5, ease: "easeOut" }
    }
  };

  // Container variants for home content scaling
  const homeContainerVariants = {
    initial: { 
      scale: comingFromLogin ? 0.85 : 1, 
      opacity: comingFromLogin ? 0 : 1 
    },
    animate: { 
      scale: 1, 
      opacity: 1, 
      transition: { 
        delay: comingFromLogin ? 1.5 : 0,
        duration: comingFromLogin ? 2 : 0.5,
        ease: "easeOut"
      }
    }
  };

  console.log("Home render, comingFromLogin state:", comingFromLogin);

  return (
    <motion.div 
      className="min-h-screen bg-white py-16"
      variants={homeContainerVariants}
      initial="initial"
      animate="animate"
    >
      <AnimatePresence>
        {comingFromLogin && (
          <motion.div 
            className="fixed inset-0 bg-white z-[9999]"
            variants={cloudOverlayVariants}
            initial="visible"
            animate="hidden"
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>
      
      <div className="container mx-auto px-4">
        <Routes>
          <Route path="/" element={<HomeDashboard comingFromLogin={comingFromLogin} />} />
          <Route
            path="/cart"
            element={<Cart userId={userId} updateCartCount={updateCartCount} />}
          />
          <Route path="/wishlist" element={<WishList />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/profile" element={<MyProfile />} />
        </Routes>
      </div>
    </motion.div>
  );
};

const heroSlides = [
  {
    image: "https://images.unsplash.com/photo-1622968422511-643849144666?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Find Your Furry Soulmate",
    subtitle: "Healthy, Happy, and Vetted Pets",
  },
  {
    image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "The Perfect Playmate Awaits",
    subtitle: "Bred with Love and Care",
  },
  {
    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=2886&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Unconditional Love, Guaranteed",
    subtitle: "Your New Best Friend is Here",
  }
];

const HomeDashboard = ({ comingFromLogin }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideInterval = useRef();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: comingFromLogin ? 0.4 : 0.2,
        duration: 0.8,
        delay: comingFromLogin ? 2 : 0,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { 
        duration: comingFromLogin ? 1.2 : 0.5, 
        ease: "easeOut" 
      },
    },
  };

  const nextSlide = () => {
    setCurrentSlide(prev => (prev === heroSlides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev === 0 ? heroSlides.length - 1 : prev - 1));
  };

  const startSlideTimer = () => {
    stopSlideTimer();
    slideInterval.current = setInterval(() => {
      nextSlide();
    }, 5000);
  };

  const stopSlideTimer = () => {
    if (slideInterval.current) {
      clearInterval(slideInterval.current);
    }
  };

  useEffect(() => {
    startSlideTimer();
    return () => stopSlideTimer();
  }, []);

  const productCategories = [
    {
      name: "Pet Food & Treats",
      description: "High-quality, nutritious food and treats for pets of all ages.",
      image: "https://images.unsplash.com/photo-1695169954725-fa757fd7315c?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      icon: ShoppingBagIcon,
    },
    {
      name: "Pet Accessories",
      description: "Stylish and durable accessories to keep your pets happy and engaged.",
      image: "https://images.unsplash.com/photo-1546421845-6471bdcf3edf?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      icon: SparklesIcon,
    },
    {
      name: "Pet Healthcare",
      description: "Essential medicines and supplements for your pet's health and wellness.",
      image:"https://images.unsplash.com/photo-1701368316718-581b47cf65f4?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      icon: HeartIcon,
    }
  ];

  return (
    <motion.div 
      className="flex flex-col gap-y-24 py-8 "
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Hero Section - A new redesign */}
      <motion.section variants={itemVariants} className="relative h-[50vh] md:h-[80vh] w-full overflow-hidden rounded-3xl shadow-2xl">
        <div 
          className="absolute inset-0 flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          onMouseEnter={stopSlideTimer}
          onMouseLeave={startSlideTimer}
        >
          {heroSlides.map((slide, index) => (
            <div key={index} className="relative h-full w-full flex-shrink-0 flex items-center justify-center overflow-hidden">
              <img src={slide.image} alt={slide.title} className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/20" />
            </div>
          ))}
        </div>

        <div className="absolute inset-0 flex items-center justify-center text-center text-white p-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight tracking-tight">
              {heroSlides[currentSlide].title}
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8">
              {heroSlides[currentSlide].subtitle}
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Link to="/Petshop" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                Explore Pets for Sale <ArrowRightIcon className="h-5 w-5" />
              </Link>
              <Link to="/matingpage" className="bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:-translate-y-0.5">
                Mating Services
              </Link>
            </div>
          </div>
        </div>

        <button onClick={prevSlide} className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/20 hover:bg-white/40 p-3 rounded-full text-white transition-all duration-300">
          <ChevronLeftIcon className="h-6 w-6" />
        </button>
        <button onClick={nextSlide} className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/20 hover:bg-white/40 p-3 rounded-full text-white transition-all duration-300">
          <ChevronRightIcon className="h-6 w-6" />
        </button>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5">
          {heroSlides.map((_, index) => (
            <button 
              key={index} 
              onClick={() => setCurrentSlide(index)}
              className={`h-2.5 rounded-full transition-all duration-300 ${currentSlide === index ? 'w-8 bg-white' : 'w-2.5 bg-white/50 hover:bg-white/75'}`}
            />
          ))}
        </div>
      </motion.section>

      {/* Main Services Section - Redesigned to match the hero */}
      <motion.section variants={itemVariants} className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="bg-blue-100 text-blue-800 text-sm font-medium px-4 py-1.5 rounded-full">Premium Services</span>
          <h2 className="text-4xl font-bold text-gray-900 mt-4 mb-4">Our Featured Services</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Discover our exclusive pet services designed for the modern pet lover.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Link to="/Petshop" className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl group text-white">
            <img src={salesimg} alt="Pets for sale" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            <div className="relative h-full flex flex-col justify-end p-8">
              <h3 className="text-3xl font-bold mb-2">Premium Pets for Sale</h3>
              <p className="text-lg text-white/90 mb-4">Discover our curated collection of healthy, well-bred pets.</p>
              <div className="flex items-center font-semibold group-hover:underline">
                Browse Collection <ArrowRightIcon className="h-5 w-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
          
          <Link to="/matingpage" className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl group text-white">
            <img src={matingimg} alt="Mating services" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            <div className="relative h-full flex flex-col justify-end p-8">
              <h3 className="text-3xl font-bold mb-2">Exclusive Mating Services</h3>
              <p className="text-lg text-white/90 mb-4">Connect with quality breeding partners for healthier offspring.</p>
              <div className="flex items-center font-semibold group-hover:underline">
                Find Partners <ArrowRightIcon className="h-5 w-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
        </div>
      </motion.section>

      {/* Why Choose Us Section - Redesigned */}
      <motion.section variants={itemVariants} className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?q=80&w=1974" 
                alt="Happy pet owner" 
                className="rounded-3xl shadow-2xl w-full h-auto"
              />
              <div className="absolute -bottom-8 -right-8 bg-white p-5 rounded-2xl shadow-lg border animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 p-3 rounded-full"><ShieldCheckIcon className="h-8 w-8 text-blue-600" /></div>
                  <div>
                    <p className="font-bold text-gray-800 text-lg">100% Verified</p>
                    <p className="text-sm text-gray-500">Quality and Trust Assured</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <span className="bg-purple-100 text-purple-800 text-sm font-medium px-4 py-1.5 rounded-full">Our Commitment</span>
              <h2 className="text-4xl font-bold text-gray-900 mt-4 mb-6">The Premium Pet Platform You Can Trust</h2>
              <p className="text-gray-600 text-lg mb-8">
                We are setting new standards in the pet industry by focusing on quality, transparency, and the well-being of every pet.
              </p>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                    <ShieldCheckIcon className="h-6 w-6"/>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">Verified Breeders</h4>
                    <p className="text-gray-600">All pet breeders undergo a strict verification process to ensure the highest standards of quality and ethics.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
                    <HeartIcon className="h-6 w-6"/>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">Health Guarantee</h4>
                    <p className="text-gray-600">Every pet comes with a health guarantee, complete vaccination records, and post-purchase support.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Special Launch Discounts - Redesigned */}
      <motion.section variants={itemVariants} className="py-20 bg-gray-50 rounded-3xl">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="bg-red-100 text-red-800 text-sm font-medium px-4 py-1.5 rounded-full">Hot Deals</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-4 mb-4">Special Launch Discounts</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Limited time offers on our entire range of premium pet products.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {productCategories.map((category, index) => (
              <div key={index} className="rounded-2xl overflow-hidden shadow-lg border-gray-100 hover:shadow-2xl transition-all duration-300 group bg-white">
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={category.image} 
                    alt={category.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <category.icon className="h-8 w-8 text-gray-500 mb-4" />
                  <h3 className="font-bold text-gray-900 text-xl mb-2">{category.name}</h3>
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  <Link to="#" className="font-medium text-blue-600 hover:text-blue-800">Shop Now <ArrowRightIcon className="inline h-4 w-4" /></Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>
      
      {/* CTA Section */}
      <motion.section variants={itemVariants} className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl overflow-hidden shadow-2xl shadow-blue-500/20">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-2/3 p-8 md:p-12 text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Find Your Perfect Pet?</h2>
              <p className="text-white/90 text-lg mb-8">
                Be among the first to experience our premium pet services with exclusive launch discounts.
              </p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <Link to="/Petshop" className="bg-white hover:bg-gray-100 text-blue-600 px-8 py-4 rounded-lg font-medium transition-all duration-300">
                  Browse Pets
                </Link>
                <Link to="/matingpage" className="bg-white/20 hover:bg-white/30 text-white px-8 py-4 rounded-lg font-medium transition-all duration-300 border border-white/30">
                  Mating Services
                </Link>
              </div>
            </div>
            <div className="md:w-1/3 p-8 flex items-center justify-center">
              <div className="text-center w-full">
                  <h3 className="text-white font-bold text-xl mb-4">Launch Offer</h3>
                  <div className="text-5xl font-bold text-white mb-2">25%</div>
                  <p className="text-white/80 text-lg mb-4">Discount on all services</p>
                  <div className="bg-white/20 backdrop-blur-sm rounded-md px-4 py-2 inline-block">
                    <span className="text-white font-mono font-bold">PETLAUNCH25</span>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
};

export default Home;
