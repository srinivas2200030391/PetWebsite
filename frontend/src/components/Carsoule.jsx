import { Carousel } from "@material-tailwind/react";
import {Link} from "react-router-dom";
import { useEffect } from "react";
import slideimg from "../assets/slideimg.jpg";
import slideimg2 from "../assets/slideimg2.jpeg";
import slideimg3 from "../assets/slideimg3.jpeg";
export default function CarouselEx() {
  useEffect(() => {
    const interval = setInterval(() => {
      // Autoplay logic handled by the Carousel component
    }, 3000);
    return () => clearInterval(interval);
  }, []); 

  return (
<div className="h-[50vh] max-h-[600px]">
      <Carousel
        className="rounded-xl h-full w-full"
        autoplay={true}
        autoplayDelay={3000}
        loop={true}
        navigation={({ setActiveIndex, activeIndex, length }) => (
          <div className="absolute bottom-4 left-2/4 z-50 flex -translate-x-2/4 gap-2">
            {new Array(length).fill("").map((_, i) => (
              <span
                key={i}
                className={`block h-1 cursor-pointer rounded-2xl transition-all content-[''] ${
                  activeIndex === i ? "w-8 bg-white" : "w-4 bg-white/50"
                }`}
                onClick={() => setActiveIndex(i)}
              />
            ))}
          </div>
        )}
      >
        <img
          src={slideimg}
          alt="image 1"
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <img
          src={slideimg2}
          alt="image 2"
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <Link to="">
        <img
          src={slideimg3}
          alt="image 3"
          className="h-full w-full object-cover"
          loading="lazy"
        />
        </Link>
      </Carousel>
    </div>
  );
}