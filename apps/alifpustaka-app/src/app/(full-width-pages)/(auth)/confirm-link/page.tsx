// app/auth/confirm-link/page.tsx (Next.js App Router)

import { ConfirmLink } from '@/components/confirm-link/ConfirmLink';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Alif Pustaka Portal | Confirm Link',
  description: 'This is Alif Pustaka Portal used to manage user activities.',
};

export default function ConfirmLinkPage() {
  return <ConfirmLink />;
}
