'use client';

import { Dropdown } from '@/components/ui/dropdown/Dropdown';
import { DropdownItem } from '@/components/ui/dropdown/DropdownItem';

import {
  ALargeSmall,
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
  CaseLower,
  Clock,
  Flag,
  FunnelPlus,
  IdCard,
  RotateCw,
} from 'lucide-react';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import Input from '../form/input/InputField';
import { UserFilter as UserFilterType } from 'next-auth';

type Props = {
  loading: boolean;
  filter?: UserFilterType;
  setFilter: Dispatch<SetStateAction<UserFilterType>>;
  refresh: boolean;

  setRefresh: Dispatch<SetStateAction<boolean>>;
};

export const UserFilter = ({ loading, filter, setFilter, refresh, setRefresh }: Props) => {
  return (
    <div className="flex w-full flex-row items-center justify-between gap-10 py-2 text-gray-800 dark:text-gray-200">
      <FilterAndRefresh
        loading={loading}
        filter={filter}
        setFilter={setFilter}
        refresh={refresh}
        setRefresh={setRefresh}
      />
    </div>
  );
};

const FilterAndRefresh = ({ loading, setFilter, refresh, setRefresh }: Props) => {
  const [searchKey, setSearchKey] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSort = (sort: string) => {
    setFilter((prev) => ({ ...prev, sort: sort }));
    setDropdownOpen(false);
  };

  const handleOrder = (order: string) => {
    setFilter((prev) => ({ ...prev, order: order }));

    setDropdownOpen(false);
  };

  useEffect(() => {
    if (!searchKey) setFilter((prev) => ({ ...prev, search: '' }));
    const search = setTimeout(() => {
      setFilter((prev) => ({ ...prev, search: searchKey }));
    }, 1000);
    return () => clearTimeout(search);
  }, [searchKey]);

  return (
    <div className="flex w-full flex-row items-center justify-between gap-5">
      <div className="w-full">
        <Input
          className="w-full"
          id="search"
          name="search"
          placeholder="Find user"
          value={searchKey}
          onChange={(e) => setSearchKey(e.target.value)}
        />
      </div>
      <div className="flex flex-row gap-1">
        <button
          onClick={() => setDropdownOpen(true)}
          disabled={loading}
          className="cursor-pointer rounded-md p-1 hover:bg-blue-200/20"
          title="Sort"
        >
          <FunnelPlus />
        </button>
        <button
          disabled={refresh}
          onClick={() => setRefresh(true)}
          className={`cursor-pointer rounded-full p-1 hover:bg-blue-200/20 ${loading ? 'animate-spin' : ''}`}
          title="Refresh"
        >
          <RotateCw />
        </button>
        <div className="relative">
          <Dropdown
            isOpen={dropdownOpen}
            onClose={() => setDropdownOpen(false)}
            className="shadow-theme-lg dark:bg-gray-dark absolute right-0 mt-[40px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-2 dark:border-gray-800"
          >
            <ul className="flex flex-col gap-1 border-b-4 border-gray-200 py-1 dark:border-gray-800">
              <li>
                <DropdownItem
                  onClick={() => handleSort('fname')}
                  className="group text-theme-sm flex items-center gap-3 rounded-lg px-3 py-2 font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                >
                  <ALargeSmall />
                  First Name
                </DropdownItem>
              </li>

              <li>
                <DropdownItem
                  onClick={() => handleSort('username')}
                  className="group text-theme-sm flex items-center gap-3 rounded-lg px-3 py-2 font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                >
                  <CaseLower />
                  Username
                </DropdownItem>
              </li>
              <li>
                <DropdownItem
                  onClick={() => handleSort('role')}
                  className="group text-theme-sm flex items-center gap-3 rounded-lg px-3 py-2 font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                >
                  <IdCard />
                  Role
                </DropdownItem>
              </li>
              <li>
                <DropdownItem
                  onClick={() => handleSort('roleStatus')}
                  className="group text-theme-sm flex items-center gap-3 rounded-lg px-3 py-2 font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                >
                  <Flag />
                  Role Status
                </DropdownItem>
              </li>
              <li>
                <DropdownItem
                  onClick={() => handleSort('createdAt')}
                  className="group text-theme-sm flex items-center gap-3 rounded-lg px-3 py-2 font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                >
                  <Clock />
                  Create Time
                </DropdownItem>
              </li>
            </ul>
            <ul className="flex flex-col gap-1 border-b border-gray-200 py-1 dark:border-gray-800">
              <li>
                <DropdownItem
                  onClick={() => handleOrder('asc')}
                  className="group text-theme-sm flex items-center gap-3 rounded-lg px-3 py-2 font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                >
                  <ArrowDownWideNarrow />
                  Ascending
                </DropdownItem>
              </li>
              <li>
                <DropdownItem
                  onClick={() => handleOrder('desc')}
                  className="group text-theme-sm flex items-center gap-3 rounded-lg px-3 py-2 font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                >
                  <ArrowUpNarrowWide />
                  Descending
                </DropdownItem>
              </li>
            </ul>
          </Dropdown>
        </div>
      </div>
    </div>
  );
};
