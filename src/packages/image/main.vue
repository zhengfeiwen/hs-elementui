<template>
  <div class="hs-image">
    <slot v-if="loading" name="placeholder">
      <div class="hs-image__placeholder"></div>
    </slot>
    <slot v-else-if="error" name="error">
      <div class="hs-image__error">{{ t('hs.image.error') }}</div>
    </slot>
    <img
      v-else
      class="hs-image__inner"
      v-bind="$attrs"
      v-on="$listeners"
      @click="clickHandler"
      :src="src"
      :style="imageStyle"
      :class="{ 'hs-image__inner--center': alignCenter, 'hs-image__preview': preview }">
    <template v-if="preview">
      <image-viewer :z-index="zIndex" :initial-index="imageIndex" v-if="showViewer" :on-close="closeViewer" :url-list="previewSrcList"/>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import ImageViewer from './viewer/main.vue'
import Locale from '@/mixins/locale'
import { on, off, getScrollContainer, isInContainer } from '@/utils/dom'
import { isString, isHtmlElement } from '@/utils/types'
import { throttle } from 'throttle-debounce'

const isSupportObjectFit = () => document.documentElement.style.objectFit !== undefined

const ObjectFit: any = {
  NONE: 'none',
  CONTAIN: 'contain',
  COVER: 'cover',
  FILL: 'fill',
  SCALE_DOWN: 'scale-down'
}

let prevOverflow = ''

@Component({
  name: 'hs-image',
  mixins: [Locale],
  components: {
    ImageViewer
  }
})

export default class HsImage extends Vue {
  // eslint-disable-next-line no-undef
  [x: string]: any
  private inheritAttrs = !1

  @Prop({ type: String })
  private src!: String

  @Prop({ type: String })
  private fit!: String

  @Prop({ type: Boolean })
  private lazy!: boolean

  @Prop({ type: Object })
  private scrollContainer!: object

  @Prop({ type: Array, default: () => [] })
  private previewSrcList!: []

  @Prop({ type: Number, default: 2000 })
  private zIndex!: number

  private loading = true

  private error = false

  private show = !this.lazy

  private imageWidth = 0

  private imageHeight = 0

  private showViewer = false

  get imageStyle () {
    const { fit } = this
    if (!this.$isServer && fit) {
      return isSupportObjectFit()
        ? { 'object-fit': fit }
        : this.getImageStyle(fit)
    }
    return {}
  }

  get alignCenter () {
    return !this.$isServer && !isSupportObjectFit() && this.fit !== ObjectFit.FILL
  }

  get preview () {
    const { previewSrcList } = this
    return Array.isArray(previewSrcList) && previewSrcList.length > 0
  }

  get imageIndex () {
    let previewIndex = 0
    const srcIndex = this.previewSrcList.indexOf((this.src as never))
    if (srcIndex >= 0) {
      previewIndex = srcIndex
    }
    return previewIndex
  }

  @Watch('src')
  private srcChange (val: any) {
    this.show && this.loadImage()
  }

  @Watch('show')
  private showChange (val: any) {
    val && this.loadImage()
  }

  mounted () {
    if (this.lazy) {
      this.addLazyLoadListener()
    } else {
      this.loadImage()
    }
  }

  beforeDestroy () {
    this.lazy && this.removeLazyLoadListener()
  }

  private loadImage () {
    if (this.$isServer) return

    // reset status
    this.loading = true
    this.error = false

    const img: any = new Image()
    img.onload = (e: any) => this.handleLoad(e, img)
    img.onerror = this.handleError.bind(this)

    // bind html attrs
    // so it can behave consistently
    Object.keys(this.$attrs)
      .forEach((key) => {
        const value = this.$attrs[key]
        img.setAttribute(key, value)
      })
    img.src = this.src
  }

  private handleLoad (e: any, img: any) {
    this.imageWidth = img.width
    this.imageHeight = img.height
    this.loading = false
    this.error = false
  }

  private handleError (e: any) {
    this.loading = false
    this.error = true
    this.$emit('error', e)
  }

  private handleLazyLoad () {
    if (isInContainer(this.$el, this._scrollContainer)) {
      this.show = true
      this.removeLazyLoadListener()
    }
  }

  private addLazyLoadListener () {
    if (this.$isServer) return

    const { scrollContainer }: any = this
    let _scrollContainer = null

    if (isHtmlElement(scrollContainer)) {
      _scrollContainer = scrollContainer
    } else if (isString(scrollContainer)) {
      _scrollContainer = document.querySelector(scrollContainer)
    } else {
      _scrollContainer = getScrollContainer(this.$el, null)
    }

    if (_scrollContainer) {
      this._scrollContainer = _scrollContainer
      this._lazyLoadHandler = throttle(200, !1, this.handleLazyLoad)
      on(_scrollContainer, 'scroll', this._lazyLoadHandler)
      this.handleLazyLoad()
    }
  }

  private removeLazyLoadListener () {
    const { _scrollContainer, _lazyLoadHandler } = this

    if (this.$isServer || !_scrollContainer || !_lazyLoadHandler) return

    off(_scrollContainer, 'scroll', _lazyLoadHandler)
    this._scrollContainer = null
    this._lazyLoadHandler = null
  }

  private getImageStyle (fit: any) {
    const { imageWidth, imageHeight } = this
    const {
      clientWidth: containerWidth,
      clientHeight: containerHeight
    } = this.$el

    if (!imageWidth || !imageHeight || !containerWidth || !containerHeight) return {}

    const vertical = imageWidth / imageHeight < 1

    if (fit === ObjectFit.SCALE_DOWN) {
      const isSmaller = imageWidth < containerWidth && imageHeight < containerHeight
      fit = isSmaller ? ObjectFit.NONE : ObjectFit.CONTAIN
    }

    switch (fit) {
      case ObjectFit.NONE:
        return { width: 'auto', height: 'auto' }
      case ObjectFit.CONTAIN:
        return vertical ? { width: 'auto' } : { height: 'auto' }
      case ObjectFit.COVER:
        return vertical ? { height: 'auto' } : { width: 'auto' }
      default:
        return {}
    }
  }

  private clickHandler () {
    // don't show viewer when preview is false
    if (!this.preview) {
      return
    }
    // prevent body scroll
    prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    this.showViewer = true
  }

  private closeViewer () {
    document.body.style.overflow = prevOverflow
    this.showViewer = false
  }
}
</script>

<style lang="scss" scoped>
@import "./main.scss";
</style>
