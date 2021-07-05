<template>
  <div>
    <hs-link href="https://element.eleme.io" target="_blank">默认链接</hs-link>
    <hs-link type="primary">主要链接</hs-link>
    <hs-link type="success">成功链接</hs-link>
    <hs-link type="warning">警告链接</hs-link>
    <hs-link type="danger">危险链接</hs-link>
    <hs-link type="info">信息链接</hs-link>
    <hs-link disabled>默认链接</hs-link>
    <hs-link type="primary" disabled>主要链接</hs-link>
    <hs-link type="success" disabled>成功链接</hs-link>
    <hs-link type="warning" disabled>警告链接</hs-link>
    <hs-link type="danger" disabled>危险链接</hs-link>
    <hs-link type="info" disabled>信息链接</hs-link>
    <hs-link icon="hs-icon-edit">编辑</hs-link>
    <hs-link>查看<i class="hs-icon-view hs-icon--right"></i> </hs-link>
    <hs-link type="extend" :max-line="2" @change="change" :extend="extend" :height="height">
      <div class="extend">
        {{ iText }}
      </div>
    </hs-link>
    <hs-link logo="edit" style="font-size:20px" type="danger">编辑</hs-link>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'
import Link from '@/packages/link/main.vue'
import { TextOverflow } from '@/utils/commons'

@Component({
  name: 'hs-progress-demo',
  components: {
    'hs-link': Link
  }
})

export default class LinkDemo extends Vue {
  private text = `永和九年，岁在癸丑，暮春之初，会于会稽山阴之兰亭，修禊事也。群贤毕至，少长咸集。此地有崇山峻岭，茂林修竹，又有清流激湍，映带左右，引以为流觞曲水，列坐其次。虽无丝竹管弦之盛，一觞一咏，亦足以畅叙幽情。
          是日也，天朗气清，惠风和畅。仰观宇宙之大，俯察品类之盛，所以游目骋怀，足以极视听之娱，信可乐也。
          夫人之相与，俯仰一世。或取诸怀抱，悟言一室之内；或因寄所托，放浪形骸之外。虽趣舍万殊，静躁不同，当其欣于所遇，暂得于己，快然自足，不知老之将至；及其所之既倦，情随事迁，感慨系之矣。向之所欣，俯仰之间，已为陈迹，犹不能不以之兴怀，况修短随化，终期于尽！古人云：“死生亦大矣。”岂不痛哉！
          每览昔人兴感之由，若合一契，未尝不临文嗟悼，不能喻之于怀。固知一死生为虚诞，齐彭殇为妄作。后之视今，亦犹今之视昔，悲夫！故列叙时人，录其所述，虽世殊事异，所以兴怀，其致一也。后之览者，亦将有感于斯文。`
  private iText = this.text
  private extend = !1
  private height = 20
  private extendText () {
    const { text, height } = TextOverflow.block({
      extend: this.extend,
      text: this.text
    }, !1, '.extend')
    this.height = height
    return text
  }

  private change (status: boolean) {
    this.extend = status
    this.iText = this.extendText()
  }
}
</script>

<style>
.extend{
  width: 95%;
  height: 100%;
}
</style>
