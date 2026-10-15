import { xailonOrbitStore } from './state/store';

@customElement('xailonorbit-app')
@connectStore(xailonOrbitStore)
export class XailonOrbitAppElement extends GemElement {
  @template()
  #render = () => html`
    <xailonorbit-session-list-page v-if=${!!xailonOrbitStore.settings.relayId} class="block h-full"></xailonorbit-session-list-page>
    <xailonorbit-settings-page v-else class="block h-full"></xailonorbit-settings-page>
  `;
}
