<template>
  <transition name="viewer-fade">
    <div tabindex="-1" ref="hs-image-viewer__wrapper" class="hs-image-viewer__wrapper" :style="{ 'z-index': zIndex }">
      <div class="hs-image-viewer__mask"></div>
      <!-- CLOSE -->
      <span class="hs-image-viewer__btn hs-image-viewer__close" @click="hide">
        <i class="hs-icon-circle-close"></i>
      </span>
      <!-- ARROW -->
      <template v-if="!isSingle">
        <span
          class="hs-image-viewer__btn hs-image-viewer__prev"
          :class="{ 'is-disabled': !infinite && isFirst }"
          @click="prev">
          <i class="hs-icon-arrow-left"/>
        </span>
        <span
          class="hs-image-viewer__btn hs-image-viewer__next"
          :class="{ 'is-disabled': !infinite && isLast }"
          @click="next">
          <i class="hs-icon-arrow-right"/>
        </span>
      </template>
      <!-- ACTIONS -->
      <div class="hs-image-viewer__btn hs-image-viewer__actions">
        <div class="hs-image-viewer__actions__inner">
          <i class="hs-icon-zoom-out" @click="handleActions('zoomOut')"></i>
          <i class="hs-icon-zoom-in" @click="handleActions('zoomIn')"></i>
          <i class="hs-image-viewer__actions__divider"></i>
          <i :class="mode.icon" @click="toggleMode"></i>
          <i class="hs-image-viewer__actions__divider"></i>
          <i class="hs-icon-refresh-left" @click="handleActions('anticlocelise')"></i>
          <i class="hs-icon-refresh-right" @click="handleActions('clocelise')"></i>
        </div>
      </div>
      <!-- CANVAS -->
      <div class="hs-image-viewer__canvas">
        <template
          v-for="(url, i) in urlList">
          <img
          v-if="i === index"
          ref="img"
          class="hs-image-viewer__img"
          :key="url"
          :src="currentImg"
          :style="imgStyle"
          @load="handleImgLoad"
          @error="handleImgError"
          @mousedown="handleMouseDown">
        </template>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { on, off } from '@/utils/dom'
import { rafThrottle, isFirefox } from '@/utils/util'

const Mode: any = {
  CONTAIN: {
    name: 'contain',
    icon: 'hs-icon-full-screen'
  },
  ORIGINAL: {
    name: 'original',
    icon: 'hs-icon-c-scale-to-original'
  }
}

const mousewheelEventName = isFirefox() ? 'DOMMouseScroll' : 'mousewheel'

@Component({
  name: 'hs-image-viewer'
})

export default class HsImageViewer extends Vue {
  // eslint-disable-next-line no-undef
  [x: string]: any
  @Prop({ type: Array, default: () => [] })
  private urlList!: []

  @Prop({ type: Number, default: 2000 })
  private zIndex!: number

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  @Prop({ type: Function, default: () => {} })
  private onSwitch!: Function

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  @Prop({ type: Function, default: () => {} })
  private onClose!: Function

  @Prop({ type: Number, default: 0 })
  private initialIndex!: number

  private index = this.initialIndex

  private isShow = false

  private infinite = true

  private loading = false

  private mode = Mode.CONTAIN

  private transform = {
    scale: 1,
    deg: 0,
    offsetX: 0,
    offsetY: 0,
    enableTransition: false
  }

  get isSingle () {
    return this.urlList.length <= 1
  }

  get isFirst () {
    return this.index === 0
  }

  get isLast () {
    return this.index === this.urlList.length - 1
  }

  get currentImg () {
    return this.urlList[this.index]
  }

  get imgStyle () {
    const { scale, deg, offsetX, offsetY, enableTransition } = this.transform
    const style: any = {
      transform: `scale(${scale}) rotate(${deg}deg)`,
      transition: enableTransition ? 'transform .3s' : '',
      'margin-left': `${offsetX}px`,
      'margin-top': `${offsetY}px`
    }
    if (this.mode === Mode.CONTAIN) {
      style.maxWidth = style.maxHeight = '100%'
    }
    return style
  }

  @Watch('index')
  private indexChange (val: any) {
    this.reset()
    this.onSwitch(val)
  }

  @Watch('currentImg')
  private currentImgChange (val: any) {
    this.$nextTick(() => {
      const $img = (this.$refs as any).img[0]
      if (!$img.complete) {
        this.loading = true
      }
    })
  }

  private hide () {
    this.deviceSupportUninstall()
    this.onClose()
  }

  private deviceSupportInstall () {
    this._keyDownHandler = rafThrottle((e: any) => {
      const keyCode = e.keyCode
      switch (keyCode) {
        // ESC
        case 27:
          this.hide()
          break
        // SPACE
        case 32:
          this.toggleMode()
          break
        // LEFT_ARROW
        case 37:
          this.prev()
          break
        // UP_ARROW
        case 38:
          this.handleActions('zoomIn')
          break
        // RIGHT_ARROW
        case 39:
          this.next()
          break
        // DOWN_ARROW
        case 40:
          this.handleActions('zoomOut')
          break
      }
    })
    this._mouseWheelHandler = rafThrottle((e: any) => {
      const delta = e.wheelDelta ? e.wheelDelta : -e.detail
      if (delta > 0) {
        this.handleActions('zoomIn', {
          zoomRate: 0.015,
          enableTransition: false
        })
      } else {
        this.handleActions('zoomOut', {
          zoomRate: 0.015,
          enableTransition: false
        })
      }
    })
    on(document, 'keydown', this._keyDownHandler)
    on(document, mousewheelEventName, this._mouseWheelHandler)
  }

  private deviceSupportUninstall () {
    off(document, 'keydown', this._keyDownHandler)
    off(document, mousewheelEventName, this._mouseWheelHandler)
    this._keyDownHandler = null
    this._mouseWheelHandler = null
  }

  private handleImgLoad () {
    this.loading = false
  }

  private handleImgError (e: any) {
    this.loading = false
    e.target.alt = '加载失败'
  }

  private handleMouseDown (e: any) {
    if (this.loading || e.button !== 0) return

    const { offsetX, offsetY } = this.transform
    const startX = e.pageX
    const startY = e.pageY
    this._dragHandler = rafThrottle((ev: any) => {
      this.transform.offsetX = offsetX + ev.pageX - startX
      this.transform.offsetY = offsetY + ev.pageY - startY
    })
    on(document, 'mousemove', this._dragHandler)
    on(document, 'mouseup', () => {
      off(document, 'mousemove', this._dragHandler)
    })

    e.preventDefault()
  }

  private reset () {
    this.transform = {
      scale: 1,
      deg: 0,
      offsetX: 0,
      offsetY: 0,
      enableTransition: false
    }
  }

  private toggleMode () {
    if (this.loading) return

    const modeNames = Object.keys(Mode)
    const modeValues = Object.values(Mode)
    const index = modeValues.indexOf(this.mode)
    const nextIndex = (index + 1) % modeNames.length
    this.mode = Mode[modeNames[nextIndex]]
    this.reset()
  }

  private prev () {
    if (this.isFirst && !this.infinite) return
    const len = this.urlList.length
    this.index = (this.index - 1 + len) % len
  }

  private next () {
    if (this.isLast && !this.infinite) return
    const len = this.urlList.length
    this.index = (this.index + 1) % len
  }

  private handleActions (action: any, options = {}) {
    if (this.loading) return
    const { zoomRate, rotateDeg, enableTransition } = {
      zoomRate: 0.2,
      rotateDeg: 90,
      enableTransition: true,
      ...options
    }
    const { transform } = this
    switch (action) {
      case 'zoomOut':
        if (transform.scale > 0.2) {
          transform.scale = parseFloat((transform.scale - zoomRate).toFixed(3))
        }
        break
      case 'zoomIn':
        transform.scale = parseFloat((transform.scale + zoomRate).toFixed(3))
        break
      case 'clocelise':
        transform.deg += rotateDeg
        break
      case 'anticlocelise':
        transform.deg -= rotateDeg
        break
    }
    transform.enableTransition = enableTransition
  }

  private mounted () {
    this.deviceSupportInstall();
    (this.$refs['hs-image-viewer__wrapper'] as any).focus()
  }
}
</script>
