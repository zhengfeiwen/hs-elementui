<template>
  <div class="hs-row" :style="style" :class="iClass">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  name: 'hs-row'
})
export default class HsRow extends Vue {
  @Prop({ type: Number, default: 0 })
  public gutter!: number

  @Prop({ type: String })
  private type!:string

  @Prop({ type: String })
  private justify!:string

  @Prop({ type: String })
  private align!:string

  private style = {}

  private iClass = {}

  private justifyDict: any = {
    center: 'is-justify-center',
    start: 'is-justify-start',
    end: 'is-justify-end',
    'space-between': 'is-justify-space-between',
    'space-around': 'is-justify-space-around'
  }

  private alignDict: any = {
    top: 'is-align-top',
    middle: 'is-align-middle',
    bottom: 'is-align-bottom'
  }

  private created () {
    if (this.gutter) {
      const margin = '-' + this.gutter / 2 + 'px'
      this.style = {
        'margin-left': margin,
        'margin-right': margin
      }
    }
    const justify = this.justifyDict[this.justify]
    const align = this.alignDict[this.align]
    this.iClass = {
      'hs-row--flex': this.type === 'flex',
      [justify]: !!justify,
      [align]: !!align
    }
  }
}
</script>

<style lang="scss" scope>
@import "./main.scss";
</style>
