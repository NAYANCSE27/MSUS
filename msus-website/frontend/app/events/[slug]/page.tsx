'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import Card, { CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

interface Event {
  _id: string;
  title: string;
  description: string;
  category: string;
  eventType: string;
  startDate: string;
  endDate: string;
  location: {
    venue: string;
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
    mapUrl?: string;
  };
  featuredImage: string;
  gallery: string[];
  videoUrl?: string;
  isAllDay: boolean;
}

export default function EventDetailPage() {
  const { slug } = useParams();
  const { user } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchEvent();
    }
  }, [slug]);

  const fetchEvent = async () => {
    try {
      const response = await fetch(`/api/events/${slug}`);
      if (response.ok) {
        const data = await response.json();
        setEvent(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch event:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!user) {
      toast.error('Please login to register for events');
      return;
    }

    setRegistering(true);
    try {
      const response = await fetch(`/api/events/${event?._id}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        toast.success('Successfully registered for the event!');
        fetchEvent(); // Refresh event data
      } else {
        const error = await response.json();
        toast.error(error.error || 'Registration failed');
      }
    } catch (error) {
      toast.error('Registration failed');
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading event...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Event not found</h1>
          <p className="mt-2 text-gray-600">The event you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const isRegistered = user?.participatedEvents?.includes(event._id);
  const eventDate = new Date(event.startDate);
  const isUpcoming = eventDate > new Date();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="relative h-96 mb-8 rounded-lg overflow-hidden">
          <Image
            src={event.featuredImage || '/placeholder-event.jpg'}
            alt={event.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="flex items-center space-x-2 mb-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white text-gray-900 capitalize">
                {event.category.replace('_', ' ')}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {event.eventType}
              </span>
            </div>
            <h1 className="text-4xl font-bold mb-2">{event.title}</h1>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {event.isAllDay
                  ? eventDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
                  : eventDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                }
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {event.location.venue}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-bold text-gray-900">About This Event</h2>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-line">{event.description}</p>
                </div>

                {event.videoUrl && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-4">Event Video</h3>
                    <div className="aspect-w-16 aspect-h-9">
                      <iframe
                        src={event.videoUrl}
                        className="w-full h-full rounded-lg"
                        allowFullScreen
                      />
                    </div>
                  </div>
                )}

                {event.gallery && event.gallery.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-4">Event Gallery</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {event.gallery.map((image, index) => (
                        <div key={index} className="aspect-w-1 aspect-h-1 relative rounded-lg overflow-hidden">
                          <Image
                            src={image}
                            alt={`Event image ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Event Details</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900">Date & Time</h4>
                  <p className="text-sm text-gray-600">
                    {event.isAllDay
                      ? `${eventDate.toLocaleDateString()} (All day)`
                      : `${eventDate.toLocaleDateString()} at ${eventDate.toLocaleTimeString()}`
                    }
                  </p>
                  {event.endDate && event.endDate !== event.startDate && (
                    <p className="text-sm text-gray-600">
                      Ends: {new Date(event.endDate).toLocaleDateString()}
                    </p>
                  )}
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">Location</h4>
                  <p className="text-sm text-gray-600">{event.location.venue}</p>
                  <p className="text-sm text-gray-600">{event.location.address}</p>
                  {event.location.mapUrl && (
                    <a
                      href={event.location.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary-600 hover:text-primary-500"
                    >
                      View on map
                    </a>
                  )}
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">Category</h4>
                  <p className="text-sm text-gray-600 capitalize">
                    {event.category.replace('_', ' ')}
                  </p>
                </div>
              </CardContent>
            </Card>

            {isUpcoming && (
              <Card>
                <CardContent className="pt-6">
                  {user ? (
                    isRegistered ? (
                      <div className="text-center">
                        <div className="text-green-600 mb-2">
                          <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <p className="text-sm text-gray-600">You're registered for this event!</p>
                      </div>
                    ) : (
                      <Button
                        onClick={handleRegister}
                        disabled={registering}
                        className="w-full"
                      >
                        {registering ? 'Registering...' : 'Register for Event'}
                      </Button>
                    )
                  ) : (
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-4">
                        Please login to register for this event
                      </p>
                      <Button as="a" href="/login" className="w-full">
                        Login to Register
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}