import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Button,
  } from "@material-tailwind/react";
  
  const boardingShops = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80",
      title: "Happy Paws Boarding",
      category: "Pet Boarding",
      description: "Luxury pet boarding facility with 24/7 care and monitoring. Spacious accommodations and daily activities for your pets.",
    },
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80",
      title: "Happy Paws Boarding",
      category: "Pet Boarding",
      description: "Luxury pet boarding facility with 24/7 care and monitoring. Spacious accommodations and daily activities for your pets.",
    },
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80",
      title: "Happy Paws Boarding",
      category: "Pet Boarding",
      description: "Luxury pet boarding facility with 24/7 care and monitoring. Spacious accommodations and daily activities for your pets.",
    },
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80",
      title: "Happy Paws Boarding",
      category: "Pet Boarding",
      description: "Luxury pet boarding facility with 24/7 care and monitoring. Spacious accommodations and daily activities for your pets.",
    },
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80",
      title: "Happy Paws Boarding",
      category: "Pet Boarding",
      description: "Luxury pet boarding facility with 24/7 care and monitoring. Spacious accommodations and daily activities for your pets.",
    },
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80",
      title: "Happy Paws Boarding",
      category: "Pet Boarding",
      description: "Luxury pet boarding facility with 24/7 care and monitoring. Spacious accommodations and daily activities for your pets.",
    },
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80",
      title: "Happy Paws Boarding",
      category: "Pet Boarding",
      description: "Luxury pet boarding facility with 24/7 care and monitoring. Spacious accommodations and daily activities for your pets.",
    },
    // Add more boarding shops here
  ];
  
  export default function BoardingShops() {
    return (
      <div className="h-screen flex flex-col">
        <div className="flex-1 overflow-y-auto px-4">
          <div className="container mx-auto max-w-3xl">
            <div className="space-y-6">
              {boardingShops.map((shop) => (
                <Card key={shop.id} className="flex flex-col md:flex-row overflow-hidden">
                  <CardHeader shadow={false} floated={false} className="relative md:w-2/5 h-48 md:h-auto shrink-0">
                    <img
                      src={shop.image}
                      alt={shop.title}
                      className="h-full w-full object-cover"
                    />
                  </CardHeader>
                  <CardBody className="flex-1 flex flex-col p-6">
                    <div>
                      <Typography variant="h6" color="gray" className="mb-2 uppercase">
                        {shop.category}
                      </Typography>
                      <Typography variant="h4" color="blue-gray" className="mb-2">
                        {shop.title}
                      </Typography>
                      <Typography color="gray" className="mb-8 font-normal">
                        {shop.description}
                      </Typography>
                    </div>
                    <Button 
                      variant="text" 
                      className="flex items-center gap-2 w-fit mt-auto"
                      color="orange"
                    >
                      View Details
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                        className="h-4 w-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                        />
                      </svg>
                    </Button>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }