import { AlertIcon } from '@/icons';
import React from 'react';

type alertType = {
  message: string;
};

export const FormAlert = ({ message }: alertType) => {
  return (
    <p
      className={`text-triadicred1 mt-2 flex flex-row gap-2 text-red-700 dark:text-red-400 ${message ? 'visible' : 'hidden'}`}
    >
      <AlertIcon />
      <span>{message}</span>
    </p>
  );
};
