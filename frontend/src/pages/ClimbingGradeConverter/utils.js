import Guu, { TimerFactory } from 'guu';

const log = new Guu('ConverterUtils', 'magenta');
// Currently supported systems include: French, Australian, South African, UIAA, Hueco, Font, British, YDS
const DELIMITER = '__';
export const gradingMap = {
  yds: [
    '5.1',
    '5.2',
    '5.3',
    '5.4',
    '5.5',
    '5.6',
    '5.7',
    '5.8',
    '5.9',
    '5.10a',
    '5.10b',
    '5.10c',
    '5.10d',
    '5.11a',
    '5.11b',
    '5.11c',
    '5.11d',
    '5.12a',
    '5.12b',
    '5.12c',
    '5.12d',
    '5.13a',
    '5.13b',
    '5.13c',
    '5.13d',
    '5.14a',
    '5.14b',
    '5.14c',
    '5.14d',
    '5.15a',
    '5.15b',
    '5.15c',
    '5.15d',
  ],
  french: [
    '2',
    '2+',
    '3',
    '3+',
    '4',
    '4+',
    '5a',
    '5b',
    '5c',
    '6a',
    '6a+',
    '6b',
    '6b+',
    '6c',
    '6c/6c+',
    '6c+',
    '7a',
    '7a+',
    '7b',
    '7b+',
    '7c',
    '7c+',
    '8a',
    '8a+',
    '8b',
    '8b+',
    '8c',
    '8c+',
    '9a',
    '9a+',
    '9b',
    '9b+',
    '9c',
  ],
  australian: [
    '7',
    '8',
    '9/10',
    '11',
    '12',
    '13',
    '14/15',
    '15/16',
    '17',
    '18',
    '19',
    '20',
    '20/21',
    '21',
    '22',
    '22/23',
    '23',
    '24',
    '25',
    '26',
    '27',
    '28',
    '29',
    '30',
    '31',
    '32',
    '33',
    '34',
    '35',
    '36',
    '37',
    '38',
    '39',
  ],
  south_african: [
    '8',
    '9',
    '10/11',
    '12',
    '13',
    '14',
    '15',
    '16',
    '17/18',
    '19',
    '20',
    '21',
    '22',
    '22/23',
    '23/24',
    '24',
    '25',
    '26',
    '27',
    '28',
    '29',
    '30',
    '31',
    '32',
    '33',
    '34',
    '35',
    '36',
    '37',
    '38',
    '39',
    '40',
    '41',
  ],
  uiaa: [
    'iii-',
    'iii',
    'iii+',
    'iv-',
    'iv',
    'iv+/v-',
    'v-/v',
    'v+/vi-',
    'vi-/vi',
    'vi/vi+',
    'vii-',
    'vii-/vii',
    'vii/vii+',
    'vii+',
    'viii-',
    'viii',
    'viii/viii+',
    'viii+',
    'ix-',
    'ix-/ix',
    'ix/ix+',
    'ix+',
    'x-',
    'x-/x',
    'x/x+',
    'x+',
    'xi-',
    'xi',
    'xi+',
    'xi+/xii-',
    'xii-/xii',
    'xii',
    'xii+',
  ],
  british: [
    'm 1',
    'd 2',
    'vd 3a',
    'vd 3b/hvd 3b',
    'hvd 3c/s 3c',
    'ms 4a',
    's 4b/hs 4b',
    'hs 4b/vs 4b',
    'hvs 4c',
    'hvs 5a',
    'e1 5a',
    'e1 5b',
    'e2 5b',
    'e2 5c',
    'e3 5c',
    'e3 6a',
    'e4 6a',
    'e4 6b',
    'e5 6b',
    'e5 6b/e6 6b',
    'e6 6b',
    'e6 6c',
    'e7 6c',
    'e7 7a',
    'e8 7a',
    'e8 7b',
    'e9 7b',
    'e10 7b',
    'e10 7c',
    'e11 7c',
    'e11 8a',
    'e11 8b',
    'e11 8c',
  ],
  hueco: [
    'vb',
    'vb',
    'vb',
    'vb',
    'vb',
    'vb',
    'vb',
    'vb',
    'vb',
    'vb',
    'v0',
    'v0+',
    'v1',
    'v2',
    'v2',
    'v3',
    'v4',
    'v4',
    'v5',
    'v5',
    'v6',
    'v7',
    'v8',
    'v8',
    'v9',
    'v10',
    'v11',
    'v12',
    'v13',
    'v14',
    'v15',
    'v16',
    'v17',
  ],
  font: [
    '1',
    '1',
    '1',
    '1',
    '1',
    '1+',
    '2',
    '2+',
    '3',
    '3+',
    '4',
    '4+',
    '5',
    '5+',
    '6a',
    '6a+',
    '6b',
    '6b+',
    '6c',
    '6c+',
    '7a',
    '7a+',
    '7b',
    '7b+',
    '7c',
    '7c+',
    '8a',
    '8a+',
    '8b',
    '8b+',
    '8c',
    '8c+',
    '9a',
  ],
};

export const allGradesAsArray = Object.keys(gradingMap).reduce(
  (memo, system) => {
    const grades = gradingMap[system];
    return [
      ...memo,
      ...grades.map((grade, index) => ({
        name: `${grade}${DELIMITER}${system}${DELIMITER}${index}`,
        value: grade,
      })),
    ];
  },
  [],
);

const timer = new TimerFactory('getMostSimilarGrade');

export const getMostSimilarGrade = (query, priorityList) => {
  if (!query) return [];
  timer.start();
  log.info('getMostSimilarGrade', { query, priorityList });
  const term = query && query.toLowerCase();
  const expr = new RegExp(term, 'g');

  const matches = allGradesAsArray
    .reduce((memo, { name, value }) => {
      // run the regexp on the master name string
      // use Set to dedupe
      const matches = Array.from(new Set(name.match(expr)));
      let matchCount = matches?.length || 0;
      if (name.startsWith(term)) {
        matchCount = matchCount + 1;
      }

      if (name.endsWith(term)) {
        matchCount = matchCount + 1;
      }

      if (matches?.length > 0) {
        // append a field "matchCount" to use on the item

        memo.push({
          matchCount,
          name,
          value,
        });
      }
      return memo;
    }, [])
    .sort((a, b) => b.matchCount - a.matchCount)
    .slice(0, 10);
  timer.crumb('initialMatch');
  log.info('matches', { matches });
  timer.crumb('matches');
  timer.stop('matches');
  return matches;
};

export const stringToEntry = (value) => {
  const [grade, system, index] = value.split(DELIMITER);
  const conversions = Object.keys(gradingMap).reduce((memo, system) => {
    const grade = gradingMap[system][parseInt(index, 10)];
    return [...memo, { grade, system }];
  }, []);
  return { grade, system, index, conversions };
};

// can check more info here: https://www.cruxrange.com/blog/climbing-ratings-explained/#australian-ratings

const systemMap = {
  yds: {
    emoji: '🇺🇸',
    displayName: 'YDS',
    color: '',
    description:
      'YDS - aka Yosemite Decimal System. Commonly used in North America.',
  },
  french: {
    emoji: '🇫🇷',
    displayName: 'French',
    color: '',
    description: 'French Climbing Scale. Common in Europe.',
  },
  australian: {
    emoji: '🇦🇺',
    displayName: 'Australian',
    color: '',
    description: 'Australian Grading System, aka the Ewbank system.',
  },
  south_african: {
    emoji: '🇿🇦',
    displayName: 'South African',
    color: '',
    description: 'Does anyone use this scale?',
  },
  uiaa: {
    emoji: '🌐',
    displayName: 'UIAA',
    color: '',
    description: 'The UIAA Grading System',
  },
  british: {
    emoji: '🇬🇧',
    displayName: 'UK',
    color: '',
    description:
      'The UK grading system is a two part system - the first part is an objective difficulty/scariness level, the second part is technical -- the hardest move on the climb.',
  },
  hueco: {
    emoji: '🇺🇸🪨',
    displayName: 'Hueco',
    color: '',
    description:
      'The Hueco system, or "V-System" is a grading scale for bouldering commonly used in North America.',
  },
  font: {
    emoji: '🇫🇷🪨',
    displayName: 'Font',
    color: '',
    description:
      'A traditional French grading system for bouldering which originated in Fontainebleau, France.',
  },
};

export const systems = Object.keys(gradingMap).map((key) => ({
  key,
  ...systemMap[key],
}));
