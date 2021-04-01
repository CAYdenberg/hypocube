import { ReactHandlers } from './types';

export const DASHED_LINE = [5, 5];
export const DOTTED_LINE = [1, 1];
export const SUPPORTED_EVENTS: Array<keyof ReactHandlers> = [
  'onPointerDown',
  'onPointerMove',
  'onPointerUp',
  'onPointerCancel',
  'onGotPointerCapture',
  'onLostPointerCapture',
  'onPointerEnter',
  'onPointerLeave',
  'onPointerOver',
  'onPointerOut',
];
