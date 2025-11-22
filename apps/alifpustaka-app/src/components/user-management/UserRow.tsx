import { userOnAdminType } from 'next-auth';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { OptionList } from './OptionList';
import { UserRole, UserStatus } from '@repo/prisma-config';
import { CircleAlert } from 'lucide-react';

type Props = {
  user: userOnAdminType;
  openEditRoleModal: () => void;
  openEditStatusModal: () => void;
  openDeleteModal: () => void;
  openReportModal: () => void;
  selectedUser: (user: userOnAdminType) => void;
};

export const UserRow = ({
  user,
  selectedUser,
  openEditRoleModal,
  openEditStatusModal,
  openDeleteModal,
  openReportModal,
}: Props) => {
  const [onHover, setOnHover] = useState(false);
  const router = useRouter();
  const reportedCount = 184;

  return (
    <tr
      onMouseEnter={() => setOnHover(true)}
      onMouseLeave={() => setOnHover(false)}
      key={user.id}
      onClick={() => router.push(`/profile/${user.username}`)}
      className="w-full cursor-pointer hover:bg-gray-300 hover:dark:bg-gray-700"
    >
      <td
        className={`w-2/6 ${onHover ? 'bg-gray-300 dark:bg-gray-700' : 'bg-gray-200 dark:bg-gray-800'} rounded-l-lg p-4 text-left`}
      >
        <p className="flex flex-row gap-3">
          <span>{`${user.fname} ${user.lname}`}</span>
          <span className="font italic opacity-70">{`~  ${user.username}`}</span>
        </p>
      </td>
      <td
        className={`w-1/6 ${onHover ? 'bg-gray-300 dark:bg-gray-700' : 'bg-gray-200 dark:bg-gray-800'} p-4 text-center`}
      >
        {user.createdAt}
      </td>
      <td
        className={`w-1/6 ${onHover ? 'bg-gray-300 dark:bg-gray-700' : 'bg-gray-200 dark:bg-gray-800'} p-4 text-center`}
      >
        <div
          title={`${user.roleReq.status === 'PENDING' ? 'This user has pending request for status changing.' : ''}`}
          className="flex w-full flex-row items-center justify-center gap-2"
        >
          <span
            className={`rounded px-2 py-1 text-sm font-semibold ${
              user.userStatus === UserStatus.BANNED
                ? 'bg-red-800 text-gray-200'
                : user.userStatus === UserStatus.DELETED
                  ? 'bg-black text-white'
                  : user.userStatus === UserStatus.ACTIVE
                    ? 'bg-purple-800 text-gray-200'
                    : 'bg-yellow-500 text-gray-800'
            }`}
          >
            {user.userStatus}
          </span>
          {user.statusReq.status === 'PENDING' && (
            <CircleAlert className="text-orange-500 dark:text-orange-300" />
          )}
        </div>
      </td>

      <td
        className={`w-1/6 ${onHover ? 'bg-gray-300 dark:bg-gray-700' : 'bg-gray-200 dark:bg-gray-800'} p-4 text-center`}
      >
        <span
          className={`rounded px-2 py-1 text-sm font-semibold ${
            reportedCount < 1
              ? 'bg-green-600 text-green-100'
              : reportedCount < 10
                ? 'bg-green-300 text-green-800'
                : reportedCount < 50
                  ? 'bg-orange-500 text-gray-100'
                  : reportedCount < 100
                    ? 'bg-red-700 text-red-200'
                    : 'bg-gray-900 text-gray-100'
          }`}
        >
          {reportedCount}
        </span>
      </td>
      <td
        className={`w-1/6 ${onHover ? 'bg-gray-300 dark:bg-gray-700' : 'bg-gray-200 dark:bg-gray-800'} p-4 text-center`}
      >
        <div
          title={`${user.roleReq.status === 'PENDING' ? 'This user has pending request for role changing.' : ''}`}
          className="flex w-full flex-row items-center justify-center gap-2"
        >
          <span
            className={`rounded px-2 py-1 text-sm font-semibold ${
              user.userRole === UserRole.SUPERADMIN
                ? 'bg-red-800 text-gray-200'
                : user.userRole === UserRole.ADMIN
                  ? 'bg-black text-white'
                  : user.userRole === UserRole.EDITOR
                    ? 'bg-purple-800 text-gray-200'
                    : user.userRole === UserRole.WRITER
                      ? 'bg-yellow-500 text-gray-800'
                      : 'bg-gray-200 text-gray-800'
            }`}
          >
            {user.userRole}
          </span>
          {user.roleReq?.status === 'PENDING' && (
            <CircleAlert className="text-orange-500 dark:text-orange-300" />
          )}
        </div>
      </td>
      <td
        onClick={(e) => e.stopPropagation()}
        className={`w-fit ${onHover ? 'bg-gray-300 dark:bg-gray-700' : 'bg-gray-200 dark:bg-gray-800'} rounded-r-lg p-4 text-center`}
      >
        <OptionList
          user={user}
          openEditRoleModal={openEditRoleModal}
          openEditStatusModal={openEditStatusModal}
          openDeleteModal={openDeleteModal}
          openReportModal={openReportModal}
          selectUser={(u) => selectedUser(u)}
        />
      </td>
    </tr>
  );
};
