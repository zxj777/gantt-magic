<script lang="ts">
import VirtualList from "vue-virtual-scroll-list";
import Vue from "vue";

export default Vue.extend({
  components: {
    // VirtualList,
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
    // const list = [...Array(100)].map();
    return {
      // list,
    };
  },
});
</script>

<template>
  <div class="gantt-view" :style="{ height: size.height + 'px' }">
    <div class="gantt-view-header">
      <div class="group-date-wrapper"></div>
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
