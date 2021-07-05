<template>
  <div class="hs-extendbutton" :style="bodystyle">
    <template v-if="custom">
      <div class="content" v-if="!extend">
        <slot name="short"></slot>
      </div>
      <div class="content" v-else>
        <slot name="whole"></slot>
      </div>
    </template>
    <a @click="change" :class="iClass">
      <span>{{title}}</span>
      <svg class="Zi Zi--ArrowDown ContentItem-arrowIcon" fill="currentColor" viewBox="0 0 24 24" width="21" height="21"><path d="M12 13L8.285 9.218a.758.758 0 0 0-1.064 0 .738.738 0 0 0 0 1.052l4.249 4.512a.758.758 0 0 0 1.064 0l4.246-4.512a.738.738 0 0 0 0-1.052.757.757 0 0 0-1.063 0L12.002 13z" fill-rule="evenodd"></path></svg>
    </a>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  name: 'hs-extendbutton'
})
export default class HsExtendbutton extends Vue {
  @Prop({ type: Array, required: true })
  public titles!: string[];

  @Prop({ type: String, default: '' })
  public state!: string;

  @Prop({ type: Boolean, default: !1 })
  private custom!: boolean

  @Prop({ type: Object })
  public bodystyle!: object;

  public title: string = (this.state === 'ex' ? this.titles[1] || '收起' : this.titles[0] || '展开');
  public iClass = {
    ex: this.state === 'ex' ? !0 : !1
  };

  private extend = !1

  private change () {
    this.iClass.ex = !this.iClass.ex
    if (this.iClass.ex) {
      this.title = this.titles[1]
    } else {
      this.title = this.titles[0]
    }
    this.extend = this.iClass.ex
    if (this.$listeners.change) {
      this.$emit('change', this.iClass.ex)
    }
  }
}
</script>

<style lang="scss" scoped>
.hs-extendbutton {
  color: #999;
  user-select: none;
  display: inline-block;
  .ex{
    svg{
      transform: rotate(180deg);
    }
  }
  a{
    display: flex;
    align-items: center;
    &:hover{
      color: #175199;
    }
  }
}
</style>
