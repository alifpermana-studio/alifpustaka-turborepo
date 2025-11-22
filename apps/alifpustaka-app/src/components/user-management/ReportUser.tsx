import { userOnAdminType } from 'next-auth';
import React, { useState } from 'react';
import Button from '../ui/button/Button';
import Image from 'next/image';
import { UserRole, UserStatus } from '@repo/prisma-config';

type Props = {
  reportUser: userOnAdminType;
  reload: () => void;
  closeModal: () => void;
};

export const ReportUser = ({ reportUser, reload, closeModal }: Props) => {
  const [loading, setLoading] = useState(false);

  const handleReportUser = async () => {
    try {
      setLoading(true);

      const res = await fetch('/api/update-user', {
        method: 'POST',
        body: JSON.stringify({
          action: 'report-user',
          data: reportUser,
        }),
      });

      const { success, error } = await res.json();

      if (success) {
        console.log('Success report user');
        closeModal();
        reload();
      } else {
        console.log('Failed report user: ', error);
      }
    } catch (error) {
      console.log('Error report user: ', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 lg:p-11 dark:bg-gray-900">
      <div className="px-2 pr-14">
        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
          Are you want to report this User?
        </h4>
        <p className="mb-6 text-sm text-gray-500 lg:mb-7 dark:text-gray-400">
          Reported user will be reviewed by superadmin. Reported user can not perform any activity
          related to its own role (except for USER role).
        </p>
      </div>
      <div className="relative flex cursor-pointer flex-row items-center gap-8 rounded-xl bg-gray-200 p-4 dark:bg-gray-800">
        <div className="relative aspect-square w-full max-w-[100px] overflow-hidden rounded-full md:mx-auto">
          {reportUser.image ? (
            <Image
              src={reportUser.image}
              alt="user"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <svg
              className="h-full w-full text-gray-600 dark:text-white"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 3.5C7.30558 3.5 3.5 7.30558 3.5 12C3.5 14.1526 4.3002 16.1184 5.61936 17.616C6.17279 15.3096 8.24852 13.5955 10.7246 13.5955H13.2746C15.7509 13.5955 17.8268 15.31 18.38 17.6167C19.6996 16.119 20.5 14.153 20.5 12C20.5 7.30558 16.6944 3.5 12 3.5ZM17.0246 18.8566V18.8455C17.0246 16.7744 15.3457 15.0955 13.2746 15.0955H10.7246C8.65354 15.0955 6.97461 16.7744 6.97461 18.8455V18.856C8.38223 19.8895 10.1198 20.5 12 20.5C13.8798 20.5 15.6171 19.8898 17.0246 18.8566ZM2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM11.9991 7.25C10.8847 7.25 9.98126 8.15342 9.98126 9.26784C9.98126 10.3823 10.8847 11.2857 11.9991 11.2857C13.1135 11.2857 14.0169 10.3823 14.0169 9.26784C14.0169 8.15342 13.1135 7.25 11.9991 7.25ZM8.48126 9.26784C8.48126 7.32499 10.0563 5.75 11.9991 5.75C13.9419 5.75 15.5169 7.32499 15.5169 9.26784C15.5169 11.2107 13.9419 12.7857 11.9991 12.7857C10.0563 12.7857 8.48126 11.2107 8.48126 9.26784Z"
                fill="currentColor"
              />
            </svg>
          )}
        </div>

        <div className="flex w-full flex-col items-start justify-start gap-1 border-l-[1px] border-amber-500 pl-5 text-lg text-gray-800 dark:text-gray-200">
          <div className="flex flex-row gap-3">
            <span className="mr-1 block truncate font-medium text-ellipsis">
              {`${reportUser.fname} ${reportUser.lname}`}
            </span>
            <span>@{reportUser.username}</span>
          </div>
          <div>{reportUser.email}</div>
          <div className="mt-3 flex flex-row gap-5">
            <span
              className={`rounded px-2 py-1 text-sm font-semibold ${
                reportUser.userRole === UserRole.SUPERADMIN
                  ? 'bg-red-800 text-gray-200'
                  : reportUser.userRole === UserRole.ADMIN
                    ? 'bg-black text-white'
                    : reportUser.userRole === UserRole.EDITOR
                      ? 'bg-purple-800 text-gray-200'
                      : reportUser.userRole === UserRole.WRITER
                        ? 'bg-yellow-500 text-gray-800'
                        : 'bg-gray-200 text-gray-800'
              }`}
            >
              {reportUser.userRole}
            </span>
            <span
              className={`rounded px-2 py-1 text-sm font-semibold ${
                reportUser.userStatus === UserStatus.BANNED
                  ? 'bg-red-800 text-gray-200'
                  : reportUser.userStatus === UserStatus.DELETED
                    ? 'bg-black text-white'
                    : reportUser.userStatus === UserStatus.ACTIVE
                      ? 'bg-purple-800 text-gray-200'
                      : 'bg-yellow-500 text-gray-800'
              }`}
            >
              {reportUser.userStatus}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3 px-2 lg:justify-end">
        <Button disabled={loading ? true : false} size="sm" variant="outline" onClick={closeModal}>
          Close
        </Button>
        <Button
          disabled={loading ? true : false}
          type="button"
          onClick={handleReportUser}
          size="sm"
        >
          {loading ? 'reporting...' : 'Report User'}
        </Button>
      </div>
    </div>
  );
};
