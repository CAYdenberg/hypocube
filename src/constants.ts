import { HypocubeHandlers } from './types';

export const DASHED_LINE = [5, 5];
export const DOTTED_LINE = [1, 1];
export const SUPPORTED_EVENTS: Array<keyof HypocubeHandlers> = [
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
  'onWheel',
];
