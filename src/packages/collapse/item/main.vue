<template>
  <div class="hs-collapse-item"
    :class="{'is-active': isActive, 'is-disabled': disabled }">
    <div
      role="tab"
      :aria-expanded="collapse.activeNames.indexOf(name) > -1"
      :aria-controls="`hs-collapse-content-${id}`"
      :aria-describedby ="`hs-collapse-content-${id}`"
    >
      <div
        class="hs-collapse-item__header"
        @click="handleHeaderClick"
        role="button"
        :id="`hs-collapse-head-${id}`"
        :tabindex="disabled ? undefined : 0"
        @keyup.space.enter.stop="handleEnterClick"
        :class="{
          'focusing': focusing,
          'is-active': collapse.activeNames.indexOf(name) > -1
        }"
        @focus="handleFocus"
        @blur="focusing = false"
      >
        <slot name="title">{{title}}</slot>
        <i
          class="hs-collapse-item__arrow hs-icon-arrow-right"
          :class="{'is-active': collapse.activeNames.indexOf(name) > -1}">
        </i>
      </div>
    </div>
    <hs-collapse-transition>
      <div
        class="hs-collapse-item__wrap"
        v-show="collapse.activeNames.indexOf(name) > -1"
        role="tabpanel"
        :aria-hidden="!collapse.activeNames.indexOf(name) > -1"
        :aria-labelledby="`hs-collapse-head-${id}`"
        :id="`hs-collapse-content-${id}`"
      >
        <div class="hs-collapse-item__content">
          <slot></slot>
        </div>
      </div>
    </hs-collapse-transition>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Inject } from 'vue-property-decorator'
import HsCollapseTransition from '@/transitions/collapse-transition'
import Emitter from '@/mixins/emitter'
import { generateId } from '@/utils/util'

@Component({
  name: 'hs-collapse-item',
  mixins: [Emitter],
  components: {
    'hs-collapse-transition': HsCollapseTransition
  }
})

export default class HsCollapseItem extends Vue {
  @Inject({ from: 'collapse', default: '' })
  private collapse!: any

  private contentWrapStyle: any = {
    height: 'auto',
    display: 'block'
  }

  private contentHeight = 0

  private focusing = !1

  private isClick = !1

  private activeNames = this.collapse.activeNames

  private id = generateId()

  get uid () {
    return (this as any)._uid
  }

  get isActive () {
    return this.activeNames.indexOf(this.name) > -1
  }

  @Prop({ type: String })
  private title!: string

  @Prop({ type: [String, Number] })
  private name!: string|number

  @Prop({ type: Boolean })
  private disabled!: boolean

  private handleFocus () {
    setTimeout(() => {
      if (!this.isClick) {
        this.focusing = !0
      } else {
        this.isClick = !1
      }
    }, 50)
  }

  private handleHeaderClick () {
    if (this.disabled) return
    (this as any).dispatch('hs-collapse', 'item-click', this)
    this.focusing = !1
    this.isClick = !0
  }

  private handleEnterClick () {
    (this as any).dispatch('hs-collapse', 'item-click', this)
  }

  private created () {
    this.name = this.name || this.uid
  }
}
</script>
