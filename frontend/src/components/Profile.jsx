import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { useAuthStore } from '../pages/store/useAuthstore';
import { Link, useNavigate } from 'react-router-dom';
import {
  UserCircleIcon,
  InboxIcon,
  HeartIcon,
  CreditCardIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function ProfileMenu() {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { name: 'My Profile', href: '/home/profile', icon: UserCircleIcon },
    { name: 'Inbox', href: '/custombutton', icon: InboxIcon },
    { name: 'Wishlist', href: '/home/wishlist', icon: HeartIcon },
    { name: 'My Payments', href: '/home/payments', icon: CreditCardIcon },
  ];

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="flex items-center rounded-full bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-100 transition-transform duration-200 hover:scale-110">
          <span className="sr-only">Open user menu</span>
          <img
            className="h-9 w-9 rounded-full"
          src="https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-image-182145777.jpg"
            alt="User profile"
          />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-xl bg-white shadow-2xl ring-1 ring-black/5 focus:outline-none">
          <div className="p-1">
            {menuItems.map((item) => (
              <Menu.Item key={item.name}>
                {({ active }) => (
                  <Link
                    to={item.href}
                    className={classNames(
                      active ? 'bg-gray-100' : '',
                      'flex items-center gap-3 px-4 py-2 text-sm text-gray-700 rounded-lg'
                    )}
                  >
                    <item.icon className="h-5 w-5 text-gray-500" aria-hidden="true" />
                    <span>{item.name}</span>
        </Link>
                )}
              </Menu.Item>
            ))}
            <div className="my-1 h-px bg-gray-100"></div>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={handleLogout}
                  className={classNames(
                    active ? 'bg-red-50 text-red-700' : 'text-gray-700',
                    'w-full flex items-center gap-3 px-4 py-2 text-sm rounded-lg'
                  )}
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5 text-gray-500" aria-hidden="true" />
                  <span>Sign Out</span>
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
