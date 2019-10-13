function merge(dest, src) {
  if (dest === null || typeof dest !== 'object' || Array.isArray(dest)) {
    return src;
  }

  if (src === null || typeof src !== 'object' || Array.isArray(src)) {
    return src;
  }

  const result = { ...dest };

  // eslint-disable-next-line no-restricted-syntax
  for (const key of Object.keys(src)) {
    result[key] = merge(result[key], src[key]);
  }

  return result;
}

export default merge;
