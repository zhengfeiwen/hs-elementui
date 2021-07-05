<template>
  <div class="tabs_container">
    <div class="divi_tab" v-if="tabType == 'divi' || tabType == 'btntab'">
      <div class="tab-item" v-for="(tab, i) in tabs" :key="i">
        <div :class="tabType == 'divi' ? 'divi' : ''">
          <span
            :class="{ active: activeTab == i }"
            @click="tabClick(i, tab.id)"
            >{{ tab.name }}</span
        ></div>
      </div>
    </div>
    <div class="top_tab" v-if="tabType == 'toptab'">
      <div class="tab-item" v-for="(tab, i) in tabs" :key="i">
        <div
          :class="{ active: activeTab == i }"
          @click="tabClick(i, tab.id)"
          ><span>{{ tab.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  name: 'hs-nav-tabs'
})
export default class HsNavTabs extends Vue {
  @Prop({ type: String, default: 'divi', required: true })
  public tabType!: string;

  @Prop({ type: Number, default: 0, required: true })
  public defaultTab!: number;

  public activeTab = 0;

  @Prop({ type: Array, required: true })
  public tabs!: object[];

  // @Prop({ type: Function, required: true })
  // private clickhandle!: () => void;

  private created () {
    this.activeTab = this.defaultTab || 0
  }

  // 切换事件
  private tabClick (index: number, id: string) {
    this.activeTab = index
    if (this.$listeners.change) {
      this.$emit('change', id)
    }
  }
}
</script>

<style scope>
.tabs_container {
  padding: 10px 12px;
  width: 100%;
  height: 37px;
}

.divi_tab {
  width: 100%;
  height: 37px;
  display: flex;
  flex-direction: row;
}
.divi_tab .tab-item {
  font-size: 15px;
  height: 37px;
  color: #000;
  width: 70px;
  cursor: default;
  display: flex;
  flex-direction: row;
}
.divi{
  border-left:1px solid #cdcdcd;
  height: 20px;
  width: 70px;
  text-align: center;
}
.divi_tab .tab-item:first-child .divi{
  border:none;
}
.divi_tab .tab-item span {
  user-select: none;
}
.divi_tab .tab-item span.active {
  color: #2f74ff;
}
.divi_tab .tab-item span:hover {
  font-size: 16px;
}
</style>

<style scoped>
.top_tab{
    display: flex;
    flex-direction: row;
}
.top_tab .tab-item{
  font-size: 15px;
  padding: 0 14px;
  color:#8590a6;
  height: 32px;
  cursor: pointer;
}
.top_tab .tab-item div{
  height: 32px;
  line-height: 22px;
  box-sizing: border-box;
}
.top_tab .tab-item div:hover{
  color: #444;
}
.top_tab .tab-item div.active{
  font-size: 16px;
  font-weight: bold;
  color: #000;
  border-bottom: 3px #1791FF solid;
}
</style>
