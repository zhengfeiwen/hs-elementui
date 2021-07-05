<template>
  <div :class="'hs-divider ' + fClass()">
    <span class="hs-divider-content"><slot /></span>
  </div>
</template>

<script lang='ts'>
import {
  Component,
  Prop,
  Vue
} from 'vue-property-decorator'

@Component({
  name: 'hs-divider'
})
export default class HsImage extends Vue {
  @Prop({ type: String, default: 'horizontal' })
  private direction!: string

  @Prop({ type: String, default: 'center' })
  private contentPosition!: string

  private DIRECTIONS: any = {
    vertical: 'vertical',
    horizontal: 'horizontal'
  }

  private POSITIONS: any = {
    left: 'left',
    right: 'right',
    center: 'center'
  }

  private fClass () {
    return `${this.DIRECTIONS[this.direction] || 'horizontal'} ${this.POSITIONS[this.contentPosition] || 'center'}`
  }
}
</script>
<style lang="scss" scoped>
@import "./main.scss";
</style>
