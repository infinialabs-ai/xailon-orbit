import { xailonOrbitTheme } from '../styles/theme';

const style = css`
  :scope {
    display: inline-block;
    position: relative;
    width: 22px;
    height: 22px;
    flex: 0 0 auto;
    vertical-align: middle;
  }

  :scope::before,
  :scope::after,
  .card {
    position: absolute;
    width: 14px;
    height: 17px;
    border-radius: ${xailonOrbitTheme.smallRound};
    content: '';
  }

  :scope::before {
    left: 1px;
    top: 4px;
    rotate: -12deg;
    background: color-mix(in srgb, ${xailonOrbitTheme.informativeColor} 80%, ${xailonOrbitTheme.lightBackgroundColor});
  }

  :scope::after {
    left: 5px;
    top: 2px;
    rotate: -4deg;
    background: color-mix(in srgb, ${xailonOrbitTheme.primaryColor} 48%, ${xailonOrbitTheme.lightBackgroundColor});
  }

  .card {
    z-index: 1;
    right: 0;
    top: 1px;
    display: grid;
    place-items: center;
    background: ${xailonOrbitTheme.primaryColor};
    box-shadow: 0 4px 10px color-mix(in srgb, ${xailonOrbitTheme.primaryColor} 24%, transparent);
  }

  .card::after {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: white;
    box-shadow: 3px 3px 0 -1px white;
    content: '';
  }
`;

@customElement('deck-icon')
@adoptedStyle(style)
export class DeckIconElement extends GemElement {
  @template()
  #render = () => html`<span class="card"></span>`;
}
