<template>
  <div
    class="hs-slider"
    :class="{ 'is-vertical': vertical, 'hs-slider--with-input': showInput }"
    role="slider"
    :aria-valuemin="min"
    :aria-valuemax="max"
    :aria-orientation="vertical ? 'vertical': 'horizontal'"
    :aria-disabled="sliderDisabled"
  >
    <hs-input-number
      v-model="firstValue"
      v-if="showInput && !range"
      class="hs-slider__input"
      ref="input"
      @change="emitChange"
      :step="step"
      :disabled="sliderDisabled"
      :controls="showInputControls"
      :min="min"
      :max="max"
      :debounce="debounce"
      :size="inputSize">
    </hs-input-number>
    <div
      class="hs-slider__runway"
      :class="{ 'show-input': showInput, 'disabled': sliderDisabled }"
      :style="runwayStyle"
      @click="onSliderClick"
      ref="slider">
      <div
        class="hs-slider__bar"
        :style="barStyle">
      </div>
      <hs-slider-button
        :vertical="vertical"
        v-model="firstValue"
        :tooltip-class="tooltipClass"
        ref="button1">
      </hs-slider-button>
      <hs-slider-button
        :vertical="vertical"
        v-model="secondValue"
        :tooltip-class="tooltipClass"
        ref="button2"
        v-if="range">
      </hs-slider-button>
      <template v-if="showStops">
        <div
        class="hs-slider__stop"
        v-for="(item, key) in stops"
        :key="key"
        :style="getStopStyle(item)"
        >
      </div>
      </template>
      <template v-if="markList.length > 0">
        <div>
          <div
            v-for="(item, key) in markList"
            :style="getStopStyle(item.position)"
            class="hs-slider__stop hs-slider__marks-stop"
            :key="key">
          </div>
        </div>
        <div class="hs-slider__marks">
          <hs-slider-marker
            :mark="item.mark" v-for="(item, key) in markList"
            :key="key"
            :style="getStopStyle(item.position)">
          </hs-slider-marker>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Inject, Watch } from 'vue-property-decorator'
import HsInputNumber from '@/packages/inputnumber/main.vue'
import SliderButton from './button/main.vue'
import SliderMarker from './marker.vue'
import Emitter from '@/mixins/emitter'

@Component({
  name: 'hs-slider',
  mixins: [Emitter],
  components: {
    'hs-input-number': HsInputNumber,
    'hs-slider-button': SliderButton,
    'hs-slider-marker': SliderMarker
  }
})
export default class HsSlider extends Vue {
  @Inject({ from: 'hsForm', default: '' })
  private hsForm!: any

  @Prop({ type: Number, default: 0 })
  private min!: number

  @Prop({ type: Number, default: 100 })
  private max!: number

  @Prop({ type: Number, default: 1 })
  private step!: number

  @Prop({ type: [Number, Array], default: 0 })
  private value!: number|[]

  @Prop({ type: Boolean, default: !1 })
  private showInput!: boolean

  @Prop({ type: Boolean, default: !0 })
  private showInputControls!: boolean

  @Prop({ type: String, default: 'small' })
  private inputSize!: string

  @Prop({ type: Boolean, default: !1 })
  private showStops!: boolean

  @Prop({ type: Boolean, default: !0 })
  private showTooltip!: boolean

  @Prop({ type: Function })
  private formatTooltip!: Function

  @Prop({ type: Boolean, default: !1 })
  private disabled!: boolean

  @Prop({ type: Boolean, default: !1 })
  private range!: boolean

  @Prop({ type: Boolean, default: !1 })
  private vertical!: boolean

  @Prop({ type: String })
  private height!: string

  @Prop({ type: Number, default: 300 })
  private debounce!: number

  @Prop({ type: String })
  private label!: string

  @Prop({ type: String })
  private tooltipClass!: string

  @Prop({ type: Object })
  private marks!: object

  private firstValue: any = null

  private secondValue: any = null

  private oldValue: any = null

  private dragging = !1

  private sliderSize = 1

  @Watch('value')
  private valueChange (val: any, oldVal: any) {
    if ((this.dragging || Array.isArray(val)) && Array.isArray(oldVal) && val.every((item: any, index: any) => item === oldVal[index])) {
      return
    }
    this.setValues()
  }

  @Watch('dragging')
  private draggingChange (val: any) {
    if (!val) {
      this.setValues()
    }
  }

  @Watch('firstValue')
  private firstValueChange (val: any) {
    if (this.range) {
      this.$emit('input', [this.minValue, this.maxValue])
    } else {
      this.$emit('input', val)
    }
  }

  @Watch('secondValue')
  private secondValueChange () {
    if (this.range) {
      this.$emit('input', [this.minValue, this.maxValue])
    }
  }

  @Watch('min')
  private minChange () {
    this.setValues()
  }

  @Watch('max')
  private maxChange () {
    this.setValues()
  }

  private valueChanged () {
    if (this.range) {
      return ![this.minValue, this.maxValue]
        .every((item, index) => item === this.oldValue[index])
    } else {
      return this.value !== this.oldValue
    }
  }

  private setValues () {
    if (this.min > this.max) {
      console.error('[Element Error][Slider]min should not be greater than max.')
      return
    }
    const val: any = this.value
    if (this.range && Array.isArray(val)) {
      if (val[1] < this.min) {
        this.$emit('input', [this.min, this.min])
      } else if (val[0] > this.max) {
        this.$emit('input', [this.max, this.max])
      } else if (val[0] < this.min) {
        this.$emit('input', [this.min, val[1]])
      } else if (val[1] > this.max) {
        this.$emit('input', [val[0], this.max])
      } else {
        this.firstValue = val[0]
        this.secondValue = val[1]
        if (this.valueChanged()) {
          (this as any).dispatch('hs-form-item', 'hs.form.change', [this.minValue, this.maxValue])
          this.oldValue = val.slice()
        }
      }
    } else if (!this.range && typeof val === 'number' && !isNaN(val)) {
      if (val < this.min) {
        this.$emit('input', this.min)
      } else if (val > this.max) {
        this.$emit('input', this.max)
      } else {
        this.firstValue = val
        if (this.valueChanged()) {
          (this as any).dispatch('hs-form-item', 'hs.form.change', val)
          this.oldValue = val
        }
      }
    }
  }

  private setPosition (percent: any) {
    const targetValue = this.min + percent * (this.max - this.min) / 100
    if (!this.range) {
      (this.$refs.button1 as any).setPosition(percent)
      return
    }
    let button
    if (Math.abs(this.minValue - targetValue) < Math.abs(this.maxValue - targetValue)) {
      button = this.firstValue < (this as any).secondValue ? 'button1' : 'button2'
    } else {
      button = this.firstValue > (this as any).secondValue ? 'button1' : 'button2'
    }
    (this.$refs[button] as any).setPosition(percent)
  }

  private onSliderClick (event: any) {
    if (this.sliderDisabled || this.dragging) return
    this.resetSize()
    if (this.vertical) {
      const sliderOffsetBottom = (this.$refs.slider as any).getBoundingClientRect().bottom
      this.setPosition((sliderOffsetBottom - event.clientY) / this.sliderSize * 100)
    } else {
      const sliderOffsetLeft = (this.$refs.slider as any).getBoundingClientRect().left
      this.setPosition((event.clientX - sliderOffsetLeft) / this.sliderSize * 100)
    }
    this.emitChange()
  }

  private resetSize () {
    if (this.$refs.slider) {
      this.sliderSize = (this.$refs.slider as any)[`client${this.vertical ? 'Height' : 'Width'}`]
    }
  }

  private emitChange () {
    this.$nextTick(() => {
      this.$emit('change', this.range ? [this.minValue, this.maxValue] : this.value)
    })
  }

  private getStopStyle (position: any) {
    return this.vertical ? { bottom: position + '%' } : { left: position + '%' }
  }

  get stops () {
    if (!this.showStops || this.min > this.max) return []
    if (this.step === 0) {
      process.env.NODE_ENV !== 'production' &&
          console.warn('[Hs-elementui Warn][Slider]step should not be 0.')
      return []
    }
    const stopCount = (this.max - this.min) / this.step
    const stepWidth = 100 * this.step / (this.max - this.min)
    const result = []
    for (let i = 1; i < stopCount; i++) {
      result.push(i * stepWidth)
    }
    if (this.range) {
      return result.filter(step => {
        return step < 100 * (this.minValue - this.min) / (this.max - this.min) ||
              step > 100 * (this.maxValue - this.min) / (this.max - this.min)
      })
    } else {
      return result.filter(step => step > 100 * (this.firstValue - this.min) / (this.max - this.min))
    }
  }

  get markList () {
    if (!this.marks) {
      return []
    }

    const marksKeys = Object.keys(this.marks)
    return marksKeys.map(parseFloat)
      .sort((a, b) => a - b)
      .filter(point => point <= this.max && point >= this.min)
      .map(point => ({
        point,
        position: (point - this.min) * 100 / (this.max - this.min),
        mark: (this.marks as any)[point]
      }))
  }

  get minValue () {
    return Math.min(this.firstValue, this.secondValue)
  }

  get maxValue () {
    return Math.max(this.firstValue, this.secondValue)
  }

  get barSize () {
    return this.range
      ? `${100 * (this.maxValue - this.minValue) / (this.max - this.min)}%`
      : `${100 * (this.firstValue - this.min) / (this.max - this.min)}%`
  }

  get barStart () {
    return this.range
      ? `${100 * (this.minValue - this.min) / (this.max - this.min)}%`
      : '0%'
  }

  get precision () {
    const precisions = [this.min, this.max, this.step].map(item => {
      const decimal = ('' + item).split('.')[1]
      return decimal ? decimal.length : 0
    })
    return Math.max.apply(null, precisions)
  }

  get runwayStyle () {
    return this.vertical ? { height: this.height } : {}
  }

  get barStyle () {
    return this.vertical
      ? {
        height: this.barSize,
        bottom: this.barStart
      } : {
        width: this.barSize,
        left: this.barStart
      }
  }

  get sliderDisabled () {
    return this.disabled || (this.hsForm || {}).disabled
  }

  private mounted () {
    let valuetext
    if (this.range) {
      if (Array.isArray(this.value)) {
        this.firstValue = Math.max(this.min, (this.value as any)[0])
        this.secondValue = Math.min(this.max, (this.value as any)[1])
      } else {
        this.firstValue = this.min
        this.secondValue = this.max
      }
      this.oldValue = [this.firstValue, this.secondValue]
      valuetext = `${this.firstValue}-${this.secondValue}`
    } else {
      if (typeof this.value !== 'number' || isNaN(this.value)) {
        this.firstValue = this.min
      } else {
        this.firstValue = Math.min(this.max, Math.max(this.min, this.value))
      }
      this.oldValue = this.firstValue
      valuetext = this.firstValue
    }
    this.$el.setAttribute('aria-valuetext', valuetext)

    // label screen reader
    this.$el.setAttribute('aria-label', this.label ? this.label : `slider between ${this.min} and ${this.max}`)

    this.resetSize()
    window.addEventListener('resize', this.resetSize)
  }

  private beforeDestroy () {
    window.removeEventListener('resize', this.resetSize)
  }
}
</script>

<style lang="scss">
@import "./main.scss";
</style>
