import React, { Dispatch, SetStateAction, useState } from 'react';
import Button from '../ui/button/Button';
import { FormDataType } from 'next-auth';
import Input from '../form/input/InputField';
import Label from '../form/Label';
import { Dropdown } from '../ui/dropdown/Dropdown';
import { DropdownItem } from '../ui/dropdown/DropdownItem';

import { CircleAlert } from 'lucide-react';
import { UserRole } from '@repo/prisma-config';

type Props = {
  updating: boolean;
  closeModal: () => void;
  updateUser: () => void;
  formData: FormDataType;
  setFormData: Dispatch<SetStateAction<FormDataType>>;
};

export const EditMetaCard = ({
  updating,
  closeModal,
  updateUser,
  formData,
  setFormData,
}: Props) => {
  const [dropdown, setDropdown] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await updateUser();
    closeModal();
  };

  const selectRole = (e: UserRole) => {
    setFormData((prev) => ({ ...prev, roleReq: { ...prev.roleReq, reqUserRole: e } }));
    setDropdown(false);
  };

  return (
    <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 lg:p-11 dark:bg-gray-900">
      <div className="px-2 pr-14">
        <h4 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
          Edit Personal Information
        </h4>
        <p className="mb-6 text-sm text-gray-500 lg:mb-7 dark:text-gray-400">
          Update your details to keep your profile up-to-date.
        </p>
      </div>
      <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col">
        <div className="custom-scrollbar max-h-[80svh] overflow-y-auto px-2 pb-3">
          <div>
            <h5 className="my-2 text-lg font-medium text-gray-800 dark:text-white/90">
              Social Links
            </h5>

            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
              <div>
                <Label>Facebook</Label>
                <Input
                  type="url"
                  value={formData.social?.facebook || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      social: { ...prev.social, facebook: e.target.value },
                    }))
                  }
                />
              </div>

              <div>
                <Label>X.com</Label>
                <Input
                  type="url"
                  value={formData.social?.x || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      social: { ...formData.social, x: e.target.value },
                    })
                  }
                />
              </div>

              <div>
                <Label>Linkedin</Label>
                <Input
                  type="url"
                  value={formData.social?.linkedin || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      social: { ...formData.social, linkedin: e.target.value },
                    })
                  }
                />
              </div>

              <div>
                <Label>Instagram</Label>
                <Input
                  type="url"
                  value={formData.social?.instagram || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      social: { ...formData.social, instagram: e.target.value },
                    })
                  }
                />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-2 p-2">
          <h5 className="mb-2 text-lg font-medium text-gray-800 dark:text-white/90">Apply Role</h5>

          <div className="grid grid-cols-1 gap-y-2 text-gray-800 dark:text-gray-200">
            <div>
              <div className="relative flex w-fit flex-col gap-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setDropdown(!dropdown);
                  }}
                  className="focus:border-brand-300 focus:ring-brand-500/10 relative flex appearance-none flex-row gap-2 rounded-lg border-2 border-gray-200 bg-transparent bg-none px-3.5 py-3 leading-tight text-gray-700 focus:ring-3 focus:outline-hidden dark:border-gray-800 dark:text-gray-400"
                >
                  <p>{formData.roleReq.reqUserRole}</p>
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
                  {Object.values(UserRole).map((n, i) => (
                    <DropdownItem
                      key={i}
                      onClick={() => {
                        selectRole(n as UserRole);
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
            <p>Why you want to change your role?</p>
            <Input
              placeholder="Because I want to ..."
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  roleReq: { ...prev.roleReq, reqMsg: e.target.value },
                }))
              }
            />
            <div className="flex flex-row gap-3 text-red-400">
              <CircleAlert />
              <p>Your request will be evaluated by the admin. This will take at least 24 hours.</p>
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-center gap-3 px-2 lg:justify-end">
          <Button
            disabled={updating ? true : false}
            size="sm"
            variant="outline"
            onClick={closeModal}
          >
            Close
          </Button>
          <Button disabled={updating ? true : false} type="submit" size="sm">
            {updating ? 'processing...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
};
