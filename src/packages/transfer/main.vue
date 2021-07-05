<template>
  <div class="hs-transfer">
    <hs-transfer-panel
      v-bind="$props"
      ref="leftPanel"
      :data="sourceData"
      :title="titles[0] || t('hs.transfer.titles.0')"
      :default-checked="leftDefaultChecked"
      :placeholder="filterPlaceholder || t('hs.transfer.filterPlaceholder')"
      @checked-change="onSourceCheckedChange">
      <slot name="left-footer"></slot>
    </hs-transfer-panel>
    <div class="hs-transfer__buttons">
      <hs-button
        type="primary"
        :class="['hs-transfer__button', hasButtonTexts ? 'is-with-texts' : '']"
        @click.native="addToLeft"
        :disabled="rightChecked.length === 0">
        <i class="hs-icon-arrow-left"></i>
        <span v-if="buttonTexts[0] !== undefined">{{ buttonTexts[0] }}</span>
      </hs-button>
      <hs-button
        type="primary"
        :class="['hs-transfer__button', hasButtonTexts ? 'is-with-texts' : '']"
        @click.native="addToRight"
        :disabled="leftChecked.length === 0">
        <span v-if="buttonTexts[1] !== undefined">{{ buttonTexts[1] }}</span>
        <i class="hs-icon-arrow-right"></i>
      </hs-button>
    </div>
    <hs-transfer-panel
      v-bind="$props"
      ref="rightPanel"
      :data="targetData"
      :title="titles[1] || t('hs.transfer.titles.1')"
      :default-checked="rightDefaultChecked"
      :placeholder="filterPlaceholder || t('hs.transfer.filterPlaceholder')"
      @checked-change="onTargetCheckedChange">
      <slot name="right-footer"></slot>
    </hs-transfer-panel>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import HsButton from '@/packages/button/main.vue'
import Emitter from '@/mixins/emitter'
import Locale from '@/locale'
import TransferPanel from './panel/main.vue'
import Migrating from '@/mixins/migrating'
@Component({
  name: 'hs-transfer',
  mixins: [Emitter, Locale, Migrating],
  components: {
    'hs-transfer-panel': TransferPanel,
    'hs-button': HsButton
  }
})

export default class HsTransfer extends Vue {
  @Prop({ type: Array, default: () => ([]) })
  private data!: []

  @Prop({ type: Array, default: () => ([]) })
  private titles!: []

  @Prop({ type: Array, default: () => ([]) })
  private buttonTexts!: []

  @Prop({ type: String, default: '' })
  private filterPlaceholder!: string

  @Prop({ type: Function })
  private filterMethod!: Function

  @Prop({ type: Array, default: () => ([]) })
  private leftDefaultChecked!: []

  @Prop({ type: Array, default: () => ([]) })
  private rightDefaultChecked!: []

  @Prop({ type: Function })
  private renderContent!: Function

  @Prop({ type: Array, default: () => ([]) })
  private value!: []

  @Prop({ type: Object, default: () => ({}) })
  private format!: {}

  @Prop({ type: Boolean })
  private filterable!: boolean

  @Prop({
    type: Object,
    default: () => ({
      label: 'label',
      key: 'key',
      disabled: 'disabled'
    })
  })
  private props!: object

  @Prop({ type: String, default: 'original' })
  private targetOrder!: string

  private leftChecked = []

  private rightChecked = []

  get dataObj () {
    return this.data.reduce((o, cur) => (o[cur[(this.props as any).key]] = cur) && o, {})
  }

  get sourceData () {
    return this.data.filter(item => this.value.indexOf(item[(this.props as any).key]) === -1)
  }

  get targetData () {
    if (this.targetOrder === 'original') {
      return this.data.filter(item => this.value.indexOf(item[(this.props as any).key]) > -1)
    } else {
      return this.value.reduce((arr, cur) => {
        const val = this.dataObj[cur]
        if (val) {
          arr.push(val)
        }
        return arr
      }, [])
    }
  }

  private hasButtonTexts () {
    return this.buttonTexts.length - 2 === 0
  }

  @Watch('value')
  private valueChange (val: any) {
    (this as any).dispatch('hs-form-item', 'hs.form.change', val)
  }

  private getMigratingConfig () {
    return {
      props: {
        'footer-format': 'footer-format is renamed to format.'
      }
    }
  }

  private onSourceCheckedChange (val: any, movedKeys: any) {
    this.leftChecked = val
    if (movedKeys === undefined) return
    this.$emit('left-check-change', val, movedKeys)
  }

  private onTargetCheckedChange (val: any, movedKeys: any) {
    this.rightChecked = val
    if (movedKeys === undefined) return
    this.$emit('right-check-change', val, movedKeys)
  }

  private addToLeft () {
    const currentValue = this.value.slice()
    this.rightChecked.forEach(item => {
      const index = currentValue.indexOf(item)
      if (index > -1) {
        currentValue.splice(index, 1)
      }
    })
    this.$emit('input', currentValue)
    this.$emit('change', currentValue, 'left', this.rightChecked)
  }

  private addToRight () {
    let currentValue = this.value.slice()
    const itemsToBeMoved: any = []
    const key = (this.props as any).key
    this.data.forEach(item => {
      const itemKey = item[key]
      if (
        this.leftChecked.indexOf(itemKey) > -1 &&
        this.value.indexOf(itemKey) === -1
      ) {
        itemsToBeMoved.push(itemKey)
      }
    })
    currentValue = this.targetOrder === 'unshift'
      ? itemsToBeMoved.concat(currentValue)
      : currentValue.concat(itemsToBeMoved)
    this.$emit('input', currentValue)
    this.$emit('change', currentValue, 'right', this.leftChecked)
  }

  private clearQuery (which: any) {
    if (which === 'left') {
      (this.$refs.leftPanel as any).query = ''
    } else if (which === 'right') {
      (this.$refs.leftPanel as any).query = ''
    }
  }
}
</script>

<style lang="scss">
@import "./main.scss"
</style>
