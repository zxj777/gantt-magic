<script lang="ts">
// import VirtualList from "vue-virtual-scroll-list";
import Vue from "vue";
import MhyInfinityList from "../infinityList/src/index.vue";

export default Vue.extend({
  components: {
    // VirtualList,
    MhyInfinityList,
  },
  props: {
    size: {
      type: Object,
      default() {
        return {
          width: 0,
          height: 0,
        };
      },
    },
  },
  data() {
    const list = [...Array(1000)].map((item, index) => ({
      id: index,
      value: index,
    }));
    return {
      list,
    };
  },
});
</script>

<template>
  <div class="gantt-view" :style="{ height: size.height + 'px' }">
    <div class="gantt-view-header">
      <div class="group-date-wrapper">
        <MhyInfinityList
          :list="list"
          :horizontal="true"
          :averageSize="100"
          :minSize="100"
          dataKey="id"
          :start="30"
        >
          <template #default="{ row }">
            <div class="my-row2" style="width: 30px; height: 30px">
              {{ row.id }}{{ row.value }}
            </div>
          </template>
        </MhyInfinityList>
      </div>
      <div class="data-wrapper"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.gantt-view {
  position: relative;
  width: 9792px;
  background-color: rgb(253, 253, 253);

  .gantt-view-header {
    position: absolute;
    left: 0px;
    top: 0px;
    width: 100%;
    background: white;
    border-top: 1px solid rgb(233, 233, 231);
    border-bottom: 1px solid rgb(233, 233, 231);

    .group-date-wrapper {
      position: relative;
      height: 32px;
      overflow: hidden;
    }

    .date-wrapper {
    }
  }
}
</style>
