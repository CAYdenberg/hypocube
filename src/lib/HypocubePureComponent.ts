import React, { PropsWithChildren, ReactElement, ReactFragment } from 'react';
import { ChartEventMetaData, ChartStyleT } from '../types';
import Viewbox from '../api/Viewbox';
import { Point } from '..';

type Primitive = string | number | boolean | null;

export type Props = PropsWithChildren<
  Record<
    string,
    | Primitive
    | Array<Primitive>
    | Array<Point>
    | Viewbox
    | ChartEventMetaData
    | ChartStyleT
    // type of function is unknown, could include user-declared callbacks
    // eslint-disable-next-line @typescript-eslint/ban-types
    | Function
    | ReactElement
    | ReactFragment
  >
>;

const isIndexed = (prop: unknown): prop is ChartStyleT | ChartEventMetaData => {
  return !!prop && typeof prop === 'object';
};

export const isEqual = (a: Props, b: Props, depth = 0): boolean => {
  if (depth > 1) {
    return a === b;
  }

  const aKeys = Object.keys(a);
  const missingInA = Object.keys(b).find((key) => !aKeys.includes(key));

  return (
    !missingInA &&
    !Object.keys(a).find((key) => {
      const valA = a[key];
      const valB = b[key];
      if (valA instanceof Viewbox) {
        if (!(valB instanceof Viewbox)) {
          return true;
        }
        return !valA.isEqual(valB);
      }
      if (isIndexed(valA) && isIndexed(valB)) {
        return !isEqual(valA as Props, valB as Props, depth + 1);
      }
      return valA !== valB;
    })
  );
};

export const Pure = <Props>(Component: React.FC<Props>): React.FC<Props> =>
  React.memo(Component, isEqual);
