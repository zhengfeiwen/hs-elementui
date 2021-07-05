<template>
  <div>
    <hs-shortstory
    :shortstorys = "shortstorys"
    @getproblemreplylist="getProblemReplyList"
    @iconclick="iconClick"
    @fagree="fAgree"
    @handlereply="handleReply"
    @handlegood="handleGood"
    @handletitle="handleTitle"
    >
    </hs-shortstory>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'
import Shortstory from '@/packages/busifunc/shortstory/main.vue'

@Component({
  name: 'hs-shortstory-demo',
  components: {
    'hs-shortstory': Shortstory
  }
})

export default class ShortstoryDemo extends Vue {
  private shortstorys = [
    {
      titlepic: 'https://pic1.zhimg.com/50/v2-503d00f436b6d18889003a6d28388b6a_400x224.jpg',
      links: 'https://zhuanlan.zhihu.com/p/203501602',
      title: '雍正的四大首府宠臣中，谁才是最厉害的呢',
      content: '<p style="color:red">ceshi</p><img src="https://pic1.zhimg.com/50/v2-503d00f436b6d18889003a6d28388b6a_400x224.jpg"></img>纵观历史，雍正的四大首府宠臣中，李卫才是最精明能干的，田文镜太过于守旧，思想不够开放，做事情容易固步自封，虽然兢兢业业。但始终达不到雍正的期望，主要原因是他只会把问题都揽在自己身上，不找雍正去协助解决问题。',
      clickNum: 98989,
      agree: true,
      problemId: 1111,
      id: 1,
      shorttools: {
        hot: '4160 万热度',
        share: '分享'
      },
      tools: {
        collect: '收藏',
        share: '分享',
        comment: '3,322条评论',
        like: !1
      },
      problemReplyList: []
    },
    {
      links: 'https://zhuanlan.zhihu.com/p/203501602',
      title: '雍正的四大首府宠臣中，谁才是最厉害的呢',
      content: '纵观历史，雍正的四大首府宠臣中，李卫才是最精明能干的。',
      agree: true,
      problemId: 2222,
      clickNum: 100,
      id: 1,
      handleClick: () => {
        alert('Live')
      },
      shorttools: {
        hot: '4160 万热度',
        share: '分享'
      },
      tools: {
        collect: '收藏',
        share: '分享',
        comment: '3,122条评论',
        like: !0
      },
      problemReplyList: [
        {
          author: 'zfw',
          content: '胡说八道',
          clickNumber: 100,
          date: '11-04',
          replyChilder: [
            {
              author: 'zfw-1',
              content: '胡说八道212121',
              createTime: 20181102
            },
            {
              author: 'zfw-2',
              content: '胡说八道111',
              date: '11-05'
            },
            {
              author: 'zfw-3',
              content: '胡说八道eqwe12e1',
              date: '11-07'
            }
          ]
        },
        {
          author: '豆豆',
          content: '有理有据',
          clickNumber: 100,
          date: '11-04'
        },
        {
          author: 'emperor',
          content: '我一星期前搞了搞，不是骗人的，但是从来没领到那么大额的优惠券，但是每天都给我一个满15减3的优惠券，天天抽天天给其他功能我也搞不太懂，但是我迄今为止发现最实用的功能是肯德基的（煎蛋＋蘑菇鸡肉粥），用券买是3.2元，非常实惠，而且券是终身永久的，就是说天天可以不限量用',
          clickNumber: 100,
          date: '11-04'
        }
      ]
    }
  ];

  public handleTitle (url: string) {
    alert(1)
  }

  private iconClick (url: string, problemId: string) {
    alert(121221)
  }

  private fAgree (url: string, problemId: string) {
    alert(121221)
  }

  private handleReply (url: string, problemId: string) {
    alert(121221)
  }

  private handleGood (url: string, problemId: string) {
    alert(121221)
  }

  private async getProblemReplyList (problemId: number) {
    // const data = await getProblemReplyList({ problemId: problemId })
    // if (data.code === 10000) {
    //   const len = this.shortstorys.length
    //   for (let i = 0; i < len; i++) {
    //     if (this.shortstorys[i].problemId === problemId) {
    //       this.shortstorys[i].problemReplyList = data.list
    //     }
    //   }
    // }
  }
}
</script>

<style>

</style>
