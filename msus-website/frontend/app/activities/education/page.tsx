import { Metadata } from 'next';
import { AcademicCapIcon } from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'Education Support | MSUS',
  description: 'Providing scholarships, free tuition, and educational materials for underprivileged students in Mohammadpur.',
};

const programs = [
  {
    title: 'Scholarship Program',
    description: 'Monthly stipends for meritorious students from low-income families.',
    icon: '🎓',
  },
  {
    title: 'Free Tuition Classes',
    description: 'After-school tutoring for students who need extra academic support.',
    icon: '📖',
  },
  {
    title: 'School Supplies Distribution',
    description: 'Annual distribution of books, notebooks, and stationery to needy students.',
    icon: '📚',
  },
  {
    title: 'Computer Literacy',
    description: 'Basic computer training for students to prepare them for the digital age.',
    icon: '💻',
  },
];

const stats = [
  { value: '250+', label: 'Students Supported' },
  { value: '50+', label: 'Scholarships Awarded' },
  { value: '100%', label: 'SSC Pass Rate' },
  { value: '20', label: 'Computer Training Centers' },
];

export default function EducationPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center text-white">
            <div className="text-6xl mb-6">🎓</div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              শিক্ষা সহায়তা
            </h1>
            <p className="text-xl mb-4">Education Support</p>
            <p className="text-blue-100 text-lg">
              Empowering the next generation through quality education and support for underprivileged students.
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
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">{stat.value}</div>
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
              We offer comprehensive educational support to help students achieve their academic goals.
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

      {/* Impact Story */}
      <section className="py-20">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Success Stories</h2>
            <div className="bg-white rounded-xl shadow-lg p-8">
              <blockquote className="text-lg text-gray-600 italic mb-6">
                "Thanks to MSUS scholarship, I was able to complete my SSC with GPA 5.0.
                Now I'm studying at a reputed college, dreaming of becoming a doctor."
              </blockquote>
              <div className="flex items-center justify-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                  SR
                </div>
                <div className="ml-4 text-left">
                  <div className="font-semibold text-gray-900">Sumaiya Rahman</div>
                  <div className="text-sm text-gray-500">Scholarship Recipient</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-blue-600">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Support Education</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Your contribution can help a child get the education they deserve.
            Join us in building a brighter future.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/donate" className="btn-primary bg-white text-blue-600 hover:bg-gray-100">
              Donate for Education
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
