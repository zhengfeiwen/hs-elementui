<template>
  <div :class="fClass(flexStyle)">
    <a href="#" :class="fColor(button.color)" v-for="(button,i) in buttons" :key="i"  @click="handleClick(button.id||i)">
      <svg-icon v-if="button.icon" :name="button.icon" :style=" button.icon.indexOf('cir') > -1 ? 'width:32px;height:32px' : 'width:26px;height:26px'" />
      <slot v-else :name="'ext'+i"></slot>
      <div class="title">{{button.title}}</div>
    </a>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  name: 'hs-logobutton'
})
export default class HsLogobutton extends Vue {
  @Prop({ type: Array, required: true })
  public buttons!: object[];

  @Prop({ type: String, default: 'vertical' })
  public flexStyle!: string;

  private fClass (iStyle: string) {
    const iClass = {
      logobutton_container: true,
      horizontal: true,
      vertical: false
    }
    if (iStyle === 'vertical') {
      iClass.vertical = true
      iClass.horizontal = false
    } else {
      iClass.vertical = false
      iClass.horizontal = true
    }
    return iClass
  }

  private fColor (color: string) {
    color = color || 'darkblue'
    return {
      logobutton_item: true,
      [color]: true
    }
  }

  private handleClick (key: string) {
    if (this.$listeners.handleClick) {
      this.$emit('handleClick', key)
    }
  }
}
</script>

<style scoped>
.logobutton_container {
  height:64px;
  display: flex;
  justify-content: space-around;
}
.logobutton_container .logobutton_item{
  user-select: none;
  cursor: pointer;
  width: 50px;
  display: flex;
  flex-direction: column;
  text-decoration: none;
  justify-content: center;
  align-items: center;
  margin:5px;
}
.logobutton_container .logobutton_item.horizontal{
  flex-direction: row;
}
.logobutton_container .logobutton_item.vertical{
  flex-direction: column;
}

.logobutton_item.yellow{
  color: rgb(255, 207, 0) !important;
}
.logobutton_item.yellow:hover .title{
  color: rgb(255, 207, 0);
}

.logobutton_item.purple{
  color: purple !important;
}
.logobutton_item.purple .title:hover{
  color:purple;
}

.logobutton_item.darkblue{
  color: rgb(84, 120, 240) !important;
}
.logobutton_item.darkblue:hover .title{
  color:rgb(84, 120, 240);
}

.logobutton_item.lightbule{
  color: rgb(0, 132, 255) !important;
}
.logobutton_item.lightbule:hover .title{
  color:rgb(0, 132, 255);
}

.logobutton_item.green{
  color:rgb(67, 212, 128) !important;
}
.logobutton_item.green:hover .title{
  color:rgb(67, 212, 128);
}

.logobutton_container .logobutton_item .title{
  color: #444;
  font-size: 12px;
  line-height: 1;
  text-align: center;
  margin-top: 10px;
}

</style>
