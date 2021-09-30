<template>
  <div class="query-block-container">
    <hs-form
    :inline="true"
    v-model="form"
    class="query-form"
    ref="noQuantity"
    size="mini"
    label-width="80px"
  >
    <hs-form-item
      :label="condition.label"
      :class="condition.label ? '' : 'multi'"
      v-for="(condition, i) in conditions"
      :key="i"
    >
      <div
        class="labels"
        v-if="condition.labels && condition.labels.length > 1"
      >
        <label
          :class="
            item === activeLab[i]
              ? 'contion_label active'
              : 'contion_label'
          "
          v-for="(item, ii) in condition.labels"
          :key="ii"
          :title="item"
          @click="labHandle(i, item)"
          >{{ item }} </label
        >
      </div>
      <el-cascader
        v-if="condition.type.toLowerCase() === 'cascader'"
        size="mini"
        :options="condition.options"
        v-model="formSync[i]"
        :show-all-levels="false"
        :props="condition.props"
        clearable
        :placeholder="condition.placeholder || '请输入'"
        :filterable="condition.filterable"
      />
      <el-select
        v-if="condition.type.toLowerCase() === 'select'"
        v-model="formSync[i]"
        :filterable="condition.filterable"
        :placeholder="condition.placeholder || formSync[i]"
        size="mini"
        clearable
        :multiple="condition.multiple"
        collapse-tags
      >
        <el-option
          v-for="item in condition.data"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <hs-input
        class="hs-input__block"
        size="mini"
        v-if="condition.type.toLowerCase() === 'input'"
        v-model="formSync[i]"
        :placeholder="condition.placeholder || '请输入'"
      />
      <el-date-picker
        v-model="formSync[i]"
        v-if="condition.type.toLowerCase() === 'datepicker'"
        :id="i"
        :dateType="condition.option && condition.option.type"
        :range-separator="condition.option && condition.option.rangeSeparator"
        :start-placeholder="
          condition.option && condition.option.startPlaceholder
        "
        size="mini"
        :end-placeholder="condition.option && condition.option.endPlaceholder"
        :placeholder="condition.option && condition.option.placeholder"
        :style="condition.option && condition.option.styles"
        :default-time="condition.option && condition.option.defaultTime"
        :value-format="condition.option && condition.option.valueFormat"
        :picker-options="condition.option && condition.option.pickerOptions"
      ></el-date-picker>
    </hs-form-item>
  </hs-form>
  </div>
</template>

<script lang="ts">
import { Component, Prop, PropSync, Vue, Watch } from 'vue-property-decorator'
import HsFrom from '@/packages/form/main.vue'
import HsInput from '@/packages/input/main.vue'
import HsFromItem from '@/packages/form/item/main.vue'
import HsSelect from '@/packages/select/main.vue'
import HsCascader from '@/packages/cascader/main.vue'

@Component({
  name: 'hs-querycondition',
  components: {
    'hs-form': HsFrom,
    'hs-input': HsInput,
    'hs-form-item': HsFromItem,
    'hs-select': HsSelect,
    'hs-cascader': HsCascader
  }
})
export default class HsQuerycondition extends Vue {
  @Prop({ type: Object, required: true })
  public conditions!: any

  @PropSync('form', { type: Object })
  private formSync!: {}|any

  public activeLab: any = {}

  @Watch('formSync', { deep: true })
  public change (val: any) {
    this.$listeners.change && this.$emit('change', val, this.activeLab)
  }

  public labHandle (i: number, item: string) {
    this.activeLab[i] = item
  }

  private created () {
    const activeLab = {}
    for (const key in this.conditions) {
      // 初始化结果集
      if (!this.formSync[key]) this.formSync[key] = this.conditions[key].val
      if (this.conditions[key].labels) {
        const ikey = key
        Object.assign(activeLab, { [ikey]: this.conditions[key].labels[0] })
      }
    }
    this.activeLab = activeLab
  }
}
</script>

<style lang="scss">
@import "./main.scss";
</style>
