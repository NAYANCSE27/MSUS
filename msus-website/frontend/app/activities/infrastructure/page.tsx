import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Infrastructure Development | MSUS',
  description: 'Building roads, sanitation facilities, and community infrastructure in Mohammadpur.',
};

const projects = [
  {
    title: 'Road Development',
    description: 'Construction and maintenance of village roads and pathways.',
    icon: '🛣️',
  },
  {
    title: 'Sanitation Facilities',
    description: 'Building public toilets and promoting hygiene infrastructure.',
    icon: '🚿',
  },
  {
    title: 'Community Centers',
    description: 'Establishing multipurpose community centers.',
    icon: '🏢',
  },
  {
    title: 'Drainage Systems',
    description: 'Improving drainage to prevent waterlogging.',
    icon: '🚰',
  },
];

const stats = [
  { value: '15', label: 'Km Roads Built' },
  { value: '20+', label: 'Sanitation Units' },
  { value: '5', label: 'Community Centers' },
  { value: '10', label: 'Drainage Projects' },
];

export default function InfrastructurePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-cyan-600 to-cyan-800">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center text-white">
            <div className="text-6xl mb-6">🏗️</div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              অবকাঠামো উন্নয়ন
            </h1>
            <p className="text-xl mb-4">Infrastructure Development</p>
            <p className="text-cyan-100 text-lg">
              Building the foundation for a better community.
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
                <div className="text-3xl md:text-4xl font-bold text-cyan-600 mb-2">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Projects</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Infrastructure projects that improve the quality of life for our community.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow">
                <div className="text-5xl mb-4">{project.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{project.title}</h3>
                <p className="text-gray-600">{project.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-cyan-600">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Support Development</h2>
          <p className="text-cyan-100 mb-8 max-w-2xl mx-auto">
            Help us build better infrastructure for our community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/donate" className="btn-primary bg-white text-cyan-600 hover:bg-gray-100">
              Donate for Infrastructure
            </a>
            <a href="/contact" className="btn-outline border-white text-white hover:bg-white/10">
              Suggest a Project
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
