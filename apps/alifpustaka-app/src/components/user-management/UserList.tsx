'use client';

import { RefreshCw } from 'lucide-react';
import { User, userOnAdminType, userRoleOnAdmin, userStatusOnAdmin } from 'next-auth';
import React, { useState } from 'react';
import { Modal } from '../ui/modal';
import { useModal } from '@/hooks/useModal';
import { DeleteUser } from './DeleteUser';
import { ReportUser } from './ReportUser';
import { Status, UserRole, UserStatus } from '@repo/prisma-config';
import { UserRow } from './UserRow';
import { EditUserStatus } from './EditUserStatus';
import { EditUserRole } from './EditUserRole';

type Props = {
  userList: userOnAdminType[];
  loading: boolean;
  reload: () => void;
};

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

const initUser: User = {
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
  bio: '',
};

const initRoleReq:userRoleOnAdmin = 
  {
    id: '',
    reqUserRole: UserRole.USER,
    reqById: '',
    reqMsg: '',
    resUserRole: UserRole.USER,
    resById: '',
    resMsg: '',
    status: Status.PENDING,
    updatedAt: Date.now(),
  };

const initStatusReq:userStatusOnAdmin = 
  {
    id: '',
    reqUserStatus: UserStatus.ACTIVE,
    reqById: '',
    reqMsg: '',
    resUserStatus: UserStatus.ACTIVE,
    resById: '',
    resMsg: '',
    status: Status.PENDING,
    updatedAt: Date.now(),
  };

const initUserOnAdmin: userOnAdminType = {
  ...initUser,
  roleReq: initRoleReq,
  actionedRoleReq: [initRoleReq],
  statusReq: initStatusReq,
  actionedStatusReq: [initStatusReq],
};

export const UserList = ({ userList, reload, loading }: Props) => {
  const [selectUser, setSelectUser] = useState<userOnAdminType>(initUserOnAdmin);

  const {
    isOpen: isEditRoleOpen,
    openModal: openEditRoleModal,
    closeModal: closeEditRoleModal,
  } = useModal();
  const {
    isOpen: isEditStatusOpen,
    openModal: openEditStatusModal,
    closeModal: closeEditStatusModal,
  } = useModal();

  const {
    isOpen: isDeleteOpen,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
  } = useModal();
  const {
    isOpen: isReportOpen,
    openModal: openReportModal,
    closeModal: closeReportModal,
  } = useModal();

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-separate border-spacing-y-2 rounded-lg text-gray-800 dark:text-gray-200">
        <thead className="">
          <tr>
            <th className="w-2/6 rounded-l-lg bg-gray-200 p-4 text-left dark:bg-gray-700">Name</th>
            <th className="w-1/6 bg-gray-200 p-4 dark:bg-gray-700">Created Time</th>
            <th className="w-1/6 bg-gray-200 p-4 dark:bg-gray-700">User Status</th>
            <th className="w-1/6 bg-gray-200 p-4 dark:bg-gray-700">Report Count</th>

            <th className="w-1/6 bg-gray-200 p-4 dark:bg-gray-700">Role</th>
            <th className="w-fit rounded-r-lg bg-gray-200 p-4 dark:bg-gray-700"></th>
          </tr>
        </thead>
        <tbody className="w-full">
          {loading ? (
            <tr>
              <td colSpan={6} className="rounded-lg bg-gray-200 p-4 text-center dark:bg-gray-800">
                <div className="flex w-full flex-row items-center justify-center gap-4">
                  <RefreshCw className="animate-spin" />
                  <span>Loading...</span>
                </div>
              </td>
            </tr>
          ) : (
            userList.map((user) => {
              if (user) {
                return (
                  <UserRow
                    key={user.id}
                    user={user}
                    openEditRoleModal={openEditRoleModal}
                    openEditStatusModal={openEditStatusModal}
                    openDeleteModal={openDeleteModal}
                    openReportModal={openReportModal}
                    selectedUser={(user) => setSelectUser(user)}
                  />
                );
              } else {
                return (
                  <tr key={1}>
                    <td
                      colSpan={5}
                      className="rounded-lg bg-gray-200 p-4 text-center dark:bg-gray-800"
                    >
                      <div className="flex w-full flex-row items-center justify-center gap-4">
                        <span>User not found</span>
                      </div>
                    </td>
                  </tr>
                );
              }
            })
          )}
        </tbody>
      </table>
      <Modal isOpen={isEditRoleOpen} onClose={closeEditRoleModal} className="m-4 max-w-[700px]">
        <EditUserRole
          isOpen={isEditRoleOpen}
          editUser={selectUser}
          reload={reload}
          closeModal={closeEditRoleModal}
        />
      </Modal>
      <Modal isOpen={isEditStatusOpen} onClose={closeEditStatusModal} className="m-4 max-w-[700px]">
        <EditUserStatus editUser={selectUser} reload={reload} closeModal={closeEditStatusModal} />
      </Modal>
      <Modal isOpen={isDeleteOpen} onClose={closeDeleteModal} className="m-4 max-w-[700px]">
        <DeleteUser deleteUser={selectUser} reload={reload} closeModal={closeDeleteModal} />
      </Modal>
      <Modal isOpen={isReportOpen} onClose={closeReportModal} className="m-4 max-w-[700px]">
        <ReportUser reportUser={selectUser} reload={reload} closeModal={closeReportModal} />
      </Modal>
    </div>
  );
};
