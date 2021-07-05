<template>
  <div
    class="hs-rate"
    @keydown="handleKey"
    role="slider"
    :aria-valuenow="currentValue"
    :aria-valuetext="text"
    aria-valuemin="0"
    :aria-valuemax="max"
    tabindex="0">
    <span
      v-for="(item, key) in max"
      class="hs-rate__item"
      @mousemove="setCurrentValue(item, $event)"
      @mouseleave="resetCurrentValue"
      @click="selectValue(item)"
      :style="{ cursor: rateDisabled ? 'auto' : 'pointer' }"
      :key="key">
      <i
        :class="[classes[item - 1], { 'hover': hoverIndex === item }]"
        class="hs-rate__icon"
        :style="getIconStyle(item)">
        <i
          v-if="showDecimalIcon(item)"
          :class="decimalIconClass"
          :style="decimalStyle"
          class="hs-rate__decimal">
        </i>
      </i>
    </span>
    <span v-if="showText || showScore" class="hs-rate__text" :style="{ color: textColor }">{{ text }}</span>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Inject, Vue, Watch } from 'vue-property-decorator'
import { hasClass } from '@/utils/dom'
import { isObject } from '@/utils/types'
import Migrating from '@/mixins/migrating'

@Component({
  name: 'hs-rate',
  mixins: [Migrating]
})

export default class HsRate extends Vue {
  @Inject({ from: 'hsForm', default: '' })
  private hsForm: any = ''

  @Prop({ type: Number, default: 0 })
  private value!: number

  @Prop({ type: Number, default: 2 })
  private lowThreshold!: number

  @Prop({ type: Number, default: 4 })
  private highThreshold!: number

  @Prop({ type: Number, default: 5 })
  private max!: number

  @Prop({ type: [Array, Object], default: () => (['#F7BA2A', '#F7BA2A', '#F7BA2A']) })
  private colors!: []|object|any

  @Prop({ type: String, default: '#C6D1DE' })
  private voidColor!: string

  @Prop({ type: String, default: '#EFF2F7' })
  private disabledVoidColor!: string

  @Prop({ type: [Array, Object], default: () => (['hs-icon-star-on', 'hs-icon-star-on', 'hs-icon-star-on']) })
  private iconClasses!: []|object|any

  @Prop({ type: String, default: 'hs-icon-star-off' })
  private voidIconClass!: string

  @Prop({ type: String, default: 'hs-icon-star-on' })
  private disabledVoidIconClass!: string

  @Prop({ type: Boolean, default: !1 })
  private disabled!: boolean

  @Prop({ type: Boolean, default: !1 })
  private allowHalf!: boolean

  @Prop({ type: Boolean, default: !1 })
  private showText!: boolean

  @Prop({ type: Boolean, default: !1 })
  private showScore!: boolean

  @Prop({ type: String, default: '#1f2d3d' })
  private textColor!: string

  @Prop({ type: Array, default: () => (['极差', '失望', '一般', '满意', '惊喜']) })
  private texts!: []

  @Prop({ type: String, default: '{value}' })
  private scoreTemplate!: string

  private pointerAtLeftHalf = !0
  private currentValue = this.value
  private hoverIndex = -1

  get text () {
    let result = ''
    if (this.showScore) {
      result = this.scoreTemplate.replace(/\{\s*value\s*\}/, (this.rateDisabled ? this.value : this.currentValue as any))
    } else if (this.showText) {
      result = this.texts[Math.ceil(this.currentValue) - 1]
    }
    return result
  }

  get decimalStyle () {
    let width = ''
    if (this.rateDisabled) {
      width = `${this.valueDecimal}%`
    } else if (this.allowHalf) {
      width = '50%'
    }
    return {
      color: this.activeColor,
      width
    }
  }

  get valueDecimal () {
    return this.value * 100 - Math.floor(this.value) * 100
  }

  get classMap () {
    return Array.isArray(this.iconClasses)
      ? {
        [this.lowThreshold]: this.iconClasses[0],
        [this.highThreshold]: { value: this.iconClasses[1], excluded: true },
        [this.max]: this.iconClasses[2]
      } : this.iconClasses
  }

  get decimalIconClass () {
    return this.getValueFromMap(this.value, this.classMap)
  }

  get voidClass () {
    return this.rateDisabled ? this.disabledVoidIconClass : this.voidIconClass
  }

  get activeClass () {
    return this.getValueFromMap(this.currentValue, this.classMap)
  }

  get colorMap () {
    return Array.isArray(this.colors)
      ? {
        [this.lowThreshold]: this.colors[0],
        [this.highThreshold]: { value: this.colors[1], excluded: true },
        [this.max]: this.colors[2]
      } : this.colors
  }

  get activeColor () {
    return this.getValueFromMap(this.currentValue, this.colorMap)
  }

  get classes () {
    const result = []
    let i = 0
    let threshold = this.currentValue
    if (this.allowHalf && this.currentValue !== Math.floor(this.currentValue)) {
      threshold--
    }
    for (; i < threshold; i++) {
      result.push(this.activeClass)
    }
    for (; i < this.max; i++) {
      result.push(this.voidClass)
    }
    return result
  }

  get rateDisabled () {
    return this.disabled || (this.hsForm || {}).disabled
  }

  @Watch('value')
  private valueChange (val: any) {
    this.currentValue = val
    this.pointerAtLeftHalf = this.value !== Math.floor(this.value)
  }

  private getMigratingConfig () {
    return {
      props: {
        'text-template': 'text-template is renamed to score-template.'
      }
    }
  }

  private getValueFromMap (value: any, map: any) {
    const matchedKeys = Object.keys(map)
      .filter(key => {
        const val = map[key]
        const excluded = isObject(val) ? val.excluded : false
        return excluded ? value < key : value <= key
      })
      .sort((a: any, b: any) => a - b)
    const matchedValue = map[matchedKeys[0]]
    return isObject(matchedValue) ? matchedValue.value : (matchedValue || '')
  }

  private showDecimalIcon (item: any) {
    const showWhenDisabled = this.rateDisabled && this.valueDecimal > 0 && item - 1 < this.value && item > this.value
    /* istanbul ignore next */
    const showWhenAllowHalf = this.allowHalf &&
        this.pointerAtLeftHalf &&
        item - 0.5 <= this.currentValue &&
        item > this.currentValue
    return showWhenDisabled || showWhenAllowHalf
  }

  private getIconStyle (item: any) {
    const voidColor = this.rateDisabled ? this.disabledVoidColor : this.voidColor
    return {
      color: item <= this.currentValue ? this.activeColor : voidColor
    }
  }

  private selectValue (value: any) {
    if (this.rateDisabled) {
      return
    }
    if (this.allowHalf && this.pointerAtLeftHalf) {
      this.$emit('input', this.currentValue)
      this.$emit('change', this.currentValue)
    } else {
      this.$emit('input', value)
      this.$emit('change', value)
    }
  }

  private handleKey (e: any) {
    if (this.rateDisabled) {
      return
    }
    let currentValue = this.currentValue
    const keyCode = e.keyCode
    if (keyCode === 38 || keyCode === 39) { // left / down
      if (this.allowHalf) {
        currentValue += 0.5
      } else {
        currentValue += 1
      }
      e.stopPropagation()
      e.preventDefault()
    } else if (keyCode === 37 || keyCode === 40) {
      if (this.allowHalf) {
        currentValue -= 0.5
      } else {
        currentValue -= 1
      }
      e.stopPropagation()
      e.preventDefault()
    }
    currentValue = currentValue < 0 ? 0 : currentValue
    currentValue = currentValue > this.max ? this.max : currentValue

    this.$emit('input', currentValue)
    this.$emit('change', currentValue)
  }

  private setCurrentValue (value: any, event: any) {
    if (this.rateDisabled) {
      return
    }
    /* istanbul ignore if */
    if (this.allowHalf) {
      let target = event.target
      if (hasClass(target, 'hs-rate__item')) {
        target = target.querySelector('.hs-rate__icon')
      }
      if (hasClass(target, 'hs-rate__decimal')) {
        target = target.parentNode
      }
      this.pointerAtLeftHalf = event.offsetX * 2 <= target.clientWidth
      this.currentValue = this.pointerAtLeftHalf ? value - 0.5 : value
    } else {
      this.currentValue = value
    }
    this.hoverIndex = value
  }

  private resetCurrentValue () {
    if (this.rateDisabled) {
      return
    }
    if (this.allowHalf) {
      this.pointerAtLeftHalf = this.value !== Math.floor(this.value)
    }
    this.currentValue = this.value
    this.hoverIndex = -1
  }

  private created () {
    if (!this.value) {
      this.$emit('input', 0)
    }
  }
}
</script>

<style lang="scss">
@import "./main.scss";
</style>
