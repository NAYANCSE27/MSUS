import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Anti-Drug Campaign | MSUS',
  description: 'Campaigns and programs to prevent drug abuse in our community in Mohammadpur.',
};

const programs = [
  {
    title: 'Awareness Campaigns',
    description: 'Regular campaigns to educate youth about drug dangers.',
    icon: '📢',
  },
  {
    title: 'Counseling Services',
    description: 'Free counseling for individuals and families affected by drug abuse.',
    icon: '💬',
  },
  {
    title: 'Rehabilitation Support',
    description: 'Assistance for rehabilitation and reintegration.',
    icon: '🤝',
  },
  {
    title: 'Youth Engagement',
    description: 'Alternative activities to keep youth away from drugs.',
    icon: '🎯',
  },
];

const stats = [
  { value: '100+', label: 'Awareness Sessions' },
  { value: '500+', label: 'Youth Reached' },
  { value: '30', label: 'Counseling Cases' },
  { value: '10', label: 'Success Stories' },
];

export default function AntidrugPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-orange-600 to-orange-800">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center text-white">
            <div className="text-6xl mb-6">🚫</div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              মাদকবিরোধী ক্যাম্পেইন
            </h1>
            <p className="text-xl mb-4">Anti-Drug Campaign</p>
            <p className="text-orange-100 text-lg">
              Working together to create a drug-free community.
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
                <div className="text-3xl md:text-4xl font-bold text-orange-600 mb-2">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Programs</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comprehensive approach to preventing and addressing drug abuse.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {programs.map((program, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow">
                <div className="text-5xl mb-4">{program.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{program.title}</h3>
                <p className="text-gray-600">{program.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-orange-600">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Join the Fight</h2>
          <p className="text-orange-100 mb-8 max-w-2xl mx-auto">
            Support our anti-drug initiatives and help save lives.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/donate" className="btn-primary bg-white text-orange-600 hover:bg-gray-100">
              Support Our Work
            </a>
            <a href="/contact" className="btn-outline border-white text-white hover:bg-white/10">
              Report a Concern
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
