import { useEffect, useState } from "react";
import axios from "axios";
import config from "../../config";
import { motion } from "framer-motion";
import { Card, Avatar } from "antd";
import { MessageOutlined, HeartOutlined, ShareAltOutlined } from '@ant-design/icons';

const { Meta } = Card;

const MatingPetsList = () => {
  const [matingPets, setMatingPets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatingPets = async () => {
      try {
        const response = await axios.get(`${config.baseURL}/api/matingpets/all`, {
          withCredentials: true,
        });
        setMatingPets(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching mating pets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatingPets();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="h-full overflow-y-auto p-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {matingPets.map((pet) => (
          <motion.div
            key={pet._id}
            variants={cardVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="h-full"
          >
            <Card
              hoverable
              className="h-full flex flex-col"
              style={{ 
                width: '100%',
                height: '100%'
              }}
              cover={
                <div className="h-[200px] w-full">
                  {pet.photosAndVideos && pet.photosAndVideos.length > 0 ? (
                    <img
                      alt={pet.breedName}
                      src={pet.photosAndVideos[0]}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-gray-100 flex items-center justify-center">
                      <span className="text-gray-400">No Image Available</span>
                    </div>
                  )}
                </div>
              }
              actions={[
                <HeartOutlined key="like" />,
                <MessageOutlined key="message" />,
                <ShareAltOutlined key="share" />
              ]}
              bodyStyle={{
                flex: '1 1 auto',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <Meta
                className="flex-1 flex flex-col"
                avatar={
                  <Avatar 
                    src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${pet.breedName}`}
                  />
                }
                title={
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold truncate">{pet.breedName}</span>
                    <span className="text-sm text-gray-500 ml-2">{pet.category}</span>
                  </div>
                }
                description={
                  <div className="space-y-2 mt-2 flex-1 flex flex-col">
                    <div className="flex-1">
                      <p><strong>Gender:</strong> {pet.gender}</p>
                      <p><strong>Age:</strong> {pet.age} years</p>
                      <p><strong>Location:</strong> {pet.location}</p>
                    </div>
                    <button className="w-full mt-auto bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors">
                      Contact Owner
                    </button>
                  </div>
                }
              />
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default MatingPetsList;