import { create } from "zustand";

// Helper function to get initial auth state from localStorage
const getInitialAuthState = () => {
  try {
    const storedData = localStorage.getItem("authData");
    if (storedData) {
      return JSON.parse(storedData);
    }
  } catch (error) {
    console.error("Error reading auth data from localStorage:", error);
  }

  // Default state if nothing in localStorage
  return {
    user: null,
    token: null,
    isAuthenticated: false,
  };
};

// Helper function to get initial cart state from localStorage
const getInitialCartState = () => {
  try {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      const cartItems = JSON.parse(storedCart);
      return {
        items: cartItems,
        count: cartItems.reduce((total, item) => total + item.quantity, 0),
      };
    }
  } catch (error) {
    console.error("Error reading cart data from localStorage:", error);
  }

  return {
    items: [],
    count: 0,
  };
};

export const useStore = create((set, get) => ({
  // Auth state
  ...getInitialAuthState(),

  // Cart state
  cart: getInitialCartState(),
  products: [],
  selectedCategory: "All",
  loading: false,

  // Auth actions
  login: (userData) => {
    const authData = {
      user: userData.user,
      token: userData.token,
      isAuthenticated: true,
    };

    localStorage.setItem("authData", JSON.stringify(authData));
    set(authData);
  },

  logout: () => {
    localStorage.removeItem("authData");
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  updateUser: (updatedUserData) => {
    set((state) => {
      const newState = {
        ...state,
        user: {
          ...state.user,
          ...updatedUserData,
        },
      };

      localStorage.setItem(
        "authData",
        JSON.stringify({
          user: newState.user,
          token: newState.token,
          isAuthenticated: newState.isAuthenticated,
        })
      );

      return newState;
    });
  },

  // Product actions
  fetchProducts: async () => {
    set({ loading: true });
    try {
      // Uncomment this when backend is ready
      // const response = await axios.get('/api/products');
      // const products = response.data;

      // Static Data for Now
      const products = [
        {
          id: 1,
          name: "Dog Collar",
          price: 12.99,
          category: "Accessories",
          image: "/api/placeholder/200/200",
        },
        {
          id: 2,
          name: "Pet Vitamins",
          price: 24.99,
          category: "Medicine",
          image: "/api/placeholder/200/200",
        },
        {
          id: 3,
          name: "Premium Dog Food",
          price: 29.99,
          category: "Food",
          image: "/api/placeholder/200/200",
        },
        {
          id: 4,
          name: "Interactive Ball",
          price: 9.99,
          category: "Toys",
          image: "/api/placeholder/200/200",
        },
        {
          id: 5,
          name: "Pet Shampoo",
          price: 14.99,
          category: "Grooming",
          image: "/api/placeholder/200/200",
        },
        {
          id: 6,
          name: "Cat Toys Set",
          price: 19.99,
          category: "Toys",
          image: "/api/placeholder/200/200",
        },
        {
          id: 7,
          name: "Dog Leash",
          price: 17.99,
          category: "Accessories",
          image: "/api/placeholder/200/200",
        },
        {
          id: 8,
          name: "Cat Food",
          price: 22.99,
          category: "Food",
          image: "/api/placeholder/200/200",
        },
      ];

      set({ products, loading: false });
    } catch (error) {
      console.error("Error fetching products:", error);
      set({ loading: false });
    }
  },

  setSelectedCategory: (category) => {
    set({ selectedCategory: category });
  },

  // Cart actions
  addToCart: (productId) => {
    set((state) => {
      const product = state.products.find((item) => item.id === productId);
      if (!product) return state;

      const updatedCart = [...state.cart.items];
      const existingItemIndex = updatedCart.findIndex(
        (item) => item.id === productId
      );

      if (existingItemIndex >= 0) {
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + 1,
        };
      } else {
        updatedCart.push({ ...product, quantity: 1 });
      }

      const newCount = updatedCart.reduce(
        (total, item) => total + item.quantity,
        0
      );

      // Update localStorage
      localStorage.setItem("cart", JSON.stringify(updatedCart));

      return {
        ...state,
        cart: {
          items: updatedCart,
          count: newCount,
        },
      };
    });
  },

  removeFromCart: (productId) => {
    set((state) => {
      const updatedCart = state.cart.items.filter(
        (item) => item.id !== productId
      );
      const newCount = updatedCart.reduce(
        (total, item) => total + item.quantity,
        0
      );

      localStorage.setItem("cart", JSON.stringify(updatedCart));

      return {
        ...state,
        cart: {
          items: updatedCart,
          count: newCount,
        },
      };
    });
  },

  updateCartItemQuantity: (productId, quantity) => {
    set((state) => {
      const updatedCart = [...state.cart.items];
      const itemIndex = updatedCart.findIndex((item) => item.id === productId);

      if (itemIndex >= 0) {
        if (quantity <= 0) {
          updatedCart.splice(itemIndex, 1);
        } else {
          updatedCart[itemIndex] = {
            ...updatedCart[itemIndex],
            quantity: quantity,
          };
        }
      }

      const newCount = updatedCart.reduce(
        (total, item) => total + item.quantity,
        0
      );

      localStorage.setItem("cart", JSON.stringify(updatedCart));

      return {
        ...state,
        cart: {
          items: updatedCart,
          count: newCount,
        },
      };
    });
  },

  clearCart: () => {
    localStorage.removeItem("cart");
    set((state) => ({
      ...state,
      cart: {
        items: [],
        count: 0,
      },
    }));
  },

  // Computed values
  getFilteredProducts: () => {
    const { products, selectedCategory } = get();
    return selectedCategory === "All"
      ? products
      : products.filter((product) => product.category === selectedCategory);
  },
}));
