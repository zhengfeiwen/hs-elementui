<template>
  <li
    class="hs-dropdown-menu__item"
    :class="{
      'is-disabled': disabled,
      'hs-dropdown-menu__item--divided': divided
    }"
    @click="handleClick"
    :aria-disabled="disabled"
    :tabindex="disabled ? null : -1"
  >
    <i :class="icon" v-if="icon"></i>
    <slot></slot>
  </li>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import Emitter from '@/mixins/emitter'

@Component({
  name: 'hs-dropdown-item',
  mixins: [Emitter]
})

export default class HsDropdownItem extends Vue {
  // eslint-disable-next-line no-undef
  [x: string]: any
  @Prop({ type: Object })
  private command!: {}

  @Prop({ type: Boolean })
  private disabled!: boolean

  @Prop({ type: Boolean })
  private divided!: boolean

  @Prop({ type: String })
  private icon!: string

  private handleClick () {
    this.dispatch('hs-dropdown', 'menu-item-click', [this.command, this])
  }
}
</script>
