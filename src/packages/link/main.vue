<template>
  <div v-if="type === 'extend'" class="hs-link-extend">
    <div :class="fExtClass()" :style="{ height: height + 'px' }">
      <slot></slot>
    </div>
    <a href="#" @click="extendClick">
      <span>{{extText}}</span>
      <i :class="extendIconClass" />
      </a>
  </div>

  <a :href="href" :class="fClass()" @click="handleclick" v-else>
    <template v-if="icon">
      <i :class="icon"></i>
    </template>
    <template v-if="logo">
      <svg-icon :name="logo" :style="logo.indexOf('cir') > -1 ? 'width:inherit;height:inherit' : ''"/>
    </template>
    <span class="hs-link--inner"><slot></slot></span>
  </a>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import SvgIcon from '@/packages/svgicon/main.vue'
import { LinkType } from './types'
@Component({
  name: 'hs-link',
  components: {
    'hs-svgicon': SvgIcon
  }
})
export default class HsLink extends Vue {
  @Prop({ type: String })
  private href!: String

  @Prop({ type: String, default: 'default' })
  private type!: LinkType

  @Prop({ type: Boolean, default: !1 })
  private underline!: boolean

  @Prop({ type: Boolean, default: !1 })
  private extend!: boolean

  @Prop({ type: Boolean, default: !0 })
  private block!: boolean

  @Prop({ type: String, default: '' })
  private logo!: string

  @Prop({ type: String, default: '' })
  private icon!: string

  @Prop({ type: Boolean, default: !1 })
  private disabled!: boolean

  @Prop({ type: Number, default: 20 })
  private height!: number

  private extText = '展开'

  private extendIconClass = 'hs-icon-arrow-down'

  private extendStatus = this.extend

  private extendContainer: any

  private fClass () {
    // const plain = this.plain ? ' is-plain' : ''
    const underline = this.underline && !this.disabled ? ' is-underline' : ''
    const disabled = this.disabled ? ' is-disabled' : ''
    const icon = this.icon ? ` hs-icon--${this.icon}` : ''
    const logo = this.logo ? ' hs-icon--logo' : ''
    return `hs-link hs-link--${this.type}${disabled}${underline}${icon}${logo}`
  }

  private fExtClass () {
    const extend = !this.extend ? ' is-extend ' : ''
    const block = this.block ? ' text-overflow-block' : ''
    return `hs-link-container${extend}${block}`
  }

  private handleclick () {
    this.disabled || this.$emit('click')
  }

  mounted () {
    if (this.type === 'extend') {
    }
  }

  private extendClick () {
    if (this.extendStatus) {
      this.extendIconClass = 'hs-icon-arrow-down'
      this.extText = '展开'
    } else {
      this.extendIconClass = 'hs-icon-arrow-up'
      this.extText = '收起'
    }
    this.extendStatus = !this.extendStatus
    this.$emit('change', this.extendStatus)
  }
}
</script>

<style lang="scss" scoped>
@import "./main.scss";
</style>
