import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sports & Cultural Activities | MSUS',
  description: 'Sports competitions and cultural events for youth development in Mohammadpur.',
};

const activities = [
  {
    title: 'Sports Competitions',
    description: 'Annual tournaments in cricket, football, and traditional games.',
    icon: '🏆',
  },
  {
    title: 'Cultural Programs',
    description: 'Music, dance, and drama performances celebrating our heritage.',
    icon: '🎭',
  },
  {
    title: 'Youth Festivals',
    description: 'Inter-school competitions and talent shows.',
    icon: '🎉',
  },
  {
    title: 'Arts & Crafts',
    description: 'Workshops on traditional arts and crafts.',
    icon: '🎨',
  },
];

const stats = [
  { value: '20+', label: 'Tournaments' },
  { value: '500+', label: 'Participants' },
  { value: '15', label: 'Cultural Events' },
  { value: '50', label: 'Youth Trained' },
];

export default function SportsCulturalPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-green-600 to-green-800">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center text-white">
            <div className="text-6xl mb-6">⚽</div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              ক্রীড়া ও সাংস্কৃতিক কার্যক্রম
            </h1>
            <p className="text-xl mb-4">Sports & Cultural Activities</p>
            <p className="text-green-100 text-lg">
              Promoting physical fitness and celebrating our cultural heritage.
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
                <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Activities */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Activities</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Sports and cultural programs for holistic youth development.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {activities.map((activity, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow">
                <div className="text-5xl mb-4">{activity.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{activity.title}</h3>
                <p className="text-gray-600">{activity.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-green-600">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Join Our Teams</h2>
          <p className="text-green-100 mb-8 max-w-2xl mx-auto">
            Participate in our sports teams or cultural programs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/events" className="btn-primary bg-white text-green-600 hover:bg-gray-100">
              View Events
            </a>
            <a href="/register" className="btn-outline border-white text-white hover:bg-white/10">
              Become a Member
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
