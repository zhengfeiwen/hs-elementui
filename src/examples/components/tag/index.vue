<template>
  <div>
    <hs-tag>标签一</hs-tag>
    <hs-tag type="success">标签二</hs-tag>
    <hs-tag type="info">标签三</hs-tag>
    <hs-tag type="warning">标签四</hs-tag>
    <hs-tag type="danger">标签五</hs-tag>
    <hs-tag
      v-for="tag in tags"
      :key="tag.name"
      closable
      :type="tag.type"
      @close="close">
      {{tag.name}}
    </hs-tag>
    <hs-tag closable>默认标签</hs-tag>
    <hs-tag size="medium" effect="plain" closable>中等标签</hs-tag>
    <hs-tag size="small" closable>小型标签</hs-tag>
    <hs-tag size="mini" closable>超小标签</hs-tag>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'
import Tag from '@/packages/tag/main.vue'

@Component({
  name: 'hs-tag-demo',
  components: {
    'hs-tag': Tag
  }
})

export default class TagDemo extends Vue {
  private tags = [
    { name: '标签一', type: '' },
    { name: '标签二', type: 'success' },
    { name: '标签三', type: 'info' },
    { name: '标签四', type: 'warning' },
    { name: '标签五', type: 'danger' }
  ]

  private close (tag: any) {
    this.tags.splice(this.tags.indexOf(tag), 1)
  }
}
</script>
<style lang="scss">
  .hs-tag+.hs-tag {
    margin-left: 10px;
  }
</style>
