import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Social Awareness | MSUS',
  description: 'Creating awareness on social issues, sanitation, and community development in Mohammadpur.',
};

const campaigns = [
  {
    title: 'Sanitation Awareness',
    description: 'Promoting proper sanitation practices and hygiene in the community.',
    icon: '🧼',
  },
  {
    title: 'Environmental Awareness',
    description: 'Tree planting drives and waste management initiatives.',
    icon: '🌳',
  },
  {
    title: 'Women Empowerment',
    description: 'Programs promoting gender equality and women\'s rights.',
    icon: '👩',
  },
  {
    title: 'Legal Awareness',
    description: 'Workshops on legal rights and community laws.',
    icon: '⚖️',
  },
];

const stats = [
  { value: '30+', label: 'Awareness Campaigns' },
  { value: '2,000+', label: 'People Reached' },
  { value: '50+', label: 'Workshops Conducted' },
  { value: '100', label: 'Trees Planted' },
];

export default function SocialAwarenessPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-purple-600 to-purple-800">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center text-white">
            <div className="text-6xl mb-6">📢</div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              সামাজিক সচেতনতা
            </h1>
            <p className="text-xl mb-4">Social Awareness</p>
            <p className="text-purple-100 text-lg">
              Creating awareness and driving positive change in our community.
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
                <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Campaigns */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Campaigns</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Various awareness programs to educate and empower our community.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {campaigns.map((campaign, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow">
                <div className="text-5xl mb-4">{campaign.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{campaign.title}</h3>
                <p className="text-gray-600">{campaign.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-purple-600">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Join the Movement</h2>
          <p className="text-purple-100 mb-8 max-w-2xl mx-auto">
            Be part of creating awareness in our community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/register" className="btn-primary bg-white text-purple-600 hover:bg-gray-100">
              Become a Volunteer
            </a>
            <a href="/events" className="btn-outline border-white text-white hover:bg-white/10">
              View Upcoming Events
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
