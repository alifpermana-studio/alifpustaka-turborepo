import {
  ExternalLink,
  OctagonX,
  TextCursorInput,
  ThumbsUp,
  UserCheck,
  Link as LinkIcon,
  UserRoundX,
  MailCheck,
  TimerOff,
  ArrowLeftFromLine,
  Link2Off,
} from 'lucide-react';
import Link from 'next/link';

import { useRouter } from 'next/navigation';

interface Props {
  message: {
    error: string;
    info: string;
  };
  closeModal: () => void;
  setCallbackUrl?: React.Dispatch<React.SetStateAction<string>>;
}

export const ModalMessage = ({ message, closeModal, setCallbackUrl }: Props) => {
  const router = useRouter();
  if (message.error === 'user-exist') {
    const handleSubmit = () => {
      if (setCallbackUrl) {
        setCallbackUrl('/confirm-link');
      }
      closeModal();
    };
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8 text-gray-800 dark:text-gray-200">
        <span>
          <UserCheck className="h-20 w-20" />
        </span>
        <div className="text-2xl font-semibold">Failed create an account.</div>
        <div className="text-xl">
          <p>
            This email is already registered with an existed user. Please sign in first to link your
            third-party account.
          </p>
        </div>
        <div className="mt-4 flex w-3/4 flex-row justify-between gap-10">
          <Link
            href="https://alifpustaka.net"
            className="flex flex-row gap-3 rounded-xl bg-red-700 px-4 py-2 text-gray-200 hover:bg-red-800 focus:bg-red-600"
            target="_blank"
          >
            <span>Learn more</span>
            <span>
              <ExternalLink />
            </span>
          </Link>
          <button
            onClick={handleSubmit}
            className="flex flex-row gap-3 rounded-xl bg-blue-700 px-4 py-2 text-gray-200 hover:bg-blue-800 focus:bg-blue-600"
          >
            <span>I understand</span>
            <span>
              <ThumbsUp />
            </span>
          </button>
        </div>
      </div>
    );
  }

  if (message.error === 'credential-password-mismatch') {
    const handleSubmit = () => {
      closeModal();
    };
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8 text-gray-800 dark:text-gray-200">
        <span className="flex gap-8">
          <TextCursorInput className="h-20 w-20" />
          <OctagonX className="h-20 w-20" />
        </span>
        <div className="text-2xl font-semibold">Password incorrect.</div>
        <div className="text-xl">
          <p>Your password is incorrect, please provide reliable information.</p>
        </div>
        <div className="mt-4 flex w-3/4 flex-row justify-center gap-10">
          <button
            onClick={handleSubmit}
            className="flex flex-row gap-3 rounded-xl bg-blue-700 px-4 py-2 text-gray-200 hover:bg-blue-800 focus:bg-blue-600"
          >
            <span>I understand</span>
            <span>
              <ThumbsUp />
            </span>
          </button>
        </div>
      </div>
    );
  }

  if (message.error === 'non-credential-user') {
    const handleSubmit = () => {
      closeModal();
    };
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8 text-gray-800 dark:text-gray-200">
        <span>
          <UserRoundX className="h-20 w-20" />
        </span>
        <div className="text-2xl font-semibold">Wrong authentication method.</div>
        <div className="text-xl">
          <p>
            Your account are not signup using password authentication. Please signin using another
            method.
          </p>
        </div>
        <div className="mt-4 flex w-3/4 flex-row justify-center gap-10">
          <button
            onClick={handleSubmit}
            className="flex flex-row gap-3 rounded-xl bg-blue-700 px-4 py-2 text-gray-200 hover:bg-blue-800 focus:bg-blue-600"
          >
            <span>I understand</span>
            <span>
              <ThumbsUp />
            </span>
          </button>
        </div>
      </div>
    );
  }

  if (message.error === 'user-not-found') {
    const handleSubmit = () => {
      closeModal();
    };
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8 text-gray-800 dark:text-gray-200">
        <span>
          <UserRoundX className="h-20 w-20" />
        </span>
        <div className="text-2xl font-semibold">User not found.</div>
        <div className="text-xl">
          <p>
            We can not find user related to your provided credential. Please signup first or try
            another method.
          </p>
        </div>
        <div className="mt-4 flex w-3/4 flex-row justify-center gap-10">
          <button
            onClick={handleSubmit}
            className="flex flex-row gap-3 rounded-xl bg-blue-700 px-4 py-2 text-gray-200 hover:bg-blue-800 focus:bg-blue-600"
          >
            <span>I understand</span>
            <span>
              <ThumbsUp />
            </span>
          </button>
        </div>
      </div>
    );
  }

  if (message.error === 'unverified-user') {
    const handleSubmit = () => {
      router.push('/resend-verification-link');
      closeModal();
    };

    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8 text-gray-800 dark:text-gray-200">
        <span>
          <UserRoundX className="h-20 w-20" />
        </span>
        <div className="text-2xl font-semibold">Email not verified.</div>
        <div className="text-xl">
          <p>
            Please verify your email to access our community features. Check your inbox and click
            the link to verify your email.
          </p>
        </div>
        <div className="mt-4 flex w-3/4 flex-row justify-center gap-10">
          <button
            onClick={handleSubmit}
            className="flex flex-row gap-3 rounded-xl bg-blue-700 px-4 py-2 text-gray-200 hover:bg-blue-800 focus:bg-blue-600"
          >
            <span>Resend Verification Link</span>
            <span>
              <LinkIcon />
            </span>
          </button>
          <button
            onClick={handleSubmit}
            className="flex flex-row gap-3 rounded-xl bg-blue-700 px-4 py-2 text-gray-200 hover:bg-blue-800 focus:bg-blue-600"
          >
            <span>I understand</span>
            <span>
              <ThumbsUp />
            </span>
          </button>
        </div>
      </div>
    );
  }

  if (message.error === 'Verification') {
    const handleSubmit = () => {
      router.push('/resend-verification-link');
      closeModal();
    };

    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8 text-gray-800 dark:text-gray-200">
        <span>
          <UserRoundX className="h-20 w-20" />
        </span>
        <div className="text-2xl font-semibold">Verification Link Expired.</div>
        <div className="text-xl">
          <p>
            We encountered an error while verifying your link. Please resend the verification link
            to refresh your verification method.
          </p>
        </div>
        <div className="mt-4 flex w-3/4 flex-row justify-center gap-10">
          <button
            onClick={handleSubmit}
            className="flex flex-row gap-3 rounded-xl bg-blue-700 px-4 py-2 text-gray-200 hover:bg-blue-800 focus:bg-blue-600"
          >
            <span>Resend Verification Link</span>
            <span>
              <LinkIcon />
            </span>
          </button>
          <button
            onClick={handleSubmit}
            className="flex flex-row gap-3 rounded-xl bg-blue-700 px-4 py-2 text-gray-200 hover:bg-blue-800 focus:bg-blue-600"
          >
            <span>I understand</span>
            <span>
              <ThumbsUp />
            </span>
          </button>
        </div>
      </div>
    );
  }

  if (message.info === 'verification-sent') {
    const handleSubmit = () => {
      closeModal();
    };
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8 text-gray-800 dark:text-gray-200">
        <span>
          <MailCheck className="h-20 w-20" />
        </span>
        <div className="text-2xl font-semibold">Verification link sent.</div>
        <div className="text-xl">
          <p>Check your inbox and click the verification link to verify your account.</p>
        </div>
        <div className="mt-4 flex w-3/4 flex-row justify-center gap-10">
          <button
            onClick={handleSubmit}
            className="flex flex-row gap-3 rounded-xl bg-blue-700 px-4 py-2 text-gray-200 hover:bg-blue-800 focus:bg-blue-600"
          >
            <span>I understand</span>
            <span>
              <ThumbsUp />
            </span>
          </button>
        </div>
      </div>
    );
  }

  if (message.info === 'request-reset-password-sent') {
    const handleSubmit = () => {
      closeModal();
    };
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8 text-gray-800 dark:text-gray-200">
        <span>
          <MailCheck className="h-20 w-20" />
        </span>
        <div className="text-2xl font-semibold">Reset password link sent.</div>
        <div className="text-xl">
          <p>Check your inbox and click the link to reset your password.</p>
        </div>
        <div className="mt-4 flex w-3/4 flex-row justify-center gap-10">
          <button
            onClick={handleSubmit}
            className="flex flex-row gap-3 rounded-xl bg-blue-700 px-4 py-2 text-gray-200 hover:bg-blue-800 focus:bg-blue-600"
          >
            <span>I understand</span>
            <span>
              <ThumbsUp />
            </span>
          </button>
        </div>
      </div>
    );
  }

  if (message.error === 'missing-required-parameter') {
    const handleSubmit = () => {
      closeModal();
    };
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8 text-gray-800 dark:text-gray-200">
        <span>
          <TextCursorInput className="h-20 w-20" />
        </span>
        <div className="text-2xl font-semibold">Please fill the required parameter.</div>
        <div className="text-xl">
          <p>You have to fill all required parameter to process your sign up.</p>
        </div>
        <div className="mt-4 flex w-3/4 flex-row justify-center gap-10">
          <button
            onClick={handleSubmit}
            className="flex flex-row gap-3 rounded-xl bg-blue-700 px-4 py-2 text-gray-200 hover:bg-blue-800 focus:bg-blue-600"
          >
            <span>I understand</span>
            <span>
              <ThumbsUp />
            </span>
          </button>
        </div>
      </div>
    );
  }

  if (message.error === 'unknown-error') {
    const handleSubmit = () => {
      closeModal();
    };
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8 text-gray-800 dark:text-gray-200">
        <span>
          <TextCursorInput className="h-20 w-20" />
        </span>
        <div className="text-2xl font-semibold">We encounter unknwon error.</div>
        <div className="text-xl">
          <p>Please contact our administrator to report this issue.</p>
        </div>
        <div className="mt-4 flex w-3/4 flex-row justify-center gap-10">
          <button
            onClick={handleSubmit}
            className="flex flex-row gap-3 rounded-xl bg-blue-700 px-4 py-2 text-gray-200 hover:bg-blue-800 focus:bg-blue-600"
          >
            <span>I understand</span>
            <span>
              <ThumbsUp />
            </span>
          </button>
        </div>
      </div>
    );
  }

  if (message.error === 'username-or-email-exist') {
    const handleSubmit = () => {
      closeModal();
    };
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8 text-gray-800 dark:text-gray-200">
        <span>
          <UserCheck className="h-20 w-20" />
        </span>
        <div className="text-2xl font-semibold">Username or email already exist.</div>
        <div className="text-xl">
          <p>
            Your email or username is already registered with an existed user. Please sign in or
            sign up using different email or username.
          </p>
        </div>
        <div className="mt-4 flex w-3/4 flex-row justify-center gap-10">
          <button
            onClick={handleSubmit}
            className="flex flex-row gap-3 rounded-xl bg-blue-700 px-4 py-2 text-gray-200 hover:bg-blue-800 focus:bg-blue-600"
          >
            <span>I understand</span>
            <span>
              <ThumbsUp />
            </span>
          </button>
        </div>
      </div>
    );
  }

  if (message.error === 'session-expired') {
    const handleSubmit = () => {
      closeModal();
    };
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8 text-gray-800 dark:text-gray-200">
        <span>
          <TimerOff className="h-20 w-20" />
        </span>
        <div className="text-2xl font-semibold">Your session has expired.</div>
        <div className="text-xl">
          <p>Please sign in again to explore our community features.</p>
        </div>
        <div className="mt-4 flex w-3/4 flex-row justify-center gap-10">
          <button
            onClick={handleSubmit}
            className="flex flex-row gap-3 rounded-xl bg-blue-700 px-4 py-2 text-gray-200 hover:bg-blue-800 focus:bg-blue-600"
          >
            <span>I understand</span>
            <span>
              <ThumbsUp />
            </span>
          </button>
        </div>
      </div>
    );
  }

  if (message.error === 'reset-password-token-expired') {
    const handleSubmit = () => {
      closeModal();
    };
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8 text-gray-800 dark:text-gray-200">
        <span>
          <TimerOff className="h-20 w-20" />
        </span>
        <div className="text-2xl font-semibold">Your link has expired.</div>
        <div className="text-xl">
          <p>Please request reset password link again or back to sign in page.</p>
        </div>
        <div className="mt-4 flex w-3/4 flex-row justify-center gap-10">
          <button
            onClick={handleSubmit}
            className="flex flex-row gap-3 rounded-xl bg-blue-700 px-4 py-2 text-gray-200 hover:bg-blue-800 focus:bg-blue-600"
          >
            <span>Back to signin</span>
            <span>
              <ArrowLeftFromLine />
            </span>
          </button>
          <Link
            href="/request-reset-password"
            className="flex flex-row gap-3 rounded-xl bg-blue-700 px-4 py-2 text-gray-200 hover:bg-blue-800 focus:bg-blue-600"
          >
            <span>Send link</span>
            <span>
              <LinkIcon />
            </span>
          </Link>
        </div>
      </div>
    );
  }

  if (message.error === 'invalid-token') {
    const handleSubmit = () => {
      closeModal();
    };
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8 text-gray-800 dark:text-gray-200">
        <span>
          <Link2Off className="h-20 w-20" />
        </span>
        <div className="text-2xl font-semibold">Your link is invalid.</div>
        <div className="text-xl">
          <p>
            You maybe has request another new link, please check your email box. Or you can request
            reset password link again.
          </p>
        </div>
        <div className="mt-4 flex w-3/4 flex-row justify-center gap-10">
          <button
            onClick={handleSubmit}
            className="flex flex-row gap-3 rounded-xl bg-blue-700 px-4 py-2 text-gray-200 hover:bg-blue-800 focus:bg-blue-600"
          >
            <span>Back to signin</span>
            <span>
              <ArrowLeftFromLine />
            </span>
          </button>
          <Link
            href="/request-reset-password"
            className="flex flex-row gap-3 rounded-xl bg-blue-700 px-4 py-2 text-gray-200 hover:bg-blue-800 focus:bg-blue-600"
          >
            <span>Send link</span>
            <span>
              <LinkIcon />
            </span>
          </Link>
        </div>
      </div>
    );
  }

  if (message.error === 'mismatch-repassword') {
    const handleSubmit = () => {
      closeModal();
    };
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8 text-gray-800 dark:text-gray-200">
        <span className="flex gap-8">
          <TextCursorInput className="h-20 w-20" />
          <OctagonX className="h-20 w-20" />
        </span>
        <div className="text-2xl font-semibold">Your Confirm Password did not match.</div>
        <div className="text-xl">
          <p>Please put the same password in the Confirm Password form.</p>
        </div>
        <div className="mt-4 flex w-3/4 flex-row justify-center gap-10">
          <button
            onClick={handleSubmit}
            className="flex flex-row gap-3 rounded-xl bg-blue-700 px-4 py-2 text-gray-200 hover:bg-blue-800 focus:bg-blue-600"
          >
            <span>I understand</span>
            <span>
              <ThumbsUp />
            </span>
          </button>
        </div>
      </div>
    );
  }

  if (message.info === 'success-reset-password') {
    const handleSubmit = () => {
      closeModal();
    };
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8 text-gray-800 dark:text-gray-200">
        <span>
          <MailCheck className="h-20 w-20" />
        </span>
        <div className="text-2xl font-semibold">Reset password success.</div>
        <div className="text-xl">
          <p>Your new password registered. Please sign in using new password.</p>
        </div>
        <div className="mt-4 flex w-3/4 flex-row justify-center gap-10">
          <button
            onClick={handleSubmit}
            className="flex flex-row gap-3 rounded-xl bg-blue-700 px-4 py-2 text-gray-200 hover:bg-blue-800 focus:bg-blue-600"
          >
            <span>I understand</span>
            <span>
              <ThumbsUp />
            </span>
          </button>
        </div>
      </div>
    );
  }
};
