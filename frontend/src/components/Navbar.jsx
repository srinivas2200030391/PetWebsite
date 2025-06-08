import React, { useState, Fragment } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Transition, Disclosure } from "@headlessui/react";
import {
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
  BuildingStorefrontIcon,
  HomeModernIcon,
  AcademicCapIcon,
  HeartIcon,
  MapIcon,
  ShoppingBagIcon
} from "@heroicons/react/24/outline";
import ProfileMenu from "./Profile";
import { useStore } from "../pages/store/store";
import { useAuthStore } from "../pages/store/useAuthstore";

// Helper function for dynamic classes
function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const upcomingFeaturesMenuItems = [
  {
    title: "Pet Boarding",
    href: "#",
    description: "Safe and comfortable boarding for your pets.",
    icon: HomeModernIcon,
  },
  {
    title: "Pet Training",
    href: "#",
    description: "Professional training for a well-behaved companion.",
    icon: AcademicCapIcon,
  },
  {
    title: "Pet Hospitals",
    href: "#",
    description: "Find veterinary services and emergency care near you.",
    icon: HeartIcon,
  },
  {
    title: "Pet Walk",
    href: "#",
    description: "Reliable pet walking services for your furry friend.",
    icon: MapIcon,
  },
  {
    title: "Pet Stores",
    href: "#",
    description: "Discover local pet stores with all the supplies you need.",
    icon: BuildingStorefrontIcon,
  },
];

const navItemVariants = {
  hidden: { y: -20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.3 } },
};

const mobileNavContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
};

const mobileNavLinkVariants = {
  hidden: { x: -30, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { ease: "easeOut" } },
};

// Rebuilt with HeadlessUI for a cleaner look and better accessibility
function UpcomingFeaturesMenu() {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="inline-flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
        <span>Upcoming Features</span>
        <ChevronDownIcon className="h-4 w-4 text-gray-500 ui-open:rotate-180 transition-transform duration-200" aria-hidden="true" />
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-80 origin-top-right divide-y divide-gray-100 rounded-xl bg-white shadow-2xl ring-1 ring-black/5 focus:outline-none md:grid md:grid-cols-2 md:w-[30rem]">
          <div className="p-2 grid grid-cols-1 md:col-span-2 gap-1">
            {upcomingFeaturesMenuItems.map(
              ({ icon, title, description, href }, key) => (
                <Menu.Item key={key}>
                  {({ active }) => (
                    <a
                      href={href}
                      className={`${
                        active ? "bg-blue-500 text-white" : "text-gray-900"
                      } group flex w-full items-start gap-3 rounded-lg p-3 text-sm transition-all duration-200`}
                    >
                      <div className="flex-shrink-0 flex items-center justify-center rounded-lg bg-gray-100 p-2 transition-all duration-200 group-hover:bg-blue-100">
                        {React.createElement(icon, {
                          strokeWidth: 2,
                          className: `h-6 w-6 text-gray-600 transition-all duration-200 group-hover:text-blue-600 ${active && 'text-blue-600'}`,
                        })}
                      </div>
                      <div>
                        <p className="font-semibold">{title}</p>
                        <p className={`text-xs transition-colors duration-200 ${active ? 'text-blue-100' : 'text-gray-500'}`}>
                          {description}
                        </p>
                      </div>
                    </a>
                  )}
                </Menu.Item>
              )
            )}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

// Consolidates desktop navigation links with active state styling
const NavLinks = () => {
  const location = useLocation();
  const navItems = [
    { name: 'Home', href: '/home' },
    { name: 'Buy Pet', href: '/petshop' },
    { name: 'Adult Mating', href: '/matingpage' },
    { name: 'My Pets', href: '/my-pets' },
  ]

  return (
    <motion.div
      className="hidden lg:flex items-center gap-2 ml-auto"
      variants={{
        visible: { transition: { staggerChildren: 0.1 } },
      }}
    >
      {navItems.map((item) => (
        <motion.div key={item.name} variants={navItemVariants}>
          <Link
            to={item.href}
            className={classNames(
              'px-4 py-2 text-sm font-semibold transition-colors duration-200 rounded-full block',
              location.pathname.startsWith(item.href)
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            )}
          >
            {item.name}
          </Link>
        </motion.div>
      ))}
      <motion.div variants={navItemVariants}>
        <UpcomingFeaturesMenu />
      </motion.div>
    </motion.div>
  );
};

export default function Navbar() {
  const location = useLocation();
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  
  // Hide navbar for specific routes
  const hiddenRoutes = ["/", "/login", "/signup", "/forgot-password"];
  if (hiddenRoutes.includes(location.pathname)) {
    return null;
  }

  return (
    <motion.div
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.2 }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <Disclosure as="nav" className="bg-white/80 backdrop-blur-lg border-b border-gray-200/80">
        {({ open, close }) => (
          <>
            <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-20 items-center justify-between">
                <div className="flex items-center lg:hidden">
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500">
                    <span className="sr-only">Open main menu</span>
                    {open ? <XMarkIcon className="block h-6 w-6" /> : <Bars3Icon className="block h-6 w-6" />}
                  </Disclosure.Button>
                </div>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/home" className="flex-shrink-0">
                    <motion.span 
                      layoutId="logo"
                      className="text-2xl font-bold text-gray-900 tracking-tight"
                    >
                      PETZU
                    </motion.span>
                  </Link>
                </motion.div>

                <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center mx-auto lg:gap-8">
                  <NavLinks />
                </div>

                <div className="flex items-center gap-4">
                  <div className="hidden lg:flex items-center gap-4">
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <Link to="/home/wishlist" className="p-2 rounded-full text-gray-500 hover:text-blue-600 transition-colors duration-200">
                        <HeartIcon className="h-6 w-6" />
                      </Link>
                    </motion.div>
                  </div>

                  <div className="w-px h-6 bg-gray-200 hidden lg:block"></div>
                  
                  {isAuthenticated && (
                    <motion.div whileHover={{ scale: 1.02 }}>
                       <ProfileMenu />
                    </motion.div>
                  )}
                </div>
              </div>
            </div>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-300"
              enterFrom="transform opacity-0 -translate-x-full"
              enterTo="transform opacity-100 translate-x-0"
              leave="transition ease-in duration-200"
              leaveFrom="transform opacity-100 translate-x-0"
              leaveTo="transform opacity-0 -translate-x-full"
            >
              <Disclosure.Panel className="lg:hidden h-screen bg-white shadow-lg fixed top-20 left-0 w-full sm:w-80 border-r border-gray-200">
                <div className="px-4 pt-6 pb-3 space-y-4">
                  <p>More Options</p>
                </div>
              </Disclosure.Panel>
            </Transition>
          </>
        )}
      </Disclosure>
    </motion.div>
  );
}
