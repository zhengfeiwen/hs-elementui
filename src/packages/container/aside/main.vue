<template>
  <div class="hs-aside" :style="{width:width}">
    <slot></slot>
  </div>
</template>

<script lang='ts'>
import {
  Component,
  Prop,
  Vue
} from 'vue-property-decorator'

@Component({
  name: 'hs-aside'
})
export default class HsAside extends Vue {
  @Prop({ type: String, default: '300px' })
  private width!: string
}
</script>
<style lang="scss" scoped>
.hs-aside{
  overflow:auto;
  -webkit-box-sizing:border-box;
  box-sizing:border-box;
  -ms-flex-negative:0;
  flex-shrink:0;
  width:inherit;
}
</style>
