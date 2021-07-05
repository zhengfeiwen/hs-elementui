<template>
  <div class="navitem_container">
    <div :class="fClass()" @click="handleclick(item.handle)" v-for="(item,i) in navitems" :key="i">
      <div class="navitem_item_left">
        <i :class="item.icon" v-if="item.icon"></i>
        <slot v-else :name="'ext'+i"></slot>
        <div>{{item.title}}</div>
      </div>
      <div  class="navitem_item_right">
        <div class="count" v-if="item.count !== 'undefined'">
          <span>{{item.count}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  name: 'hs-nav-item'
})
export default class HsNavitem extends Vue {
  @Prop({ type: Array, required: true })
  public navitems!: object[];

  @Prop({ type: String, default: 0, required: true })
  public color!: string;

  private fClass () {
    return {
      navitem_item: true,
      [this.color]: true
    }
  }

  private handleclick (callback: () => void) {
    if ((typeof callback).toLowerCase() === 'function') {
      callback()
    }
  }
}
</script>

<style scope>
.navitem_container {
  display: flex;
  flex-direction: column;
  padding: 10px 0;
  width: 100%;
}
.navitem_container .grey{
  color:#8590a6;
}
.navitem_container .navitem_item{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  line-height: 40px;
  height: 40px;
  padding: 0 10px 0 20px;
}
.navitem_container .navitem_item:hover{
  background-color: #f6f6f6;
}
.navitem_container .navitem_item .navitem_item_left{
  display: flex;
  flex-direction: row;
}
.navitem_container .navitem_item .navitem_item_left i{
  font-size: 20px;
  margin-top: 9px;
  margin-right:6px;
}
.navitem_container .navitem_item .navitem_item_left div{
  font-size: 14px;
}

.navitem_container .navitem_item .navitem_item_right{
  height:40px;
}
.navitem_container .navitem_item .navitem_item_right .count{
  width:30px;
  height:30px;
  background-color: rgb(246, 246, 246);;
  border-radius: 5px;
  color:#8590a6;
  margin: 5px 0;
  text-align: center;
  line-height: 30px;
  font-size: 12px;

}
.navitem_container .navitem_item:hover .navitem_item_right .count{
  background-color: #fff;
}
</style>
