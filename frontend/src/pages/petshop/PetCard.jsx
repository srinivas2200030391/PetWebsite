import { HeartIcon } from "@heroicons/react/20/solid";
import ImageCarousel from "./ImageCarousel";

// Pet Card Component with Limited Information
const PetCard = ({ pet, onAddToWishlist, onViewDetails, wishlist }) => {
  const isWishlisted = wishlist.includes(pet._id);

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

export default PetCard;
