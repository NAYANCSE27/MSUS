'use client';

import { motion } from 'framer-motion';
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

const features = [
  {
    icon: AcademicCapIcon,
    title: 'শিক্ষা সহায়তা',
    titleEn: 'Education Support',
    description: 'Scholarships, free tuition, and educational materials for underprivileged students.',
    color: 'bg-blue-100 text-blue-600',
    href: '/activities/education'
  },
  {
    icon: HeartIcon,
    title: 'স্বাস্থ্যসেবা',
    titleEn: 'Healthcare',
    description: 'Free medical camps, health awareness, and medical assistance for needy families.',
    color: 'bg-red-100 text-red-600',
    href: '/activities/healthcare'
  },
  {
    icon: MegaphoneIcon,
    title: 'সামাজিক সচেতনতা',
    titleEn: 'Social Awareness',
    description: 'Creating awareness on social issues, sanitation, and community development.',
    color: 'bg-purple-100 text-purple-600',
    href: '/activities/social-awareness'
  },
  {
    icon: BookOpenIcon,
    title: 'গ্রন্থাগার',
    titleEn: 'Library',
    description: 'Community library with books, computers, and educational resources for all.',
    color: 'bg-amber-100 text-amber-600',
    href: '/activities/library'
  },
  {
    icon: TrophyIcon,
    title: 'ক্রীড়া ও সাংস্কৃতিক',
    titleEn: 'Sports & Cultural',
    description: 'Organizing sports competitions and cultural events for youth development.',
    color: 'bg-green-100 text-green-600',
    href: '/activities/sports-cultural'
  },
  {
    icon: ShieldCheckIcon,
    title: 'মাদকবিরোধী',
    titleEn: 'Anti-Drug',
    description: 'Campaigns and programs to prevent drug abuse in our community.',
    color: 'bg-orange-100 text-orange-600',
    href: '/activities/antidrug'
  },
  {
    icon: BuildingOfficeIcon,
    title: 'অবকাঠামো উন্নয়ন',
    titleEn: 'Infrastructure',
    description: 'Building roads, sanitation facilities, and community infrastructure.',
    color: 'bg-cyan-100 text-cyan-600',
    href: '/activities/infrastructure'
  },
  {
    icon: HandRaisedIcon,
    title: 'মানবিক সহায়তা',
    titleEn: 'Humanitarian Aid',
    description: 'Emergency relief, Zakat distribution, and aid for vulnerable community members.',
    color: 'bg-rose-100 text-rose-600',
    href: '/activities/humanitarian'
  },
];

export default function Features() {
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
            Our Activities
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="section-title mt-2"
          >
            কার্যক্রম সমূহ
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="section-subtitle"
          >
            We work across 8 key areas to bring holistic development to our community.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.a
              key={index}
              href={feature.href}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-lg ${feature.color} mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-7 h-7" />
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">
                {feature.title}
              </h3>
              <p className="text-xs text-gray-500 mb-3">{feature.titleEn}</p>

              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>

              <div className="mt-4 flex items-center text-primary-600 font-medium text-sm group-hover:translate-x-2 transition-transform">
                Learn More
                <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
