'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/context/AuthContext';
import Card, { CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import toast from 'react-hot-toast';

interface DonationForm {
  amount: number;
  paymentMethod: 'bkash' | 'stripe' | 'bank';
  isAnonymous: boolean;
  showInPublicList: boolean;
  donorName: string;
  donorEmail: string;
  donorPhone: string;
  purpose: string;
}

export default function DonatePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<DonationForm>({
    defaultValues: {
      amount: 0,
      paymentMethod: 'bkash',
      isAnonymous: false,
      showInPublicList: true,
      donorName: user?.name || '',
      donorEmail: user?.email || '',
      donorPhone: user?.phone || '',
    },
  });

  const paymentMethod = watch('paymentMethod');
  const isAnonymous = watch('isAnonymous');

  const suggestedAmounts = [500, 1000, 2000, 5000];

  const onSubmit = async (data: DonationForm) => {
    setLoading(true);
    try {
      const response = await fetch('/api/donations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();

        if (data.paymentMethod === 'stripe' && result.data.clientSecret) {
          // Handle Stripe payment
          toast.success('Redirecting to payment...');
          // In a real implementation, you'd integrate with Stripe Elements here
          console.log('Stripe payment intent:', result.data.clientSecret);
        } else if (data.paymentMethod === 'bkash') {
          // Handle bKash payment
          toast.success('Redirecting to bKash...');
          console.log('bKash URL:', result.data.bkashURL);
        } else {
          // Bank transfer
          toast.success('Donation recorded! Please complete the bank transfer.');
        }
      } else {
        const error = await response.json();
        toast.error(error.error || 'Donation failed');
      }
    } catch (error) {
      toast.error('Donation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Make a Donation</h1>
          <p className="mt-4 text-lg text-gray-600">
            Your contribution helps us continue our community development work
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Donation Form */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold text-gray-900">Donation Details</h2>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Amount Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select Amount (BDT)
                  </label>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {suggestedAmounts.map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => {
                          setSelectedAmount(amount);
                          setValue('amount', amount);
                        }}
                        className={`p-3 text-center border rounded-md transition-colors ${
                          selectedAmount === amount
                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        ৳{amount}
                      </button>
                    ))}
                  </div>
                  <Input
                    type="number"
                    placeholder="Enter custom amount"
                    {...register('amount', {
                      required: 'Amount is required',
                      min: { value: 100, message: 'Minimum donation is ৳100' },
                    })}
                    error={errors.amount?.message}
                  />
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Payment Method
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="bkash"
                        {...register('paymentMethod')}
                        className="text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2">bKash</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="stripe"
                        {...register('paymentMethod')}
                        className="text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2">Credit/Debit Card (Stripe)</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="bank"
                        {...register('paymentMethod')}
                        className="text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2">Bank Transfer</span>
                    </label>
                  </div>
                </div>

                {/* Donor Information */}
                {!isAnonymous && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Donor Information</h3>
                    <Input
                      label="Full Name"
                      {...register('donorName', { required: !isAnonymous && 'Name is required' })}
                      error={errors.donorName?.message}
                    />
                    <Input
                      label="Email"
                      type="email"
                      {...register('donorEmail', {
                        required: !isAnonymous && 'Email is required',
                        pattern: {
                          value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                          message: 'Invalid email address',
                        },
                      })}
                      error={errors.donorEmail?.message}
                    />
                    <Input
                      label="Phone"
                      {...register('donorPhone', { required: !isAnonymous && 'Phone is required' })}
                      error={errors.donorPhone?.message}
                    />
                  </div>
                )}

                {/* Purpose */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Purpose (Optional)
                  </label>
                  <select
                    {...register('purpose')}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  >
                    <option value="">General Donation</option>
                    <option value="education">Education Support</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="zakat">Zakat</option>
                    <option value="infrastructure">Infrastructure</option>
                    <option value="humanitarian">Humanitarian Aid</option>
                  </select>
                </div>

                {/* Options */}
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      {...register('isAnonymous')}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Make this donation anonymous</span>
                  </label>
                  {!isAnonymous && (
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        {...register('showInPublicList')}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Show my name in public donor list</span>
                    </label>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Processing...' : `Donate ৳${watch('amount') || 0}`}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Information Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">Why Donate?</h3>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2">•</span>
                    Support education for underprivileged children
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2">•</span>
                    Provide healthcare assistance to needy families
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2">•</span>
                    Help build community infrastructure
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2">•</span>
                    Support anti-drug campaigns and awareness programs
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2">•</span>
                    Aid in humanitarian relief efforts
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">Payment Information</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                {paymentMethod === 'bkash' && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">bKash Payment</h4>
                    <p className="text-sm text-gray-600">
                      You will be redirected to bKash for secure payment processing.
                    </p>
                  </div>
                )}

                {paymentMethod === 'stripe' && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Card Payment</h4>
                    <p className="text-sm text-gray-600">
                      Secure payment processing via Stripe. We accept all major credit and debit cards.
                    </p>
                  </div>
                )}

                {paymentMethod === 'bank' && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Bank Transfer</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Transfer to our bank account:
                    </p>
                    <div className="text-sm bg-gray-50 p-3 rounded">
                      <p><strong>Account Name:</strong> Mohammadpur Samaj Unnayan Sangathan</p>
                      <p><strong>Account Number:</strong> 1234567890123</p>
                      <p><strong>Bank:</strong> Dutch-Bangla Bank Ltd.</p>
                      <p><strong>Branch:</strong> Brahmanbaria Branch</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">Tax Benefits</h3>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Donations to MSUS are eligible for tax deductions under the Income Tax Ordinance.
                  Keep your donation receipt for tax purposes.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}