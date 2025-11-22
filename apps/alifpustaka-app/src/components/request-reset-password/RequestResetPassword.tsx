'use client';

import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import { AlertIcon } from '@/icons';
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useModal } from '@/hooks/useModal';
import { Modal } from '../ui/modal';
import { ModalMessage } from '../common/ModalMessage';
import { errorChecker } from './errorChecker';
import Link from 'next/link';

interface FormAlertType {
  email: string;
}

interface FormDataType {
  email: string;
}

export default function RequestResetPassword() {
  const [formData, setFormData] = useState({ email: '' });
  const [formAlert, setFormAlert] = useState<FormAlertType>({ email: '' });
  const [modalMessage, setModalMessage] = useState({ error: '', info: '' });
  const [isSubmit, setIsSubmit] = useState(false);
  const { isOpen, openModal, closeModal } = useModal();
  const params = useSearchParams();
  const error = params.get('error') ?? undefined;
  const info = params.get('info') ?? undefined;
  const router = useRouter();

  useEffect(() => {
    if (error && error !== 'Callback') {
      setModalMessage((p) => ({ ...p, error: error || '' }));
      openModal();
    }

    if (info) {
      setModalMessage((p) => ({ ...p, info: info || '' }));
      openModal();
    }
  }, []);

  useEffect(() => {
    Object.keys(formAlert).map((val: string) => {
      if (val !== 'failedSignUp') {
        const errorFound: string =
          formData[val as keyof FormDataType].length === 0 ? '' : errorChecker({ val, formData });
        setFormAlert((prevVal) => ({ ...prevVal, [val]: errorFound }));
      }
    });
  }, [formData]);

  const handleSubmitEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmit(true);

    const isAccepted: any[] = [];

    Object.keys(formData).map((n: string) => {
      const emptyFound: boolean = formChecker('empty', formData[n as keyof FormDataType]);
      const errorFound: boolean = formChecker('error', formAlert[n as keyof FormAlertType]!);

      if (errorFound) {
        isAccepted.push(false);
      } else if (emptyFound) {
        setFormAlert((prevVal) => ({
          ...prevVal,
          [n]: 'Please fill in all required fields.',
        }));
        isAccepted.push(false);
      } else {
        setFormAlert((prevVal) => ({
          ...prevVal,
          [n]: '',
        }));
        isAccepted.push(true);
      }
    });

    if (!isAccepted.includes(false)) {
      try {
        const res = await fetch(`/api/request-reset-password?email=${formData.email}`, {
          method: 'PUT',
        });

        const { error, success } = await res.json();

        if (success) {
          router.push('/signin?info=request-reset-password-sent');
        } else {
          setModalMessage((p) => ({ ...p, error: error }));
          openModal();
        }
      } catch (err) {
        console.log(err);
        setModalMessage((p) => ({ ...p, error: 'unknown-error' }));
        openModal();
      } finally {
        setIsSubmit(false);
      }
    } else {
      setModalMessage((p) => ({ ...p, error: 'missing-required-parameter' }));
      openModal();
    }
  };

  return (
    <div className="no-scrollbar flex w-full flex-1 flex-col overflow-y-auto lg:w-1/2">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
        <div className="w-full items-center justify-center py-4">
          <div className="mx-auto mb-5 flex w-full flex-col items-center justify-center sm:mb-8">
            <h1 className="text-title-sm sm:text-title-md mb-2 font-semibold text-gray-800 dark:text-white/90">
              Confirm Email to Reset Password
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              We will send email contain link to reset your password. Please use the link before its
              expired.
            </p>
          </div>
          <div>
            <form onSubmit={(e) => handleSubmitEmail(e)}>
              <div className="space-y-6">
                <div>
                  <Label>
                    Email<span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="email"
                      name="email"
                      placeholder="your@mail.com"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ email: e.target.value })}
                    />
                  </div>
                  <FormAlert message={formAlert.email ?? ''} />
                </div>
                <div>
                  <button
                    disabled={isSubmit}
                    type="submit"
                    className={`${isSubmit ? 'bg-brand-700' : 'bg-brand-500'} shadow-theme-xs hover:bg-brand-600 flex w-full items-center justify-center rounded-lg px-4 py-3 text-sm font-medium text-white transition`}
                  >
                    {isSubmit ? 'sending...' : 'Send Link'}
                  </button>
                </div>
              </div>
            </form>
          </div>
          <div className="my-4 flex w-full flex-wrap gap-2">
            <p className="text-gray-800 dark:text-gray-200">Keep using old password?</p>
            <Link href="/signin" className="text-blue-500 hover:font-bold focus:scale-110">
              Sign in
            </Link>
          </div>
        </div>
      </div>
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-4xl text-center">
        <ModalMessage message={modalMessage} closeModal={closeModal} />
      </Modal>
    </div>
  );
}

type alertType = {
  message: string;
};

const FormAlert = ({ message }: alertType) => {
  return (
    <p
      className={`text-triadicred1 mt-2 flex flex-row gap-2 text-red-700 dark:text-red-400 ${message ? 'visible' : 'hidden'}`}
    >
      <AlertIcon />
      <span>{message}</span>
    </p>
  );
};

function formChecker(status: string, userValue: string) {
  if (status === 'empty') {
    if (userValue.replaceAll(' ', '').length === 0) {
      return true;
    }
  }

  if (status == 'error') {
    if (userValue) {
      return true;
    }
  }

  return false;
}
