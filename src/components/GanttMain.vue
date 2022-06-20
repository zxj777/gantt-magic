<template>
  <div class="mihoyo-gantt-wrapper">
    <div class="mihoyo-gantt__toolsbar" style="height: 32px"></div>
    <div
      :v-loading="isLoading"
      ref="gantt"
      :style="{ height: `${ganttSize.height.ganttHeight}px` }"
    >
      <div
        class="mihoyo-gantt__container"
        :style="{ height: `${ganttSize.height.ganttContainerHeight}px` }"
      >
        <div class="mihoyo-gantt__empty"></div>
        <div class="mihoyo-gantt__split-wrapper">
          <!-- <div
            class="mihoyo-gantt__split-part part--left"
            :style="{ right: `${100 - triggerLeft}%` }"
          >
            <div
              :style="{ height: `${ganttSize.height.ganttContainerHeight}px` }"
            >
              <ZTable></ZTable>
            </div>
          </div>
          <div
            class="mihoyo-gantt__split-trigger"
            :style="{ left: `${triggerLeft}%` }"
          >
            <div class="mihoyo-gantt__split-trigger-bar"></div>
          </div> -->
          <div
            class="mihoyo-gantt__split-part part--right"
            :style="{ left: `${0}%` }"
            ref="ganttWrapper"
          >
            <Gantt
              :size="{
                width: ganttSize.width.ganttWidth,
                height: ganttSize.height.ganttContainerHeight,
              }"
            ></Gantt>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Gantt from "./Gantt/index3.vue";
import ZTable from "./ZTable/index.vue";
import Vue from "vue";

export default Vue.extend({
  name: "GanttMain",
  components: {
    Gantt,
    // ZTable,
  },
  data() {
    return {
      triggerLeft: 50,
      isLoading: false,
      ganttSize: {
        width: {
          ganttWidth: 0,
        },
        height: {
          ganttHeight: 0,
          ganttContainerHeight: 0,
        },
      },
      height: {
        ganttHeight: 0,
        ganttContainerHeight: 0,
      },
    };
  },

  mounted() {
    this.computeGanttSize();
    this.computeGanttHeight();
    window.onresize = () => {
      this.computeGanttHeight();
    };
  },
  methods: {
    computeGanttSize() {
      this.computeGanttWidth();
      this.computeGanttHeight();
    },
    computeGanttWidth() {
      this.ganttSize.width.ganttWidth = (
        this.$refs.ganttWrapper as HTMLElement
      ).offsetWidth;
    },
    computeGanttHeight() {
      const ganttEl = this.$refs.gantt as HTMLElement;
      const ganttHeight = window.innerHeight - ganttEl.offsetTop;
      const ganttContainerHeight = ganttHeight - 18;

      this.ganttSize.height = {
        ganttHeight,
        ganttContainerHeight,
      };
    },
  },
});
</script>

<style lang="scss">
.mihoyo-gantt-wrapper {
  width: 100%;

  .mihoyo-gantt__container {
    background-color: #f8f8f8;

    .mihoyo-gantt__split-wrapper {
      position: relative;
      height: 100%;

      .mihoyo-gantt__split-part {
        position: absolute;
        top: 0;
        bottom: 0;

        &.part--left {
          left: 0;
        }

        &.part--right {
          right: 0;
          overflow: scroll;
          font-size: 0;
        }
      }
    }
  }
}
</style>
