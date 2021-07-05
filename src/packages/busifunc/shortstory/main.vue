<template>
  <div class="shortstory">
    <hs-shortstory-child v-for="(item,i) in shortstorys" :key="i"
    :problemId="item.problemId"
    :title="item.title"
    :id="item.id"
    :order="item.order"
    :titlepic="item.titlepic"
    :agree="item.agree"
    :clickNum="item.clickNum"
    :url="item.links"
    :story="item.content"
    :shorttools="item.shorttools"
    :tools="item.tools"
    :problemReplyList="item.problemReplyList"
    @handletitle="handletitle"
    @iconclick="iconclick"
    @handlereply="handlereply"
    @handlegood="handlegood"
    @fagree="fagree"
    @getproblemreplylist="getproblemreplylist"
    >
    <template slot="whole"><div v-html="item.content"></div></template></hs-shortstory-child>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import HsShortstoryChild from './child.vue'

@Component({
  name: 'hs-shortstory',
  components: {
    'hs-shortstory-child': HsShortstoryChild
  }
})
export default class HsShortstory extends Vue {
  @Prop({ type: Array, required: true })
  public shortstorys!: object[];

  private handletitle (url: string, problemId: number, clickNum: number) {
    this.$emit('handletitle', url, problemId, clickNum)
  }

  private handlereply (id: string, pid: string, replyTxt: string) {
    this.$emit('handlereply', id, pid, replyTxt)
  }

  private handlegood (id: string, problemId: string, good: boolean) {
    this.$emit('handlegood', id, problemId, good)
  }

  private iconclick (flag: string, id: string, problemId: string, url: string) {
    this.$emit('iconclick', flag, id, problemId, url)
  }

  private fagree (agree: string, id: string) {
    this.$emit('fagree', agree, id)
  }

  private getproblemreplylist (problemId: string) {
    this.$emit('getproblemreplylist', problemId)
  }
}
</script>

<style lang='scss' scope>
.shortstory{
  width: 100%;
  display: flex;
  flex-direction: column;
}
</style>
