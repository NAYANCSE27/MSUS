'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  UsersIcon,
  HeartIcon,
  BookOpenIcon,
  BuildingLibraryIcon,
  TrophyIcon,
  HomeIcon
} from '@heroicons/react/24/outline';

const stats = [
  {
    icon: UsersIcon,
    value: 500,
    suffix: '+',
    label: 'Active Members',
    description: 'Dedicated volunteers and members',
  },
  {
    icon: HeartIcon,
    value: 10000,
    suffix: '+',
    label: 'People Helped',
    description: 'Lives impacted through our programs',
  },
  {
    icon: BookOpenIcon,
    value: 250,
    suffix: '+',
    label: 'Students Supported',
    description: 'Scholarships and educational aid',
  },
  {
    icon: BuildingLibraryIcon,
    value: 50,
    suffix: '+',
    label: 'Projects Completed',
    description: 'Successful community initiatives',
  },
  {
    icon: TrophyIcon,
    value: 8,
    suffix: '',
    label: 'Activity Areas',
    description: 'Comprehensive development sectors',
  },
  {
    icon: HomeIcon,
    value: 10,
    suffix: 'M+',
    label: 'BDT Raised',
    description: 'Funds collected for welfare',
  },
];

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const duration = 2000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {count.toLocaleString()}{suffix}
    </span>
  );
}

export default function Stats() {
  return (
    <section className="py-20 bg-primary-600">
      <div className="container-custom">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            Our Impact in Numbers
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-primary-100 max-w-2xl mx-auto"
          >
            See how we've been making a difference in our community through our various programs and initiatives.
          </motion.p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mb-4">
                <stat.icon className="w-8 h-8 text-secondary-400" />
              </div>
              <div className="text-4xl font-bold text-white mb-2">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-lg font-semibold text-white mb-1">{stat.label}</div>
              <div className="text-sm text-primary-200">{stat.description}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
