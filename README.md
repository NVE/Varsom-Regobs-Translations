# Varsom-Regobs-Translations
Translation files for Varsom Regobs.

Use i18n-editor v2.0.0-beta.1 to edit files.
https://github.com/jcbvm/i18n-editor/releases/tag/2.0.0-beta.1
Select File -> Import project and choose the folder containing the translation files.

Language files for the api and web (beta.regobs.no) are found in the folder `api`.

The app has static content such as label names, tags and most menu items. Language files for the static content in the app are found in `app/i18n`. Some translations are for the native components and are found in `app/native-dialogs`.

Some content is dynamic. Eg content in drop down menus and help texts. These can be updated in the database, and api and app (and web) will sync the changes without the need for a new release. These files are found in `kdvelements` and `helptexts`. They do not follow the i18n standard so editing must be done in the json files directly.
