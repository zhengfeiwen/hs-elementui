<template>
  <div :class="fClass()" :style="{ 'flex-direction': direction}">
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
  name: 'hs-container'
})
export default class HsContainer extends Vue {
  @Prop({ type: String, default: 'vertical' })
  private direction!: string

  private fClass () {
    let cls = 'hs-container'
    this.$slots.default && this.$slots.default.forEach((val) => {
      if ((val.tag && val.tag.indexOf('hs-header') > -1) || (val.tag && val.tag.indexOf('hs-footer') > -1)) {
        cls = 'hs-container is-vertical'
        return !1
      }
    })
    return cls
  }
}
</script>
<style lang="scss" scoped>
.hs-container{
  display:-webkit-box;
  display:-ms-flexbox;
  display:flex;
  -webkit-box-orient:horizontal;
  -webkit-box-direction:normal;
  -ms-flex-direction:row;
  flex-direction:row;
  -webkit-box-flex:1;
  -ms-flex:1;
  flex:1;
  -ms-flex-preferred-size:auto;
  flex-basis:auto;
  -webkit-box-sizing:border-box;
  box-sizing:border-box;
  min-width:0
}
.hs-container.is-vertical{
  -webkit-box-orient:vertical;
  -webkit-box-direction:normal;
  -ms-flex-direction:column;
  flex-direction:column
}
</style>
