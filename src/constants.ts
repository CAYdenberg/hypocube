import { ChartEventHandlers } from './types';

export const DASHED_LINE = [5, 5];
export const DOTTED_LINE = [1, 1];
export const SUPPORTED_EVENTS: Array<keyof Omit<
  ChartEventHandlers,
  'onGesture'
>> = [
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
export const WINDOW_RESIZE_RENDER_RATE = 500;
export const DEFAULT_FONT_FAMILY =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Roboto Light', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'";
