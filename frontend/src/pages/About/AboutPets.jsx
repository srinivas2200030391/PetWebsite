import { Card, CardHeader, CardBody, Button } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // Update this import
import aboutdog from '../../assets/aboutdogimg.png'
import aboutcat from '../../assets/aboutcatimg.jpg'
import aboutbirds from '../../assets/abotbirdsimg.jpg'
import aboutfish from '../../assets/aboutfishimg.jpg'

const cards = [
  {
    title: "Dogs",
    subtitle: "50+ Breeds",
    description: "Popular ",
    image: aboutdog,
    href: "/breeds/dog",
  },
  {
    title: "Cats",
    subtitle: "30+ Breeds",
    description: "Popular Cat Breeds",
    image: aboutcat,
    href: "/breeds/cat",
  },
  {
    title: "Birds",
    subtitle: "25+ Species",
    description: "Popular Bird Species",
    image:aboutbirds,
    href: "/breeds/bird",
  },
  {
    title: "Fish",
    subtitle: "40+ Types",
    description: "Popular Aquatic Pets",
    image: aboutfish,
    href: "/breeds/fish",
  },
];

export default function AboutPets() {
  const navigate = useNavigate();
  
  const handleCardClick = (href) => {
    navigate(href);
  };

  return (
    <div className="mt-20 flex flex-col items-center justify-center bg-white">
      <div className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, index) => (
             <motion.div
             key={index}
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{
               duration: 0.75,
               delay: index * 0.1,
               ease: "easeOut"
             }}
              onClick={() => handleCardClick(card.href)}
              className="cursor-pointer"
           >
              <Card 
                className="w-full transform transition-all duration-300 hover:scale-105 
                         bg-blue-gray-100 shadow-lg hover:shadow-xl rounded-t-xl 
                         overflow-hidden cursor-pointer flex flex-col"
              >
                <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                  <p className="text-sm uppercase font-bold">{card.subtitle}</p>
                  <small className="text-blue-gray-500">{card.description}</small>
                  <h4 className="font-bold text-xl">{card.title}</h4>
                </CardHeader>
                <CardBody className="flex-1 flex items-center justify-center p-4">
                  <div className="w-full h-48 relative overflow-hidden rounded-xl">
                    <img
                      alt={card.title}
                      className="absolute inset-0 w-full h-full object-cover object-center 
                               transition-transform duration-300 hover:scale-110"
                      src={card.image}
                    />
                  </div>
                </CardBody>
              </Card>
              <Button 
                onClick={() => navigate(card.href)}
                className="w-full bg-black text-white font-bold py-2 rounded-b-xl 
                         hover:bg-orange-600 transition duration-300 mt-[10px]"
              >
                Learn More
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}