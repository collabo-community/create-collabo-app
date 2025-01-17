import inquirer from 'inquirer';
import fs from 'fs';
import { IFolderQuestions, Ioptions } from '../interfaces';
import { prettify, warning } from '../../lib/js/helpers/prettify';

export const folderNameMissingOptionPrompt = async (options: Ioptions) => {
    let defaultFolderName = 'cbe-kit';
    const folderQuestions: IFolderQuestions[] = [];
  
    let questionPush = (msgString: string, folder: string | null) => {
      folderQuestions.push({
        type: 'input',
        name: 'folderName',
        message: msgString,
        default: folder
      });
    }

    const rootDir = process.cwd();
    const rootDirContent = fs.readdirSync(rootDir, (err: any, files: any) => {
      if (err) {
        throw err;
      }
  
      return files;
    });
  
    rootDirContent.push('');
  
    let matchDefaultValue = rootDirContent.filter(content => {
      return content.match(defaultFolderName);
    });
  
    let folderNameAnswers: any;

    let extractedNumbers = matchDefaultValue.map((value) => {
      let valueMatch = value.match(/(\d+)/);
      if (valueMatch !== null) return value.match(/(\d+)/)?.map(Number)[0];
    }).filter(value => { return value !== undefined; }) as number[];

    let maxNumber = Math.max(...extractedNumbers);

    let incrementFolderName = () => {
      if (matchDefaultValue.length >= 1) {
        if (maxNumber === -Infinity) defaultFolderName = `${defaultFolderName}-${matchDefaultValue.length}`;
          else defaultFolderName = `${defaultFolderName}-${maxNumber + 1}`;
      }
    }

    if (!options.folderName && options.skipPrompts) incrementFolderName();
  
    if (!options.folderName && !options.skipPrompts) {
      incrementFolderName();
      questionPush('Please enter folder name:', defaultFolderName);
      folderNameAnswers = await inquirer.prompt(folderQuestions);
    }
  
    if (options.folderName && !options.skipPrompts) {
      try {
        fs.accessSync(`./${options.folderName}`, fs.constants.F_OK);
        prettify.log.color.cyanBright(`Folder name ${prettify.text.color.green(`${options.folderName}`)} already exists`);
          questionPush( 'Enter different folder name:', null);
          folderNameAnswers = await inquirer.prompt(folderQuestions);
      } catch (err) {
        if (err) {
          folderNameAnswers = {folderName: ''};
          folderNameAnswers.folderName = options.folderName;
         }
      }
    }
  
    try {
      fs.accessSync(`./${folderNameAnswers.folderName}`, fs.constants.F_OK);
  
      let equalToAtLeastOneFolder;
  
      do {
        equalToAtLeastOneFolder = rootDirContent.some(content => {
          return content === folderNameAnswers.folderName;
        });
  
        if (equalToAtLeastOneFolder === true) {
          if (folderNameAnswers.folderName !== '') {
            prettify.log.color.none( `Folder name ${prettify.text.color.green(`${folderNameAnswers.folderName}`)} already exists` );
          } else {
            warning('Folder name cannot be empty');
          }
          folderQuestions.push({
            type: 'input',
            name: 'folderName',
            message: 'Enter different folder name:',
          });
          if (options.folderName) {
            folderNameAnswers = await inquirer.prompt(folderQuestions);
          } else {
            folderNameAnswers = await inquirer.prompt([folderQuestions[1]]);
          }
        }
      } while (equalToAtLeastOneFolder === true);
  
    } catch (err) {
      if (err) {
        //Dummy if statement to prevent: unhandledPromiseRejectionWarning in console
      }
    }
  
    //Note: This affects only the try block of the previous if (options.folderName && !options.skipPrompts) statement
    if (options.folderName && !options.skipPrompts) {
      options.folderName = folderNameAnswers.folderName;
    } //------------------------------------------------
    
    if (options.folderName && options.skipPrompts) {
      let matchFolderNameArg = rootDirContent.some(content => {
        return content === options.folderName;
      });

      if (matchFolderNameArg) {
        options.folderName = incrementFolderName() as unknown as string;
      }
    }
  
    return [options, folderNameAnswers, defaultFolderName];
}