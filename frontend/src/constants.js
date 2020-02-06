/* eslint-disable prefer-destructuring */
export const API_BASE_PATH = process.env.API_BASE_PATH;
export const TOKEN_KEY = 'craglog_token';
export const CACHE_LIMIT = 30000;
export const DATE_FORMAT = 'MM/dd HH:mm.SS';
export const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
/* eslint-enable prefer-destructuring */

export const tickTypeEnum = [
  // sport and trad/solo
  'lead',
  'flash',
  'onsight',
  'redpoint',
  'pinkpoint',
  'ropedog',
  'firstAscent',
  'firstFreeAscent',
  'allFreeWithRest',
  // toprope
  'topRopeFreeAscent',
  'topRopeWithRest',
  // boulder
  'send',
  'dab',
  'repeatSend',
  // failures
  'retreat',
  'attempt',
  'utterFailure',
];

export const sportAndTradTickTypeEnum = [
  'lead',
  'flash',
  'onsight',
  'redpoint',
  'pinkpoint',
  'ropedog',
  'firstFreeAscent',
  'allFreeWithRest',
  'retreat',
  'attempt',
  'utterFailure',
];

export const topRopeTickTypeEnum = [
  'topRopeFreeAscent',
  'topRopeWithRest',
  'retreat',
  'attempt',
  'utterFailure',
];

export const boulderTickTypeEnum = [
  'send',
  'dab',
  'repeatSend',
  'retreat',
  'attempt',
  'utterFailure',
];

export const tickStyleEnum = [
  'hangboard',
  'gym',
  'solo',
  'boulder',
  'toprope',
  'sport',
  'trad',
  'other',
];

export const outdoorStyleEnum = [
  'solo',
  'boulder',
  'toprope',
  'sport',
  'trad',
  'other',
];

export const fallbackPosition = [37.8651, 119.5383];
