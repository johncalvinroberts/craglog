/* eslint-disable prefer-destructuring */
export const API_BASE_PATH = process.env.API_BASE_PATH;
export const TOKEN_KEY = 'craglog_token';
export const CACHE_LIMIT = 30000;
export const DATE_FORMAT = 'EEEE MMMM do, HH:mm.SS';
export const DATE_INPUT_FORMAT = `yyyy-MM-dd'T'HH:mm`;
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
  'flash',
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

export const notesPlaceHolders = [
  'Today I nearly died, but did not, all thanks to aggressively downturned climbing shoes...',
  'Confirmed: aggressively downturned climbing shoes ARE aid, because...',
  'My tendinitis....is acting up again...',
  'SANDBAGGED. HARD.',
  'Lorem Whipsum.....',
  'I met a bat halfway up this route...',
  'I met a wolfbear halfway up this route...',
  'Candy at the top.',
  'View from the top is amazing....',
  'RUN. F*CKING. OUT.',
  'I pulled on this many quickdraws: ',
  'Suns out, guns out, RUN. OUT.',
  'Faced certain death on third bolt. Was rescued by a timely left jug',
  'Fell on first bolt, in hospital right now as I type this',
  'Took big whipper nearly died, have gray hair now. 10/10 would whip again.',
  "Gumbie's paradise",
  'FDA: First Drunk Ascent',
  'Guidebook: sport. Reality: trad unless you are suicidal.',
  "There's a hidden treasure at the top.",
  "Joey used a bowline which untied at fourth bolt. I'm sorry he died, but it's still a good route.",
  'Note to self: invest in clipstick',
  'Need to see the doctor now to see if I can still have children',
  'This climb was so potent I had to wear protection',
  'Treacherous.',
  'Easy, but fun...',
  'Sharp rock.',
];

export const boards = [
  { value: 'metolius-simulator-3d', label: 'Metolius Simulator 3D' },
];

export const exercises = [
  'deadhang',
  'offsetHang',
  'bentArmHang',
  'lHang',
  'miniFrontLever',
  'frontLever',
  'pullUp',
  'offsetPullUp',
  'oneArmPullUp',
  'kneeRaises',
  'legRaises',
  'pushUps',
  'sitUps',
  'custom',
];

export const repetitionExercises = [
  'pullUp',
  'offsetPullUp',
  'oneArmPullUp',
  'kneeRaises',
  'legRaises',
  'pushUps',
  'sitUps',
];
