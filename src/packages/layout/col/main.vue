<template>
  <div class="hs-col" :style="style" :class="iClass">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import HsRow from '@/packages/layout/row/main.vue'

@Component({
  name: 'hs-col'
})
export default class HsCol extends Vue {
  private gutter = 0

  @Prop({ type: Number, default: -1 })
  private span!: number

  @Prop({ type: Number, default: -1 })
  private xs!: number

  @Prop({ type: Number, default: -1 })
  private sm!: number

  @Prop({ type: Number, default: -1 })
  private md!: number

  @Prop({ type: Number, default: -1 })
  private lg!: number

  @Prop({ type: Number, default: -1 })
  private xl!: number

  @Prop({ type: Number, default: -1 })
  private offset!: number

  @Prop({ type: Number, default: -1 })
  private push!: number

  @Prop({ type: Number, default: -1 })
  private pull!: number

  private style = {}
  private iClass = {}
  private created () {
    if ((this.$parent as HsRow).gutter) {
      this.gutter = (this.$parent as HsRow).gutter
      const pading = this.gutter / 2 + 'px'
      this.style = {
        'padding-left': pading,
        'padding-right': pading
      }
    }
    const spanClass = `hs-col-${this.span}`
    const spanxsClass = `hs-col-xs-${this.xs}`
    const spansmClass = `hs-col-sm-${this.sm}`
    const spanmdClass = `hs-col-md-${this.md}`
    const spanlgClass = `hs-col-lg-${this.lg}`
    const spanxlClass = `hs-col-xl-${this.xl}`
    const offsetClass = `hs-col-offset-${this.offset}`
    const pushClass = `hs-col-push-${this.push}`
    const pullClass = `hs-col-pull-${this.pull}`
    this.iClass = {
      [spanClass]: this.span >= 0,
      [spanxsClass]: this.xs >= 0,
      [spansmClass]: this.sm >= 0,
      [spanmdClass]: this.md >= 0,
      [spanlgClass]: this.lg >= 0,
      [spanxlClass]: this.xl >= 0,
      [offsetClass]: this.offset >= 0,
      [pushClass]: this.push >= 0,
      [pullClass]: this.pull >= 0
    }
  }
}
</script>

<style lang="scss" scope>
@import "./main.scss";
</style>
