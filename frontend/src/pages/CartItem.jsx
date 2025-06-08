import { motion } from 'framer-motion';
import { XMarkIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/solid';

const CartItem = ({ item, onQuantityChange, onRemove, variants }) => {
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity > 0) {
      onQuantityChange(item._id, newQuantity);
    } else {
      onRemove(item._id);
    }
  };

  return (
    <motion.div
      layout
      variants={variants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="flex items-center p-4 border-b border-gray-200 last:border-b-0"
    >
      <img
        src={item.image}
        alt={item.name}
        className="h-20 w-20 object-cover rounded-lg mr-4"
      />
      <div className="flex-grow">
        <h3 className="text-md font-semibold text-gray-800">{item.name}</h3>
        <p className="text-sm text-gray-500">
          {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(item.price)}
        </p>
      </div>
      <div className="flex items-center gap-2 mx-4">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => handleQuantityChange(item.quantity - 1)}
          className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
        >
          <MinusIcon className="h-4 w-4" />
        </motion.button>
        <span className="w-8 text-center font-medium">{item.quantity}</span>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => handleQuantityChange(item.quantity + 1)}
          className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
        >
          <PlusIcon className="h-4 w-4" />
        </motion.button>
      </div>
      <div className="w-24 text-right font-semibold text-gray-800">
        {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(item.price * item.quantity)}
      </div>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onRemove(item._id)}
        className="ml-4 p-2 text-gray-400 hover:text-red-500 rounded-full transition-colors"
        aria-label="Remove item"
      >
        <XMarkIcon className="h-5 w-5" />
      </motion.button>
    </motion.div>
  );
};

export default CartItem;
