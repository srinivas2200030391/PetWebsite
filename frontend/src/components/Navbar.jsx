import React from "react";
import {
  Navbar,
  Collapse,
  Typography,
  Button,
  IconButton,
  List,
  ListItem,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

import Profile from "./Profile";
import {
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  Bars4Icon,
  GlobeAmericasIcon,
  NewspaperIcon,
  PhoneIcon,
  RectangleGroupIcon,
  SquaresPlusIcon,
  SunIcon,
  TagIcon,
  UserGroupIcon,
} from "@heroicons/react/24/solid";
import { useStore } from "../pages/store/store";

const navListMenuItems = [
  {
    title: "Products",
    href: "/",
    description: "Find the perfect solution for your needs.",
    icon: SquaresPlusIcon,
  },
  {
    title: "About Us",
    description: "Meet and learn about our dedication",
    icon: UserGroupIcon,
  },
  {
    title: "Blog",
    description: "Find the perfect solution for your needs.",
    icon: Bars4Icon,
  },
  {
    title: "Services",
    description: "Learn how we can help you achieve your goals.",
    icon: SunIcon,
  },
  {
    title: "Support",
    description: "Reach out to us for assistance or inquiries",
    icon: GlobeAmericasIcon,
  },
  {
    title: "Contact",
    description: "Find the perfect solution for your needs.",
    icon: PhoneIcon,
  },
  {
    title: "SalesForm",
    href: "/petsaleform",
    description: "Read insightful articles, tips, and expert opinions.",
    icon: NewspaperIcon,
  },
  {
    title: "Matingform",
    href: "/matingform",
    description: "Find the perfect solution for your needs.",
    icon: RectangleGroupIcon,
  },
  {
    title: "Special Offers",
    description: "Explore limited-time deals and bundles",
    icon: TagIcon,
  },
];

function NavListMenu() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  // In the NavListMenu component, update the renderItems mapping:
const renderItems = navListMenuItems.map(
  ({ icon, title, description, href }, key) => (
    <a href={href} key={key}>
      <MenuItem className="flex items-center gap-3 rounded-lg">
        <div className="flex items-center justify-center rounded-lg !bg-blue-gray-50 p-2 ">
          {React.createElement(icon, {
            strokeWidth: 2,
            className: "h-6 text-gray-900 w-6",
          })}
        </div>
        <div>
          <Typography
            variant="h6"
            color="blue-gray"
            className="flex items-center text-sm font-bold">
            {title}
          </Typography>
          <Typography
            variant="paragraph"
            className="text-xs !font-medium text-blue-gray-500">
            {description}
          </Typography>
        </div>
      </MenuItem>
    </a>
  )
);

  return (
    <React.Fragment>
      <Menu
        open={isMenuOpen}
        handler={setIsMenuOpen}
        offset={{ mainAxis: 20 }}
        placement="bottom"
        allowHover={true}>
        <MenuHandler>
          <Typography as="div" variant="small" className="font-medium">
            <ListItem
              className="flex items-center gap-2 py-2 pr-4 font-medium text-gray-900"
              selected={isMenuOpen || isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen((cur) => !cur)}>
              Resources
              <ChevronDownIcon
                strokeWidth={2.5}
                className={`hidden h-3 w-3 transition-transform lg:block ${
                  isMenuOpen ? "rotate-180" : ""
                }`}
              />
              <ChevronDownIcon
                strokeWidth={2.5}
                className={`block h-3 w-3 transition-transform lg:hidden ${
                  isMobileMenuOpen ? "rotate-180" : ""
                }`}
              />
            </ListItem>
          </Typography>
        </MenuHandler>
        <MenuList className="hidden max-w-screen-xl rounded-xl lg:block">
          <ul className="grid grid-cols-3 gap-y-2 outline-none outline-0">
            {renderItems}
          </ul>
        </MenuList>
      </Menu>
      <div className="block lg:hidden">
        <Collapse open={isMobileMenuOpen}>{renderItems}</Collapse>
      </div>
    </React.Fragment>
  );
}

function NavList() {
  return (
    <List className="mt-4 mb-6 p-0 lg:mt-0 lg:mb-0 lg:flex-row lg:p-1">
      <Typography
        as="a"
        href="/home"
        variant="small"
        color="blue-gray"
        className="font-medium">
        <ListItem className="flex items-center gap-2 py-2 pr-4">Home</ListItem>
      </Typography>

      <Typography
        as="a"
        href="#"
        variant="small"
        color="blue-gray"
        className="font-medium">
        <ListItem className="flex items-center gap-2 py-2 pr-4">
          Cart  
        </ListItem>
      </Typography>
      <NavListMenu />
      <Typography
        as="a"
        href="/Petshop"
        variant="small"
        color="blue-gray"
        className="font-medium">
        <ListItem className="flex items-center gap-2 py-2 pr-4">Store</ListItem>
      </Typography>
      <Typography
        as="a"
        href="#"
        variant="small"
        color="blue-gray"
        className="font-medium">
        <ListItem className="flex items-center gap-2 py-2 pr-4">
          Settings
        </ListItem>
      </Typography>
      <Typography
        as="a"
        href="#"
        variant="small"
        color="blue-gray"
        className="font-medium">
        <ListItem className="flex items-center gap-2 py-2 pr-4">
          Orders
        </ListItem>
      </Typography>
      
    </List>
  );
}

import { useLocation } from "react-router-dom";

export default function NavbarWithMegaMenu() {
  const location = useLocation();
  const [openNav, setOpenNav] = React.useState(false);
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  const logout = useStore((state) => state.logout);

  const handleSearch = (event) => {
    event.preventDefault();
    const searchQuery = event.target.search.value;
    console.log("Search query:", searchQuery);
    // Add your search logic here
  };

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 960) {
        setOpenNav(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Hide navbar for specific routes
  const hiddenRoutes = ["/", "/login", "/signin"];
  if (hiddenRoutes.includes(location.pathname)) {
    return null;
  }

  return (
    <Navbar className="mx-auto max-w-screen-xl px-4 py-2 fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-0">
      <div className="flex items-center justify-between text-xs text-black uppercase font-bold">
        <Typography
          as="a"
          href="/home"
          variant="h6"
          className="mr-4 cursor-pointer py-1.5 lg:ml-2">
          The Pet Shop
        </Typography>
        <div className="flex items-center gap-4 flex-1 justify-between">
  <form 
    onSubmit={handleSearch}
    className="hidden lg:flex items-center w-72"
  >
    <div className="relative flex w-full">
      <input
        type="search"
        name="search"
        placeholder="Search products..."
        className="w-full h-10 px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-orange-400"
      />
      <button
        type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2"
      >
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-500" />
      </button>
    </div>
  </form>
  <div className="hidden lg:block">
    <NavList />
  </div>
</div>
        <div className="hidden gap-2 lg:flex">
          <Profile />
        </div>
        <IconButton
          variant="text"
          color="blue-gray"
          className="lg:hidden"
          onClick={() => setOpenNav(!openNav)}>
          {openNav ? (
            <XMarkIcon className="h-6 w-6" strokeWidth={2} />
          ) : (
            <Bars3Icon className="h-6 w-6" strokeWidth={2} />
          )}
        </IconButton>
      </div>
      <Collapse open={openNav}>
        <NavList />
        
        <div className="flex w-full flex-nowrap items-center gap-2 lg:hidden">
          {isAuthenticated ? (
            <Button
              variant="outlined"
              size="sm"
              color="red"
              fullWidth
              onClick={logout}>
              Logout
            </Button>
          ) : (
            <>
              <Button variant="outlined" size="sm" color="blue-gray" fullWidth>
                Log In
              </Button>
              <Button variant="gradient" size="sm" fullWidth>
                Sign Up
              </Button>
            </>
          )}
        </div>
      </Collapse>
    </Navbar>
  );
}
