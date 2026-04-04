import { Metadata } from 'next';
import Image from 'next/image';
import { CheckCircleIcon, HeartIcon, UsersIcon, LightBulbIcon } from '@heroicons/react/24/solid';

export const metadata: Metadata = {
  title: 'About Us | MSUS',
  description: 'Learn about Mohammadpur Samaj Unnayan Sangathan - our mission, vision, and the work we do for community development.',
};

const values = [
  {
    icon: HeartIcon,
    title: 'Compassion',
    description: 'We serve with empathy and care for those in need.',
  },
  {
    icon: UsersIcon,
    title: 'Community',
    description: 'United we stand, together we grow stronger.',
  },
  {
    icon: LightBulbIcon,
    title: 'Innovation',
    description: 'Finding creative solutions to community challenges.',
  },
];

const milestones = [
  { year: '2020', event: 'Organization Founded' },
  { year: '2021', event: 'First Scholarship Program' },
  { year: '2022', event: 'Library Established' },
  { year: '2023', event: '500+ Members Milestone' },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-primary-700">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              About MSUS
            </h1>
            <p className="text-xl text-primary-100">
              Working together for the development of Mohammadpur, Ulchapara, Brahmanbaria
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-primary-600 font-semibold uppercase">Our Mission</span>
              <h2 className="text-3xl font-bold mt-2 mb-4">
                Empowering Communities Through Service
              </h2>
              <p className="text-gray-600 mb-6">
                Our mission is to create a self-reliant, educated, and healthy community
                by addressing key areas including education, healthcare, social awareness,
                and infrastructure development.
              </p>
              <ul className="space-y-3">
                {[
                  'Provide quality education to underprivileged students',
                  'Ensure healthcare access for all community members',
                  'Create awareness on social issues',
                  'Develop community infrastructure',
                ].map((item, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <CheckCircleIcon className="w-5 h-5 text-primary-600 mr-2" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative h-96 rounded-2xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800"
                alt="Community Work"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="text-primary-600 font-semibold uppercase">Our Values</span>
            <h2 className="text-3xl font-bold mt-2">What We Stand For</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center p-8 bg-white rounded-xl shadow-sm">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center">
                  <value.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="text-primary-600 font-semibold uppercase">Our Journey</span>
            <h2 className="text-3xl font-bold mt-2">Milestones</h2>
          </div>

          <div className="max-w-3xl mx-auto">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-center mb-8 last:mb-0">
                <div className="w-24 text-right pr-6">
                  <span className="text-2xl font-bold text-primary-600">{milestone.year}</span>
                </div>
                <div className="w-4 h-4 bg-primary-600 rounded-full relative">
                  <div className="absolute w-px h-16 bg-primary-200 top-4 left-1/2 transform -translate-x-1/2" />
                </div>
                <div className="flex-1 pl-6">
                  <p className="text-lg text-gray-700">{milestone.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
