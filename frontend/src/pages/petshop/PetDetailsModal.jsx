import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { HeartIcon, XMarkIcon } from "@heroicons/react/24/outline";
import config from "../../config";
import { motion } from "framer-motion";
import ImageCarousel from "./ImageCarousel";
import PropTypes from "prop-types";

// Pet Details Modal

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
    scale: 0.8,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.4,
      scale: { type: "spring", bounce: 0.5 },
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: 20,
    transition: {
      duration: 0.3,
    },
  },
};

const PetDetailsModal = ({
  pet,
  isOpen,
  onClose,
  wishlist,
  userId,
  payments,
  onAddToWishlist,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(false);
  const RAZORPAY_KEY_ID = "rzp_test_BbYHp3Xn5nnaxa";
  useEffect(() => {
    if (!window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => {
        setRazorpayLoaded(true);
        console.log("Razorpay loaded, sugar 🧁");
      };
      script.onerror = () => {
        toast.error("Couldn't load payment gateway, sweetie 😢");
      };
      document.body.appendChild(script);
    } else {
      setRazorpayLoaded(true);
    }
  }, []);

  if (!pet) return null;
  const isWishlisted = wishlist.includes(pet._id);
  let hasPaid = payments.includes(pet._id);
  
  // Refined logic for images passed to the carousel
  let imagesForCarousel = [];
  if (Array.isArray(pet.images) && pet.images.length > 0) {
    imagesForCarousel = pet.images;
  } else if (pet.imageUrl) {
    imagesForCarousel = [pet.imageUrl];
  }
  // If imagesForCarousel is empty, ImageCarousel component will use its own default placeholder

  const handlePayment = async () => {
    if (!razorpayLoaded) {
      toast.error("Hold on, darling! Payment system is still loading 🥺");
      return;
    }

    setIsLoading(true);

    try {
      const { data } = await axios.post(
        `${config.baseURL}/api/payments/create`,
        {
          amount: pet.price,
          currency: "INR",
          receipt: `rcpt_${pet._id.slice(-6)}_${Date.now()
            .toString()
            .slice(-6)}`,
          userId,
          petId: pet._id,
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
        name: "Pet Adoption Center 💕",
        description: `Adopt ${pet.name}`,
        order_id: order.id,
        handler: async function (response) {
          try {
            const verifyRes = await axios.post(
              `${config.baseURL}/api/payments/verify`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }
            );

            if (verifyRes.data.success) {
              toast.success("Paw-fect! Payment successful 🐾💸");
              setPaymentStatus(true);
              hasPaid = true;
            } else {
              toast.error("Oops! Verification failed, sweetpea 😢");
            }
          } catch (err) {
            console.error("Verification error:", err);
            toast.error("Uh-oh! Couldn't verify payment, honey 🍯");
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
          color: "#7C3AED",
        },
        modal: {
          ondismiss: () => {
            setIsLoading(false);
            toast("You closed the payment window 😘");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment error:", err);
      toast.error("Something went wrong, cupcake 💔");
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50 ">
      {/* Backdrop with reduced opacity for a more subtle enterprise look */}
      <motion.div
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
          exit: { opacity: 0 },
        }}
        initial="hidden"
        animate="visible"
        exit="exit">
        <DialogBackdrop className="fixed inset-0 bg-slate-900/40" />
      </motion.div>

      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/10 bg-opacity-50 backdrop-blur-sm">
        <div className="flex min-h-full items-center justify-center p-4">
          <motion.div
            variants={{
              hidden: { opacity: 0, scale: 0.95 },
              visible: { opacity: 1, scale: 1 },
              exit: { opacity: 0, scale: 0.95 },
            }}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full max-w-4xl">
            <DialogPanel className="mx-auto rounded-lg bg-white shadow-xl overflow-hidden">
              {/* Header section with gradient background */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4">
                <div className="flex justify-between items-center">
                  <motion.h3
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-2xl font-semibold text-white">
                    Pet Profile
                  </motion.h3>
                  <button
                    onClick={onClose}
                    className="p-1 rounded-full hover:bg-white/10 transition-colors">
                    <XMarkIcon className="h-6 w-6 text-white" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">
                {/* Left column: Image carousel */}
                <div className="md:col-span-1 p-4">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}>
                    {/* Added a wrapper for aspect ratio */}
                    <div className="w-full aspect-[4/3] rounded-lg overflow-hidden mb-4 bg-gray-100">
                      <ImageCarousel images={imagesForCarousel} />
                    </div>

                    <div className="mt-6">
                      <div className="flex items-center justify-between">
                        <h2 className="mt-8 text-xl font-bold text-gray-900">
                          {pet.breed}
                        </h2>
                      </div>
                      <p className="text-lg font-semibold text-indigo-600 mt-1">
                        ₹{pet.price}
                      </p>
                    </div>
                  </motion.div>
                </div>

                {/* Middle column: Pet details */}
                <div className="md:col-span-1 p-6">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-4">
                    <h4 className="text-lg font-medium text-gray-900 pb-2 border-b border-gray-200">
                      Pet Information
                    </h4>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h5 className="text-sm font-medium text-gray-500">
                          Breed
                        </h5>
                        <p className="text-sm font-medium">{pet.breed}</p>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-gray-500">
                          Age
                        </h5>
                        <p className="text-sm font-medium">
                          {pet.age} {pet.ageUnit || "years old"}
                        </p>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-gray-500">
                          Gender
                        </h5>
                        <p className="text-sm font-medium">{pet.gender}</p>
                      </div>
                      {pet.height && (
                        <div>
                          <h5 className="text-sm font-medium text-gray-500">
                            Height
                          </h5>
                          <p className="text-sm font-medium">{pet.height}</p>
                        </div>
                      )}
                      {pet.lifeSpan && (
                        <div>
                          <h5 className="text-sm font-medium text-gray-500">
                            Lifespan
                          </h5>
                          <p className="text-sm font-medium">{pet.lifeSpan}</p>
                        </div>
                      )}
                      {pet.petQuality && (
                        <div>
                          <h5 className="text-sm font-medium text-gray-500">
                            Quality
                          </h5>
                          <p className="text-sm font-medium">{pet.petQuality}</p>
                        </div>
                      )}
                      {pet.status && (
                        <div>
                          <h5 className="text-sm font-medium text-gray-500">
                            Status
                          </h5>
                          <p className="text-sm font-medium">{pet.status}</p>
                        </div>
                      )}
                    </div>

                    <div className="pt-4">
                      <h5 className="text-sm font-medium text-gray-500 mb-1">
                        Details
                      </h5>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {pet.details || "No details available for this pet."}
                      </p>
                    </div>

                    {pet.characteristics && (
                      <div>
                        <h5 className="text-sm font-medium text-gray-500 mb-1">
                          Characteristics
                        </h5>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {pet.characteristics.split(",").map((trait, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                              {trait.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                </div>

                {/* Right column: Premium details or call to action */}
                <div className="md:col-span-1 p-6 bg-gray-50">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}>
                    {!hasPaid ? (
                      <div className="flex flex-col h-full">
                        <div className="flex-grow">
                          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
                            <h4 className="font-medium text-gray-900 flex items-center gap-2">
                              <span className="text-indigo-600">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5"
                                  viewBox="0 0 20 20"
                                  fill="currentColor">
                                  <path
                                    fillRule="evenodd"
                                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 116 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </span>
                              Premium Information
                            </h4>
                            <p className="text-sm text-gray-600 mt-2">
                              Unlock complete pet details including:
                            </p>
                            <ul className="mt-3 space-y-2">
                              <li className="flex items-center text-sm text-gray-600">
                                <svg
                                  className="h-4 w-4 text-green-500 mr-2"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                                Contact information & location
                              </li>
                              <li className="flex items-center text-sm text-gray-600">
                                <svg
                                  className="h-4 w-4 text-green-500 mr-2"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                                Breeder documentation
                              </li>
                              <li className="flex items-center text-sm text-gray-600">
                                <svg
                                  className="h-4 w-4 text-green-500 mr-2"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                                Health & vaccination records
                              </li>
                              <li className="flex items-center text-sm text-gray-600">
                                <svg
                                  className="h-4 w-4 text-green-500 mr-2"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                                Video content & more
                              </li>
                            </ul>
                          </div>
                        </div>

                        <div>
                          <button
                            onClick={handlePayment}
                            disabled={isLoading}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-md font-medium transition-colors flex items-center justify-center gap-2">
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
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5"
                                  viewBox="0 0 20 20"
                                  fill="currentColor">
                                  <path
                                    fillRule="evenodd"
                                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 116 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                Unlock Complete Details
                              </>
                            )}
                          </button>
                          <div className="flex items-center justify-center mt-2">
                            <button
                              className="flex items-center text-gray-500 hover:text-indigo-600 text-sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                onAddToWishlist(pet._id);
                              }}>
                              <HeartIcon
                                className={`h-5 w-5 mr-1 transition-colors duration-200 ${
                                  isWishlisted
                                    ? "text-red-500"
                                    : "text-gray-400"
                                }`}
                              />
                              {isWishlisted
                                ? "Saved to Wishlist"
                                : "Add to Wishlist"}
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-5">
                        <div className="flex items-center justify-between">
                          <h4 className="text-lg font-medium text-gray-900">
                            Premium Details
                          </h4>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Verified
                          </span>
                        </div>

                        {pet.videos?.length > 0 && (
                          <div>
                            <h5 className="text-sm font-medium text-gray-900 mb-1">
                              Media Content
                            </h5>
                            <div className="space-y-2">
                              {pet.videos.map((video, idx) => (
                                <a
                                  key={idx}
                                  href={video}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block bg-white border border-gray-200 rounded-md p-2 hover:bg-gray-50 transition-colors flex items-center text-blue-600 text-sm">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 mr-2"
                                    viewBox="0 0 20 20"
                                    fill="currentColor">
                                    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                                    <path
                                      fillRule="evenodd"
                                      d="M10 18a2 2 0 002-2v-8a2 2 0 00-2-2V4a2 2 0 00-2 2v.5a1 1 0 001 1H9v10H8a1 1 0 00-1 1V17a2 2 0 002 2h1z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  Video {idx + 1}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="space-y-4">
                          {pet.breedLineage && (
                            <div>
                              <h5 className="text-sm font-medium text-gray-900">
                                Breed Lineage
                              </h5>
                              <p className="text-sm text-gray-700">
                                {pet.breedLineage}
                              </p>
                            </div>
                          )}

                          {pet.vaccinationDetails && (
                            <div>
                              <h5 className="text-sm font-medium text-gray-900">
                                Vaccination Details
                              </h5>
                              <p className="text-sm text-gray-700">
                                {pet.vaccinationDetails}
                              </p>

                              {pet.vaccinationProof && (
                                <a
                                  href={pet.vaccinationProof}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center mt-2 text-sm text-blue-600 hover:text-blue-800">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 mr-1"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                                    />
                                  </svg>
                                  View Documentation
                                </a>
                              )}
                            </div>
                          )}
                          {pet.vendor && (
                            <div>
                              <h5 className="text-sm font-medium text-gray-900">
                                Vendor Ref
                              </h5>
                              <p className="text-sm text-gray-700">
                                {pet.vendor}
                              </p>
                            </div>
                          )}
                           {pet.vendorId && (
                            <div>
                              <h5 className="text-sm font-medium text-gray-900">
                                Vendor ID
                              </h5>
                              <p className="text-sm text-gray-700">
                                {pet.vendorId}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="border-t border-gray-200 pt-4 mt-6">
                          <h4 className="text-sm font-medium text-gray-900 mb-3">
                            Contact Information
                          </h4>

                          <div className="space-y-3">
                            {pet.breederName && (
                              <div className="flex items-start">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5 text-gray-400 mr-2"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                  />
                                </svg>
                                <div>
                                  <h5 className="text-xs font-medium text-gray-500">
                                    Breeder
                                  </h5>
                                  <p className="text-sm text-gray-900">
                                    {pet.breederName}
                                  </p>
                                </div>
                              </div>
                            )}

                            {pet.phoneNumber && (
                              <div className="flex items-start">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5 text-gray-400 mr-2"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                  />
                                </svg>
                                <div>
                                  <h5 className="text-xs font-medium text-gray-500">
                                    Phone
                                  </h5>
                                  <p className="text-sm text-gray-900">
                                    {pet.phoneNumber}
                                  </p>
                                </div>
                              </div>
                            )}

                            {pet.location && (
                              <div className="flex items-start">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5 text-gray-400 mr-2"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                </svg>
                                <div>
                                  <h5 className="text-xs font-medium text-gray-500">
                                    Location
                                  </h5>
                                  <p className="text-sm text-gray-900">
                                    {pet.location}
                                  </p>
                                </div>
                              </div>
                            )}

                            {pet.shopAddress && (
                              <div className="flex items-start">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5 text-gray-400 mr-2"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                  />
                                </svg>
                                <div>
                                  <h5 className="text-xs font-medium text-gray-500">
                                    Shop Address
                                  </h5>
                                  <p className="text-sm text-gray-900">
                                    {pet.shopAddress}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
                <div className="text-sm text-gray-500">
                  Pet Id: {pet.petId || pet._id || "N/A"}
                </div>
                <div className="flex space-x-2">
                  <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                      />
                    </svg>
                    Share
                  </button>
                  <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    Schedule Visit
                  </button>
                </div>
              </div>
            </DialogPanel>
          </motion.div>
        </div>
      </div>
    </Dialog>
  );
};
PetDetailsModal.propTypes = {
  pet: PropTypes.object,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  wishlist: PropTypes.array.isRequired,
  userId: PropTypes.string,
  payments: PropTypes.array.isRequired,
  onAddToWishlist: PropTypes.func.isRequired,
};

export default PetDetailsModal;