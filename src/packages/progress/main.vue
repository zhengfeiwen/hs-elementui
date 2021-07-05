<template>
  <div
    class="hs-progress"
    :class="[
      'hs-progress--' + type,
      status ? 'is-' + status : '',
      {
        'hs-progress--without-text': !showText,
        'hs-progress--text-inside': textInside,
      }
    ]"
    role="progressbar"
    :aria-valuenow="percentage"
    aria-valuemin="0"
    aria-valuemax="100"
  >
    <div class="hs-progress-bar" v-if="type === 'line'">
      <div class="hs-progress-bar__outer" :style="{height: strokeWidth + 'px'}">
        <div class="hs-progress-bar__inner" :style="barStyle">
          <div class="hs-progress-bar__innerText" v-if="showText && textInside">{{content}}</div>
        </div>
      </div>
    </div>
    <div class="hs-progress-circle" :style="{height: width + 'px', width: width + 'px'}" v-else>
      <svg viewBox="0 0 100 100">
        <path
          class="hs-progress-circle__track"
          :d="trackPath"
          stroke="#e5e9f2"
          :stroke-width="relativeStrokeWidth"
          fill="none"
          :style="trailPathStyle"></path>
        <path
          class="hs-progress-circle__path"
          :d="trackPath"
          :stroke="stroke"
          fill="none"
          :stroke-linecap="strokeLinecap"
          :stroke-width="percentage ? relativeStrokeWidth : 0"
          :style="circlePathStyle"></path>
      </svg>
    </div>
    <div
      class="hs-progress__text"
      v-if="showText && !textInside"
      :style="{fontSize: progressTextSize + 'px'}"
    >
      <template v-if="!status">{{content}}</template>
      <i v-else :class="iconClass"></i>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
@Component({
  name: 'hs-progress'
})
export default class HsTag extends Vue {
  @Prop({ type: String, default: 'line', validator: val => ['line', 'circle', 'dashboard'].indexOf(val) > -1 })
  private type!: string

  @Prop({ type: Number, default: 0, validator: val => val >= 0 && val <= 100, required: !0 })
  private percentage!: number

  @Prop({ type: String, validator: val => ['success', 'exception', 'warning'].indexOf(val) > -1 })
  private status!: string

  @Prop({ type: Number, default: 6 })
  private strokeWidth!: number

  @Prop({ type: String, default: 'round' })
  private strokeLinecap!: string

  @Prop({ type: Boolean, default: !1 })
  private textInside!: boolean

  @Prop({ type: Number, default: 126 })
  private width!: number

  @Prop({ type: Boolean, default: !0 })
  private showText!: boolean

  @Prop({ type: [String, Array, Function], default: '' })
  private color!: string|[]|Function

  @Prop({ type: Function })
  private format!: Function

  get barStyle () {
    return {
      width: `${this.percentage}%`,
      backgroundColor: this.getCurrentColor(this.percentage)
    }
  }

  get relativeStrokeWidth () {
    return (this.strokeWidth / this.width * 100).toFixed(1)
  }

  get radius () {
    if (this.type === 'circle' || this.type === 'dashboard') {
      return 50 - (this.relativeStrokeWidth as any) / 2
    } else {
      return 0
    }
  }

  get trackPath () {
    const radius = this.radius
    const isDashboard = this.type === 'dashboard'
    return `
      M 50 50
      m 0 ${isDashboard ? '' : '-'}${radius}
      a ${radius} ${radius} 0 1 1 0 ${isDashboard ? '-' : ''}${radius * 2}
      a ${radius} ${radius} 0 1 1 0 ${isDashboard ? '' : '-'}${radius * 2}
      `
  }

  get perimeter () {
    return 2 * Math.PI * this.radius
  }

  get rate () {
    return this.type === 'dashboard' ? 0.75 : 1
  }

  get strokeDashoffset () {
    const offset = -1 * this.perimeter * (1 - this.rate) / 2
    return `${offset}px`
  }

  get trailPathStyle () {
    return {
      strokeDasharray: `${(this.perimeter * this.rate)}px, ${this.perimeter}px`,
      strokeDashoffset: this.strokeDashoffset
    }
  }

  get circlePathStyle () {
    return {
      strokeDasharray: `${this.perimeter * this.rate * (this.percentage / 100)}px, ${this.perimeter}px`,
      strokeDashoffset: this.strokeDashoffset,
      transition: 'stroke-dasharray 0.6s ease 0s, stroke 0.6s ease'
    }
  }

  get stroke () {
    let ret
    if (this.color) {
      ret = this.getCurrentColor(this.percentage)
    } else {
      switch (this.status) {
        case 'success':
          ret = '#13ce66'
          break
        case 'exception':
          ret = '#ff4949'
          break
        case 'warning':
          ret = '#e6a23c'
          break
        default:
          ret = '#20a0ff'
      }
    }
    return ret
  }

  get iconClass () {
    if (this.status === 'warning') {
      return 'hs-icon-warning'
    }
    if (this.type === 'line') {
      return this.status === 'success' ? 'hs-icon-circle-check' : 'hs-icon-circle-close'
    } else {
      return this.status === 'success' ? 'hs-icon-check' : 'hs-icon-close'
    }
  }

  get progressTextSize () {
    return this.type === 'line'
      ? 12 + this.strokeWidth * 0.4
      : this.width * 0.111111 + 2
  }

  get content () {
    if (typeof this.format === 'function') {
      return this.format(this.percentage) || ''
    } else {
      return `${this.percentage}%`
    }
  }

  private getCurrentColor (percentage: any) {
    if (typeof this.color === 'function') {
      return this.color(percentage)
    } else if (typeof this.color === 'string') {
      return this.color
    } else {
      return this.getLevelColor(percentage)
    }
  }

  private getLevelColor (percentage: any) {
    const colorArray = this.getColorArray().sort((a: any, b: any) => a.percentage - b.percentage)

    for (let i = 0; i < colorArray.length; i++) {
      if (colorArray[i].percentage > percentage) {
        return colorArray[i].color
      }
    }
    return colorArray[colorArray.length - 1].color
  }

  private getColorArray () {
    const color = this.color
    const span = 100 / color.length
    return (color as any).map((seriesColor: any, index: any) => {
      if (typeof seriesColor === 'string') {
        return {
          color: seriesColor,
          percentage: (index + 1) * span
        }
      }
      return seriesColor
    })
  }

  @Watch('percentage')
  private change () {
    this.$emit('finished', this.percentage)
  }
}
</script>
<style lang="scss" scoped>
@import "./main.scss";
</style>
