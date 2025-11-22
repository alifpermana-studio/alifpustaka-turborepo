'use client';

import { useModal } from '../../hooks/useModal';
import { Modal } from '../ui/modal';
import Button from '../ui/button/Button';
import Input from '../form/input/InputField';
import Label from '../form/Label';
import { useUser } from '@/context/UserContext';

export default function UserAddressCard() {
  const { user, updating, formData, setFormData, isOwner, status, updateUser } = useUser();

  const { isOpen, openModal, closeModal } = useModal();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await updateUser();
    closeModal();
  };

  if (status === 'not-found' || status === 'unauthenticated' || status === 'error') {
    return null;
  } else {
    return (
      <>
        <div className="rounded-2xl border border-gray-200 p-5 lg:p-6 dark:border-gray-800">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h4 className="text-lg font-semibold text-gray-800 lg:mb-6 dark:text-white/90">
                Address
              </h4>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-7 2xl:gap-x-32">
                <div>
                  <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                    Country
                  </p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {status === 'authenticated' ? `${user.address?.country || ''}` : status}
                  </p>
                </div>

                <div>
                  <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                    Province/State
                  </p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {status === 'authenticated' ? `${user.address?.province || ''}` : status}
                  </p>
                </div>

                <div>
                  <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                    City
                  </p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {status === 'authenticated' ? `${user.address?.city || ''}` : status}
                  </p>
                </div>

                <div>
                  <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                    POSTAL CODE
                  </p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {status === 'authenticated' ? `${user.address?.postCode || ''}` : status}
                  </p>
                </div>

                <div>
                  <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                    TAX ID
                  </p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {status === 'authenticated' ? `${user.address?.taxId || ''}` : status}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={openModal}
              className={`shadow-theme-xs w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-800 lg:w-auto dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 ${isOwner ? 'flex lg:inline-flex' : 'hidden'}`}
              disabled={status === 'authenticated' ? false : true}
            >
              <svg
                className="fill-current"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
                  fill=""
                />
              </svg>
              Edit
            </button>
          </div>
        </div>
        <Modal
          isOpen={isOpen}
          onClose={closeModal}
          className={`m-4 max-w-[700px] ${isOwner ? 'block' : 'hidden'}`}
        >
          <div className="no-scrollbar relative w-full overflow-y-auto rounded-3xl bg-white p-4 lg:p-11 dark:bg-gray-900">
            <div className="px-2 pr-14">
              <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                Edit Address
              </h4>
              <p className="mb-6 text-sm text-gray-500 lg:mb-7 dark:text-gray-400">
                Update your details to keep your profile up-to-date.
              </p>
            </div>
            <form className="flex flex-col" onSubmit={(e) => handleSubmit(e)}>
              <div className="custom-scrollbar max-h-[80svh] overflow-y-auto px-2">
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div>
                    <Label>Country</Label>
                    <Input
                      type="text"
                      value={formData.address?.country || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          address: { ...formData.address, country: e.target.value },
                        })
                      }
                    />
                  </div>

                  <div>
                    <Label>Province/State</Label>
                    <Input
                      type="text"
                      value={formData.address?.province || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          address: { ...formData.address, province: e.target.value },
                        })
                      }
                    />
                  </div>

                  <div>
                    <Label>City</Label>
                    <Input
                      type="text"
                      value={formData.address?.city || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          address: { ...formData.address, city: e.target.value },
                        })
                      }
                    />
                  </div>

                  <div>
                    <Label>Postal Code</Label>
                    <Input
                      type="text"
                      value={formData.address?.postCode || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          address: { ...formData.address, postCode: e.target.value },
                        })
                      }
                    />
                  </div>

                  <div>
                    <Label>TAX ID</Label>
                    <Input
                      type="text"
                      value={formData.address?.taxId || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          address: { ...formData.address, taxId: e.target.value },
                        })
                      }
                    />
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
        </Modal>
      </>
    );
  }
}
