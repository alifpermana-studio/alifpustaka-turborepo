import React, { useState } from 'react';
import { EllipsisVertical, Copy, Pencil, Trash2, Bug } from 'lucide-react';
import { Dropdown } from '../ui/dropdown/Dropdown';
import { DropdownItem } from '../ui/dropdown/DropdownItem';
import { useRouter } from 'next/navigation';
import { userOnAdminType } from 'next-auth';

type Props = {
  user: userOnAdminType;
  openEditRoleModal: () => void;
  openEditStatusModal: () => void;
  openDeleteModal: () => void;
  openReportModal: () => void;
  selectUser: (user: userOnAdminType) => void;
};

export const OptionList = ({
  user,
  openEditRoleModal,
  openEditStatusModal,
  openDeleteModal,
  openReportModal,
  selectUser,
}: Props) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  const handleEditRole = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectUser(user);
    openEditRoleModal();
    console.log('clicked');
  };

  const handleEditStatus = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectUser(user);
    openEditStatusModal();
  };

  const handleDeleteUser = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectUser(user);
    openDeleteModal();
  };

  const handleReportUser = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectUser(user);
    openReportModal();
  };
  return (
    <>
      <div
        onClick={() => setDropdownOpen(true)}
        className="w-fit cursor-pointer rounded-full p-2 transition-colors duration-200 ease-in-out hover:bg-gray-400 active:bg-gray-500 hover:dark:bg-gray-600 active:dark:bg-gray-500"
      >
        <EllipsisVertical />
      </div>
      <div className="absolute">
        <Dropdown
          isOpen={dropdownOpen}
          onClose={() => setDropdownOpen(false)}
          className="shadow-theme-lg dark:bg-gray-dark absolute right-0 mt-[6px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-2 dark:border-gray-800"
        >
          <ul className="flex flex-col gap-1 border-b border-gray-200 py-1 dark:border-gray-800">
            <li>
              <DropdownItem
                onItemClick={() => router.push(`/profile/${user.username}`)}
                className="group text-theme-sm flex items-center gap-3 rounded-lg px-3 py-2 font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              >
                <Copy />
                Go to Profile
              </DropdownItem>
            </li>
            <li>
              <DropdownItem
                onClick={handleEditRole}
                className="group text-theme-sm flex items-center gap-3 rounded-lg px-3 py-2 font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              >
                <Pencil />
                Edit Role
              </DropdownItem>
            </li>
            <li>
              <DropdownItem
                onClick={handleEditStatus}
                className="group text-theme-sm flex items-center gap-3 rounded-lg px-3 py-2 font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              >
                <Pencil />
                Edit Status
              </DropdownItem>
            </li>
            <li>
              <DropdownItem
                onClick={handleDeleteUser}
                className="group text-theme-sm flex items-center gap-3 rounded-lg px-3 py-2 font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              >
                <Trash2 />
                Delete
              </DropdownItem>
            </li>
            <li>
              <DropdownItem
                onClick={handleReportUser}
                className="group text-theme-sm flex items-center gap-3 rounded-lg px-3 py-2 font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              >
                <Bug />
                Report
              </DropdownItem>
            </li>
          </ul>
        </Dropdown>
      </div>
    </>
  );
};
