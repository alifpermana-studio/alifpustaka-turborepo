'use client';

import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';

export const UserCheck = () => {
  const { data, status } = useSession();

  useEffect(() => {
    console.log('Check status: ', status);
    if (status === 'authenticated') {
      console.log('Check data: ', data);
    }
  }, [status]);
  return <div>UserCheck</div>;
};
