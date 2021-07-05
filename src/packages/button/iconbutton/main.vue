<template>
  <div class="icon">
    <a @click="handleClick">
      <svg-icon :name=icon></svg-icon>
      <div>{{desc}}</div>
    </a>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  name: 'hs-iconbutton'
})
export default class HsIconbutton extends Vue {
  @Prop({ type: String })
  public desc!: string;

  @Prop({ type: String })
  public icon!: string;

  private handleClick () {
    if (this.$listeners.click) {
      this.$emit('click')
    }
  }
}
</script>

<style lang="scss" scoped>
.icon {
  color: #999;
  user-select: none;
  display: inline-block;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
  margin: 6px;
  a{
    display: flex;
    font-size: 14px;
    text-decoration: none;
  }
  &:hover{
    color: #175199;
  }
  svg{
    margin-top: 3px;
    margin-right:3px;
  }
}
</style>
