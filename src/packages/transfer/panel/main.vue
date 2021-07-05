<template>
  <div class="hs-transfer-panel">
    <p class="hs-transfer-panel__header">
      <hs-checkbox
        v-model="allChecked"
        @change="handleAllCheckedChange"
        :indeterminate="isIndeterminate">
        {{ title }}
        <span>{{ checkedSummary }}</span>
      </hs-checkbox>
    </p>

    <div :class="['hs-transfer-panel__body', hasFooter ? 'is-with-footer' : '']">
      <hs-input
        class="hs-transfer-panel__filter"
        v-model="query"
        size="small"
        :placeholder="placeholder"
        @mouseenter.native="inputHover = true"
        @mouseleave.native="inputHover = false"
        v-if="filterable">
        <i slot="prefix"
          :class="['hs-input__icon', 'hs-icon-' + inputIcon]"
          @click="clearQuery"
        ></i>
      </hs-input>
      <hs-checkbox-group
        v-model="checked"
        v-show="!hasNoMatch && data.length > 0"
        :class="{ 'is-filterable': filterable }"
        class="hs-transfer-panel__list">
        <hs-checkbox
          class="hs-transfer-panel__item"
          :label="item[keyProp]"
          :disabled="item[disabledProp]"
          :key="item[keyProp]"
          v-for="item in filteredData">
          <option-content :option="item"></option-content>
        </hs-checkbox>
      </hs-checkbox-group>
      <p
        class="hs-transfer-panel__empty"
        v-show="hasNoMatch">{{ t('hs.transfer.noMatch') }}</p>
      <p
        class="hs-transfer-panel__empty"
        v-show="data.length === 0 && !hasNoMatch">{{ t('hs.transfer.noData') }}</p>
    </div>
    <p class="hs-transfer-panel__footer" v-if="hasFooter">
      <slot></slot>
    </p>
  </div>
</template>

<script lang="tsx">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import HsCheckboxGroup from '@/packages/checkbox/group/main.vue'
import HsCheckbox from '@/packages/checkbox/main.vue'
import HsInput from '@/packages/input/main.vue'
import Locale from '@/locale'
@Component({
  name: 'hs-transfer-panel',
  mixins: [Locale],
  components: {
    'hs-checkbox-group': HsCheckboxGroup,
    'hs-checkbox': HsCheckbox,
    'hs-input': HsInput,
    OptionContent: {
      props: {
        option: Object
      },
      render (h: any) {
        const getParent: any = (vm: any) => {
          if (vm.$options._componentTag === 'hs-transfer-panel') {
            return vm
          } else if (vm.$parent) {
            return getParent(vm.$parent)
          } else {
            return vm
          }
        }
        const panel = getParent(this)
        const transfer = panel.$parent || panel
        const option: any = (this as any).option
        return panel.renderContent
          ? panel.renderContent(h, option)
          : transfer.$scopedSlots.default
            ? transfer.$scopedSlots.default({ option: option })
            : <span>{ option[panel.labelProp] || option[panel.keyProp] }</span>
      }
    }
  }
})
export default class HsTransferPanel extends Vue {
  @Prop({ type: Array, default: [] })
  private data!: []

  @Prop({ type: Function })
  private renderContent!: Function

  @Prop({ type: String })
  private placeholder!: string

  @Prop({ type: String })
  private title!: string

  @Prop({ type: Boolean })
  private filterable!: boolean

  @Prop({ type: Object })
  private format!: object

  @Prop({ type: Function })
  private filterMethod!: Function

  @Prop({ type: Array })
  private defaultChecked!: []

  @Prop({ type: Object })
  private props!: object

  private checked = []

  private allChecked = !1

  private query = ''

  private inputHover = !1

  private checkChangeByUser = !0

  @Watch('checked')
  private checkedChange (val: any, oldVal: any) {
    this.updateAllChecked()
    if (this.checkChangeByUser) {
      const movedKeys = val.concat(oldVal)
        .filter((v: any) => val.indexOf(v) === -1 || oldVal.indexOf(v) === -1)
      this.$emit('checked-change', val, movedKeys)
    } else {
      this.$emit('checked-change', val)
      this.checkChangeByUser = true
    }
  }

  @Watch('data')
  private dataChange () {
    const checked: any = []
    const filteredDataKeys = this.filteredData.map(item => item[this.keyProp])
    this.checked.forEach(item => {
      if (filteredDataKeys.indexOf(item) > -1) {
        checked.push(item)
      }
    })
    this.checkChangeByUser = false
    this.checked = checked
  }

  @Watch('checkableData')
  private checkableDataChange () {
    this.updateAllChecked()
  }

  @Watch('defaultChecked', { immediate: !0 })
  private defaultCheckedChange (val: any, oldVal: any) {
    if (oldVal && val.length === oldVal.length &&
      val.every((item: any) => oldVal.indexOf(item) > -1)) return
    const checked: any = []
    const checkableDataKeys = this.checkableData.map(item => item[this.keyProp])
    val.forEach((item: any) => {
      if (checkableDataKeys.indexOf((item as never)) > -1) {
        checked.push(item)
      }
    })
    this.checkChangeByUser = false
    this.checked = checked
  }

  get filteredData () {
    return this.data.filter(item => {
      if (typeof this.filterMethod === 'function') {
        return this.filterMethod(this.query, item)
      } else {
        const label: any = item[this.labelProp] || (item[this.keyProp] as any).toString()
        return label.toLowerCase().indexOf(this.query.toLowerCase()) > -1
      }
    })
  }

  get checkableData () {
    return this.filteredData.filter(item => !item[this.disabledProp])
  }

  get checkedSummary () {
    const checkedLength = this.checked.length
    const dataLength = this.data.length
    const { noChecked, hasChecked } = (this.format as any)
    if (noChecked && hasChecked) {
      return checkedLength > 0
        ? hasChecked.replace(/\${checked}/g, checkedLength).replace(/\${total}/g, dataLength)
        : noChecked.replace(/\${total}/g, dataLength)
    } else {
      return `${checkedLength}/${dataLength}`
    }
  }

  get isIndeterminate () {
    const checkedLength = this.checked.length
    return checkedLength > 0 && checkedLength < this.checkableData.length
  }

  get hasNoMatch () {
    return this.query.length > 0 && this.filteredData.length === 0
  }

  get inputIcon () {
    return this.query.length > 0 && this.inputHover
      ? 'circle-close'
      : 'search'
  }

  get labelProp () {
    return (this.props as any).label || 'label'
  }

  get keyProp () {
    return (this.props as any).key || 'key'
  }

  get disabledProp () {
    return (this.props as any).disabled || 'disabled'
  }

  get hasFooter () {
    return !!this.$slots.default
  }

  private updateAllChecked () {
    const checkableDataKeys = this.checkableData.map(item => item[this.keyProp])
    this.allChecked = checkableDataKeys.length > 0 &&
      checkableDataKeys.every(item => this.checked.indexOf(item) > -1)
  }

  private handleAllCheckedChange (value: any) {
    this.checked = value
      ? this.checkableData.map(item => item[this.keyProp])
      : []
  }

  private clearQuery () {
    if (this.inputIcon === 'circle-close') {
      this.query = ''
    }
  }
}
</script>
