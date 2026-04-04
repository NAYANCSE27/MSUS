'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { CalendarIcon, ClockIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

const news = [
  {
    id: 1,
    title: 'Annual General Meeting 2024',
    titleBn: 'বার্ষিক সাধারণ সভা ২০২৪',
    excerpt: 'Join us for our Annual General Meeting on January 15, 2024. All members are invited to attend.',
    image: 'https://images.unsplash.com/photo-1544531586-fde5298cdd40?w=600',
    date: '2024-01-10',
    category: 'Announcement',
    readTime: '3 min read',
  },
  {
    id: 2,
    title: 'Free Medical Camp Success',
    titleBn: 'বিনামূল্যে চিকিৎসা শিবির সফল',
    excerpt: 'Over 500 people received free medical checkups and consultations at our recent medical camp.',
    image: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7d133?w=600',
    date: '2024-01-05',
    category: 'Event Report',
    readTime: '5 min read',
  },
  {
    id: 3,
    title: 'Education Scholarship Program 2024',
    titleBn: 'শিক্ষা বৃত্তি কর্মসূচি ২০২৪',
    excerpt: 'Applications are now open for our annual education scholarship program. Apply before February 28.',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600',
    date: '2024-01-01',
    category: 'News',
    readTime: '4 min read',
  },
];

export default function LatestNews() {
  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-primary-600 font-semibold tracking-wide uppercase"
            >
              News & Updates
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="section-title mt-2"
            >
              Latest News
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link
              href="/news"
              className="inline-flex items-center text-primary-600 font-medium hover:text-primary-700"
            >
              View All News
              <ArrowRightIcon className="w-4 h-4 ml-1" />
            </Link>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {news.map((item, index) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <Link href={`/news/${item.id}`}>
                <div className="card card-hover">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-primary-600 text-white text-xs font-medium rounded-full">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <span className="flex items-center">
                        <CalendarIcon className="w-4 h-4 mr-1" />
                        {new Date(item.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                      <span className="mx-2">•</span>
                      <span className="flex items-center">
                        <ClockIcon className="w-4 h-4 mr-1" />
                        {item.readTime}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                      {item.titleBn}
                    </h3>

                    <p className="text-sm text-gray-600 mb-4">
                      {item.excerpt}
                    </p>

                    <span className="text-primary-600 font-medium text-sm flex items-center group-hover:translate-x-2 transition-transform">
                      Read More
                      <ArrowRightIcon className="w-4 h-4 ml-1" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
