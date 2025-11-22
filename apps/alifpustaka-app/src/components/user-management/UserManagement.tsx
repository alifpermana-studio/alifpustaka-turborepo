'use client';

import { User, UserFilter as UserFilterType } from 'next-auth';
import React, { useEffect, useState } from 'react';
import { UserList } from './UserList';
import { UserFilter } from './UserFilter';
import formatDate from '@/lib/FormatDate';
import { useUser } from '@/context/UserContext';

const initial: UserFilterType = {
  sort: 'createdAt',
  order: 'asc',
  search: '',
  max: 20,
  skip: 0,
};

export const UserManagement = () => {
  const [loading, setLoading] = useState(false);
  const [userList, setUserList] = useState([]);
  const [filter, setFilter] = useState<UserFilterType>(initial);
  const [refresh, setRefresh] = useState(false);
  const { status } = useUser();

  useEffect(() => {
    fetchUserList(filter);
  }, [filter]);

  useEffect(() => {
    if (refresh) {
      fetchUserList(filter);
    }
  }, [refresh]);

  const fetchUserList = async (filter: UserFilterType) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/user-list?sort=${filter.sort}&order=${filter.order}${filter.search ? `&search=${filter.search}` : ''}&skip=${filter.skip}&max=${filter.max}`,
        {
          method: 'GET',
        },
      );

      const { success, data, error } = await res.json();
      console.log('Check: ', data, error);
      if (success) {
        const transformData = data.map((user: User) => {
          const time = formatDate(user.createdAt as string);
          return { ...user, createdAt: time };
        });
        setUserList(transformData);
      }
    } catch (err) {
      console.log('Error fetch user list: ', err);
    } finally {
      setLoading(false);
      setRefresh(false);
    }
  };

  if (status === 'loading') {
    <div className="flex w-full items-center justify-center">loading...</div>;
  }

  if (status !== 'loading' && status !== 'authenticated') {
    <div className="flex w-full items-center justify-center">
      You are unauthenticated, please sign in again.
    </div>;
  }

  return (
    <div className="w-full">
      <UserFilter
        loading={loading}
        filter={filter}
        setFilter={setFilter}
        refresh={refresh}
        setRefresh={setRefresh}
      />
      <UserList userList={userList} loading={loading} reload={() => setRefresh(!refresh)} />
    </div>
  );
};
