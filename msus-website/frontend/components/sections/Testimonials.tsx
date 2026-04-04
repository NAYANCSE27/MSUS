'use client';

import { motion } from 'framer-motion';
import { StarIcon, QuoteIcon } from '@heroicons/react/24/solid';

const testimonials = [
  {
    id: 1,
    name: 'Karim Hassan',
    nameBn: 'করিম হাসান',
    role: 'Student Beneficiary',
    roleBn: 'শিক্ষার্থী',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    content: 'MSUS has changed my life. Their education support program helped me complete my studies when my family could not afford it.',
    contentBn: 'এমএসইউএস আমার জীবন পরিবর্তন করেছে। তাদের শিক্ষা সহায়তা কর্মসূচি আমার পরিবার যখন খরচ বহন করতে পারেনি তখন আমাকে পড়াশোনা সম্পন্ন করতে সাহায্য করেছে।',
    rating: 5,
  },
  {
    id: 2,
    name: 'Fatima Begum',
    nameBn: 'ফাতিমা বেগম',
    role: 'Community Member',
    roleBn: 'সম্প্রদায় সদস্য',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    content: 'The healthcare camp organized by MSUS provided free treatment for my mother. I am forever grateful for their support.',
    contentBn: 'এমএসইউএস আয়োজিত স্বাস্থ্য শিবির আমার মায়ের বিনামূল্যে চিকিৎসা প্রদান করেছে। আমি তাদের সহায়তার জন্য চিরকৃতজ্ঞ।',
    rating: 5,
  },
  {
    id: 3,
    name: 'Abdul Rahman',
    nameBn: 'আবদুর রহমান',
    role: 'Volunteer',
    roleBn: 'স্বেচ্ছাসেবক',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    content: 'Being a volunteer at MSUS has been a rewarding experience. We are making real changes in people\'s lives.',
    contentBn: 'এমএসইউএস-এ স্বেচ্ছাসেবক হওয়া একটি পুরস্কৃত অভিজ্ঞতা হয়েছে। আমরা মানুষের জীবনে বাস্তব পরিবর্তন আনছি।',
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-primary-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="container-custom relative z-10">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-secondary-400 font-semibold tracking-wide uppercase"
          >
            Testimonials
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-white mt-2 mb-4"
          >
            What People Say
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-primary-200 max-w-2xl mx-auto"
          >
            Hear from our community members and volunteers about their experience with MSUS.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
            >
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <StarIcon key={i} className="w-5 h-5 text-secondary-400" />
                ))}
              </div>

              <div className="relative mb-6">
                <QuoteIcon className="absolute -top-2 -left-2 w-8 h-8 text-primary-700" />
                <p className="text-white/90 leading-relaxed pl-4 font-bangla">
                  {testimonial.contentBn}
                </p>
              </div>

              <div className="flex items-center">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-secondary-400"
                />
                <div className="ml-4">
                  <div className="font-semibold text-white">{testimonial.nameBn}</div>
                  <div className="text-sm text-primary-300">{testimonial.roleBn}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
