/* eslint-disable prefer-destructuring */
export const API_BASE_PATH = process.env.API_BASE_PATH;
export const TOKEN_KEY = 'craglog_token';
export const CACHE_LIMIT = 30000;
export const DATE_FORMAT = 'MM/dd HH:mm.SS';
export const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
/* eslint-enable prefer-destructuring */

export const tickTypeEnum = [
  'lead',
  'flash',
  'onsight',
  'redpoint',
  'pinkpoint',
  'ropedog',
  'firstAscent',
  'firstFreeAscent',
  'allFreeWithRest',
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
  'aid',
  'toprope',
  'sport',
  'trad',
];

export const outdoorStyleEnum = [
  'solo',
  'boulder',
  'aid',
  'toprope',
  'sport',
  'trad',
];

export const fallbackPosition = {
  coords: {
    latitude: 37.8651,
    longitude: 119.5383,
  },
};
