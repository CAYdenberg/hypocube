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

export const radiansToDegrees = (radians: number): number => {
  return (radians * 180) / Math.PI;
};

export const degreesToRadians = (degrees: number): number => {
  return (degrees * Math.PI) / 180;
};
