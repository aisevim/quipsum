import * as vscode from 'vscode';
import { loremIpsum } from 'lorem-ipsum';

import type { LoremUnit } from 'lorem-ipsum/types/src/constants/units';

export function activate(context: vscode.ExtensionContext) {
  const provider = vscode.languages.registerCompletionItemProvider('*', {
    provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
      const quipsumGenerator = new QuipsumGenerator(document, position);
      return quipsumGenerator.generateCompletionItems();
    }
  });

  context.subscriptions.push(provider);
}

export class QuipsumGenerator {
  private config: vscode.WorkspaceConfiguration;
  private unitTypeMapping: Record<string, LoremUnit>;
  private document: vscode.TextDocument;
  private position: vscode.Position;
  private triggerText: string | undefined;

  constructor(document: vscode.TextDocument, position: vscode.Position) {
    this.config = vscode.workspace.getConfiguration();
    this.unitTypeMapping = {
      [this.config.get('quipsum.units.sentences') as string]: 'sentences',
      [this.config.get('quipsum.units.paragraphs') as string]: 'paragraphs',
      [this.config.get('quipsum.units.words') as string]: 'words',
    };
    this.triggerText = this.config.get('quipsum.triggerText');
    this.document = document;
    this.position = position;
  }

  generateCompletionItems() {
    const wordRange = this.document.getWordRangeAtPosition(this.position, this.createDynamicRegex());
    const matches = this.document.getText(wordRange)?.match(this.createDynamicRegex());

    if (!matches?.length || !wordRange) {
      return [];
    }

    const [count, unit] = this.getCountAndUnit(matches);
    const loremText = this.generateLoremText(count, unit);
    const currentWord = this.document.getText(wordRange);

    const snippetCompletion = new vscode.CompletionItem(currentWord);
    snippetCompletion.insertText = new vscode.SnippetString(loremText);

    return [snippetCompletion];
  }

  getCountAndUnit(matches: RegExpMatchArray): [number, LoremUnit] {
    const count = matches[1] ? parseInt(matches[1], 10) : this.config.get('quipsum.count') as number;
    const unit = this.unitTypeMapping[matches[2]] || this.config.get('quipsum.unit');

    return [count, unit];
  }

  generateLoremText(count: number, unit: LoremUnit): string {
    return loremIpsum({
      count,
      paragraphLowerBound: this.config.get('quipsum.paragraphLowerBound'),
      paragraphUpperBound: this.config.get('quipsum.paragraphUpperBound'),
      sentenceLowerBound: this.config.get('quipsum.sentenceLowerBound'),
      sentenceUpperBound: this.config.get('quipsum.sentenceUpperBound'),
      suffix: this.config.get('quipsum.suffix'),
      units: unit,
    });
  }

  createDynamicRegex(): RegExp {
    const regexString = `${this.triggerText}(\\d+)?(${Object.keys(this.unitTypeMapping).join('|')})?`;

    return new RegExp(regexString);
  }
}