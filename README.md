# Varsom-Regobs-Translations
Translation files for Varsom Regobs - Web, Mobile app, and API.

## Clone or download git repository

To clone repository:

`git clone https://github.com/NVE/Varsom-Regobs-Translations.git`

Or download without git:
https://github.com/NVE/Varsom-Regobs-Translations/archive/master.zip


## Folder layout
Language files for the api are found in the folder `api`. Language files for the web (beta.regobs.no) are found in the folder `web`. 

The mobile app has static content such as label names, tags and most menu items. Language files for the static content in the app are found in `app/i18n`. Some translations are for the native components and are found in `app/native-dialogs`.

Some content is dynamic. Eg content in select-menus and help texts. These can be updated in the database, and api and app (and web) will sync the changes without the need for a new release. These files are found in `kdvelements` and `helptexts`. They do not follow the i18n standard so editing must be done in the json files directly. Again, Atom might be a good editor for this.

*Note, that in the kdvelements file, most of the "name" elements are restricted to 30chars. This is because the elements are used in select-menus which often are restricted in width (e.g. on a mobile phone). Exceptions from this rule may be seen when norwegian or english name are larger than 30 chars.*

## Using i18n-editor to edit translation files

Use i18n-editor v2.0.0-beta.1 to edit the `api` and `app` files.
https://github.com/jcbvm/i18n-editor/releases/tag/2.0.0-beta.1

Download the zip package and extract to your preferred folder.

Open the different language files in one project by: `Select File` -> `Import project` and choose the folder containing the translation files.

Missing translations is marked with an orange circle.

A normal text editor with a possibility for a split view will be useful to edit the `kdvelements` and the `helptexts`. E.g Atom (https://atom.io/).


## When you have finished translating
You can either send us the new translation files and we will update the files in this repository for you or you can create a pull-request to merge in the new changes. (Requires knowledge of git and pull-request workflow)


## Validation (Optional to check if everything is ok)
Make sure you have Node.js installed.

Install npm packages: `npm install`

Run build script: `npm run build`

This script will automatically run when a new master is pushed. If build validates successfully, a new NPM package is published to:
https://www.npmjs.com/package/@varsom-regobs-common/translations
