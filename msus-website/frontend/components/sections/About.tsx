'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

const highlights = [
  'Non-profit social organization',
  'Registered under government regulations',
  'Serving since 2020',
  '8 core activity areas',
  '500+ active members',
  'Transparent operations',
];

export default function About() {
  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative h-[500px] rounded-2xl overflow-hidden">
              <Image
                src="/images/about-hero.jpg"
                alt="MSUS Community Work"
                fill
                className="object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>

            {/* Experience Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="absolute -bottom-8 -right-8 bg-primary-600 text-white p-6 rounded-xl shadow-xl"
            >
              <div className="text-5xl font-bold">4+</div>
              <div className="text-sm">Years of</div>
              <div className="text-sm font-semibold">Excellence</div>
            </motion.div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-secondary-200 rounded-full -z-10" />
            <div className="absolute top-1/2 -right-8 w-16 h-16 bg-primary-200 rounded-full -z-10" />
          </motion.div>

          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <span className="text-primary-600 font-semibold tracking-wide uppercase">
              About Us
            </span>

            <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-4">
              মোহাম্মদপুর সমাজ উন্নয়ন সংগঠন
            </h2>

            <p className="text-gray-600 mb-4 leading-relaxed">
              Mohammadpur Samaj Unnayan Sangathan (MSUS) is a non-profit social development organization
              established in 2020. We are dedicated to improving the lives of people in Mohammadpur,
              Ulchapara, Brahmanbaria through comprehensive development programs.
            </p>

            <p className="text-gray-600 mb-6 leading-relaxed">
              Our mission is to create a self-reliant, educated, and healthy community by addressing
              key areas including education, healthcare, social awareness, and infrastructure development.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {highlights.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <CheckCircleIcon className="w-5 h-5 text-primary-600 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">{item}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/about"
                className="btn-primary"
              >
                Learn More About Us
              </Link>

              <Link
                href="/contact"
                className="btn-outline"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
