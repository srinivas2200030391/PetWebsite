import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const imageVariants = {
  hidden: { opacity: 0, scale: 1.1 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

const pageVariants = {
    hidden: { opacity: 0, x: 0 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
    exit: { 
      opacity: 0, 
      transition: { duration: 0.2 } 
    }
};

const AuthLayout = () => {
  const location = useLocation();

  const pageConfig = {
    "/login": {
      imageUrl: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=2874&auto=format&fit=crop",
      imageAlt: "An adorable dog looking up",
      gradient: "to-black/30",
      isReversed: false,
    },
    "/signup": {
      imageUrl: "https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=2835&auto=format&fit=crop",
      imageAlt: "A cute dog smiling",
      gradient: "from-black/30",
      isReversed: true,
    },
    "/forgot-password": {
      imageUrl: "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?q=80&w=2817&auto=format&fit=crop",
      imageAlt: "A thoughtful dog wearing glasses",
      gradient: "to-black/30",
      isReversed: false,
    },
  };
  
  const config = pageConfig[location.pathname] || pageConfig["/login"];

  return (
    <motion.div
      className="flex min-h-screen bg-gray-50 font-sans"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <AnimatePresence mode="wait">
        <div key={location.pathname} className={`flex flex-1 ${config.isReversed ? 'flex-row-reverse' : 'flex-row'}`}>
          {/* Form Panel */}
          <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
            <Outlet />
          </div>

          {/* Image Panel */}
          <div className="relative hidden lg:block lg:flex-1">
            <motion.div
              className="absolute inset-0"
              key={config.imageUrl} // Animate when image changes
              variants={imageVariants}
              initial="hidden"
              animate="visible"
            >
              <img
                className="h-full w-full object-cover"
                src={config.imageUrl}
                alt={config.imageAlt}
              />
              <div
                className={`absolute inset-0 bg-gradient-to-l from-transparent via-transparent ${config.gradient}`}
              />
            </motion.div>
          </div>
        </div>
      </AnimatePresence>
    </motion.div>
  );
};

export default AuthLayout; 