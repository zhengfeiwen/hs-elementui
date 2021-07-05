
<script lang="tsx">
import { VNode } from 'vue'
import { Component, Prop, Watch, Provide, Vue } from 'vue-property-decorator'
import HsTabNav from './nav/main.vue'

@Component({
  name: 'hs-tabs',
  components: {
    'hs-tab-nav': HsTabNav
  }
})
export default class HsTabs extends Vue {
  @Provide('rootTabs')
  private rootTabs: any = this

  @Prop({ type: String })
  private type!: string

  @Prop({ type: String })
  private activeName!: string

  @Prop({ type: String })
  private closable!: boolean

  @Prop({ type: Boolean })
  private addable!: boolean

  @Prop({ type: [String, Object] })
  private value!: {}|string

  @Prop({ type: Boolean })
  private editable!: boolean

  @Prop({ type: String, default: 'top' })
  private tabPosition!: string

  @Prop({ type: Function })
  private beforeLeave!: Function

  @Prop({ type: Boolean })
  private stretch!: boolean

  private currentName: any = this.value || this.activeName

  private panes: any = []

    @Watch('activeName')
  private activeNameChange (value: any) {
    this.setCurrentName(value)
  }

    @Watch('value')
    private valueChange (value: any) {
      this.setCurrentName(value)
    }

    @Watch('currentName')
    private currentNameChange (value: any) {
      if (this.$refs.nav) {
        this.$nextTick(() => {
          (this.$refs.nav as any).$nextTick((_: any) => {
            (this.$refs.nav as any).scrollToActiveTab()
          })
        })
      }
    }

    private calcPaneInstances (isForceUpdate = false) {
      if (this.$slots.default) {
        const paneSlots = this.$slots.default.filter(vnode => vnode.tag &&
        vnode.componentOptions && (vnode.componentOptions.Ctor as any).options.name === 'hs-tab-pane')
        // update indeed
        const panes = paneSlots.map(({ componentInstance }) => componentInstance)
        const panesChanged = !(panes.length === this.panes.length && panes.every((pane, index) => pane === this.panes[index]))
        if (isForceUpdate || panesChanged) {
          this.panes = panes
        }
      } else if (this.panes.length !== 0) {
        this.panes = []
      }
    }

    private handleTabClick (tab: any, tabName: any, event: any) {
      if (tab.disabled) return
      this.setCurrentName(tabName)
      this.$emit('tab-click', tab, event)
    }

    private handleTabRemove (pane: any, ev: any) {
      if (pane.disabled) return
      ev.stopPropagation()
      this.$emit('edit', pane.name, 'remove')
      this.$emit('tab-remove', pane.name)
    }

    private handleTabAdd () {
      this.$emit('edit', null, 'add')
      this.$emit('tab-add')
    }

    private setCurrentName (value: any) {
      const changeCurrentName = () => {
        this.currentName = value
        this.$emit('input', value)
      }
      if (this.currentName !== value && this.beforeLeave) {
        const before = this.beforeLeave(value, this.currentName)
        if (before && before.then) {
          before
            .then(() => {
              changeCurrentName()
              this.$refs.nav && (this.$refs.nav as any).removeFocus()
            }, () => {
            // https://github.com/ElemeFE/element/pull/14816
            // ignore promise rejection in `before-leave` hook
            })
        } else if (before !== false) {
          changeCurrentName()
        }
      } else {
        changeCurrentName()
      }
    }

    render (h: any): VNode {
      const {
        type,
        handleTabClick,
        handleTabRemove,
        handleTabAdd,
        currentName,
        panes,
        editable,
        addable,
        tabPosition,
        stretch
      } = this

      const newButton = editable || addable
        ? (
          <span
            class="hs-tabs__new-tab"
            on-click={ handleTabAdd }
            tabindex="0"
            on-keydown={ (ev: any) => { if (ev.keyCode === 13) { handleTabAdd() } } }
          >
            <i class="hs-icon-plus"></i>
          </span>
        )
        : null

      const navData = {
        props: {
          currentName,
          onTabClick: handleTabClick,
          onTabRemove: handleTabRemove,
          editable,
          type,
          panes,
          stretch
        },
        ref: 'nav'
      }
      const header = (
        <div class={['hs-tabs__header', `is-${tabPosition}`]}>
          {newButton}
          <hs-tab-nav { ...navData }></hs-tab-nav>
        </div>
      )
      const panels = (
        <div class="hs-tabs__content">
          {this.$slots.default}
        </div>
      )

      return (
        <div class={{
          'hs-tabs': true,
          'hs-tabs--card': type === 'card',
          [`hs-tabs--${tabPosition}`]: true,
          'hs-tabs--border-card': type === 'border-card'
        }}>
          { tabPosition !== 'bottom' ? [header, panels] : [panels, header] }
        </div>
      )
    }

    created () {
      if (!this.currentName) {
        this.setCurrentName('0')
      }

      this.$on('tab-nav-update', this.calcPaneInstances.bind(null, true))
    }

    mounted () {
      this.calcPaneInstances()
    }

    updated () {
      this.calcPaneInstances()
    }
}
</script>

<style lang="scss">
@import "./main.scss";
</style>
