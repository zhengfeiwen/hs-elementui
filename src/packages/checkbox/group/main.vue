
<template>
  <div class="hs-checkbox-group" role="group" aria-label="checkbox-group">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Inject, Watch } from 'vue-property-decorator'
import Emitter from '@/mixins/emitter'
@Component({
  name: 'hs-checkbox-group',
  mixins: [Emitter]
})
export default class HsCheckboxGroup extends Vue {
  @Inject({ from: 'hsFormItem', default: '' })
  private hsFormItem!: any

  @Prop({ type: Array })
  private value!: []

  @Prop({ type: Boolean })
  private disabled!: boolean

  @Prop({ type: Number })
  private min!: number

  @Prop({ type: Number })
  private max!: number

  @Prop({ type: String })
  private size!: string

  @Prop({ type: String })
  private fill!: string

  @Prop({ type: String })
  private textColor!: string

  get _hsFormItemSize () {
    return (this.hsFormItem || {}).hsFormItemSize
  }

  get checkboxGroupSize () {
    return this.size || this._hsFormItemSize || ((this as any).$ELEMENT || {}).size
  }

  @Watch('value')
  private valueChange (value: object) {
    (this as any).dispatch('hs-form-item', 'hs.form.change', [value])
  }
}
</script>
