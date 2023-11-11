import * as vscode from 'vscode';
import { loremIpsum } from "lorem-ipsum";

import type { LoremUnit } from 'lorem-ipsum/types/src/constants/units';

export function activate(context: vscode.ExtensionContext) {
  const provider1 = vscode.languages.registerCompletionItemProvider('*', {
    provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
      const config = vscode.workspace.getConfiguration('quipsum');
      const wordRange = document.getWordRangeAtPosition(position, createDynamicRegex(config));
      const matches = document.getText(wordRange)?.match(createDynamicRegex(config));

      if (!matches || !wordRange) {
        return [];
      }

      const number = matches[1] ? parseInt(matches[1], 10) : config.get('count.default', 1);
      const unitKey = matches[2] || config.get('default', 'sentences');
      const unit = mapUnitKeyToLoremUnit(unitKey, config);

      const loremText = generateLoremText(number, unit);
      const currentWord = document.getText(wordRange);

      const snippetCompletion = new vscode.CompletionItem(currentWord);
      snippetCompletion.insertText = new vscode.SnippetString(loremText);

      return [
        snippetCompletion,
      ];
    }
  });

  context.subscriptions.push(provider1);
}

function generateLoremText(count: number, unit: LoremUnit): string {
  return loremIpsum({
    count,
    units: unit,
  });
}

function mapUnitKeyToLoremUnit(unitKey: string, config: vscode.WorkspaceConfiguration): LoremUnit {
  const unitMapping: Record<string, LoremUnit> = {
    [config.get('units.sentences', 's')]: "sentences",
    [config.get('units.words', 'w')]: "words",
    [config.get('units.paragraphs', 'p')]: "paragraphs",
  };

  return unitMapping[unitKey] || config.get('default', 'sentences');
}

function createDynamicRegex(config: vscode.WorkspaceConfiguration): RegExp {
  const unitMapping: Record<string, LoremUnit> = {
    [config.get('units.sentences', 's')]: "sentences",
    [config.get('units.words', 'w')]: "words",
    [config.get('units.paragraphs', 'p')]: "paragraphs",
  };
  
  const regexString = `lorem(\\d+)?(${Object.keys(unitMapping).join('|')})?`;

  return new RegExp(regexString);
}
