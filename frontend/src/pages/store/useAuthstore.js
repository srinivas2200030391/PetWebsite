import {create} from"zustand"
import { axiosinstance } from "../../lib/axios"
import toast from "react-hot-toast";
import config from "../../config"


export const useAuthStore = create((set) =>({
    authUser : null,
    isSigningUp:false,
    isLoggingIn:false,
    isUpdatingProfile:false,
    ischeckingAuth:true,
    onlineUsers : [],
    socket:null,


    checkAuth: async () => {
      try {
          set({ ischeckingAuth: true });
          const res = await axiosinstance.get("/auth/check");
          if (res.data) {
              set({ authUser: res.data });
          }
      } catch (error) {
          set({ authUser: null });
          console.error("Auth check error:", error.message);
      } finally {
          set({ ischeckingAuth: false });
      }
  },

    signup: async (data) => {
        set({ isSigningUp: true });
        try {
          const res = await axiosinstance.post("/auth/signup", data);
          set({ authUser: res.data });
          toast.success("Account created Successfully");
        } catch (error) {
          console.log("Error during signup:", error); // Debugging the error
          if (error.response) {
            toast.error(error.response.data.message); // Display server-side error message
          } else {
            toast.error("An unexpected error occurred");
          }
        } finally {
          set({ isSigningUp: false });
        }
      },
      // In your logout function in the store

logout: async () => {
  console.log("Starting logout process");
  try {
    console.log("About to make logout API call");
    const response = await axiosinstance.post(`${config.baseURL}`, {}, { withCredentials: true });
    console.log("Logout API response:", response);
    
    set({ authUser: null });
    console.log("Auth user state cleared");
    
    // Clear cookies manually as well
    document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    console.log("Cookies cleared manually");
    
    toast.success("Logged out successfully");
    window.location.href = "/login";
  } catch (error) {
    console.error("Logout error:", error);
    toast.error(error.response?.data?.message || "Logout failed");
  }
},


login: async (data) => {
  try {
      set({ isLoggingIn: true });
      const res = await axiosinstance.post(`${config.baseURL}/api/auth/login`, data);
      if (res.data) {
          set({ authUser: res.data });
          toast.success("Logged in successfully");
          return true;
      }
  } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      toast.error(message);
      return false;
  } finally {
      set({ isLoggingIn: false });
  }
}
}))