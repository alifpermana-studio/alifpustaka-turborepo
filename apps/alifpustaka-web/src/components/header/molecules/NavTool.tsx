// components/molecules/NavList.jsx

import { ReactNode } from 'react';

type DekstopNavToolType = {
  children: ReactNode;
};

export const NavTool = ({ children }: DekstopNavToolType) => (
  <ul className="relative z-10 hidden items-center justify-between gap-4 lg:flex">{children}</ul>
);
