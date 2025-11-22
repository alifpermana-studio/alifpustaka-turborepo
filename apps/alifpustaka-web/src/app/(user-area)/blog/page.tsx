import { UserCheck } from '@/components/user/UserCheck';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Next.js Profile | TailAdmin - Next.js Dashboard Template',
  description:
    'This is Next.js Profile page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template',
};

export default function Blog() {
  return (
    <div>
      <div className="rounded-2xl border border-base-100 bg-base-300 p-5 lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-base-content lg:mb-7">Profile</h3>
        <div className="space-y-6">
          <UserCheck />
        </div>
      </div>
    </div>
  );
}
