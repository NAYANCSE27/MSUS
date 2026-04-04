'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Card, { CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface ActivityModule {
  _id: string;
  type: string;
  name: {
    en: string;
    bn: string;
  };
  shortDescription: {
    en: string;
    bn: string;
  };
  description: {
    en: string;
    bn: string;
  };
  stats: {
    beneficiaries: number;
    completedProjects: number;
    ongoingProjects: number;
    volunteers: number;
    fundsRaised: number;
  };
  displayOrder: number;
}

const activityIcons = {
  education: '🎓',
  healthcare: '🏥',
  social_awareness: '📢',
  library: '📚',
  sports: '⚽',
  cultural: '🎭',
  antidrug: '🚫',
  infrastructure: '🏗️',
  humanitarian: '🤝',
};

export default function ActivitiesPage() {
  const [modules, setModules] = useState<ActivityModule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      const response = await fetch('/api/modules');
      if (response.ok) {
        const data = await response.json();
        setModules(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch modules:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading activities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">Our Activities</h1>
          <p className="mt-4 text-lg text-gray-600">
            Discover our comprehensive community development programs
          </p>
        </div>

        {/* Activities Grid */}
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((module) => (
            <Card key={module._id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">
                    {activityIcons[module.type as keyof typeof activityIcons] || '📋'}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {module.name.en}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {module.name.bn}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6">
                  {module.shortDescription.en}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600">
                      {module.stats.beneficiaries.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">Beneficiaries</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600">
                      {module.stats.completedProjects}
                    </div>
                    <div className="text-xs text-gray-500">Projects</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600">
                      {module.stats.volunteers}
                    </div>
                    <div className="text-xs text-gray-500">Volunteers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600">
                      ৳{module.stats.fundsRaised.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">Funds Raised</div>
                  </div>
                </div>

                <Link href={`/activities/${module.type}`}>
                  <Button className="w-full">
                    Learn More
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 bg-primary-600 rounded-lg p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Join Our Mission</h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            Be part of our community development efforts. Whether through volunteering,
            donations, or participation in our programs, your contribution matters.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button variant="secondary" size="lg">
                Become a Member
              </Button>
            </Link>
            <Link href="/donate">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary-600">
                Make a Donation
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}