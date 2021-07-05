<template>
  <div class="hs-header" :style="{ height: height }">
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
  name: 'hs-header'
})
export default class HsHeader extends Vue {
  @Prop({ type: String, default: 'vertical' })
  private height!: string
}
</script>
<style lang="scss" scoped>
.hs-header{
  padding:0 20px;
  -webkit-box-sizing:border-box;
  box-sizing:border-box;
  -ms-flex-negative:0;flex-shrink:0
}
</style>
