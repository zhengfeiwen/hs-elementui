<template>
  <div
    class="hs-step"
    :style="style"
    :class="[
      !isSimple && `is-${$parent.direction}`,
      isSimple && 'is-simple',
      isLast && !space && !isCenter && 'is-flex',
      isCenter && !isVertical && !isSimple && 'is-center'
     ]">
    <!-- icon & line -->
    <div
      class="hs-step__head"
      :class="`is-${currentStatus}`">
      <div
        class="hs-step__line"
        :style="isLast ? '' : { marginRight: $parent.stepOffset + 'px' }"
      >
        <i class="hs-step__line-inner" :style="lineStyle"></i>
      </div>

      <div class="hs-step__icon" :class="`is-${icon ? 'icon' : 'text'}`">
        <slot
          v-if="currentStatus !== 'success' && currentStatus !== 'error'"
          name="icon">
          <i v-if="icon" class="hs-step__icon-inner" :class="[icon]"></i>
          <div class="hs-step__icon-inner" v-if="!icon && !isSimple">{{ index + 1 }}</div>
        </slot>
        <i
          v-else
          :class="['hs-icon-' + (currentStatus === 'success' ? 'check' : 'close')]"
          class="hs-step__icon-inner is-status"
        >
        </i>
      </div>
    </div>
    <!-- title & description -->
    <div class="hs-step__main">
      <div
        class="hs-step__title"
        ref="title"
        :class="['is-' + currentStatus]">
        <slot name="title">{{ title }}</slot>
      </div>
      <div v-if="isSimple" class="hs-step__arrow"></div>
      <div
        v-else
        class="hs-step__description"
        :class="['is-' + currentStatus]">
        <slot name="description">{{ description }}</slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'

@Component({
  name: 'hs-step'
})
export default class HsStep extends Vue {
  @Prop({ type: String })
  private title!: string

  @Prop({ type: String })
  private icon!: string

  @Prop({ type: String })
  private description!: string

  @Prop({ type: String })
  private status!: string

  private index = -1

  private lineStyle = {}

  private internalStatus = ''

  beforeCreate () {
    (this.$parent as any).steps.push(this)
  }

  beforeDestroy () {
    const steps = (this.$parent as any).steps
    const index = steps.indexOf(this)
    if (index >= 0) {
      steps.splice(index, 1)
    }
  }

  get currentStatus () {
    return this.status || this.internalStatus
  }

  get prevStatus () {
    const prevStep = (this.$parent as any).steps[this.index - 1]
    return prevStep ? prevStep.currentStatus : 'wait'
  }

  get isCenter () {
    return (this.$parent as any).alignCenter
  }

  get isVertical () {
    return (this.$parent as any).direction === 'vertical'
  }

  get isSimple () {
    return (this.$parent as any).simple
  }

  get isLast () {
    const parent = (this.$parent as any)
    return parent.steps[parent.steps.length - 1] === this
  }

  get stepsCount () {
    return (this.$parent as any).steps.length
  }

  get space () {
    const { isSimple, $parent: { space } } = (this as any)
    return isSimple ? '' : space
  }

  get style () {
    const style: any = {}
    const parent: any = this.$parent
    const len = parent.steps.length

    const space = (typeof this.space === 'number'
      ? this.space + 'px'
      : this.space
        ? this.space
        : 100 / (len - (this.isCenter ? 0 : 1)) + '%')
    style.flexBasis = space
    if (this.isVertical) return style
    if (this.isLast) {
      style.maxWidth = 100 / this.stepsCount + '%'
    } else {
      style.marginRight = -(this.$parent as any).stepOffset + 'px'
    }

    return style
  }

  private updateStatus (val: any) {
    const prevChild: any = this.$parent.$children[this.index - 1]
    if (val > this.index) {
      this.internalStatus = (this.$parent as any).finishStatus
    } else if (val === this.index && this.prevStatus !== 'error') {
      this.internalStatus = (this.$parent as any).processStatus
    } else {
      this.internalStatus = 'wait'
    }

    if (prevChild) prevChild.calcProgress(this.internalStatus)
  }

  private calcProgress (status: any) {
    let step = 100
    const style: any = {}
    style.transitionDelay = 150 * this.index + 'ms'
    if (status === (this.$parent as any).processStatus) {
      step = this.currentStatus !== 'error' ? 0 : 0
    } else if (status === 'wait') {
      step = 0
      style.transitionDelay = (-150 * this.index) + 'ms'
    }

    style.borderWidth = step && !this.isSimple ? '1px' : 0;
    (this.$parent as any).direction === 'vertical'
      ? style.height = step + '%'
      : style.width = step + '%'

    this.lineStyle = style
  }

  @Watch('index', { immediate: !0 })
  private indexChange (val: any) {
    const activeIndex = (this.$parent as any).active
    this.updateStatus(activeIndex)
  }

  @Watch('$parent.active', { immediate: !0 })
  private activeChange (val: any) {
    const activeIndex = (this.$parent as any).active
    this.updateStatus(activeIndex)
  }

  @Watch('$parent.processStatus', { immediate: !0 })
  private processStatusChange (val: any) {
    const activeIndex = (this.$parent as any).active
    this.updateStatus(activeIndex)
  }
}
</script>

<style lang="scss">
@import "./main.scss";
</style>
