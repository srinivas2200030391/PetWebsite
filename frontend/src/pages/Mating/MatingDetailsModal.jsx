import { useState, useEffect, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { HeartIcon, XMarkIcon, ShieldCheckIcon, ArrowRightIcon, CheckCircleIcon, PhotoIcon, UserCircleIcon, DocumentTextIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import config from "../../config";
import { motion, AnimatePresence } from "framer-motion";
import ImageCarousel from "../petshop/ImageCarousel";
import PropTypes from "prop-types";
import ZoomableImage from "../../components/ZoomableImage";

const backdropAnimation = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.3 },
  },
};

const modalAnimation = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: {
      duration: 0.3,
    },
  },
};

const contentAnimation = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom) => ({
    opacity: 1,
    y: 0,
    transition: { 
      delay: custom * 0.1,
      duration: 0.5,
      ease: "easeOut"
    }
  }),
};

const carouselVariants = {
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

// Enhanced ImageCarousel with auto-rotate functionality, touch support, and zoom capability
const AutoRotatingCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [showZoomedImage, setShowZoomedImage] = useState(false);
  const timerRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const carouselRef = useRef(null);

  const resetTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (images && images.length > 1) {
      timerRef.current = setInterval(() => {
        handleNext();
      }, 4000);
    }
  };
  
  useEffect(() => {
    resetTimer();
    return () => clearInterval(timerRef.current);
  }, [images]);

  const handlePrev = (e) => {
    e?.stopPropagation();
    setDirection(-1);
    setCurrentIndex(prevIndex => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    resetTimer();
  };

  const handleNext = (e) => {
    e?.stopPropagation();
    setDirection(1);
    setCurrentIndex(prevIndex => (prevIndex + 1) % images.length);
    resetTimer();
  };

  const handleDotClick = (index, e) => {
    e?.stopPropagation();
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
    resetTimer();
  };
  
  // Touch handlers for swipe functionality
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    // Calculate swipe distance
    const swipeDistance = Math.abs(touchStartX.current - touchEndX.current);
    
    // If there was significant movement, it's a swipe - handle navigation
    if (swipeDistance > 20) {
      e.stopPropagation();
      if (touchStartX.current - touchEndX.current > 0) {
        // Swipe left, go to next image
        handleNext(e);
      } else {
        // Swipe right, go to previous image
        handlePrev(e);
      }
    }
    // Otherwise it might be a tap - but do nothing here
    // We'll handle taps with a separate click handler
  };
  
  const handleImageClick = (e) => {
    e.stopPropagation();
    openZoomView(e);
  };
  
  const openZoomView = (e) => {
    if (e) e.stopPropagation();
    setShowZoomedImage(true);
    // Pause auto-rotation when zoomed
    clearInterval(timerRef.current);
  };
  
  if (!images || images.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <PhotoIcon className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300" />
      </div>
    );
  }

  return (
    <div 
      ref={carouselRef}
      className="relative w-full h-full overflow-hidden group"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <AnimatePresence initial={false} custom={direction}>
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          alt={`Pet image ${currentIndex + 1}`}
          className="w-full h-full object-cover"
          custom={direction}
          variants={carouselVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          onClick={handleImageClick}
        />
      </AnimatePresence>
      
      {/* Navigation Buttons - Hidden on mobile, visible on desktop */}
      {images.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="hidden md:block absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white transition hover:bg-black/50 opacity-0 group-hover:opacity-100 focus:outline-none"
            aria-label="Previous image"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <button
            onClick={handleNext}
            className="hidden md:block absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white transition hover:bg-black/50 opacity-0 group-hover:opacity-100 focus:outline-none"
            aria-label="Next image"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Navigation dots */}
      {images.length > 1 && (
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
          {images.map((_, idx) => (
            <button 
              key={idx} 
              onClick={(e) => handleDotClick(idx, e)}
              className={`h-2 rounded-full transition-all ${
                currentIndex === idx ? 'w-5 md:w-6 bg-white' : 'w-2 bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
      
      {/* Zoomable Image Gallery Modal */}
      <ZoomableImage
        src={images[currentIndex]}
        galleryImages={images}
        initialIndex={currentIndex}
        showZoomIcon={false}
        aspectRatio={false}
        className="hidden" // Hide the component, we just want to use its modal
        isModalOpen={showZoomedImage}
        onModalClose={() => {
          setShowZoomedImage(false);
          resetTimer(); // Resume auto-rotation when zoom is closed
        }}
      />
    </div>
  );
};

const MatingDetailsModal = ({
  pet,
  isOpen,
  onClose,
  wishlist,
  userId,
  payments = [],
  onAddToWishlist,
  onPaymentComplete,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [contactVisible, setContactVisible] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const RAZORPAY_KEY_ID = "rzp_test_BbYHp3Xn5nnaxa";

  // Calculate if pet is in wishlist and if payment has been made
  const isWishlisted = wishlist?.includes(pet?._id) || false;
  let hasPaid = payments?.includes(pet?._id) || false;

  // Load Razorpay script
  useEffect(() => {
    if (!window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => {
        setRazorpayLoaded(true);
      };
      script.onerror = () => {
        toast.error("Couldn't load payment gateway");
      };
      document.body.appendChild(script);
    } else {
      setRazorpayLoaded(true);
    }
  }, []);

  // Set contact visible if already paid
  useEffect(() => {
    if (hasPaid) {
      setContactVisible(true);
    }
  }, [hasPaid]);

  if (!pet) return null;
  
  // Images for carousel
  const imagesForCarousel = Array.isArray(pet.photosAndVideos) && pet.photosAndVideos.length > 0
    ? pet.photosAndVideos
    : [];

  const handlePayment = async () => {
    if (!razorpayLoaded) {
      toast.error("Payment system is still loading. Please wait a moment");
      return;
    }

    setIsLoading(true);

    try {
      // Create an order for the mating service with the special price of 9
      const { data } = await axios.post(
        `${config.baseURL}/api/payments/create`,
        {
          amount: 9, // Set the price to the special offer price of 9 rupees instead of using pet.price
          currency: "INR",
          receipt: `rcpt_mating_${pet._id.slice(-6)}_${Date.now()
            .toString()
            .slice(-6)}`,
          userId,
          petId: pet._id,
          serviceType: "mating"
        }
      );

      if (!data.success) {
        throw new Error(data.message || "Order creation failed");
      }

      const { order } = data;

      const options = {
        key: RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Pet Mating Service",
        description: `Mating Service for ${pet.breedName}`,
        order_id: order.id,
        handler: async function (response) {
          try {
            console.log("Payment response received, verifying...");
            
            const verifyRes = await axios.post(
              `${config.baseURL}/api/payments/verify`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                userId,
                petId: pet._id,
                serviceType: "mating"
              }
            );

            if (verifyRes.data.success) {
              toast.success("Payment successful!");
              setPaymentStatus(true);
              setContactVisible(true);
              hasPaid = true;
              
              // Notify parent component about successful payment
              if (onPaymentComplete) {
                onPaymentComplete(pet._id);
              }
            } else {
              toast.error("Payment verification failed");
            }
          } catch (err) {
            console.error("Verification error:", err);
            // Show more specific error message based on the response
            const errorMessage = err.response?.data?.message || err.message || "Couldn't verify payment";
            toast.error(errorMessage);
            
            // If there's a specific error related to pet not found, show a clearer message
            if (err.response?.data?.message?.includes("Pet not found")) {
              toast.error("This mating pet was not found in the database. Please contact support.");
            }
          } finally {
            setIsLoading(false);
          }
        },
        prefill: {
          name: "Customer",
          email: "customer@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#4F46E5",
        },
        modal: {
          ondismiss: () => {
            setIsLoading(false);
            toast("Payment window closed");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment error:", err);
      toast.error("Something went wrong with the payment");
      setIsLoading(false);
    }
  };

  const handleContactRequest = async () => {
    if (!userId) {
      toast.error("Please log in to contact the breeder");
      return;
    }
    
    if (hasPaid) {
      setContactVisible(true);
      toast.success("Contact information revealed!");
      return;
    }
    
    handlePayment();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <AnimatePresence>
        <motion.div
          variants={backdropAnimation}
          initial="hidden"
          animate="visible"
          exit="exit">
          <DialogBackdrop className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </motion.div>

        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-2 sm:p-4">
            <motion.div
              variants={modalAnimation}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full max-w-5xl">
              <DialogPanel className="mx-auto overflow-hidden rounded-2xl bg-white shadow-2xl">
                {/* Header */}
                <div className="px-4 sm:px-6 py-3 sm:py-4 border-b">
                  <div className="flex justify-between items-centered">
                    <div>
                      <h2 className="text-lg sm:text-xl font-semibold text-gray-900">{pet.breedName || "Unknown Breed"}</h2>
                      {!hasPaid && (
                        <div className="flex items-center mt-1 space-x-2">
                          <span className="text-xs sm:text-sm line-through text-gray-400">₹99</span>
                          <span className="text-xs sm:text-sm font-bold text-gray-900">₹9</span>
                          <span className="px-1.5 py-0.5 sm:px-2 bg-indigo-100 text-indigo-600 text-xs rounded">Special Offer</span>
                        </div>
                      )}
                    </div>
                    <button 
                      onClick={onClose} 
                      className="p-1.5 sm:p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                      aria-label="Close modal"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                
                {/* Tabs */}
                <div className="px-4 sm:px-6 border-b">
                  <div className="flex space-x-4 sm:space-x-6 overflow-x-auto no-scrollbar">
                    <button
                      onClick={() => setActiveTab('details')}
                      className={`py-2.5 sm:py-3 text-xs sm:text-sm font-medium ${activeTab === 'details' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      Details
                    </button>
                    {contactVisible && (
                      <button
                        onClick={() => setActiveTab('contact')}
                        className={`py-2.5 sm:py-3 text-xs sm:text-sm font-medium ${activeTab === 'contact' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                      >
                        Contact Info
                      </button>
                    )}
                    {contactVisible && pet.vaccinationDetails && (
                      <button
                        onClick={() => setActiveTab('health')}
                        className={`py-2.5 sm:py-3 text-xs sm:text-sm font-medium ${activeTab === 'health' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                      >
                        Health Records
                      </button>
                    )}
                  </div>
                </div>

                {/* Tab content */}
                <div className="px-4 sm:px-6 py-4 sm:py-6">
                  <AnimatePresence mode="wait">
                    {activeTab === 'details' && (
                      <motion.div
                        key="details"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6"
                      >
                        {/* Left column */}
                        <div className="md:col-span-4 space-y-3 sm:space-y-4">
                          <motion.div 
                            custom={1}
                            variants={contentAnimation}
                            initial="hidden" 
                            animate="visible"
                            className="bg-white shadow rounded-lg overflow-hidden"
                          >
                            <div className="w-full h-72 sm:h-80 md:h-96">
                              <AutoRotatingCarousel images={imagesForCarousel} />
                            </div>
                          </motion.div>
                          {!contactVisible && pet.vaccinationDetails && (
                            <motion.div 
                              custom={2}
                              variants={contentAnimation}
                              initial="hidden" 
                              animate="visible"
                              className="bg-white shadow rounded-lg p-3 sm:p-4"
                            >
                              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1 sm:mb-2">Vaccination Preview</h3>
                              <p className="text-gray-500 italic text-xs sm:text-sm">This pet has vaccination records available. Pay to view complete details.</p>
                            </motion.div>
                          )}
                        </div>
                        {/* Right column */}
                        <div className="md:col-span-8 space-y-3 sm:space-y-4">
                          <motion.div 
                            custom={4}
                            variants={contentAnimation}
                            initial="hidden" 
                            animate="visible"
                            className="bg-white shadow rounded-lg p-3 sm:p-4"
                          >
                            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2 sm:mb-4">Pet Information</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
                              {pet.breedName && (<><dt className="text-gray-500 text-xs sm:text-sm">Breed</dt><dd className="text-gray-900 text-xs sm:text-sm">{pet.breedName}</dd></>)}
                              {pet.age && (<><dt className="text-gray-500 text-xs sm:text-sm">Age</dt><dd className="text-gray-900 text-xs sm:text-sm">{pet.age} years</dd></>)}
                              {pet.gender && (<><dt className="text-gray-500 text-xs sm:text-sm">Gender</dt><dd className="text-gray-900 text-xs sm:text-sm">{pet.gender}</dd></>)}
                              {pet.petQuality && (<><dt className="text-gray-500 text-xs sm:text-sm">Quality</dt><dd className="text-gray-900 text-xs sm:text-sm">{pet.petQuality}</dd></>)}
                              {pet.location && (<><dt className="text-gray-500 text-xs sm:text-sm">Location</dt><dd className="text-gray-900 text-xs sm:text-sm">{pet.location}</dd></>)}
                              {pet.availability && (<><dt className="text-gray-500 text-xs sm:text-sm">Status</dt><dd className="text-gray-900 text-xs sm:text-sm">{pet.availability === "available" ? "Available" : "Unavailable"}</dd></>)}
                            </div>
                          </motion.div>
                          {pet.breedLineage && (
                            <motion.div
                              custom={5}
                              variants={contentAnimation}
                              initial="hidden"
                              animate="visible"
                              className="bg-white shadow rounded-lg p-3 sm:p-4"
                            >
                              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1 sm:mb-2">Breed Lineage</h3>
                              <p className="text-gray-700 text-xs sm:text-sm">{pet.breedLineage}</p>
                            </motion.div>
                          )}
                          {!contactVisible && (
                            <motion.div 
                              custom={6}
                              variants={contentAnimation}
                              initial="hidden" 
                              animate="visible"
                              className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-3 sm:p-4 text-white shadow flex flex-col sm:flex-row justify-between items-center"
                            >
                              <div className="flex flex-col justify-center items-center sm:items-start w-full sm:w-auto mb-4 sm:mb-0"> 
                              <h3 className="text-base sm:text-lg font-medium mb-2 sm:mb-3">Breeder Contact Info</h3>
                              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm list-disc list-inside">
                                <li>Breeder name and contact details</li>
                                <li>Shop address and location</li>
                                <li>Complete vaccination records</li>
                              </ul>
                              </div>
                              <div className="flex items-center justify-center w-full sm:w-auto">
                                <div className="flex flex-col items-center">
                                  <div className="flex items-center justify-center">
                                    <span className="line-through text-gray-400 text-sm">₹99</span>
                                    <span className="ml-2 text-white font-bold text-lg">₹9</span>
                                    <span className="ml-2 bg-yellow-400 text-black text-xs px-2 py-1 rounded-full uppercase font-bold">90% OFF</span>
                                  </div>
                                  <span className="text-gray-100 text-xs mt-1 text-center">Limited time offer - Unlock now!</span>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    )}

                    {activeTab === 'contact' && contactVisible && (
                      <motion.div
                        key="contact"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="bg-white shadow rounded-lg p-3 sm:p-4 space-y-3 sm:space-y-4">
                          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2 sm:mb-4">Contact Information</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
                            {pet.breederName && (
                              <div className="bg-white shadow rounded-lg p-3 sm:p-4">
                                <h4 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Breeder</h4>
                                <p className="text-gray-900 text-xs sm:text-sm">{pet.breederName}</p>
                              </div>
                            )}
                            {pet.phoneNum && (
                              <div className="bg-white shadow rounded-lg p-3 sm:p-4">
                                <h4 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Phone</h4>
                                <p className="text-gray-900 text-xs sm:text-sm">{pet.phoneNum}</p>
                              </div>
                            )}
                            {pet.location && (
                              <div className="bg-white shadow rounded-lg p-3 sm:p-4">
                                <h4 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Location</h4>
                                <p className="text-gray-900 text-xs sm:text-sm">{pet.location}</p>
                              </div>
                            )}
                            {pet.shopAddress && (
                              <div className="bg-white shadow rounded-lg p-3 sm:p-4">
                                <h4 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Shop Address</h4>
                                <p className="text-gray-900 text-xs sm:text-sm">{pet.shopAddress}</p>
                              </div>
                            )}
                            {pet.vendor?.vendorShopName && (
                              <div className="bg-white shadow rounded-lg p-3 sm:p-4">
                                <h4 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Shop Name</h4>
                                <p className="text-gray-900 text-xs sm:text-sm">{pet.vendor.vendorShopName}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {activeTab === 'health' && contactVisible && (
                      <motion.div
                        key="health"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="bg-white shadow rounded-lg p-3 sm:p-4 space-y-3 sm:space-y-4">
                          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2 sm:mb-4">Health Records</h3>
                          {pet.vaccinationDetails && (
                            <div className="bg-white shadow rounded-lg p-3 sm:p-4">
                              <h4 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Vaccination Details</h4>
                              <p className="text-gray-900 text-xs sm:text-sm">{pet.vaccinationDetails}</p>
                            </div>
                          )}
                          {pet.vaccinationProof && pet.vaccinationProof.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                              {pet.vaccinationProof.map((proofUrl, index) => (
                                <a
                                  key={index}
                                  href={proofUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                                >
                                  <div className="p-2 sm:p-3 border-b border-gray-200 flex items-center gap-2">
                                    <DocumentTextIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                                    <span className="text-xs sm:text-sm font-medium text-gray-900">Certificate {index + 1}</span>
                                  </div>
                                  <div className="aspect-[4/3] bg-gray-100">
                                    <img
                                      src={proofUrl}
                                      alt={`Vaccination proof ${index + 1}`}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Footer with actions */}
                <div className="px-4 sm:px-6 py-3 sm:py-4 border-t flex justify-between items-center">
                  <button 
                    onClick={() => onAddToWishlist(pet._id)} 
                    className="flex items-center px-3 sm:px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded shadow-sm hover:bg-gray-50 min-h-[44px]"
                    aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    <HeartIcon className={`h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2 ${isWishlisted ? 'text-red-600 fill-red-500' : ''}`} />
                    <span className="text-xs sm:text-sm">
                      {isWishlisted ? 'Saved' : 'Wishlist'}
                    </span>
                  </button>
                  {!contactVisible ? (
                    <button 
                      onClick={handleContactRequest} 
                      disabled={isLoading} 
                      className="flex items-center px-3 sm:px-6 py-2 bg-indigo-600 text-white rounded shadow-sm hover:bg-indigo-700 disabled:opacity-70 min-h-[44px]"
                      aria-label="Pay to contact breeder"
                    >
                      {isLoading ? (
                        <span className="text-xs sm:text-sm">Processing...</span>
                      ) : (
                        <span className="text-xs sm:text-sm">
                          Pay <span className="ml-1 mr-1 text-gray-300 font-bold">₹9</span>
                        </span>
                      )}
                    </button>
                  ) : (
                    <span className="text-green-600 font-medium flex items-center text-xs sm:text-sm">
                      <CheckCircleIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-1" />
                      Contact unlocked
                    </span>
                  )}
                </div>
              </DialogPanel>
            </motion.div>
          </div>
        </div>
      </AnimatePresence>
    </Dialog>
  );
};

MatingDetailsModal.propTypes = {
  pet: PropTypes.shape({
    _id: PropTypes.string,
    breedName: PropTypes.string,
    breedLineage: PropTypes.string,
    photosAndVideos: PropTypes.arrayOf(PropTypes.string),
    beforeMatingVideos: PropTypes.arrayOf(PropTypes.string),
    vaccinationProof: PropTypes.arrayOf(PropTypes.string),
    petQuality: PropTypes.string,
    age: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    gender: PropTypes.string,
    availability: PropTypes.string,
    location: PropTypes.string,
    breederName: PropTypes.string,
    phoneNum: PropTypes.string,
    shopAddress: PropTypes.string,
    vendor: PropTypes.object,
    vaccinationDetails: PropTypes.string,
    price: PropTypes.number,
    vendorId: PropTypes.string,
  }),
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  wishlist: PropTypes.arrayOf(PropTypes.string),
  userId: PropTypes.string,
  payments: PropTypes.arrayOf(PropTypes.string),
  onAddToWishlist: PropTypes.func.isRequired,
  onPaymentComplete: PropTypes.func,
};

export default MatingDetailsModal; 