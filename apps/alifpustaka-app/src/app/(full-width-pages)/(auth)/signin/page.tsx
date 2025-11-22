import SignInForm from '@/components/auth/SignInForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Alif Pustaka Portal | Signin as user',
  description: 'This is Alif Pustaka Portal used to manage user activities.',
};

export default function SignIn() {
  return <SignInForm />;
}
