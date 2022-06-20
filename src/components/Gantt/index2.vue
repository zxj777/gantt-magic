<template>
  <div class="gantt-magic-canvas">
    <canvas
      id="gantt-canvas"
      :height="size.height"
      :width="size.width"
    ></canvas>
  </div>
</template>

<script>
import { getDateList } from "@/utils/date";
import Vue from "vue";
import { mapState } from "vuex";

export default Vue.extend({
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
    return {
      ctx: null,
      headerDateList: [],
    };
  },
  computed: {
    ...mapState({
      data: (state) => state.data.GanttData,
      timeUnit: (state) => state.options.timeUnit,
    }),
  },
  mounted() {
    this.ctx = document.querySelector("#gantt-canvas");
    this.getHeaderDateList();
    this.drawGanttHeader();
  },
  methods: {
    getHeaderDateList() {
      this.headerDateList = getDateList(
        this.data.begin,
        this.data.due,
        this.timeUnit
      );
    },
    drawGanttHeader() {
      console.log(1);
    },
    drawGanttBody() {
      console.log(2);
    },
  },
});
</script>

<style lang="scss" scoped></style>
