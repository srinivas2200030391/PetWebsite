import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import axios from "axios";
import config from "./../../config";
import { Link } from "react-router-dom";

export default function BoardingShops() {
  const [boardingShops, setBoardingShops] = useState([]);
  useEffect(() => {
    fetchBoardingShops();
  }, []);

  const fetchBoardingShops = async () => {
    try {
      const response = await axios.get(`${config.baseURL}/api/vendor`);
      //console.log(response);

      const data = response.data;
      // create a new data from this and set its title to data.vendorShopName and description
      // to data.vendorShopDescription and image to data.vendorShopImage
      const newBoardingShops = data.map((item) => {
        return {
          id: item._id,
          image:
            "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80",
          title: item.vendorShopName,
          category: "Pet Boarding",
          description:
            "Luxury pet boarding facility with 24/7 care and monitoring. Spacious accommodations and daily activities for your pets.",
        };
      });
      setBoardingShops(newBoardingShops);
    } catch (error) {
      console.error("Error fetching boarding shops:", error);
    }
  };
  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 overflow-y-auto px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="space-y-6">
            {boardingShops.map((shop) => (
              <Card
                key={shop.id}
                className="flex flex-col md:flex-row overflow-hidden">
                <CardHeader
                  shadow={false}
                  floated={false}
                  className="relative md:w-2/5 h-48 md:h-auto shrink-0">
                  <img
                    src={shop.image}
                    alt={shop.title}
                    className="h-full w-full object-cover"
                  />
                </CardHeader>
                <CardBody className="flex-1 flex flex-col p-6">
                  <div>
                    <Typography
                      variant="h6"
                      color="gray"
                      className="mb-2 uppercase">
                      {shop.category}
                    </Typography>
                    <Typography variant="h4" color="blue-gray" className="mb-2">
                      {shop.title}
                    </Typography>
                    <Typography color="gray" className="mb-8 font-normal">
                      {shop.description}
                    </Typography>
                  </div>
                  <Link to="/newboardingrequest">
                    <Button
                      variant="text"
                      className="flex items-center gap-2 w-fit mt-auto"
                      color="orange">
                      View Details
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                        className="h-4 w-4">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                        />
                      </svg>
                    </Button>
                  </Link>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
