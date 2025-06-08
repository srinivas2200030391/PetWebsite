import { useState, useEffect, useRef } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { XMarkIcon, MagnifyingGlassMinusIcon, MagnifyingGlassPlusIcon, ArrowsPointingOutIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";

const ImageGalleryModal = ({ images, isOpen, onClose, initialIndex = 0 }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchEndX = useRef(0);
  const touchEndY = useRef(0);
  const imageRef = useRef(null);
  const lastTapTimeRef = useRef(0);

  // Reset zoom and position when image changes or modal closes/opens
  useEffect(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, [currentIndex, isOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          prevImage();
          break;
        case 'ArrowRight':
          nextImage();
          break;
        case 'Escape':
          onClose();
          break;
        case '+':
          zoomIn();
          break;
        case '-':
          zoomOut();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, images?.length]);

  if (!images || images.length === 0 || !isOpen) return null;

  const zoomIn = () => {
    setScale(prevScale => Math.min(prevScale + 0.5, 4));
  };

  const zoomOut = () => {
    setScale(prevScale => {
      const newScale = Math.max(prevScale - 0.5, 1);
      
      // If returning to scale 1, reset position
      if (newScale === 1) {
        setPosition({ x: 0, y: 0 });
      }
      
      return newScale;
    });
  };

  const resetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const nextImage = () => {
    if (images.length <= 1) return;
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    resetZoom();
  };

  const prevImage = () => {
    if (images.length <= 1) return;
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    resetZoom();
  };

  // Mouse drag handlers for panning when zoomed
  const handleMouseDown = (e) => {
    if (scale > 1) {
      setIsDragging(true);
      setStartPos({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && scale > 1) {
      setPosition({ 
        x: e.clientX - startPos.x, 
        y: e.clientY - startPos.y 
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers for swipe navigation and panning
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchEndX.current = e.touches[0].clientX;
    touchEndY.current = e.touches[0].clientY;
    
    // For panning when zoomed
    if (scale > 1) {
      setIsDragging(true);
      setStartPos({ 
        x: e.touches[0].clientX - position.x, 
        y: e.touches[0].clientY - position.y 
      });
    }
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
    touchEndY.current = e.touches[0].clientY;
    
    if (isDragging && scale > 1) {
      // Pan the image when zoomed
      setPosition({ 
        x: e.touches[0].clientX - startPos.x, 
        y: e.touches[0].clientY - startPos.y 
      });
      // Prevent default to avoid scrolling the page
      e.preventDefault();
    }
  };

  const handleTouchEnd = (e) => {
    setIsDragging(false);
    
    // Check for double tap
    const now = Date.now();
    const isDoubleTap = now - lastTapTimeRef.current < 300;
    lastTapTimeRef.current = now;
    
    if (isDoubleTap) {
      handleDoubleTap(e);
      return;
    }
    
    // Only handle swipe when not zoomed
    if (scale === 1) {
      const deltaX = touchEndX.current - touchStartX.current;
      const deltaY = touchEndY.current - touchStartY.current;
      
      // Only consider horizontal swipe if the movement is mostly horizontal
      const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY) * 1.5;
      
      if (isHorizontalSwipe && Math.abs(deltaX) > 50) {
        if (deltaX < 0) {
          // Swipe left, go to next image
          nextImage();
        } else {
          // Swipe right, go to previous image
          prevImage();
        }
      }
    }
  };

  // Handle zoom on double tap (mobile)
  const handleDoubleTap = () => {
    if (scale === 1) {
      zoomIn();
    } else {
      resetZoom();
    }
  };

  // Handle zoom on double click (desktop)
  const handleDoubleClick = (e) => {
    if (scale === 1) {
      // Calculate position to zoom into where user clicked
      const rect = imageRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) * 2 - e.clientX + rect.left;
      const y = (e.clientY - rect.top) * 2 - e.clientY + rect.top;
      
      setScale(2);
      setPosition({ x, y });
    } else {
      resetZoom();
    }
  };

  // Handle wheel zoom
  const handleWheel = (e) => {
    e.preventDefault();
    
    if (e.deltaY < 0) {
      zoomIn();
    } else {
      zoomOut();
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/90 backdrop-blur-sm" />
      
      <div className="fixed inset-0 z-50 overflow-hidden">
        <DialogPanel className="h-full w-full flex flex-col">
          {/* Header with controls */}
          <div className="flex justify-between items-center py-2 px-4 bg-black/30">
            <div className="text-white text-sm sm:text-base">
              {images.length > 1 && (
                <span>{`${currentIndex + 1} / ${images.length}`}</span>
              )}
            </div>
            
            <div className="flex gap-2 sm:gap-3">
              <button 
                onClick={zoomOut} 
                className="p-1.5 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
                aria-label="Zoom out"
              >
                <MagnifyingGlassMinusIcon className="h-5 w-5" />
              </button>
              
              <button 
                onClick={zoomIn} 
                className="p-1.5 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
                aria-label="Zoom in"
              >
                <MagnifyingGlassPlusIcon className="h-5 w-5" />
              </button>
              
              <button 
                onClick={resetZoom} 
                className="p-1.5 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
                aria-label="Reset zoom"
              >
                <ArrowsPointingOutIcon className="h-5 w-5" />
              </button>
              
              <button 
                onClick={onClose} 
                className="p-1.5 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
                aria-label="Close gallery"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          {/* Main image container */}
          <div 
            className="flex-grow flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onDoubleClick={handleDoubleClick}
            onWheel={handleWheel}
          >
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{ 
                  transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
                  transformOrigin: 'center',
                  transition: isDragging ? 'none' : 'transform 0.3s'
                }}
                className="max-h-full max-w-full"
              >
                <img 
                  ref={imageRef}
                  src={images[currentIndex]} 
                  alt={`Image ${currentIndex + 1}`} 
                  className="max-h-[calc(100vh-100px)] max-w-full object-contain select-none"
                  draggable="false"
                />
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Navigation buttons for multiple images */}
          {images.length > 1 && (
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex justify-between px-4">
              <button
                onClick={prevImage}
                className="p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors min-h-[44px] min-w-[44px] hidden md:block"
                aria-label="Previous image"
              >
                <ChevronLeftIcon className="h-6 w-6" />
              </button>
              
              <button
                onClick={nextImage}
                className="p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors min-h-[44px] min-w-[44px] hidden md:block"
                aria-label="Next image"
              >
                <ChevronRightIcon className="h-6 w-6" />
              </button>
            </div>
          )}
          
          {/* Thumbnail strip at bottom */}
          {images.length > 1 && (
            <div className="py-2 px-4 bg-black/30 overflow-x-auto">
              <div className="flex gap-2 justify-center">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentIndex(index);
                      resetZoom();
                    }}
                    className={`flex-shrink-0 h-12 w-12 sm:h-16 sm:w-16 rounded-md overflow-hidden transition ${
                      index === currentIndex 
                        ? 'ring-2 ring-white ring-offset-1 ring-offset-black' 
                        : 'opacity-60 hover:opacity-100'
                    }`}
                    aria-label={`View image ${index + 1}`}
                  >
                    <img 
                      src={image} 
                      alt={`Thumbnail ${index + 1}`} 
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </DialogPanel>
      </div>
    </Dialog>
  );
};

ImageGalleryModal.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  initialIndex: PropTypes.number
};

export default ImageGalleryModal; 