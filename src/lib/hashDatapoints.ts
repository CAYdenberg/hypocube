import Hashids from 'hashids';
import { Point } from '../types';

const hashids = new Hashids(
  '',
  1,
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
);

export const hashDatapoints = (data: Point[]) => {
  const flat = data.flatMap(([x, y]) => [Math.round(x), Math.round(y)]);

  return hashids.encode(flat);
};
