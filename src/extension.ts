import * as vscode from 'vscode';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { loremIpsum } from 'lorem-ipsum';
import packageJson from '../package.json';

import type { LoremUnit } from 'lorem-ipsum/types/src/constants/units';

export function activate(context: vscode.ExtensionContext) {
  const provider = vscode.languages.registerCompletionItemProvider('*', {
    provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
      const wordRange = document.getWordRangeAtPosition(position, createDynamicRegex());
      const matches = document.getText(wordRange)?.match(createDynamicRegex());

      if (!matches || !wordRange) {
        return [];
      }

      const [count, unit] = getCountAndUnit(matches);
      const loremText = generateLoremText(count, unit);
      const currentWord = document.getText(wordRange);

      const snippetCompletion = new vscode.CompletionItem(currentWord);
      snippetCompletion.insertText = new vscode.SnippetString(loremText);

      return [snippetCompletion];
    }
  });

  context.subscriptions.push(provider);
}

function getConfigValue(key: string): any {
  const config = vscode.workspace.getConfiguration();

  return config.get(key);
}

function getUnitTypeMapping(): Record<string, LoremUnit> {
  return {
    [getConfigValue('quipsum.units.sentences')]: 'sentences',
    [getConfigValue('quipsum.units.paragraphs')]: 'paragraphs',
    [getConfigValue('quipsum.units.words')]: 'words',
  };
}

function getCountAndUnit(matches: RegExpMatchArray): [number, LoremUnit] {
  const count = matches[1] ? parseInt(matches[1], 10) : getConfigValue('quipsum.count.default');
  const unit = getUnitTypeMapping()[matches[2]] || getConfigValue('quipsum.default');

  return [count, unit];
}

function generateLoremText(count: number, unit: LoremUnit): string {
  return loremIpsum({
    count,
    paragraphLowerBound: getConfigValue('quipsum.paragraphLowerBound'),
    paragraphUpperBound: getConfigValue('quipsum.paragraphUpperBound'),
    sentenceLowerBound: getConfigValue('quipsum.sentenceLowerBound'),
    sentenceUpperBound: getConfigValue('quipsum.sentenceUpperBound'),
    suffix: getConfigValue('quipsum.suffix'),
    units: unit,
  });
}

function createDynamicRegex(): RegExp {
  const regexString = `lorem(\\d+)?(${Object.keys(getUnitTypeMapping()).join('|')})?`;

  return new RegExp(regexString);
}
