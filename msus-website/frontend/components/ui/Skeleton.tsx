import React from 'react';
import { clsx } from 'clsx';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  circle?: boolean;
}

export default function Skeleton({
  className,
  width,
  height,
  circle = false,
}: SkeletonProps) {
  return (
    <div
      className={clsx(
        'animate-pulse bg-gray-200',
        circle ? 'rounded-full' : 'rounded-md',
        className
      )}
      style={{
        width: width,
        height: height,
      }}
    />
  );
}

// Skeleton text for loading paragraphs
export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={clsx('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height={16}
          className={i === lines - 1 ? 'w-4/5' : 'w-full'}
        />
      ))}
    </div>
  );
}

// Skeleton card for loading cards
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={clsx('bg-white rounded-lg shadow p-6 space-y-4', className)}>
      <Skeleton height={200} className="rounded-lg" />
      <Skeleton height={24} width="80%" />
      <SkeletonText lines={2} />
    </div>
  );
}
