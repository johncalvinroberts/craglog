import isUndefined from './isUndefined';

export default (data, index) =>
  isUndefined(index)
    ? []
    : data.filter(
        (_, i) => (Array.isArray(index) ? index : [index]).indexOf(i) < 0,
      );
