'use client';

import { Link, Undo2 } from 'lucide-react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Modal } from '../ui/modal';
import { ModalMessage } from './ModalMessage';
import { useModal } from '@/hooks/useModal';

export const ConfirmLink = () => {
  const { status } = useSession();
  const router = useRouter();
  const { isOpen, openModal, closeModal } = useModal();
  const params = useSearchParams();
  const user = params.get('user') ?? '';
  const acc = params.get('acc') ?? '';
  const error = params.get('error') ?? '';
  const [errorParam, setErrorParam] = useState({ user: '', acc: '', error: '' });
  const [hover, setHover] = useState({ action: false, task: '' });

  useEffect(() => {
    if (error && error !== 'Callback') {
      setErrorParam({ error: error, acc: acc, user: user });
      openModal();
    }
  }, []);

  if (status === 'loading') return null;

  const handleSubmitLink = async () => {
    signIn('google', { callbackUrl: '/profile' });
  };

  return (
    <div className="flex w-full flex-1 flex-col lg:w-1/2">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="text-title-sm sm:text-title-md mb-2 font-semibold text-gray-800 dark:text-white/90">
              Link your Google account
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              After linking, you can sign in with Google or your password.
            </p>
          </div>

          <div className="flex gap-6 font-semibold text-white">
            <button
              disabled={status === 'authenticated' ? false : true}
              onMouseEnter={() => setHover({ task: 'accept', action: true })}
              onMouseLeave={() => setHover({ task: 'accept', action: false })}
              className="bg-brand-600 hover:bg-brand-700 focus:bg-brand-800 flex gap-2 rounded px-3 py-2"
              onClick={handleSubmitLink}
            >
              <span>{status === 'authenticated' ? 'Link Google' : status}</span>
              {hover.task === 'accept' && hover.action ? <Link /> : <></>}
            </button>
            <button
              onMouseEnter={() => setHover({ task: 'deny', action: true })}
              onMouseLeave={() => setHover({ task: 'deny', action: false })}
              className="flex gap-2 rounded bg-red-600 px-3 py-2 hover:bg-red-700 focus:bg-red-800"
              onClick={() => router.push('/auth/signin')}
            >
              <span>Not now</span>
              {hover.task === 'deny' && hover.action ? <Undo2 /> : <></>}
            </button>
          </div>
        </div>
      </div>
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-4xl text-center">
        <ModalMessage errorParam={errorParam} closeModal={closeModal} />
      </Modal>
    </div>
  );
};
