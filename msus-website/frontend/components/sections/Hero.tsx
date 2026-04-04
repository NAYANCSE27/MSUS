'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRightIcon, PlayIcon } from '@heroicons/react/24/solid';
import { HeartIcon, UsersIcon, LightBulbIcon } from '@heroicons/react/24/outline';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-700/95 via-primary-800/95 to-primary-900/95 z-10" />
        <img
          src="/images/hero-bg.jpg"
          alt="Community Background"
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1920';
          }}
        />
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 z-10 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-20 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute bottom-20 left-20 w-72 h-72 bg-secondary-400/10 rounded-full blur-3xl"
        />
      </div>

      {/* Content */}
      <div className="relative z-20 container-custom pt-32 pb-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm mb-8"
          >
            <span className="flex h-2 w-2 rounded-full bg-secondary-400"></span>
            <span>Established 2020 | Non-Profit Organization</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
          >
            <span className="block mb-2">মোহাম্মদপুর</span>
            <span className="block text-secondary-400">সমাজ উন্নয়ন সংগঠন</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl md:text-2xl text-white/90 mb-8 font-bangla"
          >
            সমাজের উন্নয়নে আমরা একসাথে
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-lg text-white/80 mb-10 max-w-2xl mx-auto"
          >
            Working together for the development of our community through education,
            healthcare, and social welfare programs in Mohammadpur, Ulchapara, Brahmanbaria.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/donate"
              className="inline-flex items-center px-8 py-4 text-lg font-semibold rounded-full bg-secondary-400 text-gray-900 hover:bg-secondary-500 transition-all duration-300 hover:scale-105"
            >
              <HeartIcon className="w-5 h-5 mr-2" />
              Donate Now
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </Link>

            <Link
              href="/about"
              className="inline-flex items-center px-8 py-4 text-lg font-semibold rounded-full bg-white/10 backdrop-blur-sm text-white border border-white/30 hover:bg-white/20 transition-all duration-300"
            >
              <PlayIcon className="w-5 h-5 mr-2" />
              Learn More
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {[
              { icon: UsersIcon, value: '500+', label: 'Members' },
              { icon: HeartIcon, value: '10K+', label: 'Lives Impacted' },
              { icon: LightBulbIcon, value: '50+', label: 'Projects' },
              { icon: UsersIcon, value: '100+', label: 'Volunteers' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/10 mb-4">
                  <stat.icon className="w-6 h-6 text-secondary-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-white/70">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
      >
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <motion.div
            animate={{ y: [0, 16, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1.5 h-3 bg-white/70 rounded-full mt-2"
          />
        </div>
      </motion.div>
    </section>
  );
}
