import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Humanitarian Aid | MSUS',
  description: 'Emergency relief, Zakat distribution, and aid for vulnerable community members in Mohammadpur.',
};

const services = [
  {
    title: 'Emergency Relief',
    description: 'Immediate assistance during natural disasters and emergencies.',
    icon: '🆘',
  },
  {
    title: 'Zakat Distribution',
    description: 'Proper collection and distribution of Zakat to eligible recipients.',
    icon: '🤲',
  },
  {
    title: 'Food Support',
    description: 'Monthly food packages for needy families.',
    icon: '🍚',
  },
  {
    title: 'Winter Aid',
    description: 'Distribution of blankets and warm clothes during winter.',
    icon: '🧥',
  },
];

const stats = [
  { value: '500+', label: 'Families Helped' },
  { value: '2M+', label: 'BDT Distributed' },
  { value: '10', label: 'Emergency Responses' },
  { value: '100%', label: 'Zakat Efficiency' },
];

export default function HumanitarianPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-rose-600 to-rose-800">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center text-white">
            <div className="text-6xl mb-6">🤝</div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              মানবিক সহায়তা
            </h1>
            <p className="text-xl mb-4">Humanitarian Aid</p>
            <p className="text-rose-100 text-lg">
              Standing by our community in times of need.
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
                <div className="text-3xl md:text-4xl font-bold text-rose-600 mb-2">{stat.value}</div>
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
              Comprehensive humanitarian assistance for those in need.
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
      <section className="py-20 bg-rose-600">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Give Zakat</h2>
          <p className="text-rose-100 mb-8 max-w-2xl mx-auto">
            Give your Zakat through us. 100% of your donation reaches those in need.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/donate" className="btn-primary bg-white text-rose-600 hover:bg-gray-100">
              Donate Zakat
            </a>
            <a href="/contact" className="btn-outline border-white text-white hover:bg-white/10">
              Request Aid
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
