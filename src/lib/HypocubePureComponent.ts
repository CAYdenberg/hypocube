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
    | Function
    | ReactElement
    | ReactFragment
  >
>;

const isIndexed = (prop: any): prop is ChartStyleT | ChartEventMetaData => {
  return prop && typeof prop === 'object';
};

const arrayIsEqual = (a: Array<any>, b: Array<any>, depth: number = 0) => {
  if (a.length !== b.length) {
    return false;
  }
  return true;
};

export const isEqual = (a: Props, b: Props, depth: number = 0): boolean => {
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
      if (Array.isArray(valA) && Array.isArray(valB)) {
        return !arrayIsEqual(valA, valB);
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
