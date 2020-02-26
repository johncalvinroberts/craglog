export default (data, index, value) => [
  ...data.slice(0, index),
  ...(Array.isArray(value) ? value : [value || null]),
  ...data.slice(index),
];
