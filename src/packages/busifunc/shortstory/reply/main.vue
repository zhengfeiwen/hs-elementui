<template>
  <div class="wechat_container">
    <hs-reply-child v-for="(item,i) in problemReplyList" :key="i"
    :id="item.id"
    :author="item.author||item.createName"
    :date="item.date||formatDate(item.createTime)"
    :good="item.good"
    :content="item.content"
    :clickNumber="item.clickNumber"
    :replyChilder="item.replyChilder"
    @handlereply="handlereply"
    @handlegood="handlegood"
    ></hs-reply-child>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import HsReplyChild from './child.vue'

@Component({
  name: 'hs-reply',
  components: {
    'hs-reply-child': HsReplyChild
  }
})
export default class HsShortstory extends Vue {
  @Prop({ type: Array, required: true })
  public problemReplyList!: object[];

  private handlelink (url: string, flag: string|boolean) {
    if (flag) {
      this.$emit('handleLink', url)
    }
  }

  private handlereply (id: string, replyTxt: string) {
    this.$emit('handlereply', id, replyTxt)
  }

  private formatDate (date: string) {
    if (!date) { return '' }
    date = '' + date
    return date.substring(4, 6) + '月' + date.substring(6, 8) + '日'
  }

  private handlegood (id: string, good: boolean) {
    this.$emit('handlegood', id, good)
  }
}
</script>

<style lang='scss' scope>
.wechat_container{
  width: 100%;
  padding: 6px;
}
</style>
