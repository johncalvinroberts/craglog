const fs = require('fs/promises');

/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */

(async () => {
  const folders = [
    'src/components',
    'src/components/Form',
    'src/components/hangboards',
    'src/pages',
    'src/pages/Hangboard',
    'src/pages/Jobs',
    'src/pages/Ticks',
  ];

  for (const folder of folders) {
    const files = await fs.readdir(folder);
    for (const file of files) {
      if (file.endsWith('.js')) {
        console.log(file);
        const oldPath = `${folder}/${file}`;
        const newPath = oldPath.replace('.js', '.jsx');
        console.log(`${oldPath} -> ${newPath}`);
        // await fs.rename(oldPath, newPath);
      }
    }
  }
})();

/* eslint-enable no-restricted-syntax */
