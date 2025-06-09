import { useRef } from 'react'; 
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useNavigate } from 'react-router-dom';

const CustomButton = () => {
  const navigate = useNavigate(); 

  const handleConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#FFC0CB', '#FF69B4', '#DB7093', '#C71585', '#8A2BE2']
    });
    
    setTimeout(() => {
      navigate('/signup'); 
    }, 1500);
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <motion.button
        onClick={handleConfetti}
        whileHover={{ 
          scale: 1.05, 
          boxShadow: '0px 10px 30px rgba(199, 21, 133, 0.5)',
          y: -5
        }}
        whileTap={{ 
          scale: 0.95,
          boxShadow: '0px 5px 15px rgba(199, 21, 133, 0.3)'
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="text-lg font-semibold text-white px-10 py-4 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 focus:outline-none focus:ring-4 focus:ring-purple-300"
      >
        Join the Fun!
      </motion.button>
    </div>
  );
};

export default CustomButton;