export default (value, digits) => {
  digits = digits || 2;

  const isNegative = Number(value) < 0;
  let buffer = value.toString();
  let size = 0;

  // Strip minus sign if number is negative
  if (isNegative) {
    buffer = buffer.slice(1);
  }

  size = digits - buffer.length + 1;
  buffer = new Array(size).join('0').concat(buffer);

  // Adds back minus sign if needed
  return (isNegative ? '-' : '') + buffer;
};
