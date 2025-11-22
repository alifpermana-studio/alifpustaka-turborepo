// components/molecules/NavList.jsx

import { ReactNode } from 'react';

type DekstopNavListType = {
  children: ReactNode;
};

export const DekstopNavList = ({ children }: DekstopNavListType) => (
  <ul className="hidden justify-between gap-4 lg:flex">{children}</ul>
);
