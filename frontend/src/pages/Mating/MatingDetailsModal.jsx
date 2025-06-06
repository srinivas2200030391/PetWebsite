import { useState, useEffect, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { HeartIcon, XMarkIcon, ShieldCheckIcon, ArrowRightIcon, CheckCircleIcon, PhotoIcon, UserCircleIcon, DocumentTextIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import config from "../../config";
import { motion, AnimatePresence } from "framer-motion";
import ImageCarousel from "../petshop/ImageCarousel";
import PropTypes from "prop-types";

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

// Enhanced ImageCarousel with auto-rotate functionality
const AutoRotatingCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef(null);

  const resetTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (images && images.length > 1) {
      timerRef.current = setInterval(() => {
        setCurrentIndex(prevIndex => (prevIndex + 1) % images.length);
      }, 4000);
    }
  };
  
  useEffect(() => {
    resetTimer();
    return () => clearInterval(timerRef.current);
  }, [images]);

  const handlePrev = () => {
    setCurrentIndex(prevIndex => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    resetTimer();
  };

  const handleNext = () => {
    setCurrentIndex(prevIndex => (prevIndex + 1) % images.length);
    resetTimer();
  };

  const handleDotClick = (index) => {
    setCurrentIndex(index);
    resetTimer();
  };
  
  if (!images || images.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <PhotoIcon className="h-16 w-16 text-gray-300" />
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden group">
      <AnimatePresence initial={false} mode="wait">
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          alt={`Pet image ${currentIndex + 1}`}
          className="w-full h-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        />
      </AnimatePresence>
      
      {/* Navigation Buttons */}
      {images.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white transition hover:bg-black/50 opacity-0 group-hover:opacity-100 focus:outline-none"
            aria-label="Previous image"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <button
            onClick={handleNext}
            className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white transition hover:bg-black/50 opacity-0 group-hover:opacity-100 focus:outline-none"
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
              onClick={() => handleDotClick(idx)}
              className={`h-2 rounded-full transition-all ${
                currentIndex === idx ? 'w-6 bg-white' : 'w-2 bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
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
  const hasPaid = payments?.includes(pet?._id) || false;

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
      // Create an order for the mating service
      const { data } = await axios.post(
        `${config.baseURL}/api/payments/create`,
        {
          amount: pet.price || 2500,
          currency: "INR",
          receipt: `rcpt_mating_${pet._id.slice(-6)}_${Date.now()
            .toString()
            .slice(-6)}`,
          userId,
          petId: pet._id,
          serviceType: "mating",
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
            const verifyRes = await axios.post(
              `${config.baseURL}/api/payments/verify`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                userId,
                petId: pet._id,
                serviceType: "mating",
              }
            );

            if (verifyRes.data.success) {
              toast.success("Payment successful!");
              setPaymentStatus(true);
              setContactVisible(true);
              
              // Notify parent component about successful payment
              if (onPaymentComplete) {
                onPaymentComplete(pet._id);
              }
            } else {
              toast.error("Payment verification failed");
            }
          } catch (err) {
            console.error("Verification error:", err);
            toast.error("Couldn't verify payment");
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
          <div className="flex min-h-full items-center justify-center p-4">
            <motion.div
              variants={modalAnimation}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full max-w-5xl">
              <DialogPanel className="mx-auto overflow-hidden rounded-2xl bg-white shadow-2xl">
                {/* Modern header with pet info and close button */}
                <div className="bg-gradient-to-r from-purple-600 to-indigo-700 px-6 py-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="bg-purple-200 text-purple-900 text-xs font-bold px-2.5 py-1 rounded-full">
                          ID: {pet.vendorId || pet._id?.substring(0, 8) || "N/A"}
                        </span>
                        {pet.availability && (
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                            pet.availability === "available" ? "bg-green-500 text-white" : "bg-gray-500 text-white"
                          }`}>
                            {pet.availability.charAt(0).toUpperCase() + pet.availability.slice(1)}
                          </span>
                        )}
                      </div>
                      <h1 className="text-2xl font-bold text-white">
                        {pet.breedName || "Unknown Breed"}
                      </h1>
                      <div className="flex items-center text-white/80 mt-1">
                        {pet.gender && <span>{pet.gender}</span>}
                        {pet.age && (
                          <>
                            <span className="mx-2">•</span>
                            <span>{pet.age} years old</span>
                          </>
                        )}
                        {pet.petQuality && (
                          <>
                            <span className="mx-2">•</span>
                            <span>{pet.petQuality}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      {pet.price && (
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                          <p className="text-xs text-white/80">Mating Fee</p>
                          <p className="text-xl font-bold text-white">₹{pet.price}</p>
                        </div>
                      )}
                      <button
                        onClick={onClose}
                        className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Tabs navigation */}
                <div className="border-b border-gray-200">
                  <div className="flex px-6">
                    <button
                      onClick={() => setActiveTab('details')}
                      className={`py-4 px-4 relative ${
                        activeTab === 'details' 
                          ? 'text-purple-600 font-medium' 
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Details
                      {activeTab === 'details' && (
                        <motion.div 
                          layoutId="activeTab"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600" 
                        />
                      )}
                    </button>
                    
                    {contactVisible && (
                      <button
                        onClick={() => setActiveTab('contact')}
                        className={`py-4 px-4 relative ${
                          activeTab === 'contact' 
                            ? 'text-purple-600 font-medium' 
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        Breeder Info
                        {activeTab === 'contact' && (
                          <motion.div 
                            layoutId="activeTab"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600" 
                          />
                        )}
                      </button>
                    )}
                    
                    {contactVisible && pet.vaccinationDetails && (
                      <button
                        onClick={() => setActiveTab('health')}
                        className={`py-4 px-4 relative ${
                          activeTab === 'health' 
                            ? 'text-purple-600 font-medium' 
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        Health Records
                        {activeTab === 'health' && (
                          <motion.div 
                            layoutId="activeTab"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600" 
                          />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Tab content */}
                <div className="p-6">
                  <AnimatePresence mode="wait">
                    {activeTab === 'details' && (
                      <motion.div
                        key="details"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                      >
                        {/* Left column */}
                        <div className="space-y-6">
                          {/* Image carousel with auto-rotation */}
                          <motion.div 
                            custom={1}
                            variants={contentAnimation}
                            initial="hidden" 
                            animate="visible"
                            className="overflow-hidden rounded-lg border border-gray-200 shadow-sm bg-gray-50"
                          >
                            <div className="aspect-[4/3]">
                              <AutoRotatingCarousel images={imagesForCarousel} />
                            </div>
                          </motion.div>
                          
                          {/* Breed lineage if available */}
                          {pet.breedLineage && (
                            <motion.div 
                              custom={3}
                              variants={contentAnimation}
                              initial="hidden" 
                              animate="visible"
                            >
                              <h3 className="text-lg font-medium text-gray-900 mb-3">Breed Lineage</h3>
                              <div className="bg-purple-50 rounded-lg border border-purple-100 p-4">
                                <p className="text-sm text-gray-700">{pet.breedLineage}</p>
                              </div>
                            </motion.div>
                          )}
                        </div>

                        {/* Right column */}
                        <div className="space-y-6">
                          {/* Info grid */}
                          <motion.div 
                            custom={2}
                            variants={contentAnimation}
                            initial="hidden" 
                            animate="visible"
                          >
                            <h3 className="text-lg font-medium text-gray-900 mb-3">Pet Information</h3>
                            <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                              <dl className="divide-y divide-gray-200">
                                {pet.breedName && (
                                  <div className="grid grid-cols-3 px-4 py-3">
                                    <dt className="text-sm font-medium text-gray-500">Breed</dt>
                                    <dd className="text-sm text-gray-900 col-span-2">{pet.breedName}</dd>
                                  </div>
                                )}
                                {pet.age && (
                                  <div className="grid grid-cols-3 px-4 py-3">
                                    <dt className="text-sm font-medium text-gray-500">Age</dt>
                                    <dd className="text-sm text-gray-900 col-span-2">{pet.age} years</dd>
                                  </div>
                                )}
                                {pet.gender && (
                                  <div className="grid grid-cols-3 px-4 py-3">
                                    <dt className="text-sm font-medium text-gray-500">Gender</dt>
                                    <dd className="text-sm text-gray-900 col-span-2">{pet.gender}</dd>
                                  </div>
                                )}
                                {pet.petQuality && (
                                  <div className="grid grid-cols-3 px-4 py-3">
                                    <dt className="text-sm font-medium text-gray-500">Quality</dt>
                                    <dd className="text-sm text-gray-900 col-span-2">{pet.petQuality}</dd>
                                  </div>
                                )}
                                {pet.location && (
                                  <div className="grid grid-cols-3 px-4 py-3">
                                    <dt className="text-sm font-medium text-gray-500">Location</dt>
                                    <dd className="text-sm text-gray-900 col-span-2">{pet.location}</dd>
                                  </div>
                                )}
                                {pet.availability && (
                                  <div className="grid grid-cols-3 px-4 py-3">
                                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                                    <dd className="text-sm text-gray-900 col-span-2">
                                      {pet.availability === "available" ? "Available" : "Unavailable"}
                                    </dd>
                                  </div>
                                )}
                              </dl>
                            </div>
                          </motion.div>
                          
                          {/* Vaccination info */}
                          {!contactVisible && pet.vaccinationDetails && (
                            <motion.div 
                              custom={4}
                              variants={contentAnimation}
                              initial="hidden" 
                              animate="visible"
                            >
                              <h3 className="text-lg font-medium text-gray-900 mb-3">Vaccination Preview</h3>
                              <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                                <p className="text-sm text-gray-500 italic">
                                  This pet has vaccination records available. Pay to view complete details.
                                </p>
                              </div>
                            </motion.div>
                          )}

                          {!contactVisible && (
                            <motion.div 
                              custom={5}
                              variants={contentAnimation}
                              initial="hidden" 
                              animate="visible"
                              className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg shadow-lg p-5 text-white"
                            >
                              <h3 className="text-lg font-semibold flex items-center gap-2">
                                <ShieldCheckIcon className="h-5 w-5" />
                                Breeder Contact Info
                              </h3>
                              <p className="mt-2 text-sm text-white/90">
                                Pay to unlock:
                              </p>
                              <ul className="mt-3 space-y-2">
                                <li className="flex items-center text-sm">
                                  <CheckCircleIcon className="h-4 w-4 mr-2 text-purple-200" />
                                  Breeder name and contact details
                                </li>
                                <li className="flex items-center text-sm">
                                  <CheckCircleIcon className="h-4 w-4 mr-2 text-purple-200" />
                                  Shop address and location
                                </li>
                                <li className="flex items-center text-sm">
                                  <CheckCircleIcon className="h-4 w-4 mr-2 text-purple-200" />
                                  Complete vaccination records
                                </li>
                              </ul>
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
                        className="space-y-6"
                      >
                        <div className="bg-purple-50 border border-purple-100 rounded-lg p-5">
                          <h3 className="text-lg font-medium text-purple-800 mb-4">Breeder Information</h3>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {pet.breederName && (
                              <div className="bg-white rounded-lg p-4 shadow-sm border border-purple-100">
                                <h4 className="text-sm font-medium text-gray-500 mb-1">Breeder</h4>
                                <p className="text-base text-gray-900">{pet.breederName}</p>
                              </div>
                            )}
                            
                            {pet.phoneNum && (
                              <div className="bg-white rounded-lg p-4 shadow-sm border border-purple-100">
                                <h4 className="text-sm font-medium text-gray-500 mb-1">Phone</h4>
                                <p className="text-base text-gray-900">{pet.phoneNum}</p>
                              </div>
                            )}
                            
                            {pet.location && (
                              <div className="bg-white rounded-lg p-4 shadow-sm border border-purple-100">
                                <h4 className="text-sm font-medium text-gray-500 mb-1">Location</h4>
                                <p className="text-base text-gray-900">{pet.location}</p>
                              </div>
                            )}
                            
                            {pet.shopAddress && (
                              <div className="bg-white rounded-lg p-4 shadow-sm border border-purple-100">
                                <h4 className="text-sm font-medium text-gray-500 mb-1">Shop Address</h4>
                                <p className="text-base text-gray-900">{pet.shopAddress}</p>
                              </div>
                            )}
                            
                            {pet.vendor?.vendorShopName && (
                              <div className="bg-white rounded-lg p-4 shadow-sm border border-purple-100">
                                <h4 className="text-sm font-medium text-gray-500 mb-1">Shop Name</h4>
                                <p className="text-base text-gray-900">{pet.vendor.vendorShopName}</p>
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
                        className="space-y-6"
                      >
                        <div className="bg-green-50 border border-green-100 rounded-lg p-5">
                          <h3 className="text-lg font-medium text-green-800 mb-4">Health Records</h3>
                          
                          {pet.vaccinationDetails && (
                            <div className="bg-white rounded-lg p-4 shadow-sm border border-green-100 mb-4">
                              <h4 className="text-sm font-medium text-gray-500 mb-1">Vaccination Details</h4>
                              <p className="text-base text-gray-900">{pet.vaccinationDetails}</p>
                            </div>
                          )}
                          
                          {pet.vaccinationProof && pet.vaccinationProof.length > 0 && (
                            <div className="bg-white rounded-lg p-4 shadow-sm border border-green-100">
                              <h4 className="text-sm font-medium text-gray-500 mb-3">Vaccination Proof</h4>
                              <div className="grid grid-cols-2 gap-4">
                                {pet.vaccinationProof.map((proofUrl, index) => (
                                  <a 
                                    key={index} 
                                    href={proofUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="block rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                                  >
                                    <div className="bg-green-50 p-3 border-b border-green-100 flex items-center gap-2">
                                      <DocumentTextIcon className="h-5 w-5 text-green-600" />
                                      <span className="text-sm font-medium text-gray-900">Certificate {index + 1}</span>
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
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Footer with actions */}
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <button
                      onClick={() => onAddToWishlist(pet._id)}
                      className={`flex items-center justify-center px-4 py-2 rounded-lg border text-sm font-medium ${
                        isWishlisted
                          ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <HeartIcon
                        className={`h-5 w-5 mr-2 transition-colors ${
                          isWishlisted ? "text-red-600 fill-red-500" : ""
                        }`}
                      />
                      {isWishlisted ? "Saved to Wishlist" : "Add to Wishlist"}
                    </button>
                    
                    {!contactVisible ? (
                      <button
                        onClick={handleContactRequest}
                        disabled={isLoading}
                        className="relative inline-flex items-center justify-center sm:px-8 px-6 py-2.5 rounded-lg overflow-hidden group bg-gradient-to-br from-purple-600 to-indigo-700 text-white font-medium shadow-md hover:shadow-lg transition-all disabled:opacity-70"
                      >
                        <span className="relative flex items-center gap-2">
                          {isLoading ? (
                            <>
                              <svg
                                className="animate-spin h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24">
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Processing...
                            </>
                          ) : (
                            <>
                              <UserCircleIcon className="h-5 w-5" />
                              Pay to Contact Breeder
                            </>
                          )}
                        </span>
                      </button>
                    ) : (
                      <div className="text-sm text-green-600 font-medium flex items-center">
                        <CheckCircleIcon className="h-5 w-5 mr-1" />
                        Breeder contact unlocked
                      </div>
                    )}
                  </div>
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