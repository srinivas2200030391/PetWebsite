import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  HomeIcon,
  ShoppingBagIcon,
  HeartIcon as HeartOutline,
  UserGroupIcon
} from "@heroicons/react/24/outline";
import {
  HomeIcon as HomeSolid,
  ShoppingBagIcon as ShoppingBagSolid,
  HeartIcon as HeartSolid,
    UserGroupIcon as UserGroupSolid,
} from "@heroicons/react/24/solid";

const navItems = [
  { href: "/home", outline: HomeIcon, solid: HomeSolid, label: "Home" },
  { href: "/petshop", outline: ShoppingBagIcon, solid: ShoppingBagSolid, label: "Shop" },
  { href: "/matingpage", outline: UserGroupIcon, solid: UserGroupSolid, label: "Mating" },
  { href: "/home/wishlist", outline: HeartOutline, solid: HeartSolid, label: "Wishlist" },
];

const BottomNavbar = () => {
  const location = useLocation();

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      exit={{ y: 100 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed bottom-0 left-0 right-0 h-20 bg-white/70 backdrop-blur-lg border-t border-gray-200/80 z-40 lg:hidden"
    >
      <div className="flex justify-around items-center h-full max-w-md mx-auto">
        {navItems.map(({ href, outline, solid, label }) => {
          const isActive = location.pathname === href;
          const Icon = isActive ? solid : outline;
          return (
            <Link to={href} key={label} className="flex flex-col items-center justify-center w-full h-full">
              <Icon
                className={`h-6 w-6 transition-colors ${isActive ? "text-blue-600" : "text-gray-500"
                  }`}
              />
              <span className={`text-xs mt-1 transition-colors ${isActive ? "font-bold text-blue-600" : "text-gray-600"
                  }`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </motion.div>
  );
};

export default BottomNavbar; 