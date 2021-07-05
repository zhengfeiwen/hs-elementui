<template>
  <div style="width:100%;height:500px;overflow:auto;">
    <!-- <hs-radio v-model="radio" label="1">备选项</hs-radio>
    <hs-radio v-model="radio" label="2">备选项</hs-radio> -->
    <br>
     <br>
    <hs-radio-group v-model="radio1">
      <hs-radio :label="3">备选项1</hs-radio>
      <hs-radio :label="6">备选项2</hs-radio>
      <hs-radio :label="9">备选项3</hs-radio>
    </hs-radio-group><br>
    <hs-radio-group v-model="radio2">
      <hs-radio :label="31">备选项1</hs-radio>
      <hs-radio :label="61">备选项2</hs-radio>
      <hs-radio :label="91">备选项3</hs-radio>
    </hs-radio-group>
    <hs-radio-group v-model="radio3">
      <hs-radio-button label="上海"></hs-radio-button>
      <hs-radio-button label="北京"></hs-radio-button>
      <hs-radio-button label="广州"></hs-radio-button>
      <hs-radio-button label="深圳"></hs-radio-button>
    </hs-radio-group>

    <div>
        <hs-radio v-model="radio1" label="1" border>备选项1</hs-radio>
        <hs-radio v-model="radio1" label="2" border>备选项2</hs-radio>
      </div>
      <div style="margin-top: 20px">
        <hs-radio v-model="radio2" label="1" border size="medium">备选项1</hs-radio>
        <hs-radio v-model="radio2" label="2" border size="medium">备选项2</hs-radio>
      </div>
      <div style="margin-top: 20px">
        <hs-radio-group v-model="radio3" size="small">
          <hs-radio label="1" border>备选项1</hs-radio>
          <hs-radio label="2" border disabled>备选项2</hs-radio>
        </hs-radio-group>
      </div>
      <div style="margin-top: 20px">
        <hs-radio-group v-model="radio4" size="mini" disabled>
          <hs-radio label="1" border>备选项1</hs-radio>
          <hs-radio label="2" border>备选项2</hs-radio>
        </hs-radio-group>
      </div>

    {{`radio:${radio3}`}}
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'
import Radio from '@/packages/radio/main.vue'
import RadioGroup from '@/packages/radio/group/main.vue'
import RadioButton from '@/packages/radio/button/main.vue'

@Component({
  name: 'hs-divider-demo',
  components: {
    'hs-radio': Radio,
    'hs-radio-group': RadioGroup,
    'hs-radio-button': RadioButton
  }
})

export default class RadioDemo extends Vue {
  private radio4 = 1
  private radio1 = 1
  private radio2 = 1
  private radio3 = 1
}
</script>

<style lang="scss">

</style>
