import { PropsWithChildren, ReactElement, ReactFragment } from 'react';
import { ChartEventMetaData, ChartStyleT } from '../types';
import Viewbox from './Viewbox';

export type Props = PropsWithChildren<
  Record<
    string,
    | string
    | number
    | boolean
    | null
    | Viewbox
    | ChartEventMetaData
    | ChartStyleT
    | Function
    | ReactElement
    | ReactFragment
  >
>;

const isIndexed = (prop: any): prop is ChartStyleT | ChartEventMetaData => {
  return prop && !Array.isArray(prop) && typeof prop === 'object';
};

const isEqual = (a: Props, b: Props): boolean => {
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
        return (
          valA.xMin !== valB.xMin ||
          valA.yMin !== valB.yMin ||
          valA.xMax !== valB.xMax ||
          valA.yMax !== valB.yMax
        );
      }
      if (isIndexed(valA)) {
        if (!isIndexed(valB)) {
          return true;
        }
        return !isEqual(valA as Props, valB as Props);
      }
      return valA !== valB;
    })
  );
};

export default isEqual;
