import { readFileSync, readdir } from 'fs';

const webFolder = './web';
const apiFolder = './api';
const appFolder = './app/i18n';
const appNativeFolder = './app/native-dialogs';
const requiredLanguages = ['nb.json', 'en.json'];
const requiredAPILanguages = ['no.json', 'en.json'];
const foldersToCheck = [
  { path: webFolder, required: requiredLanguages },
  { path: apiFolder, required: requiredAPILanguages },
  { path: appFolder, required: requiredLanguages },
  { path: appNativeFolder, required: requiredLanguages }
];

function keyify(obj, prefix = ''): string[] {
  return Object.keys(obj).reduce((res, el) => {
    if (Array.isArray(obj[el])) {
      return res;
    } else if (typeof obj[el] === 'object' && obj[el] !== null) {
      return [...res, ...keyify(obj[el], prefix + el + '.')];
    } else {
      return [...res, prefix + el];
    }
  }, []);
}

function getLanguageFiles(path: string): Promise<string[]> {
  return new Promise((resolve, reject) => readdir(path, (err, files) => {
    if (err) {
      reject(err);
    } else {
      resolve(files);
    }
  }));
}

function log(message: string, color?: 'red' | 'yellow' | 'green', ...optionalParams: any[]) {
  if (color !== undefined) {
    console.log(color === 'red' ? '\x1b[31m' : color === 'yellow' ? '\x1b[43m' : '\x1b[32m');
  }
  if (optionalParams.length > 0) {
    console.log(message, optionalParams);
  } else {
    console.log(message);
  }
  console.log('\x1b[0m');
}


function getRequiredKeys(path: string, required: string[]) {
  const requiredLanguagesWithKeys = required
    .map((lang) => ({ lang, keys: keyify(JSON.parse(readFileSync(`${path}/${lang}`, 'utf-8'))) }));
  const unionOfKeys = requiredLanguagesWithKeys.map((k) => k.keys).reduce((current, k) => current.concat(k), []);
  return unionOfKeys;
}


function validateFiles(path: string, languages: string[], failOnMissingKeys = true) {
  const requiredKeys = getRequiredKeys(path, languages);
  const languagesWithKeys = languages
    .map((lang) => ({ lang, keys: keyify(JSON.parse(readFileSync(`${path}/${lang}`, 'utf-8'))) }));
  const invalidLanguages = languagesWithKeys
    .map((lang) => ({ lang: lang.lang, missingKeys: requiredKeys.filter(k => lang.keys.indexOf(k) < 0) }))
    .filter((lang) => lang.missingKeys.length > 0);

  if (invalidLanguages.length > 0) {
    const messages = invalidLanguages.map((x) => `WARNING: ${x.lang} is missing keys: ${x.missingKeys.join(', ')}`).join('\n');
    if (failOnMissingKeys) {
      throw new Error(messages);
    }
    log(messages, 'yellow');
  }
}

async function validateFolder(path: string, required: string[]) {
  validateFiles(path, required, true);

  // Validate all other json-file languages as optional warnings
  const languageFiles = await getLanguageFiles(path);
  const optionalLanguages = languageFiles.filter((f) => f.endsWith('.json') && required.map((x) => `${x}`).indexOf(f) < 0);
  validateFiles(path, optionalLanguages, false);
}

async function run() {

  for (const folder of foldersToCheck) {
    // Validate required languages
    await validateFolder(folder.path, folder.required);
  }
}

run().then(() => {
  log('Translation validation completed!', 'green');
}).catch(err => {
  log('Could not validate languages', 'red', err);
  throw err;
});


