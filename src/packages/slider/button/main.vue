<template>
  <div
    class="hs-slider__button-wrapper"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @mousedown="onButtonDown"
    @touchstart="onButtonDown"
    :class="{ 'hover': hovering, 'dragging': dragging }"
    :style="wrapperStyle"
    ref="button"
    tabindex="0"
    @focus="handleMouseEnter"
    @blur="handleMouseLeave"
    @keydown.left="onLeftKeyDown"
    @keydown.right="onRightKeyDown"
    @keydown.down.prevent="onLeftKeyDown"
    @keydown.up.prevent="onRightKeyDown"
  >
    <hs-tooltip
      placement="top"
      ref="tooltip"
      :popper-class="tooltipClass"
      :disabled="!showTooltip">
      <span slot="content">{{ formatValue }}</span>
      <div class="hs-slider__button" :class="{ 'hover': hovering, 'dragging': dragging }"></div>
    </hs-tooltip>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import HsTooltip from '@/packages/tooltip/main.vue'

@Component({
  name: 'hs-slider-button',
  components: {
    'hs-tooltip': HsTooltip
  }
})
export default class hsSliderButton extends Vue {
  @Prop({ type: Number, default: 0 })
  private value!: number

  @Prop({ type: Boolean, default: !1 })
  private vertical!: boolean

  @Prop({ type: String })
  private tooltipClass!: string

  private hovering = !1

  private dragging = !1

  private isClick = !1

  private startX = 0

  private currentX = 0

  private startY = 0

  private currentY = 0

  private startPosition = 0

  private newPosition: any = null

  private oldValue = this.value

  get disabled () {
    return (this.$parent as any).sliderDisabled
  }

  get max () {
    return (this.$parent as any).max
  }

  get min () {
    return (this.$parent as any).min
  }

  get step () {
    return (this.$parent as any).step
  }

  get showTooltip () {
    return (this.$parent as any).showTooltip
  }

  get precision () {
    return (this.$parent as any).precision
  }

  get currentPosition () {
    return `${(this.value - this.min) / (this.max - this.min) * 100}%`
  }

  get enableFormat () {
    return (this.$parent as any).formatTooltip instanceof Function
  }

  get formatValue () {
    return (this.enableFormat && (this.$parent as any).formatTooltip(this.value)) || this.value
  }

  get wrapperStyle () {
    return this.vertical ? { bottom: this.currentPosition } : { left: this.currentPosition }
  }

  @Watch('dargging')
  private draggingChange (val: any) {
    (this.$parent as any).dragging = val
  }

  private displayTooltip () {
    this.$refs.tooltip && ((this.$refs.tooltip as any).showPopper = true)
  }

  private hideTooltip () {
    this.$refs.tooltip && ((this.$refs.tooltip as any).showPopper = false)
  }

  private handleMouseEnter () {
    this.hovering = true
    this.displayTooltip()
  }

  private handleMouseLeave () {
    this.hovering = false
    this.hideTooltip()
  }

  private onButtonDown (event: any) {
    if (this.disabled) return
    event.preventDefault()
    this.onDragStart(event)
    window.addEventListener('mousemove', this.onDragging)
    window.addEventListener('touchmove', this.onDragging)
    window.addEventListener('mouseup', this.onDragEnd)
    window.addEventListener('touchend', this.onDragEnd)
    window.addEventListener('contextmenu', this.onDragEnd)
  }

  private onLeftKeyDown () {
    if (this.disabled) return
    this.newPosition = parseFloat(this.currentPosition) - this.step / (this.max - this.min) * 100
    this.setPosition(this.newPosition);
    (this.$parent as any).emitChange()
  }

  private onRightKeyDown () {
    if (this.disabled) return
    this.newPosition = parseFloat(this.currentPosition) + this.step / (this.max - this.min) * 100
    this.setPosition(this.newPosition);
    (this.$parent as any).emitChange()
  }

  private onDragStart (event: any) {
    this.dragging = true
    this.isClick = true
    if (event.type === 'touchstart') {
      event.clientY = event.touches[0].clientY
      event.clientX = event.touches[0].clientX
    }
    if (this.vertical) {
      this.startY = event.clientY
    } else {
      this.startX = event.clientX
    }
    this.startPosition = parseFloat(this.currentPosition)
    this.newPosition = this.startPosition
  }

  private onDragging (event: any) {
    if (this.dragging) {
      this.isClick = false
      this.displayTooltip();
      (this.$parent as any).resetSize()
      let diff = 0
      if (event.type === 'touchmove') {
        event.clientY = event.touches[0].clientY
        event.clientX = event.touches[0].clientX
      }
      if (this.vertical) {
        this.currentY = event.clientY
        diff = (this.startY - this.currentY) / (this.$parent as any).sliderSize * 100
      } else {
        this.currentX = event.clientX
        diff = (this.currentX - this.startX) / (this.$parent as any).sliderSize * 100
      }
      this.newPosition = this.startPosition + diff
      this.setPosition(this.newPosition)
    }
  }

  private onDragEnd () {
    if (this.dragging) {
      /*
          * 防止在 mouseup 后立即触发 click，导致滑块有几率产生一小段位移
          * 不使用 preventDefault 是因为 mouseup 和 click 没有注册在同一个 DOM 上
          */
      setTimeout(() => {
        this.dragging = false
        this.hideTooltip()
        if (!this.isClick) {
          this.setPosition(this.newPosition);
          (this.$parent as any).emitChange()
        }
      }, 0)
      window.removeEventListener('mousemove', this.onDragging)
      window.removeEventListener('touchmove', this.onDragging)
      window.removeEventListener('mouseup', this.onDragEnd)
      window.removeEventListener('touchend', this.onDragEnd)
      window.removeEventListener('contextmenu', this.onDragEnd)
    }
  }

  private setPosition (newPosition: any) {
    if (newPosition === null || isNaN(newPosition)) return
    if (newPosition < 0) {
      newPosition = 0
    } else if (newPosition > 100) {
      newPosition = 100
    }
    const lengthPerStep = 100 / ((this.max - this.min) / this.step)
    const steps = Math.round(newPosition / lengthPerStep)
    let value = steps * lengthPerStep * (this.max - this.min) * 0.01 + this.min
    value = parseFloat(value.toFixed(this.precision))
    this.$emit('input', value)
    this.$nextTick(() => {
      this.displayTooltip()
      this.$refs.tooltip && (this.$refs.tooltip as any).updatePopper()
    })
    if (!this.dragging && this.value !== this.oldValue) {
      this.oldValue = this.value
    }
  }
}
</script>
