'use client';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FormDataType, UserRoleType, UserStatusType } from 'next-auth';
import { UserRole, UserStatus } from '@repo/prisma-config';

type FormState = { fname: string; lname: string; username: string };

type Field = {
  name: keyof FormState;
  label: string;
  type: 'text' | 'email' | 'number' | 'password';
  placeholder?: string;
  required?: boolean; // <- optional
};

const FIELDS = [
  {
    name: 'fname',
    label: 'First name',
    type: 'text',
    required: false,
    placeholder: 'Your name',
  },
  {
    name: 'lname',
    label: 'Last name',
    type: 'text',
    required: false,
    placeholder: 'Your name',
  },
  {
    name: 'username',
    label: 'Username',
    type: 'text',
    required: false,
    placeholder: 'Username',
  },
] as const satisfies readonly Field[];

interface ErrorType {
  user: string;
  acc: string;
  error: string;
}

interface Props {
  setErrorParam: React.Dispatch<React.SetStateAction<ErrorType>>;
  openModal: () => void;
}

const currentTime = new Date(Date.now());

const address = {
  country: '',
  province: '',
  city: '',
  postCode: '',
  taxId: '',
};

const social = {
  facebook: '',
  x: '',
  linkedin: '',
  instagram: '',
};

const initRoleReq: UserRoleType = {
  reqUserRole: UserRole.USER,
  reqMsg: '',
};

const initStatusReq: UserStatusType = {
  reqUserStatus: UserStatus.ACTIVE,
  reqMsg: '',
};

const initialFormData: FormDataType = {
  id: '',
  fname: '',
  lname: '',
  email: '',
  username: '',
  address: address,
  emailVerified: currentTime,
  social: social,
  phone: '',
  image: '',
  userRole: UserRole.USER,
  userStatus: UserStatus.ACTIVE,
  roleReq: initRoleReq,
  statusReq: initStatusReq,
  bio: '',
};

export default function SlidingWizardForm({ setErrorParam, openModal }: Props) {
  const { data, status, update } = useSession();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const inputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState(initialFormData);

  const [updating, setUpdating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    inputRef.current?.focus();
  }, [step]);

  useEffect(() => {
    if (status === 'authenticated') {
      console.log(data.user);
      setFormData((prev) => ({
        ...prev,
        fname: data.user.fname || '',
        lname: data.user.lname || '',
        username: data.user.username || '',
        emailVerified: new Date(),
      }));
    }
  }, [status]);

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: '0%', opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? '-100%' : '100%', opacity: 0 }),
  };

  const current = FIELDS[step];

  function next() {
    if (step < FIELDS.length - 1) {
      setDir(1);
      setStep((s) => s + 1);
    }
  }
  function prev() {
    if (step > 0) {
      setDir(-1);
      setStep((s) => s - 1);
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Check submit: ', formData);
    setUpdating(true);
    const currentDate = new Date();
    setFormData((p) => ({ ...p, emailVerified: currentDate }));
    try {
      const res = await fetch('/api/update-user', {
        method: 'POST',
        body: JSON.stringify({ data: formData }),
      });

      const { success, error } = await res.json();

      if (success) {
        await update();
        router.push('/profile');
      } else {
        console.log('Error update user: ', error);
        setErrorParam((prev) => ({ ...prev, error: error }));
        openModal();
      }
    } catch (error) {
      console.log('Error update user: ', error);
      setErrorParam((prev) => ({ ...prev, error: 'unknown-error' }));
      openModal();
    } finally {
      setUpdating(false);
    }
  };

  const isLast = step === FIELDS.length - 1;

  return (
    <form onSubmit={(e) => handleSubmit(e)} className="mx-auto w-full p-6 shadow-sm">
      <div className="mb-6 items-baseline justify-between">
        <h2 className="text-title-md basis-5/6 font-semibold text-gray-800 dark:text-white/90">
          Confirm your account data
        </h2>
        <span className="text-md basis-1/6 font-semibold text-gray-800 dark:text-white/90">
          Step {step + 1} / {FIELDS.length}
        </span>
      </div>

      {/* viewport */}
      <div className="relative h-28 overflow-hidden">
        <AnimatePresence initial={false} custom={dir} mode="wait">
          <motion.div
            key={step} // important
            custom={dir} // pass dir to both enter & exit
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'tween', duration: 0.35, ease: 'easeInOut' },
              opacity: { duration: 0.2 },
            }}
            className="absolute inset-0 w-full" // keep absolute to avoid layout crossfade
          >
            <label
              htmlFor={current.name}
              className="text-md mb-2 block font-medium text-gray-800 dark:text-white/90"
            >
              {current.label}
            </label>
            <input
              ref={inputRef}
              id={current.name}
              name={current.name}
              type={current.type}
              required={current.required}
              placeholder={(formData as any)[current.name]}
              value={(formData as any)[current.name]}
              onChange={(e) => setFormData((d) => ({ ...d, [current.name]: e.target.value }))}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isLast) {
                  e.preventDefault();
                  next();
                }
              }}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-800 outline-none placeholder:text-gray-800 focus:border-gray-400 dark:text-white/90 dark:placeholder:text-white/90"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <button
          type="button"
          onClick={prev}
          disabled={step === 0 || status !== 'authenticated'}
          className="rounded-xl border px-4 py-2 text-sm text-gray-800 disabled:cursor-not-allowed disabled:opacity-40 dark:text-white/90"
        >
          {status === 'authenticated' ? 'Prev' : status}
        </button>

        <button
          type="button"
          onClick={next}
          disabled={status !== 'authenticated'}
          className={`rounded-xl bg-black px-4 py-2 text-sm text-white ${isLast ? 'hidden' : 'flex'}`}
        >
          {status === 'authenticated' ? 'Next' : status}
        </button>

        <button
          disabled={updating}
          type="submit"
          className={`rounded-xl bg-black px-4 py-2 text-sm text-white ${isLast ? 'flex' : 'hidden'}`}
        >
          {updating ? 'updating...' : 'Submit'}
        </button>
      </div>
    </form>
  );
}
