// templates/DefaultLayoutTemplate.jsx
import React, { ReactNode, useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { throttle } from 'lodash';
import { useScrollTracker } from '@/contexts/ScrollRectContext';
import NavigationBar from '@/components/header/organism/NavigationBar';
import Footer from '@/components/footer/Footer';

type LayoutTemplateType = {
  children: ReactNode;
  navItems: itemContentType[];
};

type itemContentType = {
  text: string;
  link?: string;
  content?: ContentType[];
};

type ContentType = {
  text: string;
  link: string;
  icon: string;
  desc: string;
};

export const DefaultLayoutTemplate = ({ children, navItems }: LayoutTemplateType) => {
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { setContainerRect, setScrollTop } = useScrollTracker();

  const handleScroll = throttle(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setContainerRect(rect);
      setScrollTop(containerRef.current.scrollTop);
    }
  }, 200);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    el.addEventListener('scroll', handleScroll);

    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main ref={containerRef} className={`default-layout ${theme}`}>
      <header className="sticky top-0 z-30">
        <NavigationBar navItems={navItems} />
      </header>
      {children}
      <Footer />
    </main>
  );
};
