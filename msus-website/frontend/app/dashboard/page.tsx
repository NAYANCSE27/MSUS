'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import Card, { CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface DashboardStats {
  totalEvents: number;
  upcomingEvents: number;
  totalDonations: number;
  membershipStatus: string;
}

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    // Fetch dashboard stats
    fetchStats();
  }, [user, router]);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/dashboard/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
              Welcome back, {user.name}!
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Membership ID: {user.membershipId || 'Pending Approval'}
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <Button onClick={logout} variant="outline">
              Logout
            </Button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <h3 className="text-sm font-medium text-gray-500">Membership Status</h3>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 capitalize">
                {user.status}
              </div>
              <p className="text-xs text-gray-500">
                Role: {user.role}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-sm font-medium text-gray-500">Events Attended</h3>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {user.participatedEvents?.length || 0}
              </div>
              <p className="text-xs text-gray-500">
                Total events participated
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-sm font-medium text-gray-500">Donations Made</h3>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {user.donations?.length || 0}
              </div>
              <p className="text-xs text-gray-500">
                Total donations
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-sm font-medium text-gray-500">Volunteer Hours</h3>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {user.volunteerHours || 0}
              </div>
              <p className="text-xs text-gray-500">
                Hours contributed
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Link href="/events">
                  <Button variant="outline" className="w-full justify-start">
                    View Events
                  </Button>
                </Link>
                <Link href="/donate">
                  <Button variant="outline" className="w-full justify-start">
                    Make a Donation
                  </Button>
                </Link>
                <Link href="/news">
                  <Button variant="outline" className="w-full justify-start">
                    Read News & Updates
                  </Button>
                </Link>
                <Link href="/gallery">
                  <Button variant="outline" className="w-full justify-start">
                    View Gallery
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {user.participatedEvents?.slice(0, 3).map((event: any) => (
                  <div key={event._id} className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={event.featuredImage || '/placeholder-event.jpg'}
                        alt={event.title}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        Attended: {event.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(event.startDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )) || (
                  <p className="text-sm text-gray-500">No recent activity</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {user.role === 'admin' || user.role === 'superadmin' ? (
          <div className="mt-8">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-medium text-gray-900">Admin Panel</h3>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <Link href="/admin/users">
                    <Button variant="outline" className="w-full">
                      Manage Users
                    </Button>
                  </Link>
                  <Link href="/admin/events">
                    <Button variant="outline" className="w-full">
                      Manage Events
                    </Button>
                  </Link>
                  <Link href="/admin/posts">
                    <Button variant="outline" className="w-full">
                      Manage Posts
                    </Button>
                  </Link>
                  <Link href="/admin/donations">
                    <Button variant="outline" className="w-full">
                      View Donations
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : null}
      </div>
    </div>
  );
}