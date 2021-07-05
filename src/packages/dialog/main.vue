<template>
  <transition
    name="dialog-fade"
    @after-enter="afterEnter"
    @after-leave="afterLeave">
    <div
      v-show="visible"
      class="hs-dialog__wrapper"
      @click.self="handleWrapperClick">
      <div
        role="dialog"
        :key="key"
        aria-modal="true"
        :aria-label="title || 'dialog'"
        :class="['hs-dialog', { 'is-fullscreen': fullscreen, 'hs-dialog--center': center }, customClass]"
        ref="dialog"
        :style="style">
        <div class="hs-dialog__header">
          <slot name="title">
            <span class="hs-dialog__title">{{ title }}</span>
          </slot>
          <button
            type="button"
            class="hs-dialog__headerbtn"
            aria-label="Close"
            v-if="showClose"
            @click="handleClose">
            <i class="hs-dialog__close hs-icon hs-icon-close"></i>
          </button>
        </div>
        <div class="hs-dialog__body" v-if="rendered"><slot></slot></div>
        <div class="hs-dialog__footer" v-if="$slots.footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang='ts'>
import { Component, Prop, Watch, Vue } from 'vue-property-decorator'
import Popup from '@/utils/popup/index'
import Migrating from '@/mixins/migrating'
import emitter from '@/mixins/emitter'

@Component({
  name: 'hs-dialog',
  mixins: [Popup, emitter, Migrating]
})

export default class HsDialog extends Vue {
  @Prop({ type: String, default: '' })
  private title!: string

  @Prop({ type: Boolean, default: !0 })
  private modal!: boolean

  @Prop({ type: Boolean, default: !0 })
  private modalAppendToBody!: boolean

  @Prop({ type: Boolean, default: !1 })
  private appendToBody!: boolean

  @Prop({ type: Boolean, default: !0 })
  private lockScroll!: boolean

  @Prop({ type: Boolean, default: !0 })
  private closeOnClickModal!: boolean

  @Prop({ type: Boolean, default: !0 })
  private closeOnPressEscape!: boolean

  @Prop({ type: Boolean, default: !0 })
  private showClose!: boolean

  @Prop({ type: String })
  private width!: string

  @Prop({ type: Boolean })
  private fullscreen!: boolean

  @Prop({ type: String, default: '' })
  private customClass!: string

  @Prop({ type: String, default: '15vh' })
  private top!: string

  @Prop({ type: Function })
  private beforeClose!: Function

  @Prop({ type: Boolean, default: !1 })
  private center!: boolean

  @Prop({ type: Boolean })
  private destroyOnClose!: boolean

  private closed = !1

  private key = 0

  @Watch('visible')
  private visibleChange (val: any) {
    if (val) {
      this.closed = false
      this.$emit('open')
      this.$el.addEventListener('scroll', (this as any).updatePopper)
      this.$nextTick(() => {
        (this.$refs.dialog as any).scrollTop = 0
      })
      if (this.appendToBody) {
        document.body.appendChild(this.$el)
      }
    } else {
      this.$el.removeEventListener('scroll', (this as any).updatePopper)
      if (!this.closed) this.$emit('close')
      if (this.destroyOnClose) {
        this.$nextTick(() => {
          this.key++
        })
      }
    }
  }

  get style () {
    const style: any = {}
    if (!this.fullscreen) {
      style.marginTop = this.top
      if (this.width) {
        style.width = this.width
      }
    }
    return style
  }

  private getMigratingConfig () {
    return {
      props: {
        size: 'size is removed.'
      }
    }
  }

  private handleWrapperClick () {
    if (!this.closeOnClickModal) return
    this.handleClose()
  }

  private handleClose () {
    if (typeof this.beforeClose === 'function') {
      this.beforeClose(this.hide)
    } else {
      (this as any).hide()
    }
  }

  private hide (cancel: any) {
    if (cancel !== false) {
      this.$emit('update:visible', false)
      this.$emit('close')
      this.closed = true
    }
  }

  private updatePopper () {
    (this as any).broadcast('hs-select-dropdown', 'updatePopper');
    (this as any).broadcast('hs-dropdown-menu', 'updatePopper')
  }

  private afterEnter () {
    this.$emit('opened')
  }

  private afterLeave () {
    this.$emit('closed')
  }

  private mounted () {
    if ((this as any).visible) {
      (this as any).rendered = !0;
      (this as any).open()
      if (this.appendToBody) {
        document.body.appendChild(this.$el)
      }
    }
  }

  private destroyed () {
    // if appendToBody is true, remove DOM node after destroy
    if (this.appendToBody && this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./main.scss";
</style>
