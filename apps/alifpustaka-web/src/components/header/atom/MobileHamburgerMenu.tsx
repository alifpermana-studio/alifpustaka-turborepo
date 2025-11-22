interface MobileHamburgerMenuType {
  dropDownSection: string;
  setDropDownSection: (e: string) => void;
}

export const MobileHamburgerMenu = ({
  dropDownSection,
  setDropDownSection,
}: MobileHamburgerMenuType) => {
  return (
    <button
      onClick={() =>
        setDropDownSection(dropDownSection == 'mobile-dropdown' ? '' : 'mobile-dropdown')
      }
      className="relative flex h-8 w-8 cursor-pointer items-center justify-center lg:hidden"
      aria-label="Toggle Menu"
    >
      <svg viewBox="0 0 24 24" className="h-6 w-6 stroke-current stroke-3" fill="none">
        {/* Top Line */}
        <line
          x1="3"
          y1="6"
          x2="21"
          y2="6"
          className={`origin-center transition-all duration-300 ease-in-out ${
            dropDownSection === 'mobile-dropdown'
              ? 'translate-y-2 opacity-0'
              : 'translate-y-0 opacity-100'
          }`}
          strokeLinecap="round"
        />
        {/* Middle Line */}
        <line
          x1="3"
          y1="12"
          x2="21"
          y2="12"
          className={`origin-center transition-all duration-300 ease-in-out ${
            dropDownSection === 'mobile-dropdown' ? 'rotate-45' : 'rotate-0'
          }`}
          strokeLinecap="round"
        />
        {/* Middle Line (second for cross) */}
        <line
          x1="3"
          y1="12"
          x2="21"
          y2="12"
          className={`origin-center transition-all duration-300 ease-in-out ${
            dropDownSection === 'mobile-dropdown' ? '-rotate-45' : 'rotate-0'
          }`}
          strokeLinecap="round"
        />
        {/* Bottom Line */}
        <line
          x1="3"
          y1="18"
          x2="21"
          y2="18"
          className={`origin-center transition-all duration-300 ease-in-out ${
            dropDownSection === 'mobile-dropdown'
              ? '-translate-y-2 opacity-0'
              : 'translate-y-0 opacity-100'
          }`}
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
};
