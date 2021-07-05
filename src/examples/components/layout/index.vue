<template>
  <div style="width:100%;height:100%;">
    <hs-row :gutter="4">
      <hs-col :span="6"><div class="demo"></div></hs-col>
      <hs-col><div class="demo"></div></hs-col>
      <hs-col :span="6" ><div class="demo"></div></hs-col>
      <hs-col :span="6"><div class="demo"></div></hs-col>
    </hs-row>
    <hs-row>
      <hs-col :span="24"><div class="demo"></div></hs-col>
    </hs-row>
    <hs-row>
      <hs-col :span="3"><div class="demo"></div></hs-col>
      <hs-col :span="21"><div class="demo"></div></hs-col>
    </hs-row>
    <hs-row :gutter="20">
      <hs-col :span="6"><div class="demo"></div></hs-col>
      <hs-col :span="6" :offset="6"><div class="demo"></div></hs-col>
    </hs-row>
    <hs-row type="flex" class="row-bg" justify="space-around" align="middle">
      <hs-col :span="6" :push="3"><div class="demo"></div></hs-col>
      <hs-col :span="6"><div class="demo"></div></hs-col>
    </hs-row>
    <hs-row :gutter="10">
      <hs-col :xs="8" :sm="6" :md="4" :lg="3" :xl="1"><div class="demo danger"><i class="hs-icon-edit"></i></div></hs-col>
      <hs-col :xs="4" :sm="6" :md="8" :lg="9" :xl="11"><div class="demo"></div></hs-col>
      <hs-col :xs="4" :sm="6" :md="8" :lg="9" :xl="11"><div class="demo warning"></div></hs-col>
      <hs-col :xs="8" :sm="6" :md="4" :lg="3" :xl="1"><div class="demo"></div></hs-col>
    </hs-row>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue } from 'vue-property-decorator'
import Row from '@/packages/layout/row/main.vue'
import Col from '@/packages/layout/col/main.vue'

@Component({
  name: 'hs-layout-demo',
  components: {
    'hs-row': Row,
    'hs-col': Col
  }
})

export default class LayoutDemo extends Vue {
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
