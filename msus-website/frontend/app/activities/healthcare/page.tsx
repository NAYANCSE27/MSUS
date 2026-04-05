import { Metadata } from 'next';
import { HeartIcon } from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'Healthcare | MSUS',
  description: 'Free medical camps, health awareness programs, and medical assistance for needy families in Mohammadpur.',
};

const services = [
  {
    title: 'Free Medical Camps',
    description: 'Monthly health camps providing free check-ups, tests, and medicines.',
    icon: '🏥',
  },
  {
    title: 'Health Awareness',
    description: 'Workshops on nutrition, hygiene, and disease prevention.',
    icon: '📢',
  },
  {
    title: 'Blood Donation Drives',
    description: 'Regular blood donation camps to support local hospitals.',
    icon: '🩸',
  },
  {
    title: 'Emergency Medical Aid',
    description: 'Financial assistance for critical medical treatments.',
    icon: '🚑',
  },
];

const stats = [
  { value: '50+', label: 'Medical Camps' },
  { value: '5,000+', label: 'Patients Treated' },
  { value: '200+', label: 'Blood Units Collected' },
  { value: '30', label: 'Emergency Cases Aided' },
];

export default function HealthcarePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-red-600 to-red-800">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center text-white">
            <div className="text-6xl mb-6">🏥</div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              স্বাস্থ্যসেবা
            </h1>
            <p className="text-xl mb-4">Healthcare Services</p>
            <p className="text-red-100 text-lg">
              Ensuring access to quality healthcare for all members of our community.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-red-600 mb-2">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comprehensive healthcare services for the community.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow">
                <div className="text-5xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-red-600">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Support Healthcare</h2>
          <p className="text-red-100 mb-8 max-w-2xl mx-auto">
            Help us provide better healthcare services to our community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/donate" className="btn-primary bg-white text-red-600 hover:bg-gray-100">
              Donate for Healthcare
            </a>
            <a href="/register" className="btn-outline border-white text-white hover:bg-white/10">
              Become a Volunteer
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
