import * as nb from './web/nb.json'
import * as en from './web/en.json'
import * as sl from './web/en.json'
import * as sv from './web/en.json'
import * as de from './web/en.json'
import { readFileSync, readdir } from 'fs';

const webFolder = './web';

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

function getLanguageFiles(): Promise<string[]> {
    return new Promise((resolve, reject) => readdir(webFolder, (err, files) => {
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

const requiredLanguages = ['nb.json', 'en.json'];
const requiredLanguagesWithKeys = requiredLanguages
    .map((lang) => ({ lang, keys: keyify(JSON.parse(readFileSync(`${webFolder}/${lang}`, 'utf-8'))) }));
const unionOfKeys = requiredLanguagesWithKeys.map((k) => k.keys).reduce((current, k) => current.concat(k), []);


function validateFiles(languages: string[], failOnMissingKeys = true) {
    const languagesWithKeys = languages
        .map((lang) => ({ lang, keys: keyify(JSON.parse(readFileSync(`${webFolder}/${lang}`, 'utf-8'))) }));
    const invalidLanguages = languagesWithKeys
        .map((lang) => ({ lang: lang.lang, missingKeys: unionOfKeys.filter(k => lang.keys.indexOf(k) < 0) }))
        .filter((lang) => lang.missingKeys.length > 0);

    if (invalidLanguages.length > 0) {
        const messages = invalidLanguages.map((x) => `WARNING: ${x.lang} is missing keys: ${x.missingKeys.join(', ')}`).join('\n');
        if (failOnMissingKeys) {
            throw new Error(messages);
        }
        log(messages, 'yellow');
    }
}

async function run() {

    // Validate required languages
    validateFiles(requiredLanguages, true);

    // Validate all other json-file languages as optional warnings
    const languageFiles = await getLanguageFiles();
    const optionalLanguages = languageFiles.filter((f) => f.endsWith('.json') && requiredLanguages.map((x) => `${x}`).indexOf(f) < 0);
    validateFiles(optionalLanguages, false);
}

run().then(() => {
    log('Translation validation completed!', 'green');
}).catch(err => {
    log('Could not validate languages', 'red', err);
    throw err;
});


