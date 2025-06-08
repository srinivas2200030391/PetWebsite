import { useState, useEffect, useRef, Fragment } from "react";
import { Dialog } from "@headlessui/react";
import { XMarkIcon, MagnifyingGlassMinusIcon, MagnifyingGlassPlusIcon, ArrowsPointingOutIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
};

const modalVariants = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { duration: 0.3, ease: "easeOut" } },
  exit: { scale: 0.95, opacity: 0, transition: { duration: 0.2, ease: "easeIn" } },
};

const imageVariants = {
  enter: (direction) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
    scale: 0.8,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: [0.36, 0.66, 0.04, 1] },
  },
  exit: (direction) => ({
    zIndex: 0,
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
    scale: 0.8,
    transition: { duration: 0.3, ease: [0.36, 0.66, 0.04, 1] },
  }),
};

const ImageGalleryModal = ({ images, isOpen, onClose, initialIndex = 0 }) => {
  const [[currentIndex, direction], setCurrentIndex] = useState([initialIndex, 0]);
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

  const paginate = (newDirection) => {
    if (images.length <= 1) return;
    setCurrentIndex([currentIndex + newDirection, newDirection]);
  };

  const imageIndex = (currentIndex % images.length + images.length) % images.length;

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} as="div" className="relative z-50" onClose={onClose}>
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />

          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-50 overflow-hidden"
          >
            <Dialog.Panel as={motion.div} layout className="h-full w-full flex flex-col">
              {/* Header and Controls */}
              <motion.div className="flex justify-between items-center py-2 px-4 bg-black/30 z-20">
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
              </motion.div>

              <div className="flex-1 flex items-center justify-center relative overflow-hidden">
                <AnimatePresence initial={false} custom={direction}>
                  <motion.img
                    key={currentIndex}
                    src={images[imageIndex]}
                    custom={direction}
                    variants={imageVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    ref={imageRef}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    onDoubleClick={handleDoubleClick}
                    onWheel={handleWheel}
                    className="absolute max-h-full max-w-full object-contain cursor-grab active:cursor-grabbing"
                    style={{ scale, x: position.x, y: position.y }}
                    draggable="false"
                  />
                </AnimatePresence>

                {/* Prev/Next buttons */}
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => paginate(-1)} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/20 hover:bg-white/40">
                  <ChevronLeftIcon className="h-6 w-6 text-white" />
                </motion.button>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => paginate(1)} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/20 hover:bg-white/40">
                  <ChevronRightIcon className="h-6 w-6 text-white" />
                </motion.button>
              </div>
            </Dialog.Panel>
          </motion.div>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

ImageGalleryModal.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  initialIndex: PropTypes.number
};

export default ImageGalleryModal; 