## Overview

Quipsum is a Visual Studio Code extension that provides customizable snippets for generating Lorem Ipsum placeholder text within your code files.

```js
[triggerText][count]?[unit]?
lorem 10 words

// triggerText => The keyword that triggers the generation of placeholder
// count => count of [sentences|words|paragraphs] generated
// unit => sentences|words|paragraphs
```

## Snippet Examples

- `lorem` : Inserts 5-15 sentences.
<img src="https://raw.githubusercontent.com/aisevim/quipsum/master/docs/assets/lorem.gif" />

- `lorem1` : Inserts 1 sentence.
<img src="https://raw.githubusercontent.com/aisevim/quipsum/master/docs/assets/lorem1.gif" />

- `loremp` : Inserts 1 paragraphe.
<img src="https://raw.githubusercontent.com/aisevim/quipsum/master/docs/assets/loremp.gif" />

- `loremw` : Inserts 1 word.
<img src="https://raw.githubusercontent.com/aisevim/quipsum/master/docs/assets/loremw.gif" />

- `lorem10w` : Inserts 10 words.
<img src="https://raw.githubusercontent.com/aisevim/quipsum/master/docs/assets/lorem10w.gif" />

### Customization

```jsonc
{
	"quipsum.triggerText": "generate",
	"quipsum.units.words": "words",
}
```
- `generate10words` : Inserts 10 words.

<img src="https://raw.githubusercontent.com/aisevim/quipsum/master/docs/assets/generate10words.gif" />

```jsonc
{
	"quipsum.unit": "words",
	"quipsum.count": 2,
}
```
- `lorem` : Inserts 2 words.

<img src="https://raw.githubusercontent.com/aisevim/quipsum/master/docs/assets/lorem2w.gif" />

## Features

- **Customizable Snippets**: Easily customize the length and format of Lorem Ipsum text snippets according to your needs.

- **Quick Insertion**: Insert Lorem Ipsum snippets with just a few keystrokes, saving you time and effort.

- **Rich Configuration**: Quipsum gives you the flexibility to generate the exact amount and type of filler text you need for your project.

## Installation

1. Open VSCode.
2. Go to the Extensions view (`Ctrl+Shift+X` or `Cmd+Shift+X`).
3. Search for "quipsum" and install the plugin.

## Extension Settings

| config                        | Description                                                                           | default     |
| ----------------------------- | ------------------------------------------------------------------------------------- | ----------- |
| `quipsum.triggerText`         | The keyword that triggers the generation of placeholder text when typed in the editor | `lorem`     |
| `quipsum.unit`                | The default unit for the `quipsum.triggerText` command in the extension.              | `sentences` |
| `quipsum.units.sentences`     | The unit symbol for sentences in the `quipsum.triggerText` command                    | `s`         |
| `quipsum.units.words`         | The unit symbol for words in the `quipsum.triggerText` command.                       | `w`         |
| `quipsum.units.paragraphs`    | The unit symbol for paragraphs in the `quipsum.triggerText` command                   | `p`         |
| `quipsum.count`               | The default count for the 'quipsum.triggerText' command in the extension              | `1`         |
| `quipsum.suffix`              | Line ending                                                                           | `\n`        |
| `quipsum.paragraphLowerBound` | Min. number of sentences per paragraph                                                | `3`         |
| `quipsum.paragraphUpperBound` | Max. number of sentences per paragraph                                                | `7`         |
| `quipsum.sentenceLowerBound`  | Min. number of words per sentence                                                     | `5`         |
| `quipsum.sentenceUpperBound`  | Max. number of words per sentence                                                     | `15`        |

## Troubleshooting

### Suggestions are not displayed

If you're experiencing issues where Visual Studio Code isn't automatically displaying suggestions in certain programming languages, you can modify your `settings.json` file with the following configuration:

```jsonc
"editor.quickSuggestions": {
  "strings": true
}
```

This setting enables automatic suggestions inside strings.

:warning: Warning: Enabling this setting will cause VS Code to display suggestions in all strings, which can be distracting or unwanted in some scenarios. Use this setting with caution.

## License

This project is licensed under the [MIT License](LICENSE).

## Release Notes

See [CHANGELOG.md](CHANGELOG.md) for details on each release.