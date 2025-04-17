import { Card, CardHeader, CardBody, Image } from "@heroui/react";
import { motion } from "framer-motion";
import groomingimg from '../../assets/groomingimg.webp'
import trainingimg from '../../assets/trainingimg.jpg'
import boardingimg from '../../assets/boardingimg.jpeg'
import petwalkingimg from '../../assets/petwalkingimg.jpg'
import { useNavigate } from "react-router-dom";

export default function PetServices() {

  const navigate = useNavigate();

  const services = [
    {
      title: "Pet Grooming",
      description: "Professional grooming services",
      imageUrl: groomingimg,
      href: "/grooming",
    },
    {
      title: "Pet Boarding",
      description: "Safe and comfortable boarding",
      imageUrl: boardingimg,
      href: "/boardingshopfilter",
    },
    {
      title: "Pet Training",
      description: "Behavior training services",
      imageUrl: trainingimg
    },
    {
      title: "Pet Walking",
      description: "Daily exercise services",
      imageUrl: petwalkingimg
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 pt-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((service, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: index * 0.1,
              ease: "easeOut"
            }}
            onClick={() => navigate(service.href)} // Add onClick handler
            className="cursor-pointer" // Add cursor pointer style
          >
            <Card className="transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                <h4 className="font-bold text-2xl">{service.title}</h4>
                <p className="text-default-500">{service.description}</p>
              </CardHeader>
              <CardBody className="overflow-visible py-2">
                <Image
                  isZoomed
                  alt="Service image"
                  className="object-cover rounded-xl w-full h-[200px]"
                  src={service.imageUrl}
                />
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}