import type { Attachment } from '../attachment/types';
import { i18n } from '../i18n';
import { getCodeLang, isSmallTextFile } from '../lib/file-preview';
import { xailonOrbitTheme } from '../styles/theme';

const style = css`
  :scope {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .header {
    text-align: center;
    padding-top: 6px;
  }
  .title {
    margin: 0;
    word-break: break-word;
    font-family: ${xailonOrbitTheme.displayFont};
    font-size: ${xailonOrbitTheme.fontSizeLg};
    line-height: 1.375;
    font-weight: 600;
    letter-spacing: -0.025em;
    color: ${xailonOrbitTheme.highlightColor};
  }
  .description {
    margin: 6px 0 0;
    font-family: ${xailonOrbitTheme.font};
    font-size: ${xailonOrbitTheme.fontSizeSm};
    line-height: 1.5;
    font-weight: 400;
    color: ${xailonOrbitTheme.describeColor};
  }
  .image {
    display: block;
    margin-inline: auto;
    max-height: 65dvh;
    max-width: 100%;
    border-radius: ${xailonOrbitTheme.normalRound};
    object-fit: contain;
  }
  .code-block {
    display: block;
    margin: 0;
    max-height: 65dvh;
    overflow: auto;
    border-radius: ${xailonOrbitTheme.normalRound};
    background: ${xailonOrbitTheme.lightBackgroundColor};
  }
  .plain-text {
    margin: 0;
    max-height: 65dvh;
    overflow: auto;
    white-space: pre-wrap;
    word-break: break-word;
    border-radius: ${xailonOrbitTheme.normalRound};
    background: ${xailonOrbitTheme.lightBackgroundColor};
    padding: 1rem;
    font-family: ${xailonOrbitTheme.codeFont};
    font-size: ${xailonOrbitTheme.fontSizeSm};
    line-height: 1.625;
    color: ${xailonOrbitTheme.textColor};
  }
`;

@customElement('deck-attachment-preview')
@adoptedStyle(style)
export class DeckAttachmentPreviewElement extends GemElement {
  @property attachment?: Attachment | null;

  @template()
  #render = () => {
    const attachment = this.attachment;
    if (!attachment) return null;

    const text = attachment.kind === 'text' ? attachment.text : '';
    const isSmall = isSmallTextFile(text);
    const lang = attachment.name ? getCodeLang(attachment.name) : '';
    const heading = attachment.name || i18n.get('attachment.previewHeading');
    const description = i18n.get(`attachment.${attachment.kind}Desc`);

    return html`
      <div class="header">
        <h2 class="title select-text">${heading}</h2>
        <p v-if=${!!description} class="description">${description}</p>
      </div>
      ${
        attachment.kind === 'image'
          ? html`<img class="image" src=${attachment.previewUrl} alt=${attachment.name || ''} />`
          : attachment.kind === 'file'
            ? null
            : isSmall
              ? html`<tap-code-block codelang=${lang} class="code-block select-text">${text}</tap-code-block>`
              : html`<pre class="plain-text select-text">${text}</pre>`
      }
    `;
  };
}
