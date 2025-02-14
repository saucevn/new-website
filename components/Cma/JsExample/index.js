import React from 'react';
import humps from 'humps';
import pluralize from 'pluralize';
import RequestResponse from '../RequestResponse';
import slugify from 'utils/slugify';

import schemaExampleFor from 'utils/schemaExampleFor';

const regexp = /{\(%2Fschemata%2F([^%]+)[^}]*}/g;

const fix = (string) =>
  string.replace(/"([^[\-"]+)": /g, '$1: ').replace(/"/g, "'");

function example(resource, link, clientInfo, allPages = false) {
  let params = [];
  let precode = [];

  let placeholders = [];
  let match = regexp.exec(link.href);

  while (match != null) {
    placeholders.push(match[1]);
    match = regexp.exec(link.href);
  }

  const resourceId = resource.definitions.identity.example || '3209482753';

  placeholders.forEach((placeholder) => {
    if (placeholder === 'item_type') {
      precode.push(`const modelIdOrApiKey = 'blog_post';`);
      params.push('modelIdOrApiKey');
    } else if (placeholder === 'field') {
      precode.push(`const fieldIdOrApiKey = 'blog_post::title';`);
      params.push('fieldIdOrApiKey');
    } else {
      precode.push(`const ${humps.camelize(placeholder)}Id = '${resourceId}';`);
      params.push(`${humps.camelize(placeholder)}Id`);
    }
  });

  const deserialize = (data, withId = false) => {
    const id = withId ? { id: data.id } : {};

    const attrs = {
      ...id,
      ...(data.attributes || {}),
      ...(data.meta ? { meta: data.meta } : {}),
      ...Object.entries(data.relationships || {}).reduce(
        (acc, [name, value]) => {
          acc[name] = value.data;
          return acc;
        },
        {},
      ),
    };
    return attrs;
  };

  if (link.schema && (link.method === 'PUT' || link.method === 'POST')) {
    const example = schemaExampleFor(link.schema, !allPages);
    if (example.data) {
      params.push(
        fix(
          JSON.stringify(
            deserialize(example.data, link.method === 'POST'),
            null,
            2,
          ),
        ),
      );
    }
  }

  if (link.hrefSchema) {
    const example = schemaExampleFor(link.hrefSchema, !allPages);
    if (Object.keys(example).length > 0) {
      params.push(fix(JSON.stringify(example, null, 2)));
    }
  }

  const namespace = clientInfo.namespace;
  const action = clientInfo.endpoint.name;

  let paramsCode = '';
  if (params.length > 0) {
    if (allPages) {
      paramsCode += `(\n${params.join(',\n').replace(/^/gm, '  ')}\n)`;
    } else {
      paramsCode += `(${params.join(', ')})`;
    }
  } else {
    paramsCode += '()';
  }

  let call = `client.${namespace}.${action}${paramsCode}`;

  let returnCode, output;

  if (link.targetSchema || link.jobSchema) {
    const example = schemaExampleFor(link.jobSchema || link.targetSchema);

    const singleVariable = humps.camelize(resource.id);

    if (Array.isArray(example.data)) {
      const multipleVariable = humps.camelize(pluralize(resource.id));

      if (example.data.length > 0) {
        if (!allPages) {
          output = fix(
            JSON.stringify(deserialize(example.data[0], true), null, 2),
          );

          returnCode = `const ${multipleVariable} = await ${call};

${multipleVariable}.forEach((${singleVariable}) => {
  console.log(${singleVariable});
});`;
        } else {
          returnCode = `for await (const ${singleVariable} of client.${namespace}.${action}PagedIterator${paramsCode}) {
  console.log(${singleVariable});
}`;
        }
      } else {
        output = '[]';
        returnCode = `const result = await ${call};

console.log(result);`;
      }
    } else {
      output = fix(JSON.stringify(deserialize(example.data, true), null, 2));

      returnCode = `const ${singleVariable} = await ${call};

console.log(${singleVariable});`;
    }
  } else {
    returnCode = `await ${call};`;
  }

  if (!allPages) {
    const isPaginated = clientInfo.endpoint.paginatedResponse;

    const body = `const client = buildClient({ apiToken: '<YOUR_API_TOKEN>' });
${precode.length > 0 ? '\n' : ''}${precode.join('\n')}${
      precode.length > 0 ? '\n' : ''
    }${
      returnCode
        ? `${
            isPaginated
              ? '\n// this only returns the first page of results:'
              : ''
          }\n${returnCode}`
        : ''
    }
${
  isPaginated
    ? '\n\n// this iterates over every page of results:' +
      example(resource, link, clientInfo, true).code
    : ''
}`;

    let code = `import { buildClient } from '@datocms/cma-client-node';

async function run() {
${body
  .trim()
  .split('\n')
  .map((x) => `  ${x}`)
  .join('\n')}
}

run();`;

    return { code, output };
  } else {
    const code = `
${returnCode}`;
    return { code, output };
  }
}

function renderExample(example, requestCode, responseCode) {
  const response = example.request ? example.response : responseCode;

  return (
    <div>
      <RequestResponse
        title={example.title}
        description={example.description}
        chunks={[
          {
            title: 'Example code:',
            language: 'javascript',
            code: example.request || requestCode,
          },
          response && {
            title: 'Returned output:',
            language: 'javascript',
            code: response,
          },
        ].filter((x) => x)}
      />
    </div>
  );
}

export default function JsExample({ resource, link, clientInfo }) {
  const { code, output } = example(resource, link, clientInfo);

  if (link.examples && link.examples['new-js']) {
    return (
      <>
        <p>The following examples are available:</p>
        <ul>
          {link.examples['new-js'].map((example) => (
            <li key={example.title}>
              <a href={`#${slugify(example.title)}`}>{example.title}</a>
            </li>
          ))}
        </ul>
        {link.examples['new-js'].map((example) =>
          renderExample(example, code, output),
        )}
      </>
    );
  }

  return renderExample({}, code, output);
}
