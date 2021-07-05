<script lang="tsx">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import Popper from '@/utils/vue-popper'
import debounce from 'debounce'
import { addClass, removeClass, on, off } from '@/utils/dom'
import { generateId } from '@/utils/util'

@Component({
  name: 'hs-tooltip',
  mixins: [Popper]
})
export default class HsTooltip extends Vue {
  @Prop({ type: Number, default: 0 })
  private openDelay!: number

  @Prop({ type: Boolean })
  private disabled!: boolean

  @Prop({ type: Boolean })
  private manual!: boolean

  @Prop({ type: String, default: 'dark' })
  private effect!: string

  @Prop({ type: Number, default: 0 })
  private arrowOffset!: number

  @Prop({ type: String })
  private popperClass!: string

  @Prop({ type: String })
  private content!: string

  @Prop({ type: Boolean, default: !0 })
  private visibleArrow!: boolean

  @Prop({ type: String, default: 'hs-fade-in-linear' })
  private transition!: string

  @Prop({ type: Object, default: () => ({ boundariesPadding: 10, gpuAcceleration: !1 }) })
  private popperOptions!: object

  @Prop({ type: Boolean, default: !0 })
  private enterable!: boolean

  @Prop({ type: Number, default: 0 })
  private hideAfter!: number

  @Prop({ type: Number, default: 0 })
  private tabindex!: number

  private tooltipId = `hs-tooltip-${generateId()}`

  private timeoutPending: any = null

  private focusing = !1

  private popperVM: any

  private referenceElm: any

  private showPopper = !1

  private expectedState: any

  private timeout:any

  private beforeCreate () {
    if (this.$isServer) return

    this.popperVM = new Vue({
      data: { node: '' },
      render (h) {
        return (this as any).node
      }
    }).$mount()
    this.popperVM.node = '';
    (this as any).debounceClose = debounce(() => this.handleClosePopper(), 200)
  }

  render () {
    if (this.popperVM) {
      this.popperVM.node = (
        <transition
          name={ this.transition }
          onAfterLeave={ (this as any).doDestroy }>
          <div
            onMouseleave={ () => { this.setExpectedState(false); (this as any).debounceClose() } }
            onMouseenter= { () => { this.setExpectedState(true) } }
            ref="popper"
            role="tooltip"
            id={this.tooltipId}
            aria-hidden={ (this.disabled || !this.showPopper) ? 'true' : 'false' }
            v-show={!this.disabled && this.showPopper}
            class={
              ['hs-tooltip__popper', 'is-' + this.effect, this.popperClass]
            }>
            { this.$slots.content || this.content }
          </div>
        </transition>)
    }

    const firstElement = this.getFirstElement()
    if (!firstElement) return null

    const data = firstElement.data = firstElement.data || {}
    data.staticClass = this.addTooltipClass(data.staticClass)
    return firstElement
  }

  private mounted () {
    this.referenceElm = this.$el
    if (this.$el.nodeType === 1) {
      this.$el.setAttribute('aria-describedby', this.tooltipId)
      this.$el.setAttribute('tabindex', this.tabindex.toString())
      on(this.referenceElm, 'mouseenter', this.show)
      on(this.referenceElm, 'mouseleave', this.hide)
      on(this.referenceElm, 'focus', () => {
        if (!this.$slots.default || !this.$slots.default.length) {
          this.handleFocus()
          return
        }
        const instance: any = this.$slots.default[0].componentInstance
        if (instance && instance.focus) {
          instance.focus()
        } else {
          this.handleFocus()
        }
      })
      on(this.referenceElm, 'blur', this.handleBlur)
      on(this.referenceElm, 'click', this.removeFocusing)
    }
    if ((this as any).value && this.popperVM) {
      this.popperVM.$nextTick(() => {
        if ((this as any).value) {
          (this as any).updatePopper()
        }
      })
    }
  }

  @Watch('focusing')
  private focusingChange (val: any) {
    if (val) {
      addClass(this.referenceElm, 'focusing')
    } else {
      removeClass(this.referenceElm, 'focusing')
    }
  }

  private show () {
    this.setExpectedState(true)
    this.handleShowPopper()
  }

  private hide () {
    this.setExpectedState(false);
    (this as any).debounceClose()
  }

  private handleFocus () {
    this.focusing = true
    this.show()
  }

  private handleBlur () {
    this.focusing = false
    this.hide()
  }

  private removeFocusing () {
    this.focusing = false
  }

  private addTooltipClass (prev: any) {
    if (!prev) {
      return 'hs-tooltip'
    } else {
      return 'hs-tooltip ' + prev.replace('hs-tooltip', '')
    }
  }

  private handleShowPopper () {
    if (!this.expectedState || this.manual) return
    clearTimeout(this.timeout)
    this.timeout = setTimeout(() => {
      this.showPopper = true
    }, this.openDelay)

    if (this.hideAfter > 0) {
      this.timeoutPending = setTimeout(() => {
        this.showPopper = false
      }, this.hideAfter)
    }
  }

  private handleClosePopper () {
    if ((this.enterable && this.expectedState) || this.manual) return
    clearTimeout(this.timeout)

    if (this.timeoutPending) {
      clearTimeout(this.timeoutPending)
    }
    this.showPopper = false

    if (this.disabled) {
      (this as any).doDestroy()
    }
  }

  private setExpectedState (expectedState: any) {
    if (expectedState === false) {
      clearTimeout(this.timeoutPending)
    }
    this.expectedState = expectedState
  }

  private getFirstElement () {
    const slots = this.$slots.default
    if (!Array.isArray(slots)) return null
    let element = null
    for (let index = 0; index < slots.length; index++) {
      if (slots[index] && slots[index].tag) {
        element = slots[index]
      }
    }
    return element
  }

  private beforeDestroy () {
    this.popperVM && this.popperVM.$destroy()
  }

  private destroyed () {
    const reference = this.referenceElm
    if (reference.nodeType === 1) {
      off(reference, 'mouseenter', this.show)
      off(reference, 'mouseleave', this.hide)
      off(reference, 'focus', this.handleFocus)
      off(reference, 'blur', this.handleBlur)
      off(reference, 'click', this.removeFocusing)
    }
  }
}
</script>

<style lang="scss">
@import "./main.scss"
</style>
