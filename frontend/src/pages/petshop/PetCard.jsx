import { useState } from "react";
import { motion } from "framer-motion";
import { HeartOutlined, EyeOutlined } from "@ant-design/icons";
import { Card, Button, Typography, Space, Rate } from "antd";
import PropTypes from "prop-types";

const itemAnimation = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
    },
  },
};

const { Meta } = Card;
const { Text, Title } = Typography;

const PetCard = ({ pet, onAddToWishlist, onViewDetails, wishlist }) => {
  const [isImageHovered, setIsImageHovered] = useState(false);
  const isWishlisted = wishlist.includes(pet._id);

  const sampleImages = pet.images || [
    pet.imageUrl,
    "https://placehold.co/600x400?text=Pet+Image+2",
    "https://placehold.co/600x400?text=Pet+Image+3",
  ];

  return (
    <motion.div variants={itemAnimation} className="h-full">
      <Card
        
        hoverable
        style={{
          width: "100%",
          marginTop: 16,
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        }}
        cover={          
          <div
            className="relative overflow-hidden"
            onMouseEnter={() => setIsImageHovered(true)}
            onMouseLeave={() => setIsImageHovered(false)}>
              <img
              alt={pet.id}
              src={sampleImages[0]}
              style={{
                width: "100%",
                height: "250px",
                objectFit: "cover",
                objectPosition: "center",
                transition: "all 0.3s ease",
              }}
            />
            {isImageHovered && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(0,0,0,0.3)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  transition: "all 0.3s ease",
                }}>
                <Button
                  icon={<EyeOutlined />}
                  onClick={() => onViewDetails(pet)}
                  style={{
                    backgroundColor: "white",
                    borderRadius: "50%",
                    width: "40px",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                />
              </div>
            )}
          </div>
        }
        actions={[
          <Button
            key="view-details"
            type="primary"
            onClick={() => onViewDetails(pet)}>
            View Details
          </Button>,
          <Button
            key="wishlist"
            icon={<HeartOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              onAddToWishlist(pet._id);
            }}
            type={isWishlisted ? "primary" : "default"}
          />,
        ]}>
        <Meta
          title={<Title level={4}>{pet.breed}</Title>}
          description={            
          <Space direction="vertical" size="small">
              <div className="flex justify-between items-center">
                <Rate defaultValue={4} disabled style={{ fontSize: 14 }} />
                <Text
                  style={{
                    backgroundColor: pet.status ? '#f6ffed' : '#fff2f0',
                    color: pet.status ? '#52c41a' : '#ff4d4f',
                    padding: '0 8px',
                    fontSize: '12px',
                    borderRadius: '4px',
                    border: `1px solid ₹{pet.status ? '#b7eb8f' : '#ffccc7'}`
                  }}
                >
                  {pet.status ? 'Available' : 'Not Available'}
                </Text>
              </div>
              <Space align="baseline">
                <Text strong style={{ fontSize: "18px", color: "#1890ff" }}>
                  ₹{pet.price}
                </Text>
                {pet.actualPrice && (
                  <Text delete type="secondary" style={{ fontSize: "14px" }}>
                    ₹{pet.actualPrice}
                  </Text>
                )}
                {pet.actualPrice && (
                  <Text
                    type="success"
                    style={{
                      fontSize: "12px",
                      backgroundColor: "#f6ffed",
                      padding: "2px 8px",
                      borderRadius: "4px",
                      border: "1px solid #b7eb8f",
                    }}>
                    {Math.round(
                      ((pet.actualPrice - pet.price) / pet.actualPrice) * 100
                    )}
                    % OFF
                  </Text>
                )}
              </Space>
              <Space direction="vertical" size={0}>
                <Text type="secondary">{pet.details}</Text>
              </Space>
            </Space>
          }
        />
      </Card>
    </motion.div>
  );
};


export default PetCard;
