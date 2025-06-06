import { Fragment, useEffect, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { useAuthStore } from '../pages/store/useAuthstore';
import { Link } from 'react-router-dom';
import {
  UserCircleIcon,
  InboxIcon,
  HeartIcon,
  CreditCardIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function ProfileMenu() {
  const { logout } = useAuthStore();
  const [userName, setUserName] = useState('User');
  const [userEmail, setUserEmail] = useState('');
  
  useEffect(() => {
    // Get user data from localStorage if available
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData?.data) {
      setUserName(userData.data.userName || userData.data.name || 'User');
      setUserEmail(userData.data.email || '');
    }
  }, []);

  const menuItems = [
    { name: 'My Profile', href: '/home/profile', icon: UserCircleIcon },
    { name: 'Inbox', href: '/custombutton', icon: InboxIcon },
    { name: 'Wishlist', href: '/home/wishlist', icon: HeartIcon },
    { name: 'My Payments', href: '/home/payments', icon: CreditCardIcon },
  ];

  return (
    <Menu as="div" className="relative inline-block text-left">
      {({ open }) => (
        <>
          <div>
            <Menu.Button 
              className={classNames(
                "flex items-center gap-1 rounded-full bg-white border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                "transition-all duration-200 ease-in-out p-0.5 pr-3",
                "hover:bg-gray-50 hover:shadow-md",
                open ? "shadow-md ring-2 ring-blue-500 ring-opacity-50" : ""
              )}
            >
              <span className="sr-only">Open user menu</span>
              <div className="relative overflow-hidden rounded-full">
                <img
                  className="h-8 w-8 rounded-full object-cover transition-transform duration-200"
                  src="https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-image-182145777.jpg"
                  alt="User profile"
                />
                <div className={classNames(
                  "absolute inset-0 bg-black bg-opacity-10 transition-opacity duration-200",
                  open ? "opacity-100" : "opacity-0"
                )} />
              </div>
              <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-[100px] truncate">
                {userName}
              </span>
              <ChevronDownIcon 
                className={classNames(
                  "h-4 w-4 text-gray-500 transition-transform duration-200",
                  open ? "rotate-180" : ""
                )} 
                aria-hidden="true" 
              />
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="transform opacity-0 scale-95 translate-y-1"
            enterTo="transform opacity-100 scale-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="transform opacity-100 scale-100 translate-y-0"
            leaveTo="transform opacity-0 scale-95 translate-y-1"
          >
            <Menu.Items className="absolute right-0 z-10 mt-3 w-64 origin-top-right rounded-xl bg-white shadow-2xl ring-1 ring-black/5 focus:outline-none divide-y divide-gray-100 overflow-hidden">
              {/* User Profile Header */}
              <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50">
                <p className="text-sm font-medium text-gray-900">{userName}</p>
                <p className="text-xs text-gray-500 truncate mt-0.5">{userEmail}</p>
              </div>
              
              <div className="py-2">
                {menuItems.map((item) => (
                  <Menu.Item key={item.name}>
                    {({ active }) => (
                      <Link
                        to={item.href}
                        className={classNames(
                          active ? 'bg-blue-50' : '',
                          'flex items-center gap-3 px-6 py-2.5 text-sm transition-colors duration-150 ease-in-out'
                        )}
                      >
                        <span className={classNames(
                          "p-1.5 rounded-full", 
                          active ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"
                        )}>
                          <item.icon className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <span className={active ? "text-blue-800 font-medium" : "text-gray-700"}>
                          {item.name}
                        </span>
                      </Link>
                    )}
                  </Menu.Item>
                ))}
              </div>
              
              <div className="py-2 bg-gray-50">
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="/"
                      onClick={logout}
                      className={classNames(
                        active ? 'bg-red-50' : '',
                        'w-full flex items-center gap-3 px-6 py-2.5 text-sm transition-colors duration-150 ease-in-out'
                      )}
                    >
                      <span className={classNames(
                        "p-1.5 rounded-full", 
                        active ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600"
                      )}>
                        <ArrowRightOnRectangleIcon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <span className={active ? "text-red-700 font-medium" : "text-gray-700"}>
                        Sign Out
                      </span>
                    </a>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
}
