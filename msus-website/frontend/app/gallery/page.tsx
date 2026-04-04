'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface GalleryItem {
  _id: string;
  title: string;
  description?: string;
  imageUrl: string;
  category: string;
  event?: {
    title: string;
  };
  uploadedAt: string;
}

export default function GalleryPage() {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  useEffect(() => {
    fetchGallery();
  }, [filter]);

  const fetchGallery = async () => {
    try {
      const response = await fetch(`/api/gallery?category=${filter === 'all' ? '' : filter}`);
      if (response.ok) {
        const data = await response.json();
        setGallery(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch gallery:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { key: 'all', label: 'All Photos' },
    { key: 'events', label: 'Events' },
    { key: 'activities', label: 'Activities' },
    { key: 'community', label: 'Community' },
    { key: 'education', label: 'Education' },
    { key: 'healthcare', label: 'Healthcare' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">Photo Gallery</h1>
          <p className="mt-4 text-lg text-gray-600">
            Capturing moments from our community development activities
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

        {/* Gallery Grid */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {gallery.map((item) => (
            <Card
              key={item._id}
              className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedImage(item)}
            >
              <div className="aspect-w-1 aspect-h-1 relative">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-opacity flex items-center justify-center">
                  <svg className="w-8 h-8 text-white opacity-0 hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-900 mb-1">{item.title}</h3>
                {item.event && (
                  <p className="text-sm text-gray-600 mb-1">Event: {item.event.title}</p>
                )}
                <p className="text-xs text-gray-500 capitalize">{item.category}</p>
              </div>
            </Card>
          ))}
        </div>

        {gallery.length === 0 && (
          <div className="text-center mt-12">
            <p className="text-gray-500">No photos found in this category.</p>
          </div>
        )}

        {/* Image Modal */}
        {selectedImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75" onClick={() => setSelectedImage(null)}>
            <div className="relative max-w-4xl max-h-full" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-10 text-white hover:text-gray-300"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="relative">
                <Image
                  src={selectedImage.imageUrl}
                  alt={selectedImage.title}
                  width={800}
                  height={600}
                  className="max-w-full max-h-screen object-contain"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-4">
                  <h3 className="text-lg font-semibold mb-1">{selectedImage.title}</h3>
                  {selectedImage.description && (
                    <p className="text-sm mb-2">{selectedImage.description}</p>
                  )}
                  {selectedImage.event && (
                    <p className="text-sm">Event: {selectedImage.event.title}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}