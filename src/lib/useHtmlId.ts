import { useRef } from 'react';

let counter = 0;

const randomHtmlId = () => {
  if (process.env.NODE_ENV === 'test') {
    counter++;
    return `id-${counter}`;
  }
  return `id-${Math.random()
    .toString(16)
    .slice(2)}`;
};

export default () => {
  return useRef<string>(randomHtmlId());
};
