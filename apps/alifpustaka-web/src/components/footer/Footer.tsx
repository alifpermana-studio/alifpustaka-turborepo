import Icons from '@/assets/Icons';
import { useTheme } from '@/contexts/ThemeContext';
import React from 'react';

const Footer = () => {
  const { theme } = useTheme();
  return (
    <footer
      className="relative mx-auto mt-10 footer flex max-w-7xl flex-col gap-4 rounded-xl bg-base-200! text-base-content sm:footer-horizontal"
      style={{
        background: `radial-gradient(circle at 10% 10%, var(--color-info) -200%, transparent 28%), radial-gradient(circle at 90% 90%, var(--color-accent) -200%, transparent 28%)`,
      }}
    >
      <div className="grid grid-cols-1 gap-10 p-10 lg:grid-cols-9">
        <aside className="col-span-3 grid basis-2/4 grid-cols-1 gap-2">
          {theme === 'dark' ? (
            <Icons icon="ap-dark-banner-logo" className="h-10 w-auto" />
          ) : (
            <Icons icon="ap-light-banner-logo" className="h-10 w-auto" />
          )}

          <p>Code that connect the world.</p>
          <p>
            Want to know when I publish new content? Enter your email to join my free newsletter:
          </p>
        </aside>
        <nav className="col-span-2 grid basis-1/4 grid-cols-1 gap-2">
          <h6 className="footer-title">Services</h6>
          <a className="link link-hover">Branding</a>
          <a className="link link-hover">Design</a>
          <a className="link link-hover">Marketing</a>
          <a className="link link-hover">Advertisement</a>
        </nav>
        <nav className="col-span-2 grid basis-1/4 grid-cols-1 gap-2">
          <h6 className="footer-title">Company</h6>
          <a className="link link-hover">About us</a>
          <a className="link link-hover">Contact</a>
          <a className="link link-hover">Jobs</a>
          <a className="link link-hover">Press kit</a>
        </nav>
        <nav className="col-span-2 grid basis-1/4 grid-cols-1 gap-2">
          <h6 className="footer-title">Legal</h6>
          <a className="link link-hover">Terms of use</a>
          <a className="link link-hover">Privacy policy</a>
          <a className="link link-hover">Cookie policy</a>
        </nav>
      </div>
      <div className="relative flex w-full items-center justify-center rounded-xl bg-base-300 py-4 text-lg text-base-content shadow-lg">
        <p>Copyright © {new Date().getFullYear()} - All right reserved by Alif Pustaka</p>
      </div>
    </footer>
  );
};

export default Footer;
