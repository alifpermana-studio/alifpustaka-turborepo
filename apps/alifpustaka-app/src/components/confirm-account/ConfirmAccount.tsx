'use client';

import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Modal } from '../ui/modal';

import { useModal } from '@/hooks/useModal';
import { ModalMessage } from './ModalMessage';
import AnimatedForm from './AnimatedForm';

export const ConfirmAccount = () => {
  const { status } = useSession();
  const { isOpen, openModal, closeModal } = useModal();
  const params = useSearchParams();
  const user = params.get('user') ?? '';
  const acc = params.get('acc') ?? '';
  const error = params.get('error') ?? '';
  const [errorParam, setErrorParam] = useState({ user: '', acc: '', error: '' });

  useEffect(() => {
    if (error && error !== 'Callback') {
      setErrorParam({ error: error, acc: acc, user: user });
      openModal();
    }
  }, []);

  if (status === 'loading') return null;

  return (
    <div className="flex w-full flex-1 flex-col lg:w-1/2">
      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center">
        <AnimatedForm setErrorParam={setErrorParam} openModal={openModal} />
      </div>
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-4xl text-center">
        <ModalMessage errorParam={errorParam} closeModal={closeModal} />
      </Modal>
    </div>
  );
};
