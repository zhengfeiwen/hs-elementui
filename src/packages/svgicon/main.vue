<template>
  <svg-icon :name="name" :style="iStyle" />
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  name: 'hs-svgicon'
})
export default class HsSvgIcon extends Vue {
  @Prop({ type: String, default: '' })
  public name!: string;

  @Prop({ type: String })
  public iStyle!: string;
}
</script>
