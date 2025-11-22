import { ExternalLink, ThumbsUp, UserCheck } from 'lucide-react';
import Link from 'next/link';

interface Props {
  errorParam: {
    error: string;
    acc: string;
    user: string;
  };
  closeModal: () => void;
}

export const ModalMessage = ({ errorParam, closeModal }: Props) => {
  if (errorParam.error === 'mismatch-email') {
    const handleSubmit = () => {
      closeModal();
    };
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8 text-gray-800 dark:text-gray-200">
        <span>
          <UserCheck className="h-20 w-20" />
        </span>
        <div className="text-2xl font-semibold">Mismatch email user and account.</div>
        <div className="text-xl">
          <p>
            Your current user email is <span className="font-bold">{errorParam.user}</span> but
            you're trying to link with email <span className="font-bold">{errorParam.acc}.</span>
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
};
