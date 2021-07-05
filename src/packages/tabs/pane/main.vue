<template>
  <div
    class="hs-tab-pane"
    v-if="(!lazy || loaded) || active"
    v-show="active"
    role="tabpanel"
    :aria-hidden="!active"
    :id="`pane-${paneName}`"
    :aria-labelledby="`tab-${paneName}`"
  >
    <slot></slot>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  name: 'hs-tab-pane'
})
export default class HsTabPane extends Vue {
    @Prop({ type: String })
    private label!: string

    @Prop({ type: Function })
    private labelContent!: Function

    @Prop({ type: String })
    private name!: string

    @Prop({ type: Boolean })
    private closable!: boolean

    @Prop({ type: Boolean })
    private disabled!: boolean

    @Prop({ type: Boolean })
    private lazy!: boolean

    private index: any = null
    private loaded: any = !1

    get isClosable () {
      return this.closable || (this.$parent as any).closable
    }

    get active () {
      const active = (this.$parent as any).currentName === (this.name || this.index)
      if (active) {
        this.loaded = true
      }
      return active
    }

    get paneName () {
      return this.name || this.index
    }

    updated () {
      this.$parent.$emit('tab-nav-update')
    }
}
</script>
