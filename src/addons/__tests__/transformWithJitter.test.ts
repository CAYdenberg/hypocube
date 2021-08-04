import { Point } from '../../types';
import transformWithJitter, { segment } from '../transformWithJitter';

describe('segment', () => {
  it('separates data into bins of a defined width', () => {
    const input = [1, 6, 7, 8, 13];
    const result = segment(input, 5);
    expect(result).toEqual([[1], [6, 7, 8], [13]]);
  });

  it('doesnt choke on boundary conditions', () => {
    const input = [1, 6, 7, 8, 11];
    const result = segment(input, 5);
    expect(result).toEqual([[1], [6, 7, 8], [11]]);
  });

  it('works on dataseries instead of numbers', () => {
    const input = [1, 6, 7, 8, 11];
    const result = segment(input, 5);
    expect(result).toEqual([[1], [6, 7, 8], [11]]);
  });
});

describe('transformWithJitter', () => {
  it('produces off-axis displacements', () => {
    const input = [1, 6, 7, 8, 13];

    const expected: Point[] = [
      [0, 1],
      [0, 6],
      [-0.25, 7],
      [0.5, 8],
      [0, 13],
    ];
    expect(
      transformWithJitter(input, { maxFrequency: 4, maxDisplacement: 1 })
    ).toEqual(expected);
  });
});
