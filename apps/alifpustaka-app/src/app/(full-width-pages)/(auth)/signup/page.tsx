import SignUpForm from '@/components/auth/SignUpForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Alif Pustaka Portal | Welcome to our community.',
  description: 'Sign up and explore our community features.',
};

export default function SignUp() {
  return <SignUpForm />;
}
