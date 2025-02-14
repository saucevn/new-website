import { Fragment } from 'react';
import InfoCircleIcon from 'public/icons/regular/info-circle.svg';
import PluginSdkHook from 'components/PluginSdkHook';
import ReactUiExample from 'components/ReactUiExample';
import PostContent from 'components/PostContent';
import s from 'pages/docs/pageStyle.module.css';
import cn from 'classnames';
import { StructuredText } from 'react-datocms';

export default function DocPageContent({ additionalData, ...props }) {
  return (
    <PostContent
      {...props}
      renderBlock={(block) => {
        switch (block._modelApiKey) {
          case 'plugin_sdk_hook_group': {
            return (
              <>
                <hr />
                {additionalData.pluginSdkHooks
                  .sort((a, b) => a.lineNumber - b.lineNumber)
                  .map((hook) => (
                    <PluginSdkHook key={hook.name} hook={hook} />
                  ))}
              </>
            );
          }
          case 'doc_callout': {
            return (
              <div
                className={cn(
                  s.docCallout,
                  s[`docCallout--${block.calloutType}`],
                )}
              >
                {block.title && (
                  <div className={s.docCalloutTitle}>
                    <InfoCircleIcon /> <span>{block.title}</span>
                  </div>
                )}
                <StructuredText data={block.text} />
              </div>
            );
          }
          case 'react_ui_live_example': {
            const examples = additionalData.allReactUiExamples.filter(
              (e) => e.componentName === block.componentName,
            );

            return (
              <>
                {examples.map((example) => (
                  <Fragment key={example.title}>
                    <h2>{example.title}</h2>
                    {example.description}
                    <ReactUiExample example={example} />
                  </Fragment>
                ))}
              </>
            );
          }
        }
      }}
    />
  );
}
