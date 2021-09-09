import { Point } from '../types';
import Viewbox from './Viewbox';

const isAnyInView = (points: Point[], view: Viewbox): boolean => {
  return !!points.find(
    ([x, y]) =>
      x >= view.xMin && x <= view.xMax && y >= view.yMin && y <= view.yMax
  );
};

// TODO: we really need different types of filters for each data series type ...
export const filterToView = (data: Point[], view: Viewbox) => {
  return data.filter((_, i) => {
    if (i === 0) {
      return isAnyInView(data.slice(0, 2), view);
    }
    return isAnyInView(data.slice(i - 1, i + 2), view);
  });
};
