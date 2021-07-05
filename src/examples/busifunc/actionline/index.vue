<template>
  <hs-actionline :action-func="actionFunc" :action-query="actionQuery" @handle="handle">
  </hs-actionline>
</template>

<script lang='ts'>
import { Component, Prop, Vue } from 'vue-property-decorator'
import actionline from '@/packages/busifunc/actionline/main.vue'

@Component({
  name: 'hs-card-demo',
  components: {
    'hs-actionline': actionline
  }
})

export default class DrawerDemo extends Vue {
  private actionFunc = [
    {
      id: 'add',
      icon: 'plus',
      text: 'add'
    },
    {
      id: 'remove',
      icon: 'delete',
      text: 'remove'
    }
  ]

  private actionQuery = [
    {
      id: 'query',
      icon: 'query',
      text: 'query'
    },
    {
      id: 'online',
      text: 'online'
    }
  ]

  private handle (id: string) {
    alert(`click the ${id}`)
  }
}
</script>
