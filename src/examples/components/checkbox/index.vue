<template>
  <div style="width:600px;height:100%;">
    <hs-checkbox-group v-model="ruleForm.type">
      <hs-checkbox label="美食/餐厅线上活动" name="type"></hs-checkbox>
      <hs-checkbox label="地推活动" name="type"></hs-checkbox>
      <hs-checkbox label="线下主题活动" name="type"></hs-checkbox>
      <hs-checkbox label="单纯品牌曝光" name="type"></hs-checkbox>
    </hs-checkbox-group>
    <div>
    <div>
      <hs-checkbox-group v-model="checkboxGroup1">
        <hs-checkbox-button v-for="city in cities" :label="city" :key="city">{{city}}</hs-checkbox-button>
      </hs-checkbox-group>
    </div>
    <div style="margin-top: 20px">
      <hs-checkbox-group v-model="checkboxGroup2" size="medium">
        <hs-checkbox-button v-for="city in cities" :label="city" :key="city">{{city}}</hs-checkbox-button>
      </hs-checkbox-group>
    </div>
    <div style="margin-top: 20px">
      <hs-checkbox-group v-model="checkboxGroup3" size="small">
        <hs-checkbox-button v-for="city in cities" :label="city" :disabled="city === '北京'" :key="city">{{city}}</hs-checkbox-button>
      </hs-checkbox-group>
    </div>
    <div style="margin-top: 20px">
      <hs-checkbox-group v-model="checkboxGroup4" size="mini" disabled>
        <hs-checkbox-button v-for="city in cities" :label="city" :key="city">{{city}}</hs-checkbox-button>
      </hs-checkbox-group>
    </div>
  </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'
import Checkbox from '@/packages/checkbox/main.vue'
import CheckboxGroup from '@/packages/checkbox/group/main.vue'
import CheckboxButton from '@/packages/checkbox/button/main.vue'
const cityOptions = ['上海', '北京', '广州', '深圳']

@Component({
  name: 'hs-checkbox-demo',
  components: {
    'hs-checkbox': Checkbox,
    'hs-checkbox-group': CheckboxGroup,
    'hs-checkbox-button': CheckboxButton
  }
})

export default class CheckboxDemo extends Vue {
  private ruleForm = {
    type: ['地推活动']
  }

   private checkboxGroup1 = ['上海']
  private checkboxGroup2 = ['上海']
  private checkboxGroup3 = ['上海']
  private checkboxGroup4 = ['上海']
  private cities = cityOptions
}
</script>

<style>
.demo{
  min-height:36px;
  width: 100%;
  background-color: #e5e9f2;
  border-radius: 6px;
}
.hs-row{
  margin-bottom: 20px;
}
</style>
