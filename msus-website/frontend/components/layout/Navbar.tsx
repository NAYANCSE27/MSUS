'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
  UserIcon,
  HeartIcon,
  CalendarIcon,
  PhotoIcon,
  NewspaperIcon,
  HomeIcon,
  InformationCircleIcon,
  PhoneIcon,
  HandRaisedIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '@/context/AuthContext';

const navigation = [
  { name: 'Home', href: '/', icon: HomeIcon },
  { name: 'About', href: '/about', icon: InformationCircleIcon },
  {
    name: 'Activities',
    href: '#',
    icon: HandRaisedIcon,
    children: [
      { name: 'Education Support', href: '/activities/education' },
      { name: 'Healthcare', href: '/activities/healthcare' },
      { name: 'Social Awareness', href: '/activities/social-awareness' },
      { name: 'Library', href: '/activities/library' },
      { name: 'Sports & Cultural', href: '/activities/sports-cultural' },
      { name: 'Anti-Drug', href: '/activities/antidrug' },
      { name: 'Infrastructure', href: '/activities/infrastructure' },
      { name: 'Humanitarian Aid', href: '/activities/humanitarian' },
    ],
  },
  { name: 'Events', href: '/events', icon: CalendarIcon },
  { name: 'Gallery', href: '/gallery', icon: PhotoIcon },
  { name: 'News', href: '/news', icon: NewspaperIcon },
  { name: 'Contact', href: '/contact', icon: PhoneIcon },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white shadow-lg py-2'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              isScrolled ? 'bg-primary-600' : 'bg-white'
            }`}>
              <span className={`text-xl font-bold ${
                isScrolled ? 'text-white' : 'text-primary-600'
              }`}>
                MSUS
              </span>
            </div>
            <div className="hidden md:block">
              <p className={`text-sm font-semibold ${
                isScrolled ? 'text-primary-700' : 'text-white'
              }`}>
                মোহাম্মদপুর সমাজ উন্নয়ন সংগঠন
              </p>
              <p className={`text-xs ${
                isScrolled ? 'text-gray-600' : 'text-white/80'
              }`}>
                Mohammadpur Samaj Unnayan Sangathan
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => (
              <div key={item.name} className="relative">
                {item.children ? (
                  <button
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isScrolled
                        ? 'text-gray-700 hover:text-primary-600 hover:bg-primary-50'
                        : 'text-white/90 hover:text-white hover:bg-white/10'
                    }`}
                    onMouseEnter={() => setActiveDropdown(item.name)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <span>{item.name}</span>
                    <ChevronDownIcon className="w-4 h-4" />

                    <AnimatePresence>
                      {activeDropdown === item.name && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2"
                        >
                          {item.children.map((child) => (
                            <Link
                              key={child.name}
                              href={child.href}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                              onClick={() => setActiveDropdown(null)}
                            >
                              {child.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? isScrolled
                          ? 'text-primary-600 bg-primary-50'
                          : 'text-white bg-white/20'
                        : isScrolled
                        ? 'text-gray-700 hover:text-primary-600 hover:bg-primary-50'
                        : 'text-white/90 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link
              href="/donate"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
            >
              <HeartIcon className="w-4 h-4 mr-2" />
              Donate
            </Link>

            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 text-sm font-medium">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                    <UserIcon className="w-5 h-5 text-primary-600" />
                  </div>
                  <span className={isScrolled ? 'text-gray-700' : 'text-white'}>
                    {user.name.split(' ')[0]}
                  </span>
                </button>

                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
                >
                  <Link
                    href="/dashboard"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className={`text-sm font-medium ${
                  isScrolled ? 'text-gray-700 hover:text-primary-600' : 'text-white hover:text-white/80'
                }`}
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 rounded-md"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <XMarkIcon className={`w-6 h-6 ${isScrolled ? 'text-gray-700' : 'text-white'}`} />
            ) : (
              <Bars3Icon className={`w-6 h-6 ${isScrolled ? 'text-gray-700' : 'text-white'}`} />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden mt-4 bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <div className="px-4 py-4 space-y-2">
                {navigation.map((item) => (
                  <div key={item.name}>
                    {item.children ? (
                      <div className="space-y-1">
                        <p className="px-3 py-2 text-sm font-medium text-gray-900">
                          {item.name}
                        </p>
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            href={child.href}
                            className="block px-6 py-2 text-sm text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-md"
                            onClick={() => setIsOpen(false)}
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        className={`block px-3 py-2 text-sm font-medium rounded-md ${
                          isActive(item.href)
                            ? 'text-primary-600 bg-primary-50'
                            : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50'
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}

                <div className="pt-4 border-t border-gray-200">
                  <Link
                    href="/donate"
                    className="block w-full text-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
                    onClick={() => setIsOpen(false)}
                  >
                    Donate Now
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
