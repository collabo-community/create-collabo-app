import { warning, consoleLog } from '../lib/helpers';

export const help = () => {
consoleLog(
`
Usage:
collabo-be <folder_name> <template>

Usage (for shorter command alternative):
c-be <folder_name> <template>

Command:
collabo-be

Command (shorter command alternative):
c-be 

Arguments:
<folder_name>   Replace this with your folder name
<template>      Available templates: ts, esm and cjs

Usage example:
collabo-be test-folder ts

Usage example (for shorter command alternative):
c-be test-folder ts

The above example bootstraps the ts template i.e.
the typescript template into a folder named test-folder.

Prompts:
If you do not specify one or both arguments above,
you will be prompted to add your folder name and/or
choose template option from list. For foldername, you
can choose to use the default foldername provided in
the prompt or type in your preferred folder name.

Flags:
-h, --help          Show help
-v, --version       Show version number
-i, --install       Install dependencies
-g, --git           Initialize git repo
-s, --skip-install  Skip installing dependencies
-x, --skip-git      Skip initializing git
-y, --yes           No prompt: see note on --yes flag below

No prompt when --yes flag is used. It skips both install
and git init. The CLI will generate the (default) ts template
if no template is specified or if the template entered is not
in the template collection. In the case of folder name, default
foldername is used if no folder name is specified or when the
folder name used already exists.
`
);
}

export const notRecognised = () => {
consoleLog(
`
Flag(s) not recognised. Use any of the help command below for more info:

Help command:
collabo-be --help

Help command (for shorter command alternative):
c-be --help`
);
}

export const userSupport = () => {
warning(
`
It looks like the create-collabo-app does not work yet for your computer's operating system. Let us know the issue with the CLI on your computer's operating system by reporting it here:
https://github.com/collabo-community/user-issue-report/issues

Alternatively, you can download and access the API boilerplate templates from the template's github repo:
https://github.com/collabo-community/backend-api-boilerplates
`);
}
