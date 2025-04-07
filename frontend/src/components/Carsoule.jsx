import { Carousel } from "@material-tailwind/react";
import {Link} from "react-router-dom";
import { useEffect } from "react";

export default function CarouselEx() {
  useEffect(() => {
    const interval = setInterval(() => {
      // Autoplay logic handled by the Carousel component
    }, 3000);
    return () => clearInterval(interval);
  }, []); 

  return (
    <div className="h-[50vh]">
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
          src="https://image.shutterstock.com/image-photo/group-pets-isolated-on-white-260nw-227674867.jpg"
          alt="image 1"
          className="h-full w-full object-cover"
        />
        <img
          src="https://th.bing.com/th/id/OIP.3tcNKFSZcOAT6nnb2OHrxQHaEK?w=329&h=185&c=7&r=0&o=5&dpr=2&pid=1.7"
          alt="image 2"
          className="h-full w-full object-cover"
        />
        <Link to="">
        <img
          src="https://th.bing.com/th/id/OIP.81eSKy3-I9F1_7DocXHg_wHaCa?w=301&h=180&c=7&r=0&o=5&dpr=2&pid=1.7"
          alt="image 3"
          className="h-full w-full object-cover"
        />
        </Link>
      </Carousel>
    </div>
  );
}