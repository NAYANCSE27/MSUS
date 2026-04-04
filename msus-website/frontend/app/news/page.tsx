'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Card, { CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface Post {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  featuredImage: string;
  author: {
    name: string;
    avatar?: string;
  };
  publishedAt: string;
  tags: string[];
}

export default function NewsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchPosts();
  }, [filter]);

  const fetchPosts = async () => {
    try {
      const response = await fetch(`/api/posts?status=published&category=${filter === 'all' ? '' : filter}`);
      if (response.ok) {
        const data = await response.json();
        setPosts(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { key: 'all', label: 'All Posts' },
    { key: 'news', label: 'News' },
    { key: 'blog', label: 'Blog' },
    { key: 'announcement', label: 'Announcements' },
    { key: 'success_story', label: 'Success Stories' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">News & Updates</h1>
          <p className="mt-4 text-lg text-gray-600">
            Stay informed about our latest activities and community initiatives
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

        {/* Posts Grid */}
        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {posts.map((post) => (
            <Card key={post._id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="md:flex">
                <div className="md:flex-shrink-0">
                  <div className="h-48 w-full md:w-48 relative">
                    <Image
                      src={post.featuredImage || '/placeholder-post.jpg'}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="p-6 flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 capitalize">
                      {post.category.replace('_', ' ')}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(post.publishedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {post.author.avatar && (
                        <img
                          className="h-6 w-6 rounded-full"
                          src={post.author.avatar}
                          alt={post.author.name}
                        />
                      )}
                      <span className="text-sm text-gray-500">
                        By {post.author.name}
                      </span>
                    </div>
                    <Link href={`/news/${post.slug}`}>
                      <Button size="sm">
                        Read More
                      </Button>
                    </Link>
                  </div>
                  {post.tags && post.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center mt-12">
            <p className="text-gray-500">No posts found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}