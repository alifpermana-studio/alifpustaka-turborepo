'use client';

type FadeItemProps = {
  index: number;
};

export const FadeItem = ({ index }: FadeItemProps) => {
  const index0: string[] =
    index == 0 ? ['Built using top-tier tools, our platform ensures '] : [''];
  const index1: string[] =
    index == 1 ? ['easy maintenance, optimal speed, and cost efficiency. '] : [''];
  const index2: string[] =
    index == 2
      ? ['Designed to handle ', 'high traffic ', 'while delivering ', 'reliable performance, ']
      : ['', '', '', ''];
  const index3: string[] =
    index == 3 ? ['we provide ', 'a stable and responsive ', 'environment '] : ['', '', ''];
  const index4: string[] = index == 4 ? ['for all your web service needs.'] : [''];

  if (index == 0) {
    return <span>{index0[0]}</span>;
  } else if (index == 1) {
    return <span className={`font-bold text-accent`}>{index1[0]}</span>;
  } else if (index == 2) {
    return (
      <span>
        {index2[0]}
        <span className={`font-bold text-accent`}>{index2[1]}</span>
        {index2[2]}
        <span className={`font-bold text-accent`}>{index2[3]}</span>
      </span>
    );
  } else if (index == 3) {
    return (
      <span>
        <span>{index3[0]}</span>
        <span className={`font-bold text-accent`}>{index3[1]}</span>
        {index3[2]}
      </span>
    );
  } else if (index == 4) {
    return <span>{index4[0]}</span>;
  } else {
    return <></>;
  }
};
