import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction } from 'react';

interface MobileNavMenuType {
  item: itemType;
  subMenu: boolean;
  isChecked: string;
  setIsChecked: Dispatch<SetStateAction<string>>;
}

type itemType = {
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

export const MobileNavMenu = ({
  isChecked,
  setIsChecked,
  item,
  subMenu = false,
}: MobileNavMenuType) => {
  const router = useRouter();
  return subMenu ? (
    <div className="collapse-arrow collapse rounded-lg transition-all duration-500 ease-in-out">
      <input
        type="checkbox"
        checked={isChecked === item.text}
        onChange={() => setIsChecked(isChecked === item.text ? '' : item.text)}
        name="my-accordion-2"
        className="peer"
      />
      <div className="collapse-title px-2 py-1 peer-checked:bg-base-300/50 peer-checked:font-bold">
        {item.text}
      </div>
      <div className="collapse-content flex max-h-0 flex-col gap-2 text-sm transition-all duration-500 ease-in-out peer-checked:max-h-96 peer-checked:bg-base-300/50 peer-checked:pt-2">
        {item.content?.map((subItem, i) => (
          <div
            className="cursor-pointer rounded-md px-2 py-1"
            key={i}
            onClick={() => router.push(subItem.link)}
          >
            {subItem.text}
          </div>
        ))}
      </div>
    </div>
  ) : (
    <div className="cursor-pointer px-2 py-1">{item.text}</div>
  );
};
