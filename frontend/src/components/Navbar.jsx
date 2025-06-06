import React, { useState, useEffect, Fragment } from "react";
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
import Profile from "./Profile";
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

// Rebuilt with HeadlessUI for a cleaner look and better accessibility
function UpcomingFeaturesMenu() {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="inline-flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
        <span>Upcoming Features</span>
        <ChevronDownIcon className="h-4 w-4 text-gray-500" aria-hidden="true" />
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
                      } group flex w-full items-start gap-3 rounded-lg p-3 text-sm transition-colors`}
                    >
                      <div className="flex-shrink-0 flex items-center justify-center rounded-lg bg-gray-100 p-2 group-hover:bg-blue-100">
                        {React.createElement(icon, {
                          strokeWidth: 2,
                          className: `h-6 w-6 text-gray-600 group-hover:text-blue-600 ${active && 'text-blue-600'}`,
                        })}
                      </div>
                      <div>
                        <p className="font-semibold">{title}</p>
                        <p className={`text-xs ${active ? 'text-blue-100' : 'text-gray-500'}`}>
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
    { name: 'Pet Shop', href: '/petshop' },
    { name: 'Mating', href: '/matingpage' },
    { name: 'My Pets', href: '/my-pets' },
  ];

  return (
    <div className="hidden lg:flex items-center gap-2">
      {navItems.map((item) => (
        <motion.div key={item.name} whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
          <Link
            key={item.name}
            to={item.href}
            className={classNames(
              'px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-300',
              location.pathname === item.href
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            )}
          >
            {item.name}
          </Link>
        </motion.div>
      ))}
      <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
        <UpcomingFeaturesMenu />
      </motion.div>
    </div>
  );
};

// Navigation links for mobile view
const MobileNavLinks = () => (
  <div className="space-y-1">
    <Link to="/home" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">Home</Link>
    <Link to="/petshop" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">Pet Shop</Link>
    <Link to="/matingpage" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">Mating</Link>
    <Link to="/my-pets" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">My Pets</Link>
    <Disclosure>
      {({ open }) => (
        <>
          <Disclosure.Button className="flex w-full items-center justify-between px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">
            <span>Upcoming Features</span>
            <ChevronDownIcon className={`${open ? "rotate-180" : ""} h-5 w-5`} />
          </Disclosure.Button>
          <Disclosure.Panel className="pl-4 pt-2 space-y-1">
            {upcomingFeaturesMenuItems.map((item) => (
              <a
                key={item.title}
                href={item.href}
                className="group flex w-full items-start gap-3 rounded-lg p-3 text-sm hover:bg-gray-100"
              >
                <div className="flex-shrink-0 flex items-center justify-center rounded-lg bg-gray-100 p-2 group-hover:bg-blue-100">
                  {React.createElement(item.icon, {
                    strokeWidth: 2,
                    className: "h-6 w-6 text-gray-600 group-hover:text-blue-600",
                  })}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{item.title}</p>
                </div>
              </a>
            ))}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  </div>
);

export default function Navbar() {
  const location = useLocation();
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  const { logout } = useAuthStore();
  
  // Hide navbar for specific routes
  const hiddenRoutes = ["/", "/login", "/signup"];
  if (hiddenRoutes.includes(location.pathname)) {
    return null;
  }

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <Disclosure as="nav" className="bg-white/80 backdrop-blur-md shadow-sm">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-20 items-center justify-between">
                
                {/* Logo on the left */}
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/home" className="flex-shrink-0">
                    <span className="text-2xl font-bold text-gray-900 tracking-tight">
                      The Pet Shop
                    </span>
                  </Link>
                </motion.div>

                {/* Centered Navigation Links */}
                <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center lg:gap-8">
                  <NavLinks />
                </div>

                {/* Action Icons and Profile on the right */}
                <div className="hidden lg:flex items-center gap-4">
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Link to="/home/wishlist" className="p-2 rounded-full text-gray-500 hover:text-gray-800  transition-colors">
                      <HeartIcon className="h-6 w-6" />
                    </Link>
                  </motion.div>
                  <div className="w-px h-6 bg-gray-200"></div>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Profile />
                  </motion.div>
                </div>

                {/* Mobile Menu Button */}
                <div className="flex items-center lg:hidden">
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Link to="/home/wishlist" className="p-2 mr-2 rounded-full text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors">
                      <HeartIcon className="h-6 w-6" />
                    </Link>
                  </motion.div>
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon
                        className="block h-6 w-6"
                        aria-hidden="true"
                      />
                    ) : (
                      <Bars3Icon
                        className="block h-6 w-6"
                        aria-hidden="true"
                      />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>

            <AnimatePresence>
              {open && (
                <Disclosure.Panel
                  as={motion.div}
                  static
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="lg:hidden border-t border-gray-200 bg-white shadow-lg overflow-hidden"
                >
                  <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    <MobileNavLinks />
                  </div>
                  <div className="border-t border-gray-200 px-4 py-4">
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-medium text-gray-800">My Account</span>
                      <Profile />
                    </div>

                    {isAuthenticated ? (
                      <button
                        onClick={logout}
                        className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-red-600 hover:bg-red-700"
                      >
                        Logout
                      </button>
                    ) : (
                      <div className="grid grid-cols-2 gap-3">
                        <Link
                          to="/login"
                          className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                          Log In
                        </Link>
                        <Link
                          to="/signup"
                          className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
                        >
                          Sign Up
                        </Link>
                      </div>
                    )}
                  </div>
                </Disclosure.Panel>
              )}
            </AnimatePresence>
          </>
        )}
      </Disclosure>
    </motion.div>
  );
}
