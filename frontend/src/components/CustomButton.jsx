import { useRef } from 'react'; 
import { Button } from '@nextui-org/react';
import confetti from 'canvas-confetti';
import { useNavigate } from 'react-router-dom';

const CustomButton = () => {
  const buttonRef = useRef(null); 
  const navigate = useNavigate(); 

  const handleConfetti = () => {
   
    confetti({
      particleCount: 100,
      spread: 90,
      origin: { y: 0.6 },
    });
    
    setTimeout(() => {
      navigate('/signup'); 
    }, 2000);
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <Button
        ref={buttonRef}
        disableRipple
        className="flex items-center justify-center relative overflow-visible rounded-full hover:-translate-y-1 px-12 shadow-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white after:content-[''] after:absolute after:rounded-full after:inset-0 after:bg-gradient-to-r from-pink-600 to-purple-600 after:z-[-1] after:transition after:!duration-500 hover:after:scale-150 hover:after:opacity-0"
        size="lg"
        onPress={handleConfetti} 
      >
        Press me
      </Button>
    </div>
  );
};

export default CustomButton;