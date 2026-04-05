import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard | MSUS',
  description: 'Admin dashboard for MSUS website management',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
