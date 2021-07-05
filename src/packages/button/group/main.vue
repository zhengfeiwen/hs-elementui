<template>
  <div class="hs-button-group">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  name: 'hs-button-group'
})
export default class ButtonGroup extends Vue {
}
</script>

<style lang="scss" scoped>
.hs-button-group{
  display: inline-block;
  vertical-align: top;
  &:after, &:before {
    display: table;
    content: "";
  }
  &:after {
    clear: both;
  }
  .hs-button{
    &:first-child {
      border-right-color: hsla(0,0%,100%,.5);
    }
    &:last-child {
      border-left-color: hsla(0,0%,100%,.5);
    }
    &:not(:first-child):not(:last-child) {
      border-left-color: hsla(0,0%,100%,.5);
      border-right-color: hsla(0,0%,100%,.5);
    }
  }
  .hs-button+.hs-button {
    margin-left: 0;
  }
}
.hs-button-group>.hs-button {
  float: left;
  position: relative;
  &:not(:last-child) {
    margin-right: -1px;
  }
  &:first-child {
    border-right-color: hsla(0,0%,100%,.5);
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
  &:last-child {
    border-left-color: hsla(0,0%,100%,.5);
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
}
.hs-button-group>.hs-button:not(:first-child):not(:last-child) {
    border-radius: 0;
}
</style>
