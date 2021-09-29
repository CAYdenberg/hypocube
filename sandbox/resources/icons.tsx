// icon:zoom-in | Bootstrap https://icons.getbootstrap.com/ | Bootstrap
import * as React from 'react';

interface Props {
  size?: number;
}

export const ZoomInIcon: React.FC<Props> = (props) => {
  return (
    <svg
      fill="currentColor"
      viewBox="0 0 16 16"
      height="1em"
      width="1em"
      {...props}
    >
      <path
        fillRule="evenodd"
        d="M6.5 12a5.5 5.5 0 100-11 5.5 5.5 0 000 11zM13 6.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z"
      />
      <path d="M10.344 11.742c.03.04.062.078.098.115l3.85 3.85a1 1 0 001.415-1.414l-3.85-3.85a1.007 1.007 0 00-.115-.1 6.538 6.538 0 01-1.398 1.4z" />
      <path
        fillRule="evenodd"
        d="M6.5 3a.5.5 0 01.5.5V6h2.5a.5.5 0 010 1H7v2.5a.5.5 0 01-1 0V7H3.5a.5.5 0 010-1H6V3.5a.5.5 0 01.5-.5z"
      />
    </svg>
  );
};

// icon:zoom-out | Bootstrap https://icons.getbootstrap.com/ | Bootstrap
export const ZoomOutIcon: React.FC<Props> = (props) => {
  return (
    <svg
      fill="currentColor"
      viewBox="0 0 16 16"
      height="1em"
      width="1em"
      {...props}
    >
      <path
        fillRule="evenodd"
        d="M6.5 12a5.5 5.5 0 100-11 5.5 5.5 0 000 11zM13 6.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z"
      />
      <path d="M10.344 11.742c.03.04.062.078.098.115l3.85 3.85a1 1 0 001.415-1.414l-3.85-3.85a1.007 1.007 0 00-.115-.1 6.538 6.538 0 01-1.398 1.4z" />
      <path
        fillRule="evenodd"
        d="M3 6.5a.5.5 0 01.5-.5h6a.5.5 0 010 1h-6a.5.5 0 01-.5-.5z"
      />
    </svg>
  );
};

// icon:chevron-double-right | Bootstrap https://icons.getbootstrap.com/ | Bootstrap
export const ChevronDoubleRightIcon: React.FC<Props> = (props) => {
  return (
    <svg
      fill="currentColor"
      viewBox="0 0 16 16"
      height="1em"
      width="1em"
      {...props}
    >
      <path
        fillRule="evenodd"
        d="M3.646 1.646a.5.5 0 01.708 0l6 6a.5.5 0 010 .708l-6 6a.5.5 0 01-.708-.708L9.293 8 3.646 2.354a.5.5 0 010-.708z"
      />
      <path
        fillRule="evenodd"
        d="M7.646 1.646a.5.5 0 01.708 0l6 6a.5.5 0 010 .708l-6 6a.5.5 0 01-.708-.708L13.293 8 7.646 2.354a.5.5 0 010-.708z"
      />
    </svg>
  );
};
