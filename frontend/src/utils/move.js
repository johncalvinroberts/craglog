export default (arr, from, to) => {
  const clone = [...arr];
  Array.prototype.splice.call(
    clone,
    to,
    0,
    Array.prototype.splice.call(clone, from, 1)[0],
  );
  return clone;
};
