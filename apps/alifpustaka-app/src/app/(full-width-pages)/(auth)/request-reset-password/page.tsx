// app/auth/confirm-link/page.tsx (Next.js App Router)

import RequestResetPassword from '@/components/request-reset-password/RequestResetPassword';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Alif Pustaka Portal | Reset Password',
  description: 'We will send reset password link to your email box.',
};

export default function ResendLinkPage() {
  return <RequestResetPassword />;
}
