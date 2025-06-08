import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import ImageGalleryModal from "./ImageGalleryModal";
import { MagnifyingGlassPlusIcon } from "@heroicons/react/24/outline";

const ZoomableImage = ({ 
  src, 
  alt, 
  className = "", 
  galleryImages = [], 
  initialIndex = 0,
  showZoomIcon = true,
  aspectRatio = true,
  isModalOpen = null,
  onModalClose = null
}) => {
  const [internalModalOpen, setInternalModalOpen] = useState(false);
  const touchStartY = useRef(0);
  const touchEndY = useRef(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const isTouchDevice = useRef(false);
  
  useEffect(() => {
    // Detect touch device
    isTouchDevice.current = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }, []);
  
  // If no gallery images provided, use the single image
  const imagesToShow = galleryImages.length > 0 ? galleryImages : [src];
  
  // Determine if modal is controlled externally or internally
  const isControlled = isModalOpen !== null && onModalClose !== null;
  const modalOpen = isControlled ? isModalOpen : internalModalOpen;
  
  // Handle modal close based on control mode
  const handleClose = () => {
    if (isControlled) {
      onModalClose();
    } else {
      setInternalModalOpen(false);
    }
  };
  
  // Handle touch start for mobile
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchEndX.current = e.touches[0].clientX;
    touchEndY.current = e.touches[0].clientY;
  };
  
  // Handle touch move for mobile
  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
    touchEndY.current = e.touches[0].clientY;
  };
  
  // Handle touch end for mobile
  const handleTouchEnd = (e) => {
    // Calculate distance
    const distanceX = Math.abs(touchEndX.current - touchStartX.current);
    const distanceY = Math.abs(touchEndY.current - touchStartY.current);
    
    // Only consider it a tap if there was minimal movement
    if (distanceX < 10 && distanceY < 10) {
      handleClick(e);
    }
  };
  
  // Handle click to open modal
  const handleClick = (e) => {
    e.stopPropagation();
    if (!isControlled) {
      setInternalModalOpen(true);
    }
  };
  
  return (
    <>
      <div 
        className={`relative group overflow-hidden ${aspectRatio ? 'aspect-square' : ''} ${className}`}
        onClick={isTouchDevice.current ? undefined : handleClick}
        onTouchStart={isTouchDevice.current ? handleTouchStart : undefined}
        onTouchMove={isTouchDevice.current ? handleTouchMove : undefined}
        onTouchEnd={isTouchDevice.current ? handleTouchEnd : undefined}
      >
        <img
          src={src}
          alt={alt || "Zoomable image"}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {showZoomIcon && (
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/80 rounded-full p-2">
              <MagnifyingGlassPlusIcon className="h-5 w-5 text-gray-800" />
            </div>
          </div>
        )}
      </div>
      
      <ImageGalleryModal
        images={imagesToShow}
        isOpen={modalOpen}
        onClose={handleClose}
        initialIndex={initialIndex}
      />
    </>
  );
};

ZoomableImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  className: PropTypes.string,
  galleryImages: PropTypes.arrayOf(PropTypes.string),
  initialIndex: PropTypes.number,
  showZoomIcon: PropTypes.bool,
  aspectRatio: PropTypes.bool,
  isModalOpen: PropTypes.bool,
  onModalClose: PropTypes.func
};

export default ZoomableImage; 