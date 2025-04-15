const CartItem = ({ item, updateQuantity, removeItem }) => {
  const { id, name, price, quantity, image } = item;

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity > 0) {
      updateQuantity(id, newQuantity);
    }
  };

  return (
    <tr>
      <td className="py-4 px-4">
        <div className="flex items-center">
          <div className="h-16 w-16 flex-shrink-0 rounded overflow-hidden mr-4">
            <img
              src={image}
              alt={name}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <h3 className="text-gray-800 font-medium">{name}</h3>
          </div>
        </div>
      </td>
      <td className="py-4 px-4 text-right text-gray-900">
        ₹{price.toFixed(2)}
      </td>
      <td className="py-4 px-4">
        <div className="flex items-center justify-center">
          <button
            onClick={() => handleQuantityChange(quantity - 1)}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
            -
          </button>
          <span className="mx-3 w-8 text-center">{quantity}</span>
          <button
            onClick={() => handleQuantityChange(quantity + 1)}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
            +
          </button>
        </div>
      </td>
      <td className="py-4 px-4 text-right font-medium text-gray-900">
        ₹{(price * quantity).toFixed(2)}
      </td>
      <td className="py-4 px-4 text-right">
        <button
          onClick={() => removeItem(id)}
          className="text-red-500 hover:text-red-700">
          Remove
        </button>
      </td>
    </tr>
  );
};

export default CartItem;
