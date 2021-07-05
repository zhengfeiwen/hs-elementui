<template>
  <div class="hs-main">
    <slot></slot>
  </div>
</template>

<script lang='ts'>
import {
  Component,
  Vue
} from 'vue-property-decorator'

@Component({
  name: 'hs-main'
})
export default class HsMain extends Vue {

}
</script>
<style lang="scss" scoped>
.hs-main{
  display:block;
  -webkit-box-flex:1;
  -ms-flex:1;
  flex:1;
  -ms-flex-preferred-size:auto;
  flex-basis:auto;
  overflow:auto;
  -webkit-box-sizing:border-box;
  box-sizing:border-box;
  padding:20px
}
</style>
