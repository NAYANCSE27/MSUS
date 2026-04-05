'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card, { CardContent, CardHeader } from '@/components/ui/Card';
import { Tabs, TabList, Tab, TabPanel } from '@/components/ui/Tabs';
import api from '@/lib/api';

interface ProfileForm {
  name: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  bloodGroup: string;
  occupation: string;
  education: string;
  bio: string;
  address: {
    village: string;
    postOffice: string;
    union: string;
    upazila: string;
    district: string;
    division: string;
  };
  emergencyContact: {
    name: string;
    phone: string;
    relation: string;
  };
}

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState<any>(null);

  const { register: registerProfile, handleSubmit: handleProfileSubmit, reset: resetProfile } = useForm<ProfileForm>();
  const { register: registerPassword, handleSubmit: handlePasswordSubmit, reset: resetPassword } = useForm<PasswordForm>();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/auth/me');
      setProfileData(response.data.data);
      resetProfile(response.data.data);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };

  const onUpdateProfile = async (data: ProfileForm) => {
    setLoading(true);
    try {
      await api.put('/auth/update', data);
      toast.success('Profile updated successfully!');
      fetchProfile();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const onUpdatePassword = async (data: PasswordForm) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setPasswordLoading(true);
    try {
      await api.put('/auth/password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success('Password updated successfully!');
      resetPassword();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      suspended: 'bg-red-100 text-red-800',
      inactive: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || colors.inactive;
  };

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center text-3xl font-bold text-primary-600">
              {profileData.name?.charAt(0).toUpperCase()}
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-2xl font-bold text-gray-900">{profileData.name}</h1>
              <p className="text-gray-500">{profileData.email}</p>
              <div className="mt-2 flex items-center justify-center md:justify-start space-x-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(profileData.status)}`}>
                  {profileData.status}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800 capitalize">
                  {profileData.role}
                </span>
              </div>
              {profileData.membershipId && (
                <p className="mt-2 text-sm text-gray-600">
                  Membership ID: <span className="font-semibold">{profileData.membershipId}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultTab="profile">
          <TabList>
            <Tab value="profile">Profile Information</Tab>
            <Tab value="password">Change Password</Tab>
            <Tab value="activity">Activity</Tab>
          </TabList>

          <TabPanel value="profile">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileSubmit(onUpdateProfile)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Full Name"
                      {...registerProfile('name', { required: true })}
                    />
                    <Input
                      label="Phone"
                      {...registerProfile('phone', { required: true })}
                    />

                    <Input
                      label="Date of Birth"
                      type="date"
                      {...registerProfile('dateOfBirth')}
                    />

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                      <select
                        {...registerProfile('gender')}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                      <select
                        {...registerProfile('bloodGroup')}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      >
                        <option value="">Select Blood Group</option>
                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                          <option key={bg} value={bg}>{bg}</option>
                        ))}
                      </select>
                    </div>

                    <Input
                      label="Occupation"
                      {...registerProfile('occupation')}
                    />

                    <Input
                      label="Education"
                      {...registerProfile('education')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                    <textarea
                      {...registerProfile('bio')}
                      rows={3}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Address</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Village"
                        {...registerProfile('address.village')}
                      />
                      <Input
                        label="Post Office"
                        {...registerProfile('address.postOffice')}
                      />
                      <Input
                        label="Union"
                        {...registerProfile('address.union')}
                      />
                      <Input
                        label="Upazila"
                        {...registerProfile('address.upazila')}
                      />
                      <Input
                        label="District"
                        {...registerProfile('address.district')}
                      />
                      <Input
                        label="Division"
                        {...registerProfile('address.division')}
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Emergency Contact</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <Input
                        label="Contact Name"
                        {...registerProfile('emergencyContact.name')}
                      />
                      <Input
                        label="Contact Phone"
                        {...registerProfile('emergencyContact.phone')}
                      />
                      <Input
                        label="Relation"
                        {...registerProfile('emergencyContact.relation')}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={loading}>
                      {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabPanel>

          <TabPanel value="password">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-bold text-gray-900">Change Password</h2>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordSubmit(onUpdatePassword)} className="space-y-6 max-w-md">
                  <Input
                    label="Current Password"
                    type="password"
                    {...registerPassword('currentPassword', { required: true })}
                  />
                  <Input
                    label="New Password"
                    type="password"
                    {...registerPassword('newPassword', {
                      required: true,
                      minLength: { value: 6, message: 'Password must be at least 6 characters' },
                    })}
                  />
                  <Input
                    label="Confirm New Password"
                    type="password"
                    {...registerPassword('confirmPassword', { required: true })}
                  />

                  <Button type="submit" disabled={passwordLoading}>
                    {passwordLoading ? 'Updating...' : 'Update Password'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabPanel>

          <TabPanel value="activity">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
              </CardHeader>
              <CardContent>
                {profileData.participatedEvents?.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No recent activity to display.</p>
                ) : (
                  <div className="space-y-4">
                    {profileData.participatedEvents?.map((event: any) => (
                      <div key={event._id} className="flex items-center p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{event.title}</h4>
                          <p className="text-sm text-gray-500">
                            {new Date(event.startDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
}
