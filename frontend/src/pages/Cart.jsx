import CartItem from "./CartItem";
import { useStore } from "./store/store"; // Adjust the path as needed
import axios from "axios";
import { useEffect, useState } from "react";
import config from "./../config";

// This should be your actual test key from Razorpay dashboard
// Hardcoding for demonstration - in production, use environment variables
const RAZORPAY_KEY_ID = "rzp_test_BbYHp3Xn5nnaxa"; // Replace with your actual key

const Cart = () => {
  // Get cart state and actions from the store
  const cartItems = useStore((state) => state.cart.items);
  const loading = useStore((state) => state.loading);
  const setLoading = useStore((state) => state.setLoading);
  const updateCartItemQuantity = useStore(
    (state) => state.updateCartItemQuantity
  );
  const removeFromCart = useStore((state) => state.removeFromCart);

  // Add state variables for payment handling
  const [error, setError] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [paymentData, setPaymentData] = useState({
    amount: 0,
    currency: "INR",
    name: "",
    email: "",
    phone: "",
  });

  // Add state to track if Razorpay is loaded
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  // Calculate total price directly from cart items
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Load Razorpay script
  useEffect(() => {
    const loadRazorpay = () => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => {
        setRazorpayLoaded(true);
        console.log("Razorpay SDK loaded successfully");
      };
      script.onerror = () => {
        console.error("Failed to load Razorpay SDK");
        setError("Payment gateway failed to load. Please try again later.");
      };
      document.body.appendChild(script);
    };

    if (!window.Razorpay) {
      loadRazorpay();
    } else {
      setRazorpayLoaded(true);
    }

    // Optional cleanup
    return () => {
      const script = document.querySelector(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
      );
      if (script) {
        script.remove();
      }
    };
  }, []);

  // Update payment data when cart changes
  useEffect(() => {
    setPaymentData((prev) => ({
      ...prev,
      amount: Math.round(totalPrice * 100), // Convert to smallest currency unit (paise for INR) and ensure integer
    }));

    // Set name, email, phone for paymentData from local storage
    const storedData = localStorage.getItem("user");
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setPaymentData((prev) => ({
          ...prev,
          name: parsedData.fullname || "",
          email: parsedData.email || "",
          phone: parsedData.phone || "9999999999",
        }));
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, [totalPrice]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-indigo-600">Loading cart...</div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!razorpayLoaded) {
      setError(
        "Payment gateway is still loading. Please wait a moment and try again."
      );
      return;
    }

    setLoading(true);
    setError(null);
    setPaymentStatus(null);

    try {
      console.log("Payment Data:", paymentData); // Debugging line

      // 1. Create an order
      const orderResponse = await axios.post(
        `₹{config.baseURL}/api/payment/create-order`,
        {
          amount: paymentData.amount,
          currency: paymentData.currency,
          receipt: `receipt_₹{Date.now()}`,
          notes: {
            name: paymentData.name,
            email: paymentData.email,
            phone: paymentData.phone,
          },
        }
      );

      if (!orderResponse.data.success) {
        throw new Error(orderResponse.data.message || "Failed to create order");
      }

      const { order } = orderResponse.data;
      console.log("Order created:", order); // Debug order creation

      // 2. Initialize Razorpay - Properly setting the key
      const options = {
        key: RAZORPAY_KEY_ID, // Using the hardcoded key for now
        amount: order.amount,
        currency: order.currency,
        name: "Pet Shop", // Your company name
        description: "Pet Shop Purchase",
        order_id: order.id,
        handler: async function (response) {
          try {
            console.log("Payment successful, verifying...", response); // Debug payment response

            // 3. Verify payment
            const verifyResponse = await axios.post(
              `₹{config.baseURL}/api/payment/verify-payment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }
            );

            if (verifyResponse.data.success) {
              console.log("Payment verification successful");
              setPaymentStatus({
                success: true,
                message: "Payment successful!",
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
              });

              // Clear cart after successful payment
              useStore.getState().clearCart();
            } else {
              console.error("Payment verification failed", verifyResponse.data);
              setPaymentStatus({
                success: false,
                message: "Payment verification failed",
              });
            }
          } catch (error) {
            console.error("Error during payment verification:", error);
            setError(
              "Error verifying payment: " +
                (error.response?.data?.message || error.message)
            );
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: paymentData.name || "Customer",
          email: paymentData.email || "customer@example.com",
          contact: paymentData.phone || "9999999999",
        },
        notes: {
          address: "Customer Address",
        },
        theme: {
          color: "#3399cc",
        },
        modal: {
          ondismiss: function () {
            console.log("Payment modal dismissed");
            setLoading(false);
          },
        },
      };

      console.log("Initializing Razorpay with options:", options); // Debug Razorpay options

      // Check again to make sure Razorpay is available
      if (window.Razorpay) {
        const razorpayInstance = new window.Razorpay(options);
        razorpayInstance.open();
      } else {
        throw new Error(
          "Razorpay SDK is not loaded. Please refresh the page and try again."
        );
      }
    } catch (error) {
      console.error("Payment error:", error);
      setError(
        "Error initiating payment: " +
          (error.response?.data?.message || error.message)
      );
      setLoading(false);
    }
  };

  return (
    <div className="mt-[5.5rem] container mx-auto px-4 mb-5">
      {cartItems.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md min-h-screen justify-center items-center flex">
          <p className="text-gray-500">Your cart is empty</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Display error or payment status if any */}
          {error && (
            <div className="bg-red-100 text-red-700 p-4 mb-4">{error}</div>
          )}
          {paymentStatus && (
            <div
              className={`p-4 mb-4 ₹{
                paymentStatus.success
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}>
              {paymentStatus.message}
              {paymentStatus.success && (
                <div className="mt-2 text-sm">
                  <p>Payment ID: {paymentStatus.paymentId}</p>
                  <p>Order ID: {paymentStatus.orderId}</p>
                </div>
              )}
            </div>
          )}
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
                    ₹{totalPrice.toFixed(2)}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
          <div className="p-4 bg-gray-50 flex justify-end">
            <button
              className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              onClick={handleSubmit}
              disabled={!razorpayLoaded || loading}>
              {loading ? "Processing..." : "Checkout"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
