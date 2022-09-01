import React from 'react';
import Viewbox from '../api/Viewbox';

const isIndexed = (prop: unknown): prop is Record<string, unknown> => {
  return !!prop && typeof prop === 'object';
};

export const isEqual = (
  a: Record<string, unknown>,
  b: Record<string, unknown>,
  depth = 0
): boolean => {
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
        return !isEqual(valA, valB, depth + 1);
      }
      return valA !== valB;
    })
  );
};

export const Pure = <P>(Component: React.FC<P>) =>
  React.memo(Component, isEqual);
