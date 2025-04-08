import { Card, CardHeader, CardBody, Image,Button } from "@heroui/react";
import { useNavigate } from "react-router-dom";

const cards = [
  {
    title: "Dogs",
    subtitle: "50+ Breeds",
    description: "Popular Dog Breeds",
    image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1",
    href: "/breeds/dog",
  },
  {
    title: "Cats",
    subtitle: "30+ Breeds",
    description: "Popular Cat Breeds",
    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba",
    href: "/breeds/cat",
  },
  {
    title: "Birds",
    subtitle: "25+ Species",
    description: "Popular Bird Species",
    image: "https://images.unsplash.com/photo-1552728089-57bdde30beb3",
  },
  {
    title: "Fish",
    subtitle: "40+ Types",
    description: "Popular Aquatic Pets",
    image: "https://images.unsplash.com/photo-1524704796725-9fc3044a58b2",
  },
];

export default function AboutPets() {
  const navigate = useNavigate();
  
  return (
    <div className="mt-20 flex flex-col items-center justify-center bg-white">
      <div className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, index) => (
            <div className="flex flex-col" key={index}>
              <Card 
                className="w-full transform transition-all duration-300 hover:scale-105 
                         bg-blue-gray-100 shadow-lg hover:shadow-xl rounded-t-xl 
                         overflow-hidden cursor-pointer"
              >
                <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                  <p className="text-sm uppercase font-bold">{card.subtitle}</p>
                  <small className="text-blue-gray-500">{card.description}</small>
                  <h4 className="font-bold text-xl">{card.title}</h4>
                </CardHeader>
                <CardBody className="overflow-visible py-2">
                  <Image
                    alt={card.title}
                    className="object-cover rounded-xl h-48 w-full transition-transform 
                             duration-300 hover:scale-110"
                    src={card.image}
                  />
                </CardBody>
              </Card>
              <Button 
                 onClick={() => navigate(card.href)}
                className="w-full bg-black text-white font-bold py-2 rounded-b-xl 
                         hover:bg-orange-600 transition duration-300 mt-[10px]"
              >
                Learn More
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}