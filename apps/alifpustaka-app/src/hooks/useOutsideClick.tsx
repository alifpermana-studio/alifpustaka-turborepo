'use client';

import { RefObject, useEffect, useState } from 'react';

export function useOutsideClick(ref: RefObject<HTMLDivElement | null>) {
  const [clickOutside, setClickOutside] = useState(false);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Element | null;
      if (ref.current && !ref.current.contains(target)) {
        setClickOutside(true);
      } else {
        setClickOutside(false);
      }
    }

    /* function handleMouseEnter(event: any) {
      setClickOutside(false);
    } */

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);
  return { clickOutside: clickOutside };
}
