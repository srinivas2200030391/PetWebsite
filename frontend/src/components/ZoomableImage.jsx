import { useState, useEffect } from "react";
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
  
  // Handle click to open modal
  const handleClick = () => {
    if (!isControlled) {
      setInternalModalOpen(true);
    }
  };
  
  return (
    <>
      <div 
        className={`relative group cursor-zoom-in overflow-hidden ${aspectRatio ? 'aspect-square' : ''} ${className}`}
        onClick={handleClick}
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