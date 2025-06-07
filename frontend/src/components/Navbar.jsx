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
      <Menu.Button className="inline-flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
        <span>Upcoming Features</span>
        <ChevronDownIcon className="h-4 w-4 text-gray-500 transition-transform duration-200 group-open:rotate-180" aria-hidden="true" />
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="transform opacity-0 scale-98 translate-y-1"
        enterTo="transform opacity-100 scale-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="transform opacity-100 scale-100 translate-y-0"
        leaveTo="transform opacity-0 scale-98 translate-y-1"
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
    <div className="hidden lg:flex items-center gap-2 ml-auto">
      {navItems.map((item) => (
        <Link
          key={item.name}
          to={item.href}
          className={classNames(
            'px-4 py-2 text-sm font-semibold transition-all duration-200 rounded-full',
            location.pathname === item.href
              ? 'bg-red-50 text-black shadow-sm'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          )}
        >
          {item.name}
        </Link>
      ))}
      <UpcomingFeaturesMenu />
    </div>
  );
};

// Navigation links for mobile view
const MobileNavLinks = ({ close }) => (
  <div className="space-y-1">
    <Link 
      to="/home" 
      onClick={close}
      className="block px-3 py-2.5 rounded-md text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200"
    >
      Home
    </Link>
    <Link 
      to="/petshop" 
      onClick={close}
      className="block px-3 py-2.5 rounded-md text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200"
    >
      Pet Shop
    </Link>
    <Link 
      to="/matingpage" 
      onClick={close}
      className="block px-3 py-2.5 rounded-md text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200"
    >
      Mating
    </Link>
    <Link 
      to="/my-pets" 
      onClick={close}
      className="block px-3 py-2.5 rounded-md text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200"
    >
      My Pets
    </Link>
    <Disclosure>
      {({ open }) => (
        <>
          <Disclosure.Button className="flex w-full items-center justify-between px-3 py-2.5 rounded-md text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200">
            <span>Upcoming Features</span>
            <ChevronDownIcon className={`${open ? "rotate-180" : ""} h-5 w-5 transition-transform duration-200`} />
          </Disclosure.Button>
          <Disclosure.Panel className="pl-4 pt-2 space-y-1">
            {upcomingFeaturesMenuItems.map((item) => (
              <a
                key={item.title}
                href={item.href}
                onClick={close}
                className="group flex w-full items-start gap-3 rounded-lg p-3 text-sm hover:bg-gray-50 transition-all duration-200"
              >
                <div className="flex-shrink-0 flex items-center justify-center rounded-lg bg-gray-100 p-2 transition-colors duration-200 group-hover:bg-blue-100">
                  {React.createElement(item.icon, {
                    strokeWidth: 2,
                    className: "h-6 w-6 text-gray-600 group-hover:text-blue-600 transition-colors duration-200",
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
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1.0] }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <Disclosure as="nav" className="bg-white/80 backdrop-blur-md shadow-sm">
        {({ open, close }) => (
          <>
            <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-20 items-center justify-between">
                
                {/* Logo on the left */}
                <Link to="/home" className="flex-shrink-0 transition-all duration-200 hover:opacity-80">
                  <span className="text-2xl font-bold text-gray-900 tracking-tight">
                    PETZU
                  </span>
                </Link>

                {/* Centered Navigation Links */}
                <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center mx-auto lg:gap-8">
                  <NavLinks />
                </div>

                {/* Action Icons and Profile on the right */}
                <div className="hidden lg:flex items-center gap-4">
                  <Link 
                    to="/home/wishlist" 
                    className="p-2 rounded-full text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                  >
                    <HeartIcon className="h-6 w-6" />
                  </Link>
                  <div className="w-px h-6 bg-gray-200"></div>
                  <Profile />
                </div>

                {/* Mobile Menu Button - Enhanced with better touch target size */}
                <div className="flex items-center lg:hidden">
                  <Link 
                    to="/home/wishlist" 
                    onClick={close}
                    className="p-2 mr-2 rounded-full text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 min-w-[44px] min-h-[44px] flex items-center justify-center"
                    aria-label="Wishlist"
                  >
                    <HeartIcon className="h-6 w-6" />
                  </Link>
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-all duration-200 min-w-[44px] min-h-[44px]" aria-label="Menu">
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
                  transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1.0] }}
                  className="lg:hidden border-t border-gray-200 bg-white shadow-lg overflow-hidden overscroll-contain"
                >
                  <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    <MobileNavLinks close={close} />
                  </div>
                  <div className="border-t border-gray-200 px-4 py-4">
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-medium text-gray-800">My Account</span>
                      <Profile closeNavbar={close} />
                    </div>

                    {isAuthenticated ? (
                      <button
                        onClick={() => {
                          close();
                          logout();
                        }}
                        className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-red-600 hover:bg-red-700 active:bg-red-800 active:scale-95 transition-all duration-200 min-h-[44px]"
                      >
                        Logout
                      </button>
                    ) : (
                      <div className="grid grid-cols-2 gap-3">
                        <Link
                          to="/login"
                          onClick={close}
                          className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 active:bg-gray-100 active:scale-95 transition-all duration-200 min-h-[44px]"
                        >
                          Log In
                        </Link>
                        <Link
                          to="/signup"
                          onClick={close}
                          className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 active:scale-95 transition-all duration-200 min-h-[44px]"
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
