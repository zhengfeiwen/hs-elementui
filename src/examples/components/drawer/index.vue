<template>
  <div>
    <hs-drawer :wrapperClosable="wrapperClosable" :withHeader="withHeader" :show-close="showClose" :direction="direction" title="dddd" :visible.sync="drawer" @before-close="handleClose">
    </hs-drawer>
    <el-button @click="click">drawer-open</el-button>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'
import Drawer from '@/packages/drawer/main.vue'

@Component({
  name: 'hs-drawer-demo',
  components: {
    'hs-drawer': Drawer
  }
})

export default class DrawerDemo extends Vue {
  private drawer = !1
  private drawer1 = !0
  private showClose = true
  private withHeader = true
  private wrapperClosable = false

  private direction = 'btt'

  private click () {
    this.drawer = !0
  }

  private handleClose (done: Function) {
    // alert('我关咯')
    done()
  }
}
</script>

<style lang="scss">
</style>
