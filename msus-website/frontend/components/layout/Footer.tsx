'use client';

import Link from 'next/link';
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  FacebookIcon,
  TwitterIcon,
  InstagramIcon,
  YoutubeIcon,
  HeartIcon
} from '@heroicons/react/24/solid';

const quickLinks = [
  { name: 'About Us', href: '/about' },
  { name: 'Our Activities', href: '/activities' },
  { name: 'Events', href: '/events' },
  { name: 'News & Blog', href: '/news' },
  { name: 'Gallery', href: '/gallery' },
  { name: 'Contact', href: '/contact' },
];

const activities = [
  { name: 'Education Support', href: '/activities/education' },
  { name: 'Healthcare', href: '/activities/healthcare' },
  { name: 'Social Awareness', href: '/activities/social-awareness' },
  { name: 'Library', href: '/activities/library' },
  { name: 'Sports & Cultural', href: '/activities/sports-cultural' },
  { name: 'Anti-Drug Campaign', href: '/activities/antidrug' },
];

const socialLinks = [
  { name: 'Facebook', href: '#', icon: FacebookIcon },
  { name: 'Twitter', href: '#', icon: TwitterIcon },
  { name: 'Instagram', href: '#', icon: InstagramIcon },
  { name: 'YouTube', href: '#', icon: YoutubeIcon },
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Organization Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center">
                <span className="text-xl font-bold text-white">MSUS</span>
              </div>
              <div>
                <p className="font-semibold text-white">মোহাম্মদপুর সমাজ উন্নয়ন সংগঠন</p>
                <p className="text-sm text-gray-400">Mohammadpur Samaj Unnayan Sangathan</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              A non-profit social development organization working for community welfare
              in Mohammadpur, Ulchapara, Brahmanbaria since 2020.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary-600 hover:text-white transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-primary-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Activities */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Our Activities</h3>
            <ul className="space-y-3">
              {activities.map((activity) => (
                <li key={activity.name}>
                  <Link
                    href={activity.href}
                    className="text-gray-400 hover:text-primary-400 transition-colors"
                  >
                    {activity.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPinIcon className="w-5 h-5 text-primary-500 mt-1 flex-shrink-0" />
                <span className="text-gray-400 text-sm">
                  Mohammadpur, Ulchapara<br />
                  Brahmanbaria Sadar, Brahmanbaria 3400<br />
                  Chattogram Division, Bangladesh
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <PhoneIcon className="w-5 h-5 text-primary-500 flex-shrink-0" />
                <span className="text-gray-400 text-sm">+880 1234-567890</span>
              </li>
              <li className="flex items-center space-x-3">
                <EnvelopeIcon className="w-5 h-5 text-primary-500 flex-shrink-0" />
                <span className="text-gray-400 text-sm">info@msus.org.bd</span>
              </li>
            </ul>

            {/* Newsletter */}
            <div className="mt-8">
              <h4 className="text-sm font-semibold mb-3">Subscribe to Newsletter</h4>
              <form className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-md text-sm focus:outline-none focus:border-primary-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-r-md hover:bg-primary-700 transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} MSUS. All rights reserved.
            </p>
            <p className="text-gray-400 text-sm flex items-center">
              Made with <HeartIcon className="w-4 h-4 text-red-500 mx-1" /> for the community
            </p>
            <div className="flex space-x-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
