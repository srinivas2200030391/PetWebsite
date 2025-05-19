import { useState, useEffect } from "react";
import axios from "axios";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import {
  XMarkIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon, CheckBadgeIcon } from "@heroicons/react/20/solid";
import config from "../../config";
import toast from "react-hot-toast";
import ImageCarousel from "./ImageCarousel";

// Pet Details Modal
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
  const [activeImage, setActiveImage] = useState(null);
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
  const sampleImages = pet.images || [
    pet.imageUrl,
    "https://placehold.co/600x400?text=Pet+Image+2",
    "https://placehold.co/600x400?text=Pet+Image+3",
  ];

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
                userId,
                petId: pet._id,
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

  // Function to open image in new tab
  const openImageInNewTab = (image) => {
    const url = `/pets/image/${pet._id}/${encodeURIComponent(image)}`;
    window.open(url, "_blank");
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/60" />
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel className="mx-auto w-full max-w-3xl rounded-xl bg-white p-6 shadow-2xl">
            {/* Header with gradient background */}
            <div className="relative -m-6 mb-4 rounded-t-xl bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold">{pet.name}</h3>
                <button
                  onClick={onClose}
                  className="rounded-full bg-white/20 p-2 hover:bg-white/30 transition-colors">
                  <XMarkIcon className="h-5 w-5 text-white" />
                </button>
              </div>
              <div className="mt-1 flex items-center space-x-2">
                <span className="text-sm bg-white/20 px-2 py-0.5 rounded-full">
                  {pet.breed}
                </span>
                <span className="text-sm bg-white/20 px-2 py-0.5 rounded-full">
                  {pet.age} years
                </span>
                <span className="text-sm bg-white/20 px-2 py-0.5 rounded-full">
                  {pet.gender}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="relative">
                {/* Modified ImageCarousel component usage with click handler */}
                <div className="relative rounded-lg overflow-hidden shadow-md">
                  <ImageCarousel
                    images={sampleImages}
                    onImageClick={(image) => openImageInNewTab(image)}
                  />
                  <div className="absolute top-2 right-2 z-10">
                    <button
                      onClick={() => openImageInNewTab(sampleImages[0])}
                      className="bg-white/80 p-1.5 rounded-md shadow-md hover:bg-white transition-colors"
                      title="Open in new tab">
                      <ArrowTopRightOnSquareIcon className="h-4 w-4 text-gray-700" />
                    </button>
                  </div>
                </div>

                {/* Price badge */}
                <div className="absolute top-2 left-2 z-10 bg-indigo-600 text-white px-3 py-1 rounded-full font-bold shadow-md">
                  ${pet.price}
                </div>
              </div>

              <div>
                {/* Pet details section with cards */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="rounded-lg border border-gray-200 p-3 hover:border-indigo-300 transition-colors">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase">
                      Age
                    </h4>
                    <p className="text-lg font-medium">{pet.age} years old</p>
                  </div>

                  <div className="rounded-lg border border-gray-200 p-3 hover:border-indigo-300 transition-colors">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase">
                      Gender
                    </h4>
                    <p className="text-lg font-medium">{pet.gender}</p>
                  </div>

                  <div className="rounded-lg border border-gray-200 p-3 hover:border-indigo-300 transition-colors">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase">
                      Weight
                    </h4>
                    <p className="text-lg font-medium">{pet.weight}</p>
                  </div>

                  {pet.height && (
                    <div className="rounded-lg border border-gray-200 p-3 hover:border-indigo-300 transition-colors">
                      <h4 className="text-xs font-semibold text-gray-500 uppercase">
                        Height
                      </h4>
                      <p className="text-lg font-medium">{pet.height}</p>
                    </div>
                  )}

                  {pet.lifeSpan && (
                    <div className="rounded-lg border border-gray-200 p-3 hover:border-indigo-300 transition-colors">
                      <h4 className="text-xs font-semibold text-gray-500 uppercase">
                        Lifespan
                      </h4>
                      <p className="text-lg font-medium">{pet.lifeSpan}</p>
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 uppercase mb-2">
                    About {pet.name}
                  </h4>
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-200">
                    {pet.details || "No details available for this pet."}
                  </p>
                </div>

                {pet.characteristics && (
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-700 uppercase mb-2">
                      Characteristics
                    </h4>
                    <p className="text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-200">
                      {pet.characteristics}
                    </p>
                  </div>
                )}

                {/* Premium content section */}
                {hasPaid ? (
                  <div className="mt-8 rounded-lg border border-green-200 bg-green-50 p-5">
                    <div className="flex items-center mb-4">
                      <CheckBadgeIcon className="h-6 w-6 text-green-600 mr-2" />
                      <h4 className="text-lg font-semibold text-green-700">
                        Premium Pet Details
                      </h4>
                    </div>

                    <div className="space-y-4">
                      {pet.videos?.length > 0 && (
                        <div>
                          <h5 className="text-sm font-medium text-gray-600">
                            Videos
                          </h5>
                          <ul className="mt-1 space-y-1">
                            {pet.videos.map((video, idx) => (
                              <li key={idx} className="flex items-center">
                                <a
                                  href={video}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-indigo-600 hover:text-indigo-800 flex items-center">
                                  <span>Watch Video {idx + 1}</span>
                                  <ArrowTopRightOnSquareIcon className="h-4 w-4 ml-1" />
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Contact details in a grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        {pet.location && (
                          <div>
                            <h5 className="text-sm font-medium text-gray-600">
                              Location
                            </h5>
                            <p className="text-gray-800">{pet.location}</p>
                          </div>
                        )}

                        {pet.breederName && (
                          <div>
                            <h5 className="text-sm font-medium text-gray-600">
                              Breeder
                            </h5>
                            <p className="text-gray-800">{pet.breederName}</p>
                          </div>
                        )}

                        {pet.phoneNumber && (
                          <div>
                            <h5 className="text-sm font-medium text-gray-600">
                              Contact
                            </h5>
                            <p className="text-gray-800">{pet.phoneNumber}</p>
                          </div>
                        )}

                        {pet.shopAddress && (
                          <div>
                            <h5 className="text-sm font-medium text-gray-600">
                              Address
                            </h5>
                            <p className="text-gray-800">{pet.shopAddress}</p>
                          </div>
                        )}
                      </div>

                      {/* Health info */}
                      {(pet.breedLineage || pet.vaccinationDetails) && (
                        <div className="mt-4 border-t border-gray-200 pt-4">
                          {pet.breedLineage && (
                            <div className="mb-3">
                              <h5 className="text-sm font-medium text-gray-600">
                                Breed Lineage
                              </h5>
                              <p className="text-gray-800">
                                {pet.breedLineage}
                              </p>
                            </div>
                          )}

                          {pet.vaccinationDetails && (
                            <div>
                              <h5 className="text-sm font-medium text-gray-600">
                                Vaccination Details
                              </h5>
                              <p className="text-gray-800">
                                {pet.vaccinationDetails}
                              </p>
                              {pet.vaccinationProof && (
                                <a
                                  href={pet.vaccinationProof}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center mt-1 text-indigo-600 hover:text-indigo-800">
                                  <span>View Vaccination Record</span>
                                  <ArrowTopRightOnSquareIcon className="h-4 w-4 ml-1" />
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="mt-6 p-5 rounded-lg border border-indigo-100 bg-indigo-50">
                    <h4 className="text-lg font-semibold text-indigo-800 mb-2">
                      Unlock Premium Details
                    </h4>
                    <p className="text-gray-700 mb-2">
                      Pay now to access contact information, health records,
                      videos, and more exclusive details about {pet.name}.
                    </p>
                  </div>
                )}

                {/* Action buttons */}
                <div className="mt-8 flex space-x-4">
                  {!hasPaid ? (
                    <button
                      onClick={handlePayment}
                      className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 px-4 rounded-lg shadow-md font-medium transition-all duration-200 transform hover:-translate-y-0.5"
                      disabled={isLoading}>
                      {isLoading ? (
                        <span className="flex items-center justify-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                        </span>
                      ) : (
                        "Pay Now to View All Details"
                      )}
                    </button>
                  ) : (
                    <button
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg shadow-md font-medium flex items-center justify-center"
                      disabled>
                      <CheckBadgeIcon className="h-5 w-5 mr-2" />
                      Payment Successful
                    </button>
                  )}

                  <button
                    className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 p-3 rounded-lg shadow-sm transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToWishlist(pet._id);
                    }}>
                    <HeartIcon
                      className={`h-6 w-6 transition-colors duration-200 ${
                        isWishlisted
                          ? "text-red-500"
                          : "text-gray-400 hover:text-red-500"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default PetDetailsModal;
