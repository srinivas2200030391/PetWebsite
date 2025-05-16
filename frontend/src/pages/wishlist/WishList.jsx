import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { HeartIcon } from "@heroicons/react/20/solid";
import config from "../../config";
import toast from "react-hot-toast";
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

// Image Carousel Component for Pet Cards
const ImageCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Limit to 4 images maximum
  const displayImages = images.slice(0, 4);

  const nextImage = (e) => {
    e.stopPropagation(); // Prevent event bubbling to parent elements
    setCurrentIndex((prevIndex) =>
      prevIndex === displayImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = (e) => {
    e.stopPropagation(); // Prevent event bubbling to parent elements
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? displayImages.length - 1 : prevIndex - 1
    );
  };

  const selectImage = (index, e) => {
    e.stopPropagation(); // Prevent event bubbling to parent elements
    setCurrentIndex(index);
  };

  return (
    <div className="relative w-full h-64 overflow-hidden rounded-lg">
      {displayImages.map((image, index) => (
        <div
          key={index}
          className={`absolute w-full h-full transition-opacity duration-300 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}>
          <img
            src={image}
            alt={`Pet image ${index + 1}`}
            className="w-full h-full object-cover"
          />
        </div>
      ))}

      {displayImages.length > 1 && (
        <>
          <button
            onClick={prevImage}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full">
            ‹
          </button>
          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full">
            ›
          </button>
          <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-2">
            {displayImages.map((_, index) => (
              <button
                key={index}
                onClick={(e) => selectImage(index, e)}
                className={`w-2 h-2 rounded-full ${
                  index === currentIndex ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// Pet Details Modal
const PetDetailsModal = ({
  pet,
  isOpen,
  onClose,
  wishlist,
  userId,
  payments,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  // Early check moved outside of the component body
  if (!pet) return null;

  const isWishlisted = wishlist.includes(pet._id);
  const paymentStatus = payments.includes(pet._id);

  const sampleImages = pet.images || [
    pet.imageUrl,
    "https://placehold.co/600x400?text=Pet+Image+2",
    "https://placehold.co/600x400?text=Pet+Image+3",
    "https://placehold.co/600x400?text=Pet+Image+4",
  ];

  const handlePayment = async () => {
    try {
      setIsLoading(true);
      const resp = await axios.post(`${config.baseURL}/api/payments/create`, {
        amount: pet.price,
        currency: "INR",
        receipt: `rcpt_${pet._id.slice(-6)}_${Date.now().toString().slice(-6)}`,
        notes: "Pet adoption payment",
        userId: userId,
        petId: pet._id,
      });

      if (resp?.data?.success) {
        toast.success(
          "💖 Payment initiated, darling! Complete it to see all the juicy details!"
        );
      } else {
        toast.error("😢 Payment failed, love. Wanna try again?");
      }
    } catch (error) {
      console.error("Payment failed:", error);
      toast.error("💔 Oopsie! Something went wrong, sugar.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/30" />
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel className="mx-auto w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-gray-900">{pet.name}</h3>
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-gray-100">
                <XMarkIcon className="h-6 w-6 text-gray-400" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <ImageCarousel images={sampleImages} />
              </div>
              <div>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Breed</h4>
                    <p className="text-base font-medium">{pet.breed}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Age</h4>
                    <p className="text-base font-medium">{pet.age} years old</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Gender
                    </h4>
                    <p className="text-base font-medium">{pet.gender}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Weight
                    </h4>
                    <p className="text-base font-medium">{pet.weight}</p>
                  </div>
                  {pet.height && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">
                        Height
                      </h4>
                      <p className="text-base font-medium">{pet.height}</p>
                    </div>
                  )}
                  {pet.lifeSpan && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">
                        Lifespan
                      </h4>
                      <p className="text-base font-medium">{pet.lifeSpan}</p>
                    </div>
                  )}
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Price</h4>
                    <p className="text-xl font-bold text-indigo-600">
                      ${pet.price}
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">
                    Details
                  </h4>
                  <p className="text-gray-700">
                    {pet.details || "No details available for this pet."}
                  </p>
                </div>

                {pet.characteristics && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">
                      Characteristics
                    </h4>
                    <p className="text-gray-700">{pet.characteristics}</p>
                  </div>
                )}
                {paymentStatus && (
                  <div className="mt-8 space-y-4 border-t pt-6">
                    <h4 className="text-lg font-semibold text-indigo-700">
                      Exclusive Pet Details 💎
                    </h4>

                    {pet.videos?.length > 0 && (
                      <div>
                        <h5 className="text-sm font-medium text-gray-500">
                          Videos
                        </h5>
                        <ul className="list-disc ml-5 text-blue-600 underline">
                          {pet.videos.map((video, idx) => (
                            <li key={idx}>
                              <a
                                href={video}
                                target="_blank"
                                rel="noopener noreferrer">
                                Watch Video {idx + 1} 🎥
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {pet.breedLineage && (
                      <div>
                        <h5 className="text-sm font-medium text-gray-500">
                          Breed Lineage
                        </h5>
                        <p className="text-base text-gray-700">
                          {pet.breedLineage}
                        </p>
                      </div>
                    )}

                    {pet.vaccinationDetails && (
                      <div>
                        <h5 className="text-sm font-medium text-gray-500">
                          Vaccination Details
                        </h5>
                        <p className="text-base text-gray-700">
                          {pet.vaccinationDetails}
                        </p>
                      </div>
                    )}

                    {pet.vaccinationProof && (
                      <div>
                        <h5 className="text-sm font-medium text-gray-500">
                          Vaccination Proof
                        </h5>
                        <a
                          href={pet.vaccinationProof}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline">
                          View Proof 📄
                        </a>
                      </div>
                    )}

                    {pet.location && (
                      <div>
                        <h5 className="text-sm font-medium text-gray-500">
                          Location
                        </h5>
                        <p className="text-base text-gray-700">
                          {pet.location}
                        </p>
                      </div>
                    )}

                    {pet.breederName && (
                      <div>
                        <h5 className="text-sm font-medium text-gray-500">
                          Breeder's Name
                        </h5>
                        <p className="text-base text-gray-700">
                          {pet.breederName}
                        </p>
                      </div>
                    )}

                    {pet.phoneNumber && (
                      <div>
                        <h5 className="text-sm font-medium text-gray-500">
                          Contact Number
                        </h5>
                        <p className="text-base text-gray-700">
                          {pet.phoneNumber}
                        </p>
                      </div>
                    )}

                    {pet.shopAddress && (
                      <div>
                        <h5 className="text-sm font-medium text-gray-500">
                          Shop Address
                        </h5>
                        <p className="text-base text-gray-700">
                          {pet.shopAddress}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Payment button */}
                <div className="mt-8 flex space-x-4">
                  {!paymentStatus ? (
                    <button
                      onClick={handlePayment}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md"
                      disabled={isLoading}>
                      {isLoading
                        ? "Processing..."
                        : "Pay Now To View All Details"}
                    </button>
                  ) : (
                    <button
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md"
                      disabled>
                      Payment Successful
                    </button>
                  )}

                  <button className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 p-2 rounded-md">
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

// Pet Card Component with Limited Information
const PetCard = ({ pet, onAddToWishlist, onViewDetails, wishlist }) => {
  const isWishlisted = wishlist.includes(pet._id);
  console.log(wishlist, pet);

  const sampleImages = pet.images || [
    pet.imageUrl,
    "https://placehold.co/600x400?text=Pet+Image+2",
    "https://placehold.co/600x400?text=Pet+Image+3",
    "https://placehold.co/600x400?text=Pet+Image+4",
  ];

  return (
    <div className="group relative border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white">
      <div className="cursor-pointer" onClick={() => onViewDetails(pet)}>
        <ImageCarousel images={sampleImages} />

        <div className="p-4">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-gray-900">{pet.name}</h3>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddToWishlist(pet._id);
              }}
              className="p-1 rounded-full hover:bg-gray-100"
              aria-label="Add to wishlist">
              <HeartIcon
                className={`h-6 w-6 transition-colors duration-200 ${
                  isWishlisted
                    ? "text-red-500"
                    : "text-gray-400 hover:text-red-500"
                }`}
              />
            </button>
          </div>

          <p className="mt-1 text-sm text-gray-500">{pet.breed}</p>
          <p className="mt-1 text-sm text-gray-500">{pet.age} years old</p>

          <div className="mt-2 flex justify-between items-center">
            <p className="text-lg font-medium text-gray-900">${pet.price}</p>
            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
              Available
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={() => onViewDetails(pet)}
        className="block w-[calc(100%-2rem)] mx-auto mb-4 mt-2 bg-indigo-600 text-white text-sm font-medium py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors">
        View Details
      </button>
    </div>
  );
};

export default function PetStore() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState([]);

  // Add state for pet details modal
  const [selectedPet, setSelectedPet] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Add state for wishlist
  const [wishlist, setWishlist] = useState([]);
  const [payments, setPayments] = useState([]);
  // 1. Store userData from localStorage
  useEffect(() => {
    const userdata = JSON.parse(localStorage.getItem("user"));

    if (userdata && userdata.data) {
      setUserData(userdata.data); // setUserData is async 💕
      console.log("Logged in as", userdata.data);
    } else {
      console.log("No user found");
    }
  }, []);

  // Fetch user's wishlist
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!userData?._id) return; // Make sure we wait for the user ID

      try {
        const response = await axios.get(
          `${config.baseURL}/api/user/getallwishlist/${userData._id}`
        );
        setWishlist(response.data);

        const validPetIds = response.data.filter((petId) => petId);

        // For each valid pet ID, fetch the details
        const petDetailsPromises = validPetIds.map((petId) =>
          axios.get(`${config.baseURL}/api/aboutpet/pet/${petId}`)
        );

        // Wait for all pet details to be fetched
        const petDetailsResponses = await Promise.all(petDetailsPromises);

        // Extract pet data from responses
        const petDetails = petDetailsResponses.map((res) => res.data);

        // Set the pets in state
        setPets(petDetails);
        console.log("Wishlist fetched", response.data);

        const resp = await axios.get(
          `${config.baseURL}/api/payments/getallpayments/${userData._id}`
        );
        setPayments(resp.data);
        console.log("Payments fetched", resp.data);
      } catch (err) {
        console.error("Error fetching wishlist:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [userData]); // Only run when userData is available

  const handleAddToWishlist = async (petId) => {
    try {
      console.log("Adding to wishlist:", petId);

      const userId = userData._id;
      await axios.put(`${config.baseURL}/api/user/updatewishlist`, {
        userId,
        wishListId: petId,
      });

      // Update local wishlist state
      setWishlist((prev) => [...prev, petId]);

      // Show success message
      toast.success("WishList updated successfully!");
      location.reload();
    } catch (err) {
      console.error("Error adding to wishlist:", err);

      // If unauthorized, prompt user to login
      if (err.response?.status === 401) {
        alert("Please log in to add pets to your wishlist.");
      } else {
        alert("Failed to add pet to wishlist. Please try again.");
      }
    }
  };

  // Handler for viewing pet details
  const handleViewDetails = (pet) => {
    console.log("Viewing details for pet:", pet);

    setSelectedPet(pet);
    setIsDetailsModalOpen(true);
  };

  return (
    <div className="bg-white">
      <div>
        {/* Mobile filter dialog */}
        <Dialog
          open={mobileFiltersOpen}
          onClose={setMobileFiltersOpen}
          className="relative z-40 lg:hidden">
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-black/25 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
          />

          <div className="fixed inset-0 z-40 flex">
            <DialogPanel
              transition
              className="relative ml-auto flex size-full max-w-xs transform flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl transition duration-300 ease-in-out data-[closed]:translate-x-full">
              <div className="flex items-center justify-between px-4">
                <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="-mr-2 flex size-10 items-center justify-center rounded-md bg-white p-2 text-gray-400">
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon aria-hidden="true" className="size-6" />
                </button>
              </div>
            </DialogPanel>
          </div>
        </Dialog>

        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-24">
            <h1 className="text-4xl uppercase font-extrabold tracking-tighter text-gray-900">
              Pets Store
            </h1>
          </div>

          <section aria-labelledby="products-heading" className="pb-24 pt-6">
            <h2 id="products-heading" className="sr-only">
              Available Pets
            </h2>

            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-8">
              {/* Products - Add scrollable container */}
              <div className="lg:col-span-6">
                <div className="h-[calc(100vh-200px)] overflow-y-auto pr-4 flex justify-center">
                  <div className="w-full max-w-6xl">
                    {loading ? (
                      <div className="flex justify-center items-center h-64">
                        <p className="text-gray-500">Loading pets...</p>
                      </div>
                    ) : error ? (
                      <div className="flex justify-center items-center h-64">
                        <p className="text-red-500">{error}</p>
                      </div>
                    ) : pets.length === 0 ? (
                      <div className="flex justify-center items-center h-64">
                        <p className="text-gray-500">
                          No pets found matching your criteria.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
                        {pets.map((pet) => (
                          <PetCard
                            key={pet._id}
                            pet={pet}
                            onViewDetails={handleViewDetails}
                            onAddToWishlist={handleAddToWishlist}
                            wishlist={wishlist}
                          />
                        ))}
                        <PetDetailsModal
                          pet={selectedPet}
                          isOpen={isDetailsModalOpen}
                          onClose={() => setIsDetailsModalOpen(false)}
                          wishlist={wishlist}
                                payments={payments}
                                userId = {userData._id}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
