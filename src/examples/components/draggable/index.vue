<template>
  <div>
    <hs-draggable v-model="list" :options="{draggable:'.item'}">
        <div v-for="element in list" :key="element.id" class="item">
            {{element.name}}
        </div>
        <button slot="footer" @click="addPeople">Add</button>
    </hs-draggable>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'
import Draggable from '@/packages/draggable/main.vue'

@Component({
  name: 'hs-draggable-demo',
  components: {
    'hs-draggable': Draggable
  }
})

export default class DraggDemo extends Vue {
  private list = [
    {
      id: 1,
      name: 'a'
    },
    {
      id: 2,
      name: 'b'
    },
    {
      id: 3,
      name: 'c'
    },
    {
      id: 4,
      name: 'd'
    },
    {
      id: 5,
      name: 'e'
    },
    {
      id: 6,
      name: 'f'
    }
  ]

  private addPeople () {
    // do
    this.list.push({
      id: 22,
      name: '554353'
    })
  }
}
</script>

<style lang="scss">
.item{
  height: 60px;
  width: 300px;
  border: 1px solid red;
  margin-top: 10px;
}
</style>
