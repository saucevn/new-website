const {
  rootNodeType,
  blockNodeType,
  blockquoteNodeType,
  codeNodeType,
  validate,
} = require('datocms-structured-text-utils');
const inspect = require('unist-util-inspect');
const markdownToStructuredText = require('./markdownToStructuredText');

const { range } = require('range');

const QUOTE = 'quote';
const CODE_BLOCK = 'code_block';
const TEXT = 'text';

module.exports = async function convertModularContentToStructuredText(
  modularContentValue,
  itemTypesByApiKey,
) {
  let children = [];

  for (const block of modularContentValue) {
    const { id, meta, ...sanitizedBlock } = block;
    const {
      createdAt,
      updatedAt,
      ...sanitizedAttributes
    } = sanitizedBlock.attributes;

    sanitizedBlock.attributes = sanitizedAttributes;

    switch (block.relationships.itemType.data.id) {
      case itemTypesByApiKey[TEXT].id: {
        const structuredText = await markdownToStructuredText(
          block.attributes.text,
        );
        children = [...children, ...structuredText.document.children];
        break;
      }
      case itemTypesByApiKey[QUOTE].id: {
        const structuredText = await markdownToStructuredText(
          block.attributes.quote,
        );
        const node = {
          type: blockquoteNodeType,
          children: structuredText.document.children,
        };

        if (block.attributes.author) {
          node.attribution = block.attributes.author;
        }

        children.push(node);
        break;
      }
      case itemTypesByApiKey[CODE_BLOCK].id: {
        const codeNode = {
          type: codeNodeType,
          language: block.attributes.language,
          code: block.attributes.code,
        };

        if (block.attributes.highlightLines) {
          codeNode.highlight = block.attributes.highlightLines
            .split(/\s*,\s*/)
            .map((str) => {
              const chunks = str.split(/\-/);
              if (chunks.length === 1) {
                return parseInt(chunks[0]) - 1;
              }

              return range(parseInt(chunks[0]) - 1, parseInt(chunks[1]));
            })
            .flat();
        }

        children.push(codeNode);
        break;
      }
      default: {
        children.push({ type: blockNodeType, item: sanitizedBlock });
        break;
      }
    }
  }

  const dastTree = {
    type: rootNodeType,
    children,
  };

  const validationResult = validate(dastTree);

  if (!validationResult.valid) {
    console.log(inspect(dastTree));
    throw new Error(validationResult.message);
  }

  return {
    schema: 'dast',
    document: dastTree,
  };
};
