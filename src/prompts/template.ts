import inquirer from 'inquirer';
import { IFoldernameAnswers, Ioptions, ItemplateOptions, TemplateQuestions } from '../interfaces';
import { prettify } from '../../lib/js/helpers/prettify';

let skipPromptsModified = (options: Ioptions, defaultFolderName: string, notAmongTemplateCollection: boolean, defaultTemplate: ItemplateOptions) => {
  if (notAmongTemplateCollection && (options.template !== undefined || options.template === undefined)) {
    options.template = defaultTemplate;
  }

  options = {
    ...options,
    folderName: options.folderName || defaultFolderName,
    template: options.template,
    runInstall: false,
    git: false
  }

  return options;
}

export const templateMissingOptionPrompt = async (options: Ioptions, folderNameAnswers: IFoldernameAnswers, defaultFolderName: string) => {
  const templateQuestions: TemplateQuestions[]  = [];

  const apiTemplate = {
    ts: {
      name: 'typescript API template',
      abbrev: 'ts',
    },
    esm: {
      name: 'es Module API template',
      abbrev: 'esm',
    },
    cjs: {
      name: 'commonjs module API template',
      abbrev: 'cjs',
    }
  }

  const defaultTemplate = `${apiTemplate.ts.name} (${apiTemplate.ts.abbrev})`;
  const esmTemplate = `${apiTemplate.esm.name} (${apiTemplate.esm.abbrev})`;
  const cjsTemplate = `${apiTemplate.cjs.name} (${apiTemplate.cjs.abbrev})`;

  const templateCollection = [defaultTemplate, esmTemplate, cjsTemplate];

  // Use the abbrev template names for .some operation (for when template name is added through command line)
  const abbrevTemplateCollection = [apiTemplate.ts.abbrev, apiTemplate.esm.abbrev, apiTemplate.cjs.abbrev];
  const equalToAtLeastOneTemplate = abbrevTemplateCollection.some(tc => {
    return tc === options.template;
  });

  const notAmongTemplateCollection = equalToAtLeastOneTemplate === false;

  if (notAmongTemplateCollection && options.template !== undefined && !options.skipPrompts) prettify.log.color.none(`${prettify.text.error(`${options.template}`)} is not in the create-collabo-app backend API template collection`);

  if (!options.template || notAmongTemplateCollection) {
    templateQuestions.push({
      type: 'list',
      name: 'template',
      message: 'Please choose which create-collabo-app API boilerplate template to use',
      choices: templateCollection, //uses full names of templates in prompt for better user experience
      default: defaultTemplate
    });
  }

  let templateAnswers: any;

  if (options.skipPrompts) {
    options = skipPromptsModified(options, defaultFolderName, notAmongTemplateCollection, defaultTemplate);
    (templateQuestions as any).template = defaultTemplate;
    templateAnswers = templateQuestions;
  }

  if (!options.skipPrompts) templateAnswers = await inquirer.prompt(templateQuestions);

  // Transform template name/answers back to abbrev name for cli to process it accordingly
  const transformTemplateName = (templateOption: string) => {
    if (templateOption === defaultTemplate) templateAnswers.template = apiTemplate.ts.abbrev;
    if (templateOption === esmTemplate) templateAnswers.template = apiTemplate.esm.abbrev;
    if (templateOption === cjsTemplate) templateAnswers.template = apiTemplate.cjs.abbrev;
  }
  transformTemplateName(templateAnswers.template);

  if (notAmongTemplateCollection) {
    options = {
      ...options,
      folderName: options.folderName || folderNameAnswers.folderName,
      template: templateAnswers.template,
      git: options.git
    }
  }

  options = {
    ...options,
    folderName: options.folderName || folderNameAnswers.folderName,
    template: options.template || templateAnswers.template,
    git: options.git
  }

  return options;
}
