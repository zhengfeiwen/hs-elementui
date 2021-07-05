<template>
  <div class="hs-footer">
    <slot></slot>
  </div>
</template>

<script lang='ts'>
import {
  Component,
  Vue
} from 'vue-property-decorator'

@Component({
  name: 'hs-footer'
})
export default class HsFooter extends Vue {

}
</script>
<style lang="scss" scoped>
.hs-footer{
  padding:0 20px;
  -webkit-box-sizing:border-box;
  box-sizing:border-box;
  -ms-flex-negative:0;
  flex-shrink:0
}
</style>
