'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  AcademicCapIcon,
  HeartIcon,
  MegaphoneIcon,
  BookOpenIcon,
  TrophyIcon,
  ShieldCheckIcon,
  BuildingOfficeIcon,
  HandRaisedIcon
} from '@heroicons/react/24/outline';

const activities = [
  {
    icon: AcademicCapIcon,
    title: 'Education Support',
    titleBn: 'শিক্ষা সহায়তা',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600',
    description: 'Providing scholarships, free tuition, and educational materials to underprivileged students.',
    stats: { beneficiaries: 250, projects: 20 },
    href: '/activities/education'
  },
  {
    icon: HeartIcon,
    title: 'Healthcare',
    titleBn: 'স্বাস্থ্যসেবা',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600',
    description: 'Organizing free medical camps and providing health awareness education.',
    stats: { beneficiaries: 500, projects: 23 },
    href: '/activities/healthcare'
  },
  {
    icon: MegaphoneIcon,
    title: 'Social Awareness',
    titleBn: 'সামাজিক সচেতনতা',
    image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600',
    description: 'Creating awareness on sanitation, hygiene, and social rights.',
    stats: { beneficiaries: 1000, projects: 33 },
    href: '/activities/social-awareness'
  },
  {
    icon: BuildingOfficeIcon,
    title: 'Infrastructure',
    titleBn: 'অবকাঠামো উন্নয়ন',
    image: 'https://images.unsplash.com/photo-1590247813693-5541d1c609fd?w=600',
    description: 'Building roads, sanitation facilities, and community infrastructure.',
    stats: { beneficiaries: 2000, projects: 10 },
    href: '/activities/infrastructure'
  },
];

export default function Activities() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary-600 font-semibold tracking-wide uppercase"
          >
            What We Do
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="section-title mt-2"
          >
            Our Key Activities
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="section-subtitle"
          >
            Discover our diverse programs designed to uplift the community across multiple sectors.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {activities.map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="group"
            >
              <Link href={activity.href}>
                <div className="relative h-80 rounded-2xl overflow-hidden">
                  <Image
                    src={activity.image}
                    alt={activity.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <activity.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{activity.titleBn}</h3>
                        <p className="text-white/70 text-sm">{activity.title}</p>
                      </div>
                    </div>

                    <p className="text-white/80 text-sm mb-4 line-clamp-2">
                      {activity.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex space-x-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-secondary-400">{activity.stats.beneficiaries}+</div>
                          <div className="text-xs text-white/70">Helped</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-secondary-400">{activity.stats.projects}</div>
                          <div className="text-xs text-white/70">Projects</div>
                        </div>
                      </div>

                      <span className="text-white font-medium flex items-center group-hover:translate-x-2 transition-transform">
                        Learn More
                        <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/activities"
            className="btn-outline"
          >
            View All Activities
          </Link>
        </div>
      </div>
    </section>
  );
}
