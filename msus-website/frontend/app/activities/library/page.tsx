import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Library | MSUS',
  description: 'Community library with books, computers, and educational resources for all in Mohammadpur.',
};

const resources = [
  {
    title: 'Book Collection',
    description: 'Over 2,000 books covering various subjects and genres.',
    icon: '📚',
  },
  {
    title: 'Computer Lab',
    description: 'Free computer access for students and job seekers.',
    icon: '💻',
  },
  {
    title: 'Reading Room',
    description: 'Quiet study space for students and researchers.',
    icon: '📖',
  },
  {
    title: 'Newspaper & Magazine',
    description: 'Daily newspapers and monthly magazines.',
    icon: '📰',
  },
];

const stats = [
  { value: '2,000+', label: 'Books' },
  { value: '500+', label: 'Members' },
  { value: '20', label: 'Computers' },
  { value: '50', label: 'Daily Visitors' },
];

export default function LibraryPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-amber-600 to-amber-800">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center text-white">
            <div className="text-6xl mb-6">📚</div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              গ্রন্থাগার
            </h1>
            <p className="text-xl mb-4">Community Library</p>
            <p className="text-amber-100 text-lg">
              A hub of knowledge and learning for the entire community.
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
                <div className="text-3xl md:text-4xl font-bold text-amber-600 mb-2">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Resources */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Library Resources</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Free access to books, computers, and learning resources.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {resources.map((resource, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow">
                <div className="text-5xl mb-4">{resource.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{resource.title}</h3>
                <p className="text-gray-600">{resource.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-amber-600">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Visit Our Library</h2>
          <p className="text-amber-100 mb-8 max-w-2xl mx-auto">
            Open daily from 9 AM to 8 PM. Membership is free for all residents.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/contact" className="btn-primary bg-white text-amber-600 hover:bg-gray-100">
              Get Directions
            </a>
            <a href="/donate" className="btn-outline border-white text-white hover:bg-white/10">
              Donate Books
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
