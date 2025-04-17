import { ShoppingCartOutlined, HeartOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Avatar, Card, Tag } from 'antd';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const { Meta } = Card;

const cardVariants = {
  hidden: { 
    opacity: 0,
    y: 20
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const contentVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      delay: 0.3,
      duration: 0.4
    }
  }
};

const PetCard = ({ pet }) => {
  const actions = [
    { 
      icon: <HeartOutlined />, 
      key: 'favorite',
      onClick: (e) => {
        e.preventDefault();
        // Add favorite logic here
      }
    },
    { 
      icon: <ShoppingCartOutlined />, 
      key: 'cart',
      onClick: (e) => {
        e.preventDefault();
        // Add cart logic here
      }
    },
    { 
      icon: <InfoCircleOutlined />, 
      key: 'info',
      onClick: (e) => {
        e.preventDefault();
        // Add info logic here
      }
    }
  ];

  return (
    <Link 
      to={`/pet/${pet._id}/details`} 
      className="block w-full h-full no-underline hover:no-underline"
      state={{ pet }}
    >
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="h-full"
      >
        <Card
          hoverable
          className="w-full h-full shadow-lg cursor-pointer"
          cover={
            <motion.div 
              className="relative h-[200px]"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <img
                alt={pet.name}
                src={pet.images[0] || 'https://via.placeholder.com/300x200.png?text=No+Image'}
                className="w-full h-full object-cover"
              />
              <Tag 
                className="absolute top-2 right-2 z-10" 
                color={pet.status === 'Available' ? 'green' : 'volcano'}
              >
                {pet.status}
              </Tag>
            </motion.div>
          }
          actions={actions.map(({ icon, key, onClick }) => (
            <motion.span
              key={key}
              whileHover={{ scale: 1.2 }}
              transition={{ duration: 0.2 }}
              onClick={onClick}
            >
              {icon}
            </motion.span>
          ))}
        >
          <motion.div variants={contentVariants}>
            <Meta
              avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${pet.name}`} />}
              title={
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium truncate">{pet.name}</span>
                  <span className="text-lg font-bold text-blue-600">₹{pet.price}</span>
                </div>
              }
              description={
                <div className="mt-2 space-y-1">
                  <div className="grid grid-cols-2 gap-2">
                    <p className="text-gray-600"><strong>Breed:</strong> {pet.breed}</p>
                    <p className="text-gray-600"><strong>Age:</strong> {pet.age}</p>
                    <p className="text-gray-600"><strong>Gender:</strong> {pet.gender}</p>
                    <p className="text-gray-600"><strong>Weight:</strong> {pet.weight}</p>
                  </div>
                  <p className="text-gray-500 mt-2">{pet.category}</p>
                </div>
              }
            />
          </motion.div>
        </Card>
      </motion.div>
    </Link>
  );
};

export default PetCard;
