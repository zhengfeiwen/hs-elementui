<template>
  <div>
    <hs-progress :stroke-width="26" :taskChains="taskChains" :percentage="percentage" @finished="finished"></hs-progress>
    <hs-button @click="btnFinished">finished</hs-button>
<hs-progress :percentage="100" :format="format"></hs-progress>
    <hs-progress
      :percentage='20'
      status="exception"
      :text-inside="true"
    ></hs-progress>
    <hs-progress type="circle" :percentage="25"></hs-progress>
    <div>
    <hs-progress
      type="dashboard"
      :percentage="percentage"
      :color="customColors"
    ></hs-progress>
    <div>
      <hs-button-group>
        <hs-button icon="el-icon-minus" @click="decrease"></hs-button>
        <hs-button icon="el-icon-plus" @click="increase"></hs-button>
      </hs-button-group>
      <hs-progress :percentage="50"></hs-progress>
      <hs-progress :percentage="100" :format="format"></hs-progress>
      <hs-progress :percentage="100" status="success"></hs-progress>
      <hs-progress :percentage="100" status="warning"></hs-progress>
      <hs-progress :percentage="50" status="exception"></hs-progress>
    </div>
  </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'
import progress from '@/packages/progress/main.vue'
import button from '@/packages/button/main.vue'

@Component({
  name: 'hs-progress-demo',
  components: {
    'hs-progress': progress,
    'hs-button': button
  }
})

export default class ProgressDemo extends Vue {
  public percentage = 50;
  private customColors: object[] = [
    { color: '#f56c6c', percentage: 20 },
    { color: '#e6a23c', percentage: 40 },
    { color: '#5cb87a', percentage: 60 },
    { color: '#1989fa', percentage: 80 },
    { color: '#6f7ad3', percentage: 100 }
  ]

  private increase () {
    this.percentage += 10
    if (this.percentage > 100) {
      this.percentage = 100
    }
  }

  private decrease () {
    this.percentage -= 10
    if (this.percentage < 0) {
      this.percentage = 0
    }
  }

  public taskChains = {
    task0: {
      status: 'doing'
    },
    task1: {
      status: 'init',
      task: () => {
        // setTimeout(() => {
        //   this.taskChains.task1.status = 'finished';
        // }, 5 * 1000);
      }
    },
    task2: {
      status: 'init'
    }
  };

  public format (percentage: number) {
    return percentage === 100 ? '满' : `${percentage}%`
  }

  public btnFinished () {
    this.taskChains.task1.status = 'finished'
  }

  public finished () {
    alert('0k')
  }
}
</script>

<style>

</style>
