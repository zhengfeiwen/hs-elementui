<script lang="tsx">
import { Component, Provide, Prop, Watch, Vue } from 'vue-property-decorator'
import Clickoutside from '@/utils/clickoutside'
import Emitter from '@/mixins/emitter'
import Migrating from '@/mixins/migrating'
import HsButton from '@/packages/button/main.vue'
import HsButtonGroup from '@/packages/button/group/main.vue'
import { generateId } from '@/utils/util'

@Component({
  name: 'hs-dropdown',
  mixins: [Emitter, Migrating],
  directives: { Clickoutside },
  components: {
    HsButton,
    HsButtonGroup
  }
})

export default class HsDropdown extends Vue {
  // eslint-disable-next-line no-undef
  [x: string]: any
  @Provide('dropdown')
  private dropdown:any = this

  @Prop({ type: String, default: 'hover' })
  private trigger!: string

  @Prop({ type: String, default: 'hover' })
  private type!: String

  @Prop({ type: String, default: '' })
  private size!: String

  @Prop({ type: Boolean })
  private splitButton!: Boolean

  @Prop({ type: Boolean, default: !0 })
  private hideOnClick!: boolean

  @Prop({ type: String, default: 'bottom-end' })
  private placement!: String

  @Prop({ type: Boolean, default: !0 })
  private visibleArrow!: boolean

  @Prop({ type: Number, default: 250 })
  private showTimeout!: number

  @Prop({ type: Number, default: 150 })
  private hideTimeout!: number

  @Prop({ type: Number, default: 0 })
  private tabindex!: number

  private timeout = null

  private visible = false

  private triggerElm = null

  private menuItems = null

  private menuItemsArray = null

  private dropdownElm = null

  private focusing = false

  private listId = `dropdown-menu-${generateId()}`

  get dropdownSize () {
    return this.size || (this.$ELEMENT || {}).size
  }

  mounted () {
    this.$on('menu-item-click', this.handleMenuItemClick)
  }

  @Watch('visible')
  private visibleChange (val: any) {
    this.broadcast('hs-dropdown-menu', 'visible', val)
    this.$emit('visible-change', val)
  }

  @Watch('focusing')
  private focusingChange (val: any) {
    const selfDefine = this.$el.querySelector('.hs-dropdown-selfdefine')
    if (selfDefine) { // 自定义
      if (val) {
        selfDefine.className += ' focusing'
      } else {
        selfDefine.className = selfDefine.className.replace('focusing', '')
      }
    }
  }

  private getMigratingConfig () {
    return {
      props: {
        'menu-align': 'menu-align is renamed to placement.'
      }
    }
  }

  private show () {
    if ((this as any).triggerElm.disabled) return
    clearTimeout((this as any).timeout);
    (this as any).timeout = setTimeout(() => {
      this.visible = true
    }, this.trigger === 'click' ? 0 : this.showTimeout)
  }

  private hide () {
    if ((this as any).triggerElm.disabled) return
    this.removeTabindex()
    if (this.tabindex >= 0) {
      this.resetTabindex(this.triggerElm)
    }
    clearTimeout((this as any).timeout);
    (this as any).timeout = setTimeout(() => {
      this.visible = false
    }, this.trigger === 'click' ? 0 : this.hideTimeout)
  }

  private handleClick () {
    if ((this as any).triggerElm.disabled) return
    if (this.visible) {
      this.hide()
    } else {
      this.show()
    }
  }

  private handleTriggerKeyDown (ev: any) {
    const keyCode = ev.keyCode
    if ([38, 40].indexOf(keyCode) > -1) { // up/down
      this.removeTabindex()
      this.resetTabindex((this as any).menuItems[0]);
      (this as any).menuItems[0].focus()
      ev.preventDefault()
      ev.stopPropagation()
    } else if (keyCode === 13) { // space enter选中
      this.handleClick()
    } else if ([9, 27].indexOf(keyCode) > -1) { // tab || esc
      this.hide()
    }
  }

  private handleItemKeyDown (ev: any) {
    const keyCode = ev.keyCode
    const target = ev.target
    const currentIndex = (this as any).menuItemsArray.indexOf(target)
    const max = (this as any).menuItemsArray.length - 1
    let nextIndex
    if ([38, 40].indexOf(keyCode) > -1) { // up/down
      if (keyCode === 38) { // up
        nextIndex = currentIndex !== 0 ? currentIndex - 1 : 0
      } else { // down
        nextIndex = currentIndex < max ? currentIndex + 1 : max
      }
      this.removeTabindex()
      this.resetTabindex((this as any).menuItems[nextIndex]);
      (this as any).menuItems[nextIndex].focus()
      ev.preventDefault()
      ev.stopPropagation()
    } else if (keyCode === 13) { // enter选中
      this.triggerElmFocus()
      target.click()
      if (this.hideOnClick) { // click关闭
        this.visible = false
      }
    } else if ([9, 27].indexOf(keyCode) > -1) { // tab // esc
      this.hide()
      this.triggerElmFocus()
    }
  }

  private resetTabindex (ele: any) { // 下次tab时组件聚焦元素
    this.removeTabindex()
    ele.setAttribute('tabindex', '0') // 下次期望的聚焦元素
  }

  private removeTabindex () {
    (this as any).triggerElm.setAttribute('tabindex', '-1');
    (this as any).menuItemsArray.forEach((item: any) => {
      item.setAttribute('tabindex', '-1')
    })
  }

  private initAria () {
    (this as any).dropdownElm.setAttribute('id', this.listId);
    (this as any).triggerElm.setAttribute('aria-haspopup', 'list');
    (this as any).triggerElm.setAttribute('aria-controls', this.listId)

    if (!this.splitButton) { // 自定义
      (this as any).triggerElm.setAttribute('role', 'button');
      (this as any).triggerElm.setAttribute('tabindex', this.tabindex);
      (this as any).triggerElm.setAttribute('class', ((this as any).triggerElm.getAttribute('class') || '') + ' hs-dropdown-selfdefine') // 控制
    }
  }

  private initEvent () {
    const { trigger, show, hide, handleClick, splitButton, handleTriggerKeyDown, handleItemKeyDown } = this
    this.triggerElm = splitButton
      ? (this.$refs.trigger as any).$el
      : (this as any).$slots.default[0].elm
    const dropdownElm: any = this.dropdownElm;
    (this as any).triggerElm.addEventListener('keydown', handleTriggerKeyDown) // triggerElm keydown
    dropdownElm.addEventListener('keydown', handleItemKeyDown, true) // item keydown
    // 控制自定义元素的样式
    if (!splitButton) {
      (this as any).triggerElm.addEventListener('focus', () => {
        this.focusing = true
      });
      (this as any).triggerElm.addEventListener('blur', () => {
        this.focusing = false
      });
      (this as any).triggerElm.addEventListener('click', () => {
        this.focusing = false
      })
    }
    if (trigger === 'hover') {
      (this as any).triggerElm.addEventListener('mouseenter', show);
      (this as any).triggerElm.addEventListener('mouseleave', hide)
      dropdownElm.addEventListener('mouseenter', show)
      dropdownElm.addEventListener('mouseleave', hide)
    } else if (trigger === 'click') {
      (this as any).triggerElm.addEventListener('click', handleClick)
    }
  }

  private handleMenuItemClick (command: any, instance: any) {
    if (this.hideOnClick) {
      this.visible = false
    }
    this.$emit('command', command, instance)
  }

  private triggerElmFocus () {
    (this as any).triggerElm.focus && (this as any).triggerElm.focus()
  }

  private initDomOperation () {
    this.dropdownElm = this.popperElm = this.dropdown.popperElm
    this.menuItems = (this as any).dropdownElm.querySelectorAll("[tabindex='-1']");
    (this as any).menuItemsArray = [].slice.call(this.menuItems)

    this.initEvent()
    this.initAria()
  }

  render (h: any) {
    const { hide, splitButton, type, dropdownSize } = this

    const handleMainButtonClick = (event: any) => {
      this.$emit('click', event)
      hide()
    }

    const triggerElm = !splitButton
      ? this.$slots.default
      : (<hs-button-group>
        <hs-button type={type} size={dropdownSize} nativeOn-click={handleMainButtonClick}>
          {this.$slots.default}
        </hs-button>
        <hs-button ref="trigger" type={type} size={dropdownSize} class="hs-dropdown__caret-button">
          <i class="hs-dropdown__icon hs-icon-arrow-down"></i>
        </hs-button>
      </hs-button-group>)

    return (
      <div class="hs-dropdown" v-clickoutside={hide}>
        {triggerElm}
        {this.$slots.dropdown}
      </div>
    )
  }
}
</script>

<style lang="scss">
@import "./main.scss";
</style>
