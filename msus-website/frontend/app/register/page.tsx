'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface RegisterForm {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  address: {
    village: string;
    postOffice: string;
    union: string;
    upazila: string;
    district: string;
    division: string;
  };
  dateOfBirth: string;
  gender: string;
  bloodGroup: string;
  occupation: string;
  education: string;
  bio: string;
  volunteerAreas: string[];
  emergencyContact: {
    name: string;
    phone: string;
    relation: string;
  };
}

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>();

  const password = watch('password');

  const onSubmit = async (data: RegisterForm) => {
    if (data.password !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await registerUser({
        ...data,
        volunteerAreas: data.volunteerAreas.filter(Boolean),
      });
      toast.success('Registration successful! Please wait for admin approval.');
      router.push('/login');
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Join MSUS
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Create your account to become a member
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <Input
              label="Full Name"
              {...register('name', { required: 'Name is required' })}
              error={errors.name?.message}
            />

            <Input
              label="Email"
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                  message: 'Invalid email address',
                },
              })}
              error={errors.email?.message}
            />

            <Input
              label="Phone"
              {...register('phone', { required: 'Phone is required' })}
              error={errors.phone?.message}
            />

            <Input
              label="Password"
              type="password"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
              error={errors.password?.message}
            />

            <Input
              label="Confirm Password"
              type="password"
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) => value === password || 'Passwords do not match',
              })}
              error={errors.confirmPassword?.message}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Village"
                {...register('address.village')}
              />
              <Input
                label="Post Office"
                {...register('address.postOffice')}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Union"
                {...register('address.union')}
              />
              <Input
                label="Upazila"
                {...register('address.upazila')}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="District"
                {...register('address.district')}
              />
              <Input
                label="Division"
                {...register('address.division')}
              />
            </div>

            <Input
              label="Date of Birth"
              type="date"
              {...register('dateOfBirth')}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Gender
              </label>
              <select
                {...register('gender')}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Blood Group
              </label>
              <select
                {...register('bloodGroup')}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="">Select Blood Group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>

            <Input
              label="Occupation"
              {...register('occupation')}
            />

            <Input
              label="Education"
              {...register('education')}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Bio
              </label>
              <textarea
                {...register('bio')}
                rows={3}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="Tell us about yourself..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Areas you'd like to volunteer in
              </label>
              <div className="space-y-2">
                {[
                  'education',
                  'healthcare',
                  'social',
                  'library',
                  'sports',
                  'antidrug',
                  'infrastructure',
                  'humanitarian',
                ].map((area) => (
                  <label key={area} className="flex items-center">
                    <input
                      type="checkbox"
                      {...register('volunteerAreas')}
                      value={area}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 capitalize">
                      {area.replace('_', ' ')}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-700">Emergency Contact</h4>
              <Input
                label="Contact Name"
                {...register('emergencyContact.name')}
              />
              <Input
                label="Contact Phone"
                {...register('emergencyContact.phone')}
              />
              <Input
                label="Relation"
                {...register('emergencyContact.relation')}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">Already have an account?</span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                href="/login"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-600 bg-white hover:bg-gray-50 border-gray-300"
              >
                Sign in instead
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}