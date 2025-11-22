'use client';
import Checkbox from '@/components/form/input/Checkbox';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import { AlertIcon, EyeCloseIcon, EyeIcon } from '@/icons';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { errorChecker } from './errorChecker';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Modal } from '../ui/modal';
import { ModalMessage } from '../common/ModalMessage';
import { useModal } from '@/hooks/useModal';

type FormDataType = {
  fname: string;
  lname: string;
  username: string;
  email: string;
  password: string;
  rePassword: string;
};

type FormAlertType = {
  lname?: string;
  fname?: string;
  username?: string;
  email?: string;
  password?: string;
  rePassword?: string;
  failedSignUp?: string;
};

export default function SignUpForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [modalMessage, setModalMessage] = useState({ error: '', info: '' });
  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    username: '',
    email: '',
    password: '',
    rePassword: '',
  });

  const [formAlert, setFormAlert] = useState<FormAlertType>({
    fname: '',
    lname: '',
    username: '',
    email: '',
    password: '',
    rePassword: '',
    failedSignUp: '',
  });

  const [sent, setSent] = useState(false);

  const { isOpen, openModal, closeModal } = useModal();

  useEffect(() => {
    Object.keys(formAlert).map((val: string) => {
      if (val !== 'failedSignUp') {
        const errorFound: string =
          formData[val as keyof FormDataType].length === 0 ? '' : errorChecker({ val, formData });
        setFormAlert((prevVal) => ({ ...prevVal, [val]: errorFound }));
      }
    });
  }, [formData]);

  useEffect(() => {
    if (sent) {
      console.log('Email verification sent.');
    }
  }, [sent]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

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
        const reqSignUp = await fetch('/api/signup', {
          method: 'POST',
          body: JSON.stringify(formData),
        });

        const { success, error } = await reqSignUp.json();

        if (success) {
          console.log(formData.email);
          // Trigger magic-link email (verification)
          const verif = await signIn('email', {
            email: formData.email,
            redirect: false, // don't navigate away
          });

          console.log('verif: ', verif);
          setSent(true);
          router.push('/signin?info=verification-sent');
        } else {
          setModalMessage((p) => ({ ...p, error: error }));
          openModal();
          console.log('Error signup: ', error);
        }
      } catch (err) {
        console.log(err);
        setModalMessage((p) => ({ ...p, error: 'unknown-error' }));
        openModal();
      }
    } else {
      setModalMessage((p) => ({ ...p, error: 'missing-required-parameter' }));
      openModal();
    }
    setLoading(false);
  };

  return (
    <div className="no-scrollbar flex w-full flex-1 flex-col overflow-y-auto lg:w-1/2">
      <div className="mx-auto flex w-full flex-1 flex-col justify-center">
        <div className="w-full items-center justify-center py-4">
          <div className="mx-auto mb-5 flex w-full flex-col items-center justify-center sm:mb-8">
            <h1 className="text-title-sm sm:text-title-md mb-2 text-center font-semibold text-gray-800 dark:text-white/90">
              Join with our community
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign up!
            </p>
          </div>
          <div className="mx-auto flex w-10/12 flex-col items-center justify-center gap-5 p-2">
            <ProviderAuth />
            <div className="relative w-full basis-1/12 py-2 sm:py-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-b-2 border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white p-2 text-gray-400 sm:px-5 sm:py-2 dark:bg-gray-900">
                  Or
                </span>
              </div>
            </div>
            <Form
              loading={loading}
              isChecked={isChecked}
              setIsChecked={setIsChecked}
              formData={formData}
              setFormData={setFormData}
              formAlert={formAlert}
              handleSubmit={handleSubmit}
            />
            <div className="mt-5 w-full">
              <p className="text-center text-base font-normal text-gray-700 sm:text-start dark:text-gray-400">
                <span>Already have an account? </span>
                <Link
                  href="/signin"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-4xl text-center">
        <ModalMessage message={modalMessage} closeModal={closeModal} />
      </Modal>
    </div>
  );
}

interface FormType {
  loading: boolean;
  isChecked: boolean;
  setIsChecked: React.Dispatch<React.SetStateAction<boolean>>;
  formData: FormDataType;
  setFormData: React.Dispatch<React.SetStateAction<FormDataType>>;
  formAlert: FormAlertType;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const Form = ({
  loading,
  isChecked,
  setIsChecked,
  formData,
  setFormData,
  formAlert,
  handleSubmit,
}: FormType) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <form className="w-full basis-6/12" onSubmit={(e) => handleSubmit(e)}>
      <div className="space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* <!-- First Name --> */}
          <div className="sm:col-span-1">
            <Label>
              First Name<span className="text-error-500">*</span>
            </Label>
            <Input
              type="text"
              id="fname"
              name="fname"
              placeholder="Enter your first name"
              value={formData.fname}
              onChange={(e) => setFormData({ ...formData, fname: e.target.value })}
            />
            <FormAlert message={formAlert.fname ?? ''} />
          </div>
          {/* <!-- Last Name --> */}
          <div className="sm:col-span-1">
            <Label>
              Last Name<span className="text-error-500">*</span>
            </Label>
            <Input
              type="text"
              id="lname"
              name="lname"
              placeholder="Enter your last name"
              value={formData.lname}
              onChange={(e) => setFormData({ ...formData, lname: e.target.value })}
            />
            <FormAlert message={formAlert.lname ?? ''} />
          </div>
        </div>
        {/* <!-- Username --> */}
        <div>
          <Label>
            Username<span className="text-error-500">*</span>
          </Label>
          <Input
            type="text"
            id="username"
            name="username"
            placeholder="Enter your username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          />
          <FormAlert message={formAlert.username ?? ''} />
        </div>
        {/* <!-- Email --> */}
        <div>
          <Label>
            Email<span className="text-error-500">*</span>
          </Label>
          <Input
            type="text"
            id="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <FormAlert message={formAlert.email ?? ''} />
        </div>
        {/* <!-- Password --> */}
        <div>
          <Label>
            Password<span className="text-error-500">*</span>
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
            Re-Enter Password<span className="text-error-500">*</span>
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
        {/* <!-- Checkbox --> */}
        <div className="flex items-center gap-3">
          <Checkbox
            className="h-5 w-5"
            checked={isChecked}
            required
            onChange={() => setIsChecked(!isChecked)}
          />
          <p className="inline-block font-normal text-gray-500 dark:text-gray-400">
            By creating an account means you agree to the{' '}
            <span className="text-gray-800 dark:text-white/90">Terms and Conditions,</span> and our{' '}
            <span className="text-gray-800 dark:text-white">Privacy Policy</span>
          </p>
        </div>
        {/* <!-- Button --> */}
        <div>
          <button
            type="submit"
            className={`bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:bg-warning-300 flex w-full items-center justify-center rounded-lg px-4 py-3 text-sm font-medium text-white transition`}
          >
            {loading ? 'processing' : 'Sign Up'}
          </button>
        </div>
      </div>
    </form>
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

const ProviderAuth = () => {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5">
      <button
        onClick={() => signIn('google')}
        className="inline-flex items-center justify-center gap-3 rounded-lg bg-gray-100 px-7 py-3 text-sm font-normal text-gray-700 transition-colors hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M18.7511 10.1944C18.7511 9.47495 18.6915 8.94995 18.5626 8.40552H10.1797V11.6527H15.1003C15.0011 12.4597 14.4654 13.675 13.2749 14.4916L13.2582 14.6003L15.9087 16.6126L16.0924 16.6305C17.7788 15.1041 18.7511 12.8583 18.7511 10.1944Z"
            fill="#4285F4"
          />
          <path
            d="M10.1788 18.75C12.5895 18.75 14.6133 17.9722 16.0915 16.6305L13.274 14.4916C12.5201 15.0068 11.5081 15.3666 10.1788 15.3666C7.81773 15.3666 5.81379 13.8402 5.09944 11.7305L4.99473 11.7392L2.23868 13.8295L2.20264 13.9277C3.67087 16.786 6.68674 18.75 10.1788 18.75Z"
            fill="#34A853"
          />
          <path
            d="M5.10014 11.7305C4.91165 11.186 4.80257 10.6027 4.80257 9.99992C4.80257 9.3971 4.91165 8.81379 5.09022 8.26935L5.08523 8.1534L2.29464 6.02954L2.20333 6.0721C1.5982 7.25823 1.25098 8.5902 1.25098 9.99992C1.25098 11.4096 1.5982 12.7415 2.20333 13.9277L5.10014 11.7305Z"
            fill="#FBBC05"
          />
          <path
            d="M10.1789 4.63331C11.8554 4.63331 12.9864 5.34303 13.6312 5.93612L16.1511 3.525C14.6035 2.11528 12.5895 1.25 10.1789 1.25C6.68676 1.25 3.67088 3.21387 2.20264 6.07218L5.08953 8.26943C5.81381 6.15972 7.81776 4.63331 10.1789 4.63331Z"
            fill="#EB4335"
          />
        </svg>
        Sign in with Google
      </button>
      <button
        onClick={() => signIn('github')}
        className="inline-flex items-center justify-center gap-3 rounded-lg bg-gray-100 px-7 py-3 text-sm font-normal text-gray-700 transition-colors hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="30"
          viewBox="0 0 30 30"
          className="fill-black dark:fill-white"
        >
          <path d="M15,3C8.373,3,3,8.373,3,15c0,5.623,3.872,10.328,9.092,11.63C12.036,26.468,12,26.28,12,26.047v-2.051 c-0.487,0-1.303,0-1.508,0c-0.821,0-1.551-0.353-1.905-1.009c-0.393-0.729-0.461-1.844-1.435-2.526 c-0.289-0.227-0.069-0.486,0.264-0.451c0.615,0.174,1.125,0.596,1.605,1.222c0.478,0.627,0.703,0.769,1.596,0.769 c0.433,0,1.081-0.025,1.691-0.121c0.328-0.833,0.895-1.6,1.588-1.962c-3.996-0.411-5.903-2.399-5.903-5.098 c0-1.162,0.495-2.286,1.336-3.233C9.053,10.647,8.706,8.73,9.435,8c1.798,0,2.885,1.166,3.146,1.481C13.477,9.174,14.461,9,15.495,9 c1.036,0,2.024,0.174,2.922,0.483C18.675,9.17,19.763,8,21.565,8c0.732,0.731,0.381,2.656,0.102,3.594 c0.836,0.945,1.328,2.066,1.328,3.226c0,2.697-1.904,4.684-5.894,5.097C18.199,20.49,19,22.1,19,23.313v2.734 c0,0.104-0.023,0.179-0.035,0.268C23.641,24.676,27,20.236,27,15C27,8.373,21.627,3,15,3z"></path>
        </svg>
        Sign in with Github
      </button>
    </div>
  );
};
