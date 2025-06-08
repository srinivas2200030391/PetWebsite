import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { motion, AnimatePresence } from "framer-motion";

const variants = {
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

const ImageCarousel = ({ images = [], onClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const touchStartX = useRef(0);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const validImages = Array.isArray(images) && images.length > 0 
    ? images 
    : ["https://placehold.co/600x400?text=No+Image"];

  const displayImages = validImages.slice(0, 6);
  const hasMultipleImages = displayImages.length > 1;

  const handleInteraction = (action, e, dir) => {
    if (e) e.stopPropagation();
    if (dir !== undefined) setDirection(dir);
    action();
  };

  const nextImage = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
  };

  const selectImage = (index) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const swipeDistance = touchEndX - touchStartX.current;
    
    if (Math.abs(swipeDistance) < 50) {
      if (!isMobile && onClick) {
        e.stopPropagation();
        onClick();
      }
      return;
    }

    e.stopPropagation();
    if (swipeDistance < 0) {
      nextImage();
    } else {
      prevImage();
    }
  };

  return (
    <div 
      className="relative w-full h-full overflow-hidden rounded-lg bg-gray-100 group"
      onTouchStart={hasMultipleImages ? handleTouchStart : undefined}
      onTouchEnd={hasMultipleImages ? handleTouchEnd : undefined}
      onClick={!hasMultipleImages && !isMobile && onClick ? onClick : undefined}
    >
      <AnimatePresence initial={false} custom={direction}>
        <motion.img
          key={currentIndex}
          src={displayImages[currentIndex]}
          alt={`Pet ${currentIndex + 1}`}
          className="absolute w-full h-full object-cover"
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://placehold.co/600x400?text=Image+Error";
          }}
        />
      </AnimatePresence>

      {hasMultipleImages && (
        <>
          <button
            type="button"
            onClick={(e) => handleInteraction(prevImage, e, -1)}
            className="hidden md:block absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-1.5 rounded-full z-10"
            aria-label="Previous image"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={(e) => handleInteraction(nextImage, e, 1)}
            className="hidden md:block absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-1.5 rounded-full z-10"
            aria-label="Next image"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
          <div className="absolute bottom-3 left-0 right-0 flex justify-center space-x-2 z-10">
            {displayImages.map((_, index) => (
              <button
                type="button"
                key={`dot-${index}`}
                onClick={(e) => handleInteraction(() => selectImage(index), e)}
                className={`w-2.5 h-2.5 rounded-full transition-all shadow-md ${
                  index === currentIndex ? "bg-white scale-125" : "bg-white/50"
                }`}
              />
            ))}
          </div>
          <div className="absolute top-2 left-2 bg-black/60 text-white text-xs rounded-md px-2 py-1 z-10">
            {currentIndex + 1} / {displayImages.length}
          </div>
        </>
      )}
    </div>
  );
};

ImageCarousel.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string),
  onClick: PropTypes.func,
};

export default ImageCarousel;