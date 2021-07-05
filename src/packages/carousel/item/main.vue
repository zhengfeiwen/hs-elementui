<template>
  <div
    v-show="ready"
    class="hs-carousel__item"
    :class="{
      'is-active': active,
      'hs-carousel__item--card': $parent.type === 'card',
      'is-in-stage': inStage,
      'is-hover': hover,
      'is-animating': animating
    }"
    @click="handleItemClick"
    :style="itemStyle">
    <div
      v-if="$parent.type === 'card'"
      v-show="!active"
      class="hs-carousel__mask">
    </div>
    <slot></slot>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue } from 'vue-property-decorator'
import { autoprefixer } from '@/utils/util'

const CARD_SCALE = 0.83

@Component({
  name: 'hs-carousel-item'
})

export default class HsCarouselItem extends Vue {
    @Prop({ type: String })
    private name!: string

    @Prop({ type: [String, Number], default: '' })
    private label!: string|number

    private hover: any = !1

    private translate: any = 0

    private scale: any = 1

    private active: any = !1

    private ready: any = !1

    private inStage: any = !1

    private animating: any = !1

    private processIndex (index: any, activeIndex: any, length: any) {
      if (activeIndex === 0 && index === length - 1) {
        return -1
      } else if (activeIndex === length - 1 && index === 0) {
        return length
      } else if (index < activeIndex - 1 && activeIndex - index >= length / 2) {
        return length + 1
      } else if (index > activeIndex + 1 && index - activeIndex >= length / 2) {
        return -2
      }
      return index
    }

    private calcCardTranslate (index: any, activeIndex: any) {
      const parentWidth = (this.$parent.$el as any).offsetWidth
      if (this.inStage) {
        return parentWidth * ((2 - CARD_SCALE) * (index - activeIndex) + 1) / 4
      } else if (index < activeIndex) {
        return -(1 + CARD_SCALE) * parentWidth / 4
      } else {
        return (3 + CARD_SCALE) * parentWidth / 4
      }
    }

    private calcTranslate (index: any, activeIndex: any, isVertical: any) {
      const distance = (this.$parent.$el as any)[isVertical ? 'offsetHeight' : 'offsetWidth']
      return distance * (index - activeIndex)
    }

    private translateItem (index: any, activeIndex: any, oldIndex: any) {
      const parentType = (this.$parent as any).type
      const parentDirection = this.parentDirection
      const length = (this.$parent as any).items.length
      if (parentType !== 'card' && oldIndex !== undefined) {
        this.animating = index === activeIndex || index === oldIndex
      }
      if (index !== activeIndex && length > 2 && (this.$parent as any).loop) {
        index = (this as any).processIndex(index, activeIndex, length)
      }
      if (parentType === 'card') {
        if (parentDirection === 'vertical') {
          console.warn('[HsElement Warn][Carousel]vertical direction is not supported in card mode')
        }
        this.inStage = Math.round(Math.abs(index - activeIndex)) <= 1
        this.active = index === activeIndex
        this.translate = this.calcCardTranslate(index, activeIndex)
        this.scale = this.active ? 1 : CARD_SCALE
      } else {
        this.active = index === activeIndex
        const isVertical = parentDirection === 'vertical'
        this.translate = this.calcTranslate(index, activeIndex, isVertical)
      }
      this.ready = true
    }

    private handleItemClick () {
      const parent: any = this.$parent
      if (parent && parent.type === 'card') {
        const index = parent.items.indexOf(this)
        parent.setActiveItem(index)
      }
    }

    get parentDirection () {
      return (this.$parent as any).direction
    }

    get itemStyle () {
      const translateType = this.parentDirection === 'vertical' ? 'translateY' : 'translateX'
      const value = `${translateType}(${this.translate}px) scale(${this.scale})`
      const style = {
        transform: value
      }
      return autoprefixer(style)
    }

    created () {
      this.$parent && (this.$parent as any).updateItems()
    }

    destroyed () {
      this.$parent && (this.$parent as any).updateItems()
    }
}
</script>

<style lang="scss" scoped>
@import "./main.scss";
</style>
