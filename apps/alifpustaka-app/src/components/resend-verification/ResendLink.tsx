'use client';

import { FileUser, Link } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

export const ResendLink = () => {
  const router = useRouter();
  const [hover, setHover] = useState({ task: '', action: false });
  const [isResending, setIsResending] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmitLink = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsResending(true);
      const verif = await signIn('email', {
        email: email,
        redirect: false,
      });

      if (!verif?.error) {
        console.log('Success send verification link: ', verif);
        router.push('/signin?info=verification-sent');
      } else {
        console.log('Error send verification link: ', verif.error);
        router.push('/signin?error=error-send-verification-link');
      }
    } catch (error) {
      console.log('Error send verification link: ', error);
      router.push('/signin?error=error-send-verification-link');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex w-full flex-1 flex-col lg:w-1/2">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="text-title-sm sm:text-title-md mb-2 font-semibold text-gray-800 dark:text-white/90">
              Resend Verification Link
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Make sure you’ve completed sign-up before requesting a verification link again.
            </p>
          </div>

          <form onSubmit={(e) => handleSubmitLink(e)} className="flex flex-col gap-5">
            <input
              value={email}
              placeholder="youremail@mail.com"
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                }
              }}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-800 outline-none placeholder:text-gray-800/50 focus:border-gray-400 dark:text-white/90 dark:placeholder:text-white/50"
            />
            <div className="flex gap-6 font-semibold text-white">
              <button
                type="submit"
                disabled={isResending}
                onMouseEnter={() => setHover({ task: 'accept', action: true })}
                onMouseLeave={() => setHover({ task: 'accept', action: false })}
                className="bg-brand-600 hover:bg-brand-700 focus:bg-brand-800 flex gap-2 rounded px-3 py-2"
              >
                <span>{isResending ? 'resending...' : 'Resend Link'}</span>
                {hover.task === 'accept' && hover.action ? <Link /> : <></>}
              </button>
              <button
                type="button"
                onMouseEnter={() => setHover({ task: 'router', action: true })}
                onMouseLeave={() => setHover({ task: 'router', action: false })}
                className="border-brand-600 hover:border-brand-700 focus:border-brand-800 flex gap-2 rounded border-2 px-3 py-2"
              >
                <span>Sign up First?</span>
                {hover.task === 'router' && hover.action ? <FileUser /> : <></>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
