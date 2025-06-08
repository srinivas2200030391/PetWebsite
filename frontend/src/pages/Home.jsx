import { useState, useEffect, useRef } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Carsoule from "../components/Carsoule";
import Cart from "./Cart";
import salesimg from "../assets/salesimg.jpg";
import matingimg from "../assets/matingimg.jpeg";
import WishList from "./wishlist/WishList";
import Payments from "./payments/Payments";
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

const pageVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      mass: 0.8,
    },
  },
  exit: {
    opacity: 0,
    y: -50,
    transition: { duration: 0.4, ease: "easeInOut" }
  },
};

const fromLoginVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.15,
      delayChildren: 0.4,
    },
  },
};

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    zIndex: 0,
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
  }),
};

const slideTextVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      staggerChildren: 0.1,
    },
  },
};

const Home = () => {
  const [setCartCount] = useState(0);
  const userId = 1;
  const location = useLocation();
  const fromLogin = location.state?.from === "login";
  
  const updateCartCount = (newCount) => {
    setCartCount(newCount);
  };

  return (
    <motion.div 
      layout
      className="min-h-screen bg-white py-16"
      variants={fromLogin ? fromLoginVariants : pageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >      
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

const HomeDashboard = () => {
  const [[currentSlide, direction], setSlide] = useState([0, 0]);
  const slideInterval = useRef();
  const sliderRef = useRef(null);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        duration: 0.6,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 100, 
        damping: 15, 
        mass: 0.5,
        delay: 0.25,
        
      },
    },
  };

  const paginate = (newDirection) => {
    setSlide([ (currentSlide + newDirection + heroSlides.length) % heroSlides.length, newDirection ]);
  };

  const nextSlide = () => paginate(1);
  const prevSlide = () => paginate(-1);

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

  // Handle touch events for swipe
  const handleTouchStart = (e) => {
    stopSlideTimer();
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      // Swipe left, go to next slide
      nextSlide();
    }

    if (touchStart - touchEnd < -75) {
      // Swipe right, go to previous slide
      prevSlide();
    }
    
    startSlideTimer();
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
      className="flex flex-col gap-y-16 sm:gap-y-20 md:gap-y-24 py-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Hero Section - A new redesign with mobile responsiveness and touch scrolling */}
      <motion.section 
        variants={itemVariants} 
        className="relative h-[40vh] sm:h-[50vh] md:h-[60vh] lg:h-[80vh] w-full overflow-hidden rounded-xl sm:rounded-2xl md:rounded-3xl shadow-lg sm:shadow-xl md:shadow-2xl"
        ref={sliderRef}
      >
        <div 
          className="absolute inset-0 flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          onMouseEnter={stopSlideTimer}
          onMouseLeave={startSlideTimer}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {heroSlides.map((slide, index) => (
            <div key={index} className="relative h-full w-full flex-shrink-0 flex items-center justify-center overflow-hidden">
              <img src={slide.image} alt={slide.title} className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/20" />
            </div>
          ))}
        </div>

        {/* Content container - modified for phone layout */}
        <div className="absolute inset-0 flex sm:items-center justify-center text-center text-white p-4 sm:p-6 md:p-8">
          <div className="max-w-3xl w-full flex flex-col justify-end items-center sm:block">
            {/* Push buttons to bottom on phone screens */}
            <div className="flex flex-col justify-end flex-grow sm:block">
              {/* Title - moved to bottom on phone screens, just above links */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-extrabold sm:mb-4 leading-tight tracking-tight mb-3 sm:mt-0">
                {heroSlides[currentSlide].title}
              </h1>
              {/* Subtitle - hidden on phone screens */}
              <p className="hidden sm:block text-base sm:text-lg md:text-xl text-white/90 mb-4 sm:mb-6 md:mb-8">
                {heroSlides[currentSlide].subtitle}
              </p>
              <div className="flex flex-wrap gap-2 justify-center  mb-4 sm:mb-4 sm:mt-0">
                <Link to="/Petshop" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-3 sm:px-4 md:px-6 lg:px-8 py-1.5 sm:py-2 md:py-3 rounded-md sm:rounded-lg text-sm sm:text-base font-semibold transition-all duration-300 flex items-center gap-1 sm:gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:scale-95 min-h-[36px] sm:min-h-[44px] touch-manipulation">
                  Explore <span className="hidden sm:inline">Pets for Sale</span> <ArrowRightIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                </Link>
                <Link to="/matingpage" className="bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 text-white px-3 sm:px-4 md:px-6 lg:px-8 py-1.5 sm:py-2 md:py-3 rounded-md sm:rounded-lg text-sm sm:text-base font-semibold transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 min-h-[36px] sm:min-h-[44px] touch-manipulation">
                  Mating <span className="hidden sm:inline">Services</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation buttons - hidden on mobile/tablet, smaller on larger screens */}
        <button 
          onClick={prevSlide} 
          className="hidden lg:block absolute top-1/2 left-4 -translate-y-1/2 bg-white/20 hover:bg-white/40 p-2 lg:p-3 rounded-full text-white transition-all duration-300 min-w-[36px] min-h-[36px] lg:min-w-[44px] lg:min-h-[44px] touch-manipulation"
          aria-label="Previous slide"
        >
          <ChevronLeftIcon className="h-4 w-4 lg:h-5 lg:w-5" />
        </button>
        <button 
          onClick={nextSlide} 
          className="hidden lg:block absolute top-1/2 right-4 -translate-y-1/2 bg-white/20 hover:bg-white/40 p-2 lg:p-3 rounded-full text-white transition-all duration-300 min-w-[36px] min-h-[36px] lg:min-w-[44px] lg:min-h-[44px] touch-manipulation"
          aria-label="Next slide"
        >
          <ChevronRightIcon className="h-4 w-4 lg:h-5 lg:w-5" />
        </button>

        {/* Slide indicators - smaller on mobile */}
        <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-1 sm:gap-1.5">
          {heroSlides.map((_, index) => (
            <button 
              key={index} 
              onClick={() => setCurrentSlide(index)}
              className={`h-1.5 sm:h-2 md:h-2.5 rounded-full transition-all duration-300 ${
                currentSlide === index 
                  ? 'w-5 sm:w-6 md:w-8 bg-white' 
                  : 'w-1.5 sm:w-2 md:w-2.5 bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </motion.section>

      {/* Main Services Section - Enhanced for mobile responsiveness */}
      <motion.section 
        className="container mx-auto px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={itemVariants}
      >
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <span className="bg-blue-100 text-blue-800 text-xs sm:text-sm font-medium px-3 sm:px-4 py-1 sm:py-1.5 rounded-full">Premium Services</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mt-3 sm:mt-4 mb-2 sm:mb-4">Our Featured Services</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base md:text-lg px-2">
            Discover our exclusive pet services designed for the modern pet lover.
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.custom
            to="/Petshop" 
            variants={itemVariants}
            className="relative h-[300px] sm:h-[400px] md:h-[500px] rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden shadow-lg sm:shadow-xl md:shadow-2xl group text-white touch-manipulation"
            aria-label="Browse premium pets for sale"
            as={Link}
          >
            <img src={salesimg} alt="Pets for sale" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            <div className="relative h-full flex flex-col justify-end p-4 sm:p-6 md:p-8">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2">Premium Pets for Sale</h3>
              <p className="text-sm sm:text-base md:text-lg text-white/90 mb-3 sm:mb-4">Discover our curated collection of healthy, well-bred pets.</p>
              <div className="flex items-center font-medium sm:font-semibold group-hover:underline min-h-[44px]">
                <span className="text-sm sm:text-base">Browse Collection</span> <ArrowRightIcon className="h-4 w-4 sm:h-5 sm:w-5 ml-1 sm:ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </div>
          </motion.custom>
          
          <motion.custom
            to="/matingpage" 
            variants={itemVariants}
            className="relative h-[300px] sm:h-[400px] md:h-[500px] rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden shadow-lg sm:shadow-xl md:shadow-2xl group text-white touch-manipulation"
            aria-label="Explore mating services"
            as={Link}
          >
            <img src={matingimg} alt="Mating services" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            <div className="relative h-full flex flex-col justify-end p-4 sm:p-6 md:p-8">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2">Exclusive Mating Services</h3>
              <p className="text-sm sm:text-base md:text-lg text-white/90 mb-3 sm:mb-4">Connect with quality breeding partners for healthier offspring.</p>
              <div className="flex items-center font-medium sm:font-semibold group-hover:underline min-h-[44px]">
                <span className="text-sm sm:text-base">Find Partners</span> <ArrowRightIcon className="h-4 w-4 sm:h-5 sm:w-5 ml-1 sm:ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </div>
          </motion.custom>
        </motion.div>
      </motion.section>

      {/* Why Choose Us Section - Redesigned */}
      <motion.section 
        className="py-20 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={itemVariants}
      >
        <div className="container mx-auto px-4">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div className="relative" variants={itemVariants}>
              <img 
                src="https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?q=80&w=1974" 
                alt="Happy pet owner" 
                className="rounded-3xl shadow-2xl w-full h-auto"
              />
              <div className="absolute -bottom-8 -right-8 bg-white p-5 rounded-2xl shadow-lg border mr-4 sm:mr-0">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 p-3 rounded-full"><ShieldCheckIcon className="h-8 w-8 text-blue-600" /></div>
                  <div>
                    <p className="font-bold text-gray-800 text-lg">100% Verified</p>
                    <p className="text-sm text-gray-500">Quality and Trust Assured</p>
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div variants={itemVariants}>
              <span className="bg-purple-100 text-purple-800 text-sm font-medium px-4 py-1.5 rounded-full">Our Commitment</span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mt-4 mb-6">The Premium Pet Platform You Can Trust</h2>
              <p className="text-gray-600 text-sm sm:text-base md:text-lg mb-8">
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
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Special Launch Discounts - Redesigned */}
      <motion.section 
        className="py-20 bg-gray-50 rounded-3xl"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={itemVariants}
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="bg-red-100 text-red-800 text-sm font-medium px-4 py-1.5 rounded-full">Hot Deals</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mt-4 mb-4">Upcoming Special Launch Discounts</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base md:text-lg">
              Limited time offers on our entire range of premium pet products.
            </p>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {productCategories.map((category, index) => (
              <motion.div
                key={index}
                className="rounded-2xl overflow-hidden shadow-lg border-gray-100 hover:shadow-2xl transition-all duration-300 group bg-white"
                variants={itemVariants}
                whileHover={{ y: -8, transition: { type: 'spring', stiffness: 300 } }}
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={category.image} 
                    alt={category.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <category.icon className="h-8 w-8 text-gray-500 mb-4" />
                  <h3 className="font-bold text-gray-900 text-md sm:text-base md:text-lg mb-2">{category.name}</h3>
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  <Link to="#" className="font-medium text-blue-600 hover:text-blue-800">Shop Now <ArrowRightIcon className="inline h-4 w-4" /></Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>
      
      {/* CTA Section */}
      <motion.section 
        className="container mx-auto px-4 py-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={itemVariants}
      >
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
