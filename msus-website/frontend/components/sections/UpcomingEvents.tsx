'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { CalendarIcon, MapPinIcon, ClockIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

const events = [
  {
    id: 1,
    title: 'Free Medical Camp',
    titleBn: 'বিনামূল্যে চিকিৎসা শিবির',
    date: '2024-02-15',
    time: '09:00 AM - 04:00 PM',
    location: 'Community Center, Mohammadpur',
    image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=600',
    category: 'Healthcare',
  },
  {
    id: 2,
    title: 'Tree Plantation Drive',
    titleBn: 'বৃক্ষ রোপণ অভিযান',
    date: '2024-03-01',
    time: '08:00 AM - 12:00 PM',
    location: 'School Ground, Mohammadpur',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600',
    category: 'Environment',
  },
  {
    id: 3,
    title: 'Educational Scholarship Distribution',
    titleBn: 'শিক্ষাবৃত্তি বিতরণ',
    date: '2024-03-15',
    time: '02:00 PM - 05:00 PM',
    location: 'MSUS Office, Mohammadpur',
    image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=600',
    category: 'Education',
  },
];

export default function UpcomingEvents() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-primary-600 font-semibold tracking-wide uppercase"
            >
              Join Us
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="section-title mt-2"
            >
              Upcoming Events
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link
              href="/events"
              className="inline-flex items-center text-primary-600 font-medium hover:text-primary-700"
            >
              View All Events
              <ArrowRightIcon className="w-4 h-4 ml-1" />
            </Link>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <Link href={`/events/${event.id}`}>
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                  <div className="relative h-56">
                    <Image
                      src={event.image}
                      alt={event.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                    <div className="absolute top-4 right-4 bg-white rounded-lg p-3 text-center min-w-[70px]">
                      <div className="text-2xl font-bold text-primary-600">
                        {new Date(event.date).getDate()}
                      </div>
                      <div className="text-xs text-gray-600 uppercase">
                        {new Date(event.date).toLocaleString('default', { month: 'short' })}
                      </div>
                    </div>

                    <div className="absolute bottom-4 left-4">
                      <span className="px-3 py-1 bg-secondary-400 text-gray-900 text-xs font-semibold rounded-full">
                        {event.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                      {event.titleBn}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">{event.title}</p>

                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <ClockIcon className="w-4 h-4 mr-2 text-primary-600" />
                        {event.time}
                      </div>
                      <div className="flex items-center">
                        <MapPinIcon className="w-4 h-4 mr-2 text-primary-600" />
                        {event.location}
                      </div>
                    </div>

                    <div className="mt-6">
                      <span className="inline-flex items-center text-primary-600 font-medium group-hover:translate-x-2 transition-transform">
                        Register Now
                        <ArrowRightIcon className="w-4 h-4 ml-1" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
