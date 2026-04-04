'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import api from '@/lib/api';

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactForm>();

  const onSubmit = async (data: ContactForm) => {
    setIsSubmitting(true);
    try {
      await api.post('/contact', data);
      toast.success('Message sent successfully! We will get back to you soon.');
      reset();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to send message');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-primary-700">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Contact Us</h1>
            <p className="text-xl text-primary-100">
              Get in touch with us for any inquiries, suggestions, or to join our mission
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="py-20">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-1">
              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPinIcon className="w-6 h-6 text-primary-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold">Address</h3>
                    <p className="text-gray-600">
                      Mohammadpur, Ulchapara<br />
                      Brahmanbaria Sadar, Brahmanbaria 3400<br />
                      Chattogram Division, Bangladesh
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <PhoneIcon className="w-6 h-6 text-primary-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold">Phone</h3>
                    <p className="text-gray-600">+880 1234-567890</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <EnvelopeIcon className="w-6 h-6 text-primary-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold">Email</h3>
                    <p className="text-gray-600">info@msus.org.bd</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <ClockIcon className="w-6 h-6 text-primary-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold">Office Hours</h3>
                    <p className="text-gray-600">
                      Saturday - Thursday<br />
                      9:00 AM - 5:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-8 rounded-2xl shadow-lg"
              >
                <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="form-label">Your Name *</label>
                      <input
                        {...register('name', { required: 'Name is required' })}
                        className="form-input"
                        placeholder="John Doe"
                      />
                      {errors.name && <p className="form-error">{errors.name.message}</p>}
                    </div>

                    <div>
                      <label className="form-label">Your Email *</label>
                      <input
                        {...register('email', {
                          required: 'Email is required',
                          pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' }
                        })}
                        type="email"
                        className="form-input"
                        placeholder="john@example.com"
                      />
                      {errors.email && <p className="form-error">{errors.email.message}</p>}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="form-label">Phone Number</label>
                      <input
                        {...register('phone')}
                        type="tel"
                        className="form-input"
                        placeholder="+880 1XXX-XXXXXX"
                      />
                    </div>

                    <div>
                      <label className="form-label">Subject *</label>
                      <input
                        {...register('subject', { required: 'Subject is required' })}
                        className="form-input"
                        placeholder="How can we help?"
                      />
                      {errors.subject && <p className="form-error">{errors.subject.message}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="form-label">Your Message *</label>
                    <textarea
                      {...register('message', {
                        required: 'Message is required',
                        minLength: { value: 10, message: 'Message too short' }
                      })}
                      rows={6}
                      className="form-input"
                      placeholder="Write your message here..."
                    />
                    {errors.message && <p className="form-error">{errors.message.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full md:w-auto"
                  >
                    {isSubmitting ? (
                      <div className="spinner w-5 h-5 mr-2" />
                    ) : null}
                    Send Message
                  </button>
                </form>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
