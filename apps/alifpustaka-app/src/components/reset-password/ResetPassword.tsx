'use client';

import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import { AlertIcon, EyeCloseIcon, EyeIcon } from '@/icons';
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useModal } from '@/hooks/useModal';
import { Modal } from '../ui/modal';
import { ModalMessage } from '../common/ModalMessage';
import { errorChecker } from './errorChecker';

type FormAlertType = {
  password?: string;
  rePassword?: string;
};

type FormDataType = {
  password?: string;
  rePassword?: string;
};

export default function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    password: '',
    rePassword: '',
  });
  const [formAlert, setFormAlert] = useState<FormAlertType>({
    password: '',
    rePassword: '',
  });

  const [isSubmit, setIsSubmit] = useState(false);

  const { isOpen, openModal, closeModal } = useModal();
  const params = useSearchParams();
  const error = params.get('error') ?? undefined;
  const info = params.get('info') ?? undefined;
  const token = params.get('token') ?? undefined;
  const [modalMessage, setModalMessage] = useState({ error: '', info: '' });

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

    if (token) {
      setFormData((p) => ({ ...p, token: token }));
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

  const handleSubmitPassword = async (e: React.FormEvent<HTMLFormElement>) => {
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
        const res = await fetch(`/api/reset-password`, {
          method: 'PUT',
          body: JSON.stringify(formData),
        });

        const { error, success } = await res.json();

        if (success) {
          router.push('/signin?info=success-reset-password');
        } else {
          setModalMessage((p) => ({ ...p, error: error }));
          openModal();
        }
      } catch (error) {
        console.log('Error reset password: ', error);
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
              Reset Password
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Make sure your new password is different from existed password.
            </p>
          </div>
          <div>
            <form onSubmit={(e) => handleSubmitPassword(e)}>
              <div className="space-y-6">
                <div>
                  <Label>
                    New Password<span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      placeholder="Enter your password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute top-1/2 right-4 z-30 -translate-y-1/2 cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                      )}
                    </span>
                  </div>
                  <FormAlert message={formAlert.password ?? ''} />
                </div>
                <div>
                  <Label>
                    Re-Enter New Password<span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="re-password"
                      name="re-password"
                      placeholder="Enter your password again"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.rePassword}
                      onChange={(e) => setFormData({ ...formData, rePassword: e.target.value })}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute top-1/2 right-4 z-30 -translate-y-1/2 cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                      )}
                    </span>
                  </div>
                  <FormAlert message={formAlert.rePassword ?? ''} />
                </div>
                <div>
                  <button
                    disabled={isSubmit}
                    type="submit"
                    className={`${isSubmit ? 'bg-brand-700' : 'bg-brand-500'} shadow-theme-xs hover:bg-brand-600 flex w-full items-center justify-center rounded-lg px-4 py-3 text-sm font-medium text-white transition`}
                  >
                    {isSubmit ? 'submit password...' : 'Reset Password'}
                  </button>
                </div>
              </div>
            </form>
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
