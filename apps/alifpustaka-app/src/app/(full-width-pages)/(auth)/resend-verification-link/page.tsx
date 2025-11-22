// app/auth/confirm-link/page.tsx (Next.js App Router)

import { ResendLink } from '@/components/resend-verification/ResendLink';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Alif Pustaka Portal | Confirm Link',
  description: 'This is Alif Pustaka Portal used to manage user activities.',
};

export default function ResendLinkPage() {
  return <ResendLink />;
}
