<template>
  <transition name="hs-zoom-in-top" @after-leave="doDestroy">
    <ul :class="iClass" v-show="showPopper">
      <slot></slot>
    </ul>
  </transition>
</template>
<script lang="ts">
import { Component, Prop, Watch, Inject, Vue } from 'vue-property-decorator'
import Popper from '@/utils/vue-popper'

@Component({
  name: 'hs-dropdown-menu',
  mixins: [Popper]
})

export default class HsDropdownMenu extends Vue {
  // eslint-disable-next-line no-undef
  [x: string]: any
  @Prop({ type: Boolean, default: !0 })
  private visibleArrow!: boolean

  @Prop({ type: Number, default: 0 })
  private arrowOffset!: number

  private size = (this as any).dropdown.dropdownSize

  get iClass () {
    const size = `hs-dropdown-menu--${this.size}`
    return {
      'hs-dropdown-menu': !0,
      'hs-popper': !0,
      [size]: !!this.size
    }
  }

  @Inject({ from: 'dropdown', default: '' })
  private dropdown!: any

  created () {
    this.$on('updatePopper', () => {
      if (this.showPopper) this.updatePopper()
    })
    this.$on('visible', (val: any) => {
      this.showPopper = val
    })
  }

  mounted () {
    this.dropdown.popperElm = this.popperElm = this.$el
    this.referenceElm = this.$parent.$el
    // compatible with 2.6 new v-slot syntax
    // issue link https://github.com/ElemeFE/element/issues/14345
    this.dropdown.initDomOperation()
  }

  @Watch('dropdown.placement', { immediate: !0 })
  private handler (val: any) {
    this.currentPlacement = val
  }
}
</script>
