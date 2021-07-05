<template>
  <div
    :class="carouselClasses"
    @mouseenter.stop="handleMouseEnter"
    @mouseleave.stop="handleMouseLeave">
    <div
      class="hs-carousel__container"
      :style="{ height: height }">
      <transition
        v-if="arrowDisplay"
        name="caroushs-arrow-left">
        <button
          type="button"
          v-show="(arrow === 'always' || hover) && (loop || activeIndex > 0)"
          @mouseenter="handleButtonEnter('left')"
          @mouseleave="handleButtonLeave"
          @click.stop="throttledArrowClick(activeIndex - 1)"
          class="hs-carousel__arrow hs-carousel__arrow--left">
          <i class="hs-icon-arrow-left"></i>
        </button>
      </transition>
      <transition
        v-if="arrowDisplay"
        name="caroushs-arrow-right">
        <button
          type="button"
          v-show="(arrow === 'always' || hover) && (loop || activeIndex < items.length - 1)"
          @mouseenter="handleButtonEnter('right')"
          @mouseleave="handleButtonLeave"
          @click.stop="throttledArrowClick(activeIndex + 1)"
          class="hs-carousel__arrow hs-carousel__arrow--right">
          <i class="hs-icon-arrow-right"></i>
        </button>
      </transition>
      <slot></slot>
    </div>
    <ul
      v-if="indicatorPosition !== 'none'"
      :class="indicatorsClasses">
      <li
        v-for="(item, index) in items"
        :key="index"
        :class="[
          'hs-carousel__indicator',
          'hs-carousel__indicator--' + direction,
          { 'is-active': index === activeIndex }]"
        @mouseenter="throttledIndicatorHover(index)"
        @click.stop="handleIndicatorClick(index)">
        <button class="hs-carousel__button">
          <span v-if="hasLabel">{{ item.label }}</span>
        </button>
      </li>
    </ul>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Watch, Vue } from 'vue-property-decorator'
import debounce from 'debounce'
import { addResizeListener, removeResizeListener } from '@/utils/resize-event'

@Component({
  name: 'hs-carousel'
})

export default class HsCarousel extends Vue {
  @Prop({ type: Number, default: 0 })
  private initialIndex!: number

  @Prop({ type: String })
  private height!: string

  @Prop({ type: String, default: 'hover' })
  private trigger!: string

  @Prop({ type: Boolean, default: !0 })
  private autoplay!: boolean

  @Prop({ type: Number, default: 3000 })
  private interval!: number

  @Prop({ type: Number, default: 0 })
  private indicatorPosition!: String

  @Prop({ type: Boolean, default: !0 })
  private indicator!: boolean

  @Prop({ type: String, default: 'hover' })
  private arrow!: string

  @Prop({ type: String })
  private type!: string

  @Prop({ type: Boolean, default: !0 })
  private loop!: boolean

  @Prop({
    type: String,
    default: 'horizontal',
    validator (val) {
      return ['horizontal', 'vertical'].indexOf(val) !== -1
    }
  })
  private direction!: string

  private items = []

  private activeIndex = -1

  private containerWidth = 0

  private timer: any = null

  private hover: any = !1

  get arrowDisplay () {
    return this.arrow !== 'never' && this.direction !== 'vertical'
  }

  get hasLabel () {
    return this.items.some((item: any) => item.label.toString().length > 0)
  }

  get carouselClasses () {
    const classes = ['hs-carousel', 'hs-caroushs--' + this.direction]
    if (this.type === 'card') {
      classes.push('hs-caroushs--card')
    }
    return classes
  }

  get indicatorsClasses () {
    const classes = ['hs-carousel__indicators', 'hs-carousel__indicators--' + this.direction]
    if (this.hasLabel) {
      classes.push('hs-carousel__indicators--labels')
    }
    if (this.indicatorPosition === 'outside' || this.type === 'card') {
      classes.push('hs-carousel__indicators--outside')
    }
    return classes
  }

  @Watch('items')
  private itemsChange (val: any) {
    if (val.length > 0) this.setActiveItem(this.initialIndex)
  }

  @Watch('activeIndex')
  private activeIndexChange (val: any, oldVal: any) {
    this.resetItemPosition(oldVal)
    if (oldVal > -1) {
      this.$emit('change', val, oldVal)
    }
  }

  @Watch('autoplay')
  private autoplayChange (val: any) {
    val ? this.startTimer() : this.pauseTimer()
  }

  @Watch('loop')
  private loopChange () {
    this.setActiveItem(this.activeIndex)
  }

  private handleMouseEnter () {
    this.hover = true
    this.pauseTimer()
  }

  private handleMouseLeave () {
    this.hover = false
    this.startTimer()
  }

  private itemInStage (item: any, index: any) {
    const length = this.items.length
    if ((index === length - 1 && item.inStage && (this.items as any)[0].active) ||
        (item.inStage && this.items[index + 1] && (this.items[index + 1] as any).active)) {
      return 'left'
    } else if ((index === 0 && item.inStage && (this.items[length - 1] as any).active) ||
        (item.inStage && this.items[index - 1] && (this.items[index - 1] as any).active)) {
      return 'right'
    }
    return false
  }

  private handleButtonEnter (arrow: any) {
    if (this.direction === 'vertical') return
    this.items.forEach((item: any, index) => {
      if (arrow === this.itemInStage(item, index)) {
        item.hover = true
      }
    })
  }

  private handleButtonLeave () {
    if (this.direction === 'vertical') return
    this.items.forEach((item: any) => {
      item.hover = false
    })
  }

  private updateItems () {
    (this as any).items = this.$children.filter(child => child.$options.name === 'hs-carousel-item')
  }

  private resetItemPosition (oldIndex: any) {
    this.items.forEach((item: any, index) => {
      item.translateItem(index, this.activeIndex, oldIndex)
    })
  }

  private playSlides () {
    if (this.activeIndex < this.items.length - 1) {
      this.activeIndex++
    } else if (this.loop) {
      this.activeIndex = 0
    }
  }

  private pauseTimer () {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  }

  private startTimer () {
    if (this.interval <= 0 || !this.autoplay || this.timer) return
    this.timer = setInterval(this.playSlides, this.interval)
  }

  private setActiveItem (index: any) {
    if (typeof index === 'string') {
      const filteredItems = this.items.filter((item: any) => item.name === index)
      if (filteredItems.length > 0) {
        index = this.items.indexOf(filteredItems[0])
      }
    }
    index = Number(index)
    if (isNaN(index) || index !== Math.floor(index)) {
      console.warn('[HsElement Warn][Carousel]index must be an integer.')
      return
    }
    const length = this.items.length
    const oldIndex = this.activeIndex
    if (index < 0) {
      this.activeIndex = this.loop ? length - 1 : 0
    } else if (index >= length) {
      this.activeIndex = this.loop ? 0 : length - 1
    } else {
      this.activeIndex = index
    }
    if (oldIndex === this.activeIndex) {
      this.resetItemPosition(oldIndex)
    }
  }

  private prev () {
    this.setActiveItem(this.activeIndex - 1)
  }

  private next () {
    this.setActiveItem(this.activeIndex + 1)
  }

  private handleIndicatorClick (index: any) {
    this.activeIndex = index
  }

  private handleIndicatorHover (index: any) {
    if (this.trigger === 'hover' && index !== this.activeIndex) {
      this.activeIndex = index
    }
  }

  created () {
    (this as any).throttledArrowClick = debounce((index: any) => {
      this.setActiveItem(index)
    }, 300, true);
    (this as any).throttledIndicatorHover = debounce((index: any) => {
      this.handleIndicatorHover(index)
    }, 300)
  }

  mounted () {
    this.updateItems()
    this.$nextTick(() => {
      addResizeListener(this.$el, this.resetItemPosition)
      if (this.initialIndex < this.items.length && this.initialIndex >= 0) {
        this.activeIndex = this.initialIndex
      }
      this.startTimer()
    })
  }

  beforeDestroy () {
    if (this.$el) removeResizeListener(this.$el, this.resetItemPosition)
    this.pauseTimer()
  }
}
</script>

<style lang="scss" scoped>
@import "./main.scss";
</style>
