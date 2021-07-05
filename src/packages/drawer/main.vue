<template>
  <transition
    name="el-drawer-fade"
    @after-enter="afterEnter"
    @after-leave="afterLeave">
    <div :class="directionClass">
      <div :class="base">
        <header :class="withHeader? '' : 'hidden'">
          <span>{{title}}</span>
          <slot name="title"></slot>
          <a :class="showClose? '' : 'hidden'" href="#" @click="handleClose(!0)"><i class="hs-icon-error" /></a>
          </header>
        <section><slot/></section>
      </div>
      <div class="hs-modal" @click="handleClose(wrapperClosable)"></div>
    </div>
  </transition>
</template>

<script lang='ts'>
import {
  Component,
  Prop,
  PropSync,
  Watch,
  Vue
} from 'vue-property-decorator'

@Component({
  name: 'hs-drawer'
})
export default class HsDrawer extends Vue {
  @PropSync('visible', { type: [String, Boolean], default: '' })
  private syncvisible!: string|boolean

  @Prop({ type: Boolean, default: !0 })
  private withHeader!: boolean

  @Prop({ type: Boolean, default: !0 })
  private showClose!: boolean

  @Prop({ type: Boolean, default: !0 })
  private wrapperClosable!: boolean

  @Prop({ type: String, default: 'ltr' })
  private direction!: string

  @Prop({ type: String, default: '' })
  private title!: string

  private DIRECTIONS: any = {
    rtl: 'right',
    ltr: 'left',
    ttb: 'top',
    btt: 'bottom'
  }

  private directionKey = this.DIRECTIONS[this.direction] || 'left'
  private directionClass = {
    'hs-drawer': !0,
    [this.directionKey]: !!this.syncvisible,
    hidden: !this.syncvisible
  }

  private base = {
    'hs-drawer-body': !0,
    [this.directionKey + '-base']: !0
  }

  @Watch('syncvisible', { immediate: true })
  private onVisible () {
    if (this.syncvisible && this.$listeners.open) {
      this.$emit('open')
    }
    if (!this.syncvisible) {
      this.directionClass[this.directionKey] = !!this.syncvisible
      setTimeout(() => {
        this.directionClass.hidden = !this.syncvisible
      }, 700)
    } else {
      this.directionClass.hidden = !this.syncvisible
      setTimeout(() => {
        this.directionClass[this.directionKey] = !!this.syncvisible
        if (this.$listeners.opened) {
          this.$emit('opened')
        }
      }, 100)
    }
  }

  private afterEnter () {
    this.$listeners.opened && this.$emit('opened')
  }

  private afterLeave () {
    this.$listeners.closed && this.$emit('closed')
  }

  private handleClose (flag: boolean) {
    if (!flag) {
      return
    }
    if (this.$listeners['before-close']) {
      this.$emit('before-close', this.close)
    } else {
      this.close()
    }
  }

  private close () {
    this.syncvisible = !1
  }
}
</script>
<style lang="scss" scoped>
@import "./main.scss";
</style>
