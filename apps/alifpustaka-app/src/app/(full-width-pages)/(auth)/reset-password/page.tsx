// app/auth/confirm-link/page.tsx (Next.js App Router)

import ResetPassword from '@/components/reset-password/ResetPassword';
import { prisma } from '@/lib/prisma';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Alif Pustaka Portal | Reset Password',
  description: 'Reset your password here.',
};

type Props = {
  params: Promise<{ token: string }>;
};

export default async function ResetPasswordPage({ params }: Props) {
  const { token } = await params;
  const currentTime = Date.now() / 1000;
  let redirectPath: string | null = null;

  try {
    const res = await prisma.user.findUnique({
      where: { passwordResetToken: token || '' },
    });

    if (res && res.resetTokenExpiry) {
      if (res.resetTokenExpiry >= currentTime) {
        redirectPath = '';
      } else {
        redirectPath = '/signin?error=reset-password-token-expired';
      }
    } else {
      redirectPath = '/signin?error=invalid-token';
    }
  } catch (error) {
    console.error('Error verify reset password token: ', error);
    redirectPath = '/signin?error=unknown-error';
  } finally {
    if (redirectPath) {
      redirect(redirectPath);
    } else {
      return <ResetPassword />;
    }
  }
}
