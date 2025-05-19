    import { useEffect, useState } from "react";

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
        
        useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) =>
            prevIndex === displayImages.length - 1 ? 0 : prevIndex + 1
            );
        }, 3000); // Change image every 3 seconds
        return () => clearInterval(interval); // Cleanup interval on unmount
        }, [displayImages.length]);

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

    export default ImageCarousel;