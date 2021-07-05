<template>
  <div class="action_container">
    <div class="action_func">
      <el-button
        v-for="(item, i) in actionFunc"
        size="mini"
        :icon="item.iclass"
        @click="handle(item.id)"
        :type="item.type || 'primary'"
        :key="i"
        >{{ item.text }}
      </el-button>
    </div>
    <div class="action_query">
      <el-button
        v-for="(item, i) in actionQuery"
        plain
        size="mini"
        :icon="item.iclass"
        @click="handle(item.id)"
        :type="item.type || 'primary'"
        :key="i"
        >{{ item.text }}</el-button
      >
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  name: 'hs-actionline'
})
export default class HsActionline extends Vue {
  @Prop({ type: Array, required: true })
  private actionFunc!: object[];

  @Prop({ type: Array, required: true })
  private actionQuery!: object[];

  private handle (id: string) {
    if (this.$listeners.handle) {
      this.$emit('handle', id)
    }
  }
}
</script>

<style>
.action_container {
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 10px;
}
.action_func {
  display: flex;
}
.action_query {
  display: flex;
  flex-direction: row;
}
</style>
