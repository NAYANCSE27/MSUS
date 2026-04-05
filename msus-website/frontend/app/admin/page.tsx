'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Card, { CardContent, CardHeader } from '@/components/ui/Card';
import {
  UsersIcon,
  BanknotesIcon,
  CalendarIcon,
  NewspaperIcon,
  PhotoIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline';
import api from '@/lib/api';

interface DashboardStats {
  members: {
    total: number;
    active: number;
    pending: number;
  };
  donations: {
    total: number;
    completed: number;
    totalAmount: number;
  };
  events: {
    total: number;
    upcoming: number;
  };
  posts: number;
  pendingContacts: number;
}

const adminModules = [
  { name: 'Users', icon: UsersIcon, href: '/admin/users', color: 'bg-blue-500' },
  { name: 'Donations', icon: BanknotesIcon, href: '/admin/donations', color: 'bg-green-500' },
  { name: 'Events', icon: CalendarIcon, href: '/admin/events', color: 'bg-purple-500' },
  { name: 'Posts', icon: NewspaperIcon, href: '/admin/posts', color: 'bg-yellow-500' },
  { name: 'Gallery', icon: PhotoIcon, href: '/admin/gallery', color: 'bg-pink-500' },
  { name: 'Messages', icon: EnvelopeIcon, href: '/admin/contacts', color: 'bg-orange-500' },
];

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
      router.push('/');
      return;
    }
    fetchStats();
  }, [user]);

  const fetchStats = async () => {
    try {
      const response = await api.get('/settings/stats');
      setStats(response.data.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  <UsersIcon className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Members</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.members.total || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 text-green-600">
                  <BanknotesIcon className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Donations</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ৳{(stats?.donations.totalAmount || 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                  <CalendarIcon className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Upcoming Events</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.events.upcoming || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-orange-100 text-orange-600">
                  <EnvelopeIcon className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Messages</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.pendingContacts || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Modules */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {adminModules.map((module) => (
            <Link key={module.name} href={module.href}>
              <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow text-center">
                <div className={`${module.color} w-12 h-12 rounded-lg mx-auto mb-4 flex items-center justify-center text-white`}>
                  <module.icon className="w-6 h-6" />
                </div>
                <p className="font-medium text-gray-900">{module.name}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Link href="/admin/events/create" className="btn-primary">
                Create Event
              </Link>
              <Link href="/admin/posts/create" className="btn-primary">
                Create Post
              </Link>
              <Link href="/admin/gallery/upload" className="btn-secondary">
                Upload Photos
              </Link>
              <Link href="/admin/settings" className="btn-secondary">
                Settings
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
