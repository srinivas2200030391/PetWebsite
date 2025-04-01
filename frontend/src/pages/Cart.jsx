import CartItem from "./CartItem";
import { useStore } from "./store/store"; // Adjust the path as needed

const Cart = () => {
  // Get cart state and actions from the store
  const cartItems = useStore((state) => state.cart.items);
  const loading = useStore((state) => state.loading);
  const updateCartItemQuantity = useStore(
    (state) => state.updateCartItemQuantity
  );
  const removeFromCart = useStore((state) => state.removeFromCart);

  // Calculate total price directly from cart items
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-indigo-600">Loading cart...</div>
      </div>
    );
  }

  return (
    <div className="mt-[5.5rem] container mx-auto px-4 mb-5">
      {cartItems.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md min-h-screen justify-center items-center flex">
          <p className="text-gray-500">Your cart is empty</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    updateQuantity={updateCartItemQuantity}
                    removeItem={removeFromCart}
                  />
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td
                    colSpan="3"
                    className="py-4 px-4 text-right font-medium text-gray-500">
                    Subtotal:
                  </td>
                  <td className="py-4 px-4 text-right font-bold text-gray-900">
                    ${totalPrice.toFixed(2)}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
          <div className="p-4 bg-gray-50 flex justify-end">
            <button className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors">
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
