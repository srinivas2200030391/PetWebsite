import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import config from "../../config";
import { motion } from "framer-motion";

const pageVariants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function PetDetail() {
  const { petId } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const res = await axios.get(
          `${config.baseURL}/api/aboutpet/pet/${petId}`
        );
        setPet(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPet();
  }, [petId]);

  if (loading) return <div className="p-8">Loading...</div>;
  if (!pet) return <div className="p-8 text-red-500">Pet not found</div>;

  return (
    <motion.section 
      className="text-gray-600 body-font overflow-hidden"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="container px-5 py-24 mx-auto">
        <div className="lg:w-4/5 mx-auto flex flex-wrap">
          <motion.img
            alt={pet.name}
            className="lg:w-1/2 w-full lg:h-[600px] h-64 object-cover object-center rounded"
            src={pet.images}
            variants={itemVariants}
          />
          <motion.div variants={pageVariants} className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
            <motion.button
              onClick={() => navigate("/")}
              className="mb-6 text-blue-600 hover:underline"
              variants={itemVariants}
            >
              ← Back to Home
            </motion.button>
            <motion.h2 variants={itemVariants} className="text-sm title-font text-gray-500 tracking-widest uppercase">
              {pet.category}
            </motion.h2>
            <motion.h1 variants={itemVariants} className="text-gray-900 text-3xl title-font font-medium mb-1">
              {pet.name}
            </motion.h1>

            <motion.div variants={itemVariants} className="flex mb-4">
              <span className="flex items-center">
                <span className="text-gray-600">Status: </span>
                <span
                  className={`ml-2 ${
                    pet.status === "Available"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}>
                  {pet.status}
                </span>
              </span>
            </motion.div>

            <motion.div variants={itemVariants} className="leading-relaxed mb-4">
              <p>
                <strong>Description:</strong> {pet.details}
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="flex mt-6 items-center pb-5 border-b-2 border-gray-100 mb-5">
              <div className="flex flex-col gap-2 w-full">
                <div className="flex justify-between">
                  <span>
                    <strong>Breed:</strong> {pet.breed}
                  </span>
                  <span>
                    <strong>Age:</strong> {pet.age}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>
                    <strong>Gender:</strong> {pet.gender}
                  </span>
                  <span>
                    <strong>Weight:</strong> {pet.weight}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>
                    <strong>Height:</strong> {pet.height}
                  </span>
                  <span>
                    <strong>Life Span:</strong> {pet.lifeSpan}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>
                    <strong>Group:</strong> {pet.group}
                  </span>
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-center">
              <span className="title-font font-medium text-2xl text-gray-900">
                ₹{pet.price}
              </span>
              <motion.button 
                className="flex ml-auto text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Add to Cart
              </motion.button>
              <motion.button 
                className="rounded-full w-10 h-10 bg-gray-200 p-0 border-0 inline-flex items-center justify-center text-gray-500 ml-4"
                whileHover={{ scale: 1.1, rotate: 10 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg
                  fill="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="w-5 h-5"
                  viewBox="0 0 24 24">
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path>
                </svg>
              </motion.button>
            </motion.div>

            {pet.characteristics && (
              <motion.div variants={itemVariants} className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Characteristics:</h3>
                <p className="text-gray-600">{pet.characteristics}</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
