import { useState } from "react";
import PropTypes from "prop-types";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

const ImageCarousel = ({ images = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Ensure images is an array and provide a fallback
  const validImages = Array.isArray(images) && images.length > 0 
    ? images 
    : ["https://placehold.co/600x400?text=No+Image"];

  // Limit to a reasonable number of images, e.g., 6
  const displayImages = validImages.slice(0, 6);
  const hasMultipleImages = displayImages.length > 1;

  const handleInteraction = (action, e) => {
    if (e) e.stopPropagation(); // Prevent event bubbling
    action();
  };

  const nextImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === displayImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? displayImages.length - 1 : prevIndex - 1
    );
  };

  const selectImage = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative w-full h-full overflow-hidden rounded-lg bg-gray-100 group">
      {displayImages.map((image, index) => (
        <div
          key={`pet-image-${index}-${image.slice(-10)}`} // More unique key
          className={`absolute inset-0 w-full h-full transition-opacity duration-300 ease-in-out ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={image}
            alt={`Pet ${index + 1}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null; // Prevent infinite loop if placeholder also fails
              e.target.src = "https://placehold.co/600x400?text=Image+Error";
            }}
          />
        </div>
      ))}

      {hasMultipleImages && (
        <>
          {/* Navigation Arrows */}
          <button
            type="button"
            onClick={(e) => handleInteraction(prevImage, e)}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-1.5 rounded-full z-10 transition-opacity opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Previous image"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={(e) => handleInteraction(nextImage, e)}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-1.5 rounded-full z-10 transition-opacity opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Next image"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-3 left-0 right-0 flex justify-center space-x-2 z-10">
            {displayImages.map((_, index) => (
              <button
                type="button"
                key={`dot-${index}`}
                onClick={(e) => handleInteraction(() => selectImage(index), e)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ease-in-out shadow-md
                  ${
                    index === currentIndex
                      ? "bg-white scale-125 ring-1 ring-black/20"
                      : "bg-white/50 hover:bg-white/75"
                  }
                `}
                aria-label={`Go to image ${index + 1}`}
                aria-current={index === currentIndex ? "true" : "false"}
              />
            ))}
          </div>
        </>
      )}
       {hasMultipleImages && (
        <div className="absolute top-2 right-2 bg-black/60 text-white text-xs font-medium rounded-md px-2 py-1 z-10">
          {currentIndex + 1} / {displayImages.length}
        </div>
      )}
    </div>
  );
};

ImageCarousel.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string),
};

export default ImageCarousel;