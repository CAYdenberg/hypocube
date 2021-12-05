import { Point } from '../types';

export const closeLineToEdge = (
  line: Point[],
  yEdge: number
): Point[] | null => {
  if (line.length < 2) {
    return null;
  }

  const first = line[0];
  const last = line[line.length - 1];

  return [[first[0], yEdge], ...line, [last[0], yEdge]];
};
