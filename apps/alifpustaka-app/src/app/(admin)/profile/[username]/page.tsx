// app/[username]/page.tsx
import UserAddressCard from '@/components/user-profile/UserAddressCard';
import UserInfoCard from '@/components/user-profile/UserInfoCard';
import UserMetaCard from '@/components/user-profile/UserMetaCard';
import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { BellIcon } from '@/icons';

type Props = {
  params: Promise<{ username: string }>;
};

// ⚡ This runs on the server before rendering
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;

  const user = await prisma.user.findUnique({
    where: { username: username },
    select: { username: true, fname: true, lname: true },
  });

  if (!user) {
    console.log('Check username: ', user);
    return {
      title: 'User not found',
      description: 'This user does not exist.',
    };
  }

  return {
    title: `${user.fname ?? ''} ${user.lname ?? ''} (@${user.username})`,
    description: `Profile page of ${user.username}`,
  };
}

// Fetch data server-side directly in the component
export default function Username() {
  return (
    <div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 lg:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 lg:mb-7 dark:text-white/90">
          Profile
        </h3>
        <BellIcon />
        <div className="space-y-6">
          <UserMetaCard />
          <UserInfoCard />
          <UserAddressCard />
        </div>
      </div>
    </div>
  );
}
