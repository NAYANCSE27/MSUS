'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Card, { CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface Event {
  _id: string;
  title: string;
  slug: string;
  description: string;
  summary: string;
  category: string;
  eventType: string;
  startDate: string;
  endDate: string;
  location: {
    venue: string;
    address: string;
  };
  featuredImage: string;
  isAllDay: boolean;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchEvents();
  }, [filter]);

  const fetchEvents = async () => {
    try {
      const response = await fetch(`/api/events?status=published&category=${filter === 'all' ? '' : filter}`);
      if (response.ok) {
        const data = await response.json();
        setEvents(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { key: 'all', label: 'All Events' },
    { key: 'education', label: 'Education' },
    { key: 'healthcare', label: 'Healthcare' },
    { key: 'social_awareness', label: 'Social Awareness' },
    { key: 'sports', label: 'Sports' },
    { key: 'cultural', label: 'Cultural' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">Events & Activities</h1>
          <p className="mt-4 text-lg text-gray-600">
            Join us in our community development initiatives
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <Button
              key={category.key}
              variant={filter === category.key ? 'primary' : 'outline'}
              onClick={() => setFilter(category.key)}
              size="sm"
            >
              {category.label}
            </Button>
          ))}
        </div>

        {/* Events Grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Card key={event._id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-w-16 aspect-h-9 relative">
                <Image
                  src={event.featuredImage || '/placeholder-event.jpg'}
                  alt={event.title}
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 capitalize">
                    {event.category.replace('_', ' ')}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(event.startDate).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {event.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {event.summary || event.description}
                </p>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {event.location.venue}
                </div>
                <Link href={`/events/${event.slug}`}>
                  <Button className="w-full">
                    View Details
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {events.length === 0 && (
          <div className="text-center mt-12">
            <p className="text-gray-500">No events found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}