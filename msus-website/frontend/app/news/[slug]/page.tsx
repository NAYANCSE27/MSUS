'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import api from '@/lib/api';

interface Post {
  _id: string;
  title: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  category: string;
  publishedAt: string;
  author: {
    name: string;
    avatar?: string;
  };
  tags: string[];
  views: number;
}

export default function NewsDetailPage() {
  const { slug } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const fetchPost = async () => {
    try {
      const response = await api.get(`/posts/slug/${slug}`);
      setPost(response.data.data.post);
    } catch (error) {
      console.error('Failed to fetch post:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Post not found</h1>
          <p className="mt-2 text-gray-600">The post you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/news" className="mt-4 text-primary-600 hover:text-primary-700">
            Back to News
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <Link href="/" className="hover:text-gray-900">Home</Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/news" className="hover:text-gray-900">News</Link>
            </li>
            <li>/</li>
            <li className="text-gray-900 truncate max-w-xs">{post.title}</li>
          </ol>
        </nav>

        {/* Article */}
        <article className="bg-white rounded-xl shadow-lg overflow-hidden">
          {post.featuredImage && (
            <div className="relative h-96">
              <Image
                src={post.featuredImage}
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="p-8">
            {/* Meta */}
            <div className="flex items-center space-x-4 mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800 capitalize">
                {post.category.replace('_', ' ')}
              </span>
              <span className="text-gray-500">
                {format(new Date(post.publishedAt), 'MMMM dd, yyyy')}
              </span>
              <span className="text-gray-500">
                {post.views} views
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {post.title}
            </h1>

            {/* Author */}
            <div className="flex items-center mb-8 pb-8 border-b border-gray-200">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold">
                {post.author.name.charAt(0)}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{post.author.name}</p>
                <p className="text-sm text-gray-500">Author</p>
              </div>
            </div>

            {/* Content */}
            <div
              className="prose prose-lg max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <Link
            href="/news"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
          >
            ← Back to News
          </Link>
        </div>
      </div>
    </div>
  );
}
