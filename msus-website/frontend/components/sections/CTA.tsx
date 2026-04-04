'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { HeartIcon, UserPlusIcon } from '@heroicons/react/24/outline';

export default function CTA() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-800">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Join Us in Making a Difference
          </h2>

          <p className="text-xl text-primary-100 mb-10 max-w-2xl mx-auto">
            Be a part of our mission to create positive change in our community.
            Whether through volunteering or donations, your support matters.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/donate"
              className="group inline-flex items-center px-8 py-4 text-lg font-semibold rounded-full bg-secondary-400 text-gray-900 hover:bg-secondary-500 transition-all duration-300 hover:scale-105"
            >
              <HeartIcon className="w-5 h-5 mr-2 group-hover:animate-pulse" />
              Donate Now
            </Link>

            <Link
              href="/register"
              className="group inline-flex items-center px-8 py-4 text-lg font-semibold rounded-full bg-white/10 text-white border-2 border-white/30 hover:bg-white/20 transition-all duration-300"
            >
              <UserPlusIcon className="w-5 h-5 mr-2" />
              Become a Member
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
