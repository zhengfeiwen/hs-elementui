<template>
  <div>
    <hs-tabs
      tabType="btntab"
      :tabs="tabs"
      :defaultTab="0"
      @change="tabChange"
    ></hs-tabs>

    <hs-navitem
      color="grey"
      :navitems="navitems"
      @change="navChange"
    ></hs-navitem>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'
import Tabs from '@/packages/navigation/tabs/main.vue'
import Navitem from '@/packages/navigation/navitem/main.vue'

@Component({
  name: 'hs-progress-demo',
  components: {
    'hs-tabs': Tabs,
    'hs-navitem': Navitem
  }
})

export default class NavigationDemo extends Vue {
  private tabs = [
    {
      id: 'home',
      name: '首页'
    },
    {
      id: 'vip',
      name: '会员'
    },
    {
      id: 'find',
      name: '发现'
    },
    {
      id: 'ask',
      name: '等你来答'
    }
  ];

  private navitems = [
    {
      title: '我的收藏',
      icon: 'hs-icon-star-on',
      count: '0'
    },
    {
      title: '我关注的问题',
      icon: 'hs-icon-star-on',
      count: '2'
    }
  ];

  public tabChange (id: string) {
    alert()
  }

  public navChange (id: string) {
    alert()
  }
}
</script>

<style>

</style>
