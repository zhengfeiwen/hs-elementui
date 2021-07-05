<template>
<div>

  <hs-calender v-model="value">
    <template
    slot="dateCell"
    slot-scope="{data}">
    <p :class="data.isSelected ? 'is-selected' : ''">
      {{ data.day.split('-').slice(1).join('-') }} {{ data.isSelected ? '✔️' : ''}}
    </p>
  </template>
  </hs-calender>
  <el-button @click="click">get date</el-button>
</div>
</template>

<script lang='ts'>
import { Component, Prop, Vue } from 'vue-property-decorator'
import Calender from '@/packages/calender/main.vue'

@Component({
  name: 'hs-calender-demo',
  components: {
    'hs-calender': Calender
  }
})

export default class CalenderDemo extends Vue {
  private value = new Date()

  private click () {
    alert(this.value)
  }
}
</script>

<style lang="scss">
.is-selected {
  color: #1989FA;
}
</style>
