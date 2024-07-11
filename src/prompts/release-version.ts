import { execSync } from "child_process";
import inquirer from 'inquirer';
import { Ioptions, TemplateQuestions } from "../interfaces";
import { prettify } from "../../lib/js/helpers/prettify";

export const versioningRelease = async (options: Ioptions) => {
    const releaseQuestions: TemplateQuestions[]  = [];
     const repoUrl = 'https://github.com/collabo-community/backend-api-boilerplates.git'

     const result = execSync(`git ls-remote --heads ${repoUrl}`).toString();

    const tags = result.trim().split('\n');

     // Filter out branches that don't contain '@release/'
     const releaseTags = tags.filter(tag => tag.includes('@release/')).map(tag => tag.split('/').pop());

     let versioningAnswers: { version: string } 

     const isVersionExist = releaseTags.some(vers => {
        return vers === options.releaseVersion;
      });

      const notAmongVersionCollection = isVersionExist === false;

      if (notAmongVersionCollection && options.releaseVersion !== undefined && !options.skipPrompts) prettify.log.color.none(`${prettify.text.error(`${options.releaseVersion}`)} does not exist in create-collabo-app backend API template version`);

     if (!options.releaseVersion || notAmongVersionCollection) {
        releaseQuestions.push({
          type: 'list',
          name: 'version',
          message: 'Please choose which create-collabo-app API boilerplate version to use :',
          choices: releaseTags as string[],
          default: releaseTags[releaseTags.length - 1] || ''
        });
      }

      versioningAnswers = await inquirer.prompt(releaseQuestions);

    //   console.log(releaseTags)

    options = {
        ...options,
        releaseVersion: options.releaseVersion || versioningAnswers.version
    }

    return options
}