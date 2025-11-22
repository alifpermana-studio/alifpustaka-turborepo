import { UserStatus } from '@repo/prisma-config';
import { userOnAdminType } from 'next-auth';
import React, { useEffect, useState } from 'react';
import { Dropdown } from '../ui/dropdown/Dropdown';
import { DropdownItem } from '../ui/dropdown/DropdownItem';
import Input from '../form/input/InputField';

type Props = {
  editUser: userOnAdminType;
  reload: () => void;
  closeModal: () => void;
};

export const EditUserStatus = ({ editUser, reload, closeModal }: Props) => {
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState('');
  const [dropdown, setDropdown] = useState(false);
  const [formData, setFormData] = useState(editUser);

  useEffect(() => {
    setFormData(editUser);
  }, [editUser]);

  const updateUserStatus = async () => {
    try {
      setLoading(true);
      setAction('accept');

      const res = await fetch('/api/update-user', {
        method: 'POST',
        body: JSON.stringify({
          action: 'update-user-status',
          data: formData,
        }),
      });

      const { success, error } = await res.json();

      if (success) {
        console.log('Success update status');
        closeModal();
        reload();
      } else {
        console.log('Failed update status: ', error);
      }
    } catch (error) {
      console.log('Error update status: ', error);
    } finally {
      setLoading(false);
      setAction('');
    }
  };

  const rejectUserStatus = async () => {
    try {
      setLoading(true);
      setAction('reject');

      const res = await fetch('/api/update-user', {
        method: 'POST',
        body: JSON.stringify({
          action: 'reject-user-status',
          data: formData,
        }),
      });

      const { success, error } = await res.json();

      if (success) {
        console.log('Success update role');
        closeModal();
        reload();
      } else {
        console.log('Failed update role: ', error);
      }
    } catch (error) {
      console.log('Error update role: ', error);
    } finally {
      setLoading(false);
      setAction('');
    }
  };
  return (
    <div className="no-scrollbar relative w-full overflow-y-auto rounded-3xl bg-white p-4 lg:p-11 dark:bg-gray-900">
      <div className="px-2 pr-14">
        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
          Edit User Status
        </h4>
        <p className="mb-6 text-sm text-gray-500 lg:mb-7 dark:text-gray-400">
          This status refers to user activity.
        </p>
      </div>
      <div className="px-2 text-gray-800 dark:text-white/90">
        <h5 className="mb-4 text-xl font-semibold">Apply Role</h5>
        <div className="flex w-full flex-col items-center justify-center gap-3 md:justify-between">
          <div className="flex w-full flex-col gap-3">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <h6>Current Status </h6>
              <div>{editUser.userStatus}</div>
            </div>
            {formData.statusReq.id ? (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <h6>Request Status </h6>
                <div>{formData.statusReq.reqUserStatus}</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 items-center gap-3 md:grid-cols-2">
                <h6>Assign Status </h6>
                <div>
                  <div className="relative flex w-fit flex-col gap-3">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setDropdown(!dropdown);
                      }}
                      className="focus:border-brand-300 focus:ring-brand-500/10 relative flex appearance-none flex-row gap-2 rounded-lg border-2 border-gray-200 bg-transparent bg-none px-1 py-1 leading-tight text-gray-700 focus:ring-3 focus:outline-hidden dark:border-gray-800 dark:text-gray-400"
                    >
                      <p>{formData.userStatus}</p>
                      <div
                        className={`pointer-events-none inset-y-0 right-3 flex items-center text-gray-700 transition-transform duration-300 ease-in-out dark:text-gray-400 ${dropdown ? 'rotate-180' : 'rotate-0'}`}
                      >
                        <svg
                          className="stroke-current"
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M4.79175 7.396L10.0001 12.6043L15.2084 7.396"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </button>
                    <Dropdown
                      isOpen={dropdown}
                      onClose={() => setDropdown(false)}
                      className={`no-scrollbar absolute z-10 mt-10 w-fit flex-col overflow-y-auto rounded-xl border border-amber-50/20 dark:bg-gray-900 ${dropdown ? 'flex' : 'hidden'}`}
                    >
                      {Object.values(UserStatus).map((n, i) => (
                        <DropdownItem
                          key={i}
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              statusReq: {
                                ...prev.statusReq,
                                reqStatus: n,
                              },
                            }));
                            setDropdown(false);
                          }}
                          className="flex cursor-pointer flex-row justify-between px-3 py-1 text-gray-700 dark:text-gray-400 hover:dark:bg-gray-700"
                        >
                          <div>{n}</div>
                        </DropdownItem>
                      ))}
                    </Dropdown>
                  </div>
                </div>
                <div className="col-span-2 grid gap-2">
                  <p>Why you want to change user status?</p>
                  <Input
                    placeholder="Because the user ..."
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        statusReq: { ...prev.statusReq, resMsg: e.target.value },
                      }))
                    }
                  />
                </div>
              </div>
            )}
          </div>
          <div className="flex w-full flex-row items-center justify-center gap-3 pt-3">
            {formData.statusReq.id ? (
              <button
                disabled={loading}
                onClick={rejectUserStatus}
                className={`${loading ? 'opacity-85' : 'opacity-100'} w-full rounded-lg bg-red-800 px-3 py-1 text-gray-200 transition-transform duration-200 ease-in-out hover:scale-105 active:scale-110`}
              >
                {action === 'reject' ? 'rejecting...' : 'REJECT'}
              </button>
            ) : (
              <button
                disabled={loading}
                onClick={closeModal}
                className={`${loading ? 'opacity-85' : 'opacity-100'} w-full rounded-lg bg-red-800 px-3 py-1 text-gray-200 transition-transform duration-200 ease-in-out hover:scale-105 active:scale-110`}
              >
                CANCEL
              </button>
            )}

            <button
              disabled={loading}
              onClick={updateUserStatus}
              className={`${loading ? 'opacity-85' : 'opacity-100'} w-full rounded-lg bg-blue-800 px-3 py-1 text-gray-200 transition-transform duration-200 ease-in-out hover:scale-105 active:scale-110`}
            >
              {action === 'accept'
                ? formData.statusReq.id
                  ? 'accepting...'
                  : 'assigning...'
                : formData.statusReq.id
                  ? 'ACCEPT'
                  : 'ASSIGN'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
