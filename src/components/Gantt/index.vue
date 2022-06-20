<template>
  <div :style="{ textAlign: 'left', height: `${height}px` }">
    <!-- <div
      ref="test"
      style="width: 30px; height: 30px; background: #000"
      @mousedown="handleBarDown2($event)"
      @mousemove="handleBarMove2"
      @mouseup="handleBarUp2"
    ></div> -->

    <svg
      class="gantt-wrapper"
      :width="ganttLayout.width"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g class="gantt-header">
        <svg
          :x="headerItem.x"
          y="0"
          v-for="headerItem in ganttDatesGroup"
          :key="headerItem.range"
          fill="#8093a6"
        >
          <rect
            :width="headerItem.width"
            :height="ganttLayout.headerHeight"
            fill="#fff"
          ></rect>
          <text
            :x="headerItem.width / 2"
            y="1em"
            dy="8"
            text-anchor="middle"
            class="gantt-header__time-range"
          >
            {{ headerItem.range }}
          </text>
          <text
            :x="
              (options.columnWidth + options.columnGap) * index +
              options.columnWidth / 2
            "
            y="40"
            text-anchor="middle"
            v-for="(item, index) in headerItem.arr"
            :key="index"
            class="gantt-header__time-date"
          >
            <!-- {{ item.date }} -->
            <tspan>{{ item.date }}</tspan>
            <tspan
              :x="
                (options.columnWidth + options.columnGap) * index +
                options.columnWidth / 2
              "
              dy="10"
            >
              <!--
              -->{{ item.dayLabel
              }}<!-- -->
            </tspan>
          </text>
        </svg>
        <line
          x1="0"
          :y1="ganttLayout.headerHeight"
          :x2="ganttLayout.width"
          :y2="ganttLayout.headerHeight"
          style="stroke: #e8eaec; stroke-width: 1"
        />
      </g>

      <g class="gantt-body">
        <rect
          v-for="(item, index) in tasks"
          :key="item.id"
          x="0"
          :y="ganttLayout.headerHeight + 36 * index"
          :width="ganttLayout.width"
          :height="ganttLayout.rowHeight"
          fill="#fff"
        ></rect>
        <g class="gantt-lines">
          <line
            :x1="line.x"
            :y1="ganttLayout.headerHeight"
            :x2="line.x"
            :y2="ganttLayout.height"
            v-for="(line, index) in verticalDateLines"
            :key="index"
            style="stroke: #dee6ee"
          />
          <line
            :x1="line.x"
            :y1="0"
            :x2="line.x"
            :y2="ganttLayout.height"
            v-for="(line, index) in verticalDateGroupLines"
            :key="'group' + index"
            style="stroke: #dee6ee; stroke-width: 2"
          />
        </g>
        <svg
          class="gantt-task-bar-wrapper"
          v-for="(bar, index) in taskBars"
          :key="'bar' + index"
          :x="bar.x"
          :y="bar.y"
        >
          <rect
            :width="bar.width"
            :height="bar.height"
            fill="#b0bac5"
            rx="5"
            ry="5"
            class="gantt-task-bar"
            @mousedown="handleBarDown($event, index)"
            @mousemove="handleBarMove"
            @mouseup="handleBarUp"
          />
          <text
            :x="bar.width - 30"
            :y="options.barHeight / 2"
            class="gantt-bar-text"
          >
            {{ bar.progress }}%
          </text>
          <rect
            class="gantt-bar-adjust adjust--w"
            x="0"
            rx="5"
            ry="5"
            fill="rgba(0,0,0,0.2)"
            width="5"
            :height="bar.height"
            @mousedown="handleBarScaleDown($event, index, 'left')"
            @mousemove="handleBarMove"
            @mouseup="handleBarUp"
          />
          <rect
            class="gantt-bar-adjust adjust--e"
            :x="bar.width - 5"
            rx="5"
            ry="5"
            fill="rgba(0,0,0,0.2)"
            width="5"
            :height="bar.height"
            @mousedown="handleBarScaleDown($event, index, 'right')"
            @mousemove="handleBarMove"
            @mouseup="handleBarUp"
          />
        </svg>
      </g>
    </svg>
  </div>
</template>

<script>
/* eslint-disable no-debugger */

import dayjs from "dayjs";
import { mapState } from "vuex";
import { EventBus } from "../event-bus";

const DAY_MAP = ["日", "一", "二", "三", "四", "五", "六"];

export default {
  name: "GanttChart",
  props: {
    height: {
      type: Number,
      default: 0,
    },
  },
  created() {
    this.mergeOptions();
    this.handleGanttDate();
  },
  data() {
    return {
      taskBegin: null,
      taskDue: null,
      ganttStart: null,
      ganttEnd: null,
      ganttDates: [],
      layoutWidth: 0,
      layoutHeight: 0,
      ganttDatesGroup: [],
      ganttLayout: {
        width: 0,
        height: 0,
        headerHeight: 0,
        rowHeight: 0,
        bodyHeight: 0,
      },
      verticalDateLines: [],
      verticalDateGroupLines: [],
      taskBars: [],
      move: {
        isMoving: false,
        task: null,
        startX: 0,
      },
      scale: {
        isScaling: false,
        task: null,
        startX: 0,
        direction: "",
      },
    };
  },
  computed: {
    ...mapState({
      allTasks: "tasks",
      options: "options",
    }),
    tasks() {
      return this.allTasks.filter((task) => !task.hide);
    },
  },
  watch: {
    ganttDatesGroup() {
      this.computeLayout();
      this.handleTasks();
    },
  },
  mounted() {
    document.addEventListener("mousemove", this.handleBarMove);
    document.addEventListener("mouseup", this.handleBarUp);
    document.addEventListener("mousemove", this.handleBarScaleMove);
    document.addEventListener("mouseup", this.handleBarScaleUp);
  },
  beforeDestroy() {
    document.removeEventListener("mousemove", this.handleBarMove);
    document.removeEventListener("mouseup", this.handleBarUp);
    document.removeEventListener("mousemove", this.handleBarScaleMove);
    document.removeEventListener("mouseup", this.handleBarScaleUp);
  },
  methods: {
    // mergeOptions() {},
    handleGanttDate() {
      this.getBeginDue();
      this.computeGanttDateRange();
      this.combineDates();
      this.computeVerticalLinesPos();
    },
    getBeginDue() {
      for (const task of this.tasks) {
        if (!this.taskBegin || task._begin.isBefore(this.taskBegin)) {
          this.taskBegin = task._begin;
        }

        if (!this.taskDue || task._due.isAfter(this.taskDue)) {
          this.taskDue = task._due;
        }
      }
    },
    // 写死
    computeGanttDateRange() {
      this.ganttStart = dayjs(this.taskBegin).subtract(1, "month").day(0);
      this.ganttEnd = dayjs(this.taskDue).add(1, "month").day(6);

      // 默认时间维度 天
      for (let s = this.ganttStart; s <= this.ganttEnd; ) {
        const day = s.day();
        const date = s.date();
        const year = s.year();
        this.ganttDates.push({
          day,
          date,
          year,
          dayLabel: DAY_MAP[s.day()],
          instance: s,
          time: s.format("YYYY-MM-DD"),
        });
        s = dayjs(s).add(1, "day");
      }
    },
    combineDates() {
      const { columnWidth, columnGap, groupGap } = this.options;
      for (let i = 0; i < this.ganttDates.length; i += 7) {
        const s = this.ganttDates[i];
        const e = this.ganttDates[i + 6];
        this.ganttDatesGroup.push({
          range: `${s.instance.format("YYYY.MM.DD")}~${
            s.year === e.year
              ? e.instance.format("MM.DD")
              : e.instance.format("YYYY.MM.DD")
          }`,
          arr: this.ganttDates.slice(i, i + 7),
          x: (columnWidth * 7 + (7 - 1) * columnGap + groupGap) * (i / 7),
          width: columnWidth * 7 + (7 - 1) * columnGap,
        });
      }
    },
    computeLayout() {
      const { columnWidth, columnGap, rowHeight, groupGap, headerHeight } =
        this.options;
      const width =
        this.ganttDates.length * columnWidth +
        (this.ganttDatesGroup.length - 1) * groupGap +
        (this.ganttDates.length - this.ganttDatesGroup.length) * columnGap;
      const height = headerHeight + this.tasks.length * rowHeight;
      const bodyHeight = this.tasks.length * rowHeight;

      this.ganttLayout = {
        width,
        height,
        bodyHeight,
        headerHeight,
        rowHeight,
      };
    },
    computeVerticalLinesPos() {
      if (this.ganttDatesGroup.length === 0) return;
      const dateLines = [];
      const dateGroupLines = [];

      let currentGroupX = 0;

      for (let i = 0; i < this.ganttDatesGroup.length; i++) {
        const group = this.ganttDatesGroup[i];
        for (let j = 0; j < group.arr.length - 1; j++) {
          const x =
            (j + 1) * this.options.columnWidth +
            j * this.options.columnGap +
            currentGroupX;
          dateLines.push({
            x,
          });
          group.arr[j].x = x;
        }
        const x = currentGroupX + group.width;
        group.arr[group.arr.length - 1].x = x;
        dateGroupLines.push({
          x,
        });
        currentGroupX += group.width + this.options.groupGap;
      }

      this.verticalDateLines = dateLines;
      this.verticalDateGroupLines = dateGroupLines;
    },
    handleTasks() {
      this.taskBars = this.tasks
        .map((task, index) => {
          if (!task.begin || !task.due) {
            return null;
          }

          const y =
            this.ganttLayout.headerHeight +
            index * this.ganttLayout.rowHeight +
            this.options.barPadding;
          const height =
            this.ganttLayout.rowHeight - 2 * this.options.barPadding;

          let x1;
          let x2;

          let i = 0;
          let j = 0;

          for (; i < this.ganttDatesGroup.length; i++) {
            const { arr } = this.ganttDatesGroup[i];

            for (; j < arr.length; j++) {
              const time = arr[j];

              if (time.instance.isSame(task._begin.subtract(1, "day"))) {
                x1 = time.x;
                break;
              }
            }
            if (x1) {
              break;
            }
            j = 0;
          }

          for (; i < this.ganttDatesGroup.length; i++) {
            const { arr } = this.ganttDatesGroup[i];

            for (; j < arr.length; j++) {
              const time = arr[j];
              if (time.instance.isSame(task._due)) {
                x2 = time.x;
                break;
              }
            }
            if (x2) {
              break;
            }
          }

          return {
            id: task.id,
            originX: x1,
            x: x1,
            originX2: x2,
            x2,
            y,
            originWidth: x2 - x1,
            width: x2 - x1,
            height,
            originBegin: task.begin,
            begin: task.begin,
            originDue: task.due,
            due: task.due,
            owner: task.owner,
            title: task.title,
            progress: task.progress,
            status: task.status,
          };
        })
        .filter((taskBar) => !!taskBar);
    },
    handleBarDown(e, index) {
      this.move = {
        isMoving: true,
        task: this.taskBars[index],
        startX: e.pageX,
      };
    },
    handleBarMove(e) {
      if (!this.move.isMoving) return;
      const deltaX = e.pageX - this.move.startX;
      const bar = this.taskBars.find((bar) => bar.id === this.move.task.id);
      // const moveX = deltaX / (this.options.columnWidth + this.options.columnGap) *
      const x = bar.originX + deltaX;

      // 可优化
      for (let i = 0; i < this.ganttDates.length - 1; i++) {
        if (this.ganttDates[i].x < x && this.ganttDates[i + 1].x >= x) {
          let d, t;
          if (deltaX >= 0) {
            d = this.ganttDates[i];
            t = this.ganttDates[i + 1];
          } else {
            d = this.ganttDates[i + 1];
            t = this.ganttDates[i + 2];
          }
          bar.x = d.x;
          bar.begin = t.time;
          bar.due = dayjs(bar.begin)
            .add(dayjs(bar.originDue) - dayjs(bar.originBegin), "millisecond")
            .format("YYYY-MM-DD");
        }
      }
    },

    handleBarUp() {
      if (!this.move.isMoving) return;
      const { begin, due, id: taskId } = this.move.task;
      EventBus.$emit(
        "updateTaskTime",
        {
          begin,
          due,
          taskId,
        },
        (error) => {
          if (!error) {
            const bar = this.taskBars.find((bar) => bar.id === taskId);
            bar.originBegin = bar.begin;
            bar.originDue = bar.due;
            bar.originX = bar.x;
          }
        }
      );

      this.move = {
        isMoving: false,
        task: null,
        startX: 0,
      };

      // console.log(index)
    },
    handleBarScaleDown(e, index, direction) {
      this.scale = {
        isScaling: true,
        task: this.taskBars[index],
        startX: e.pageX,
        direction,
      };
    },
    handleBarScaleMove(e) {
      if (!this.scale.isScaling) return;
      // const coefficient = this.scale.direction === 'left' ? -1 : 1
      const deltaX = e.pageX - this.scale.startX;
      // if (deltaX * coefficient <= 0) return
      const bar = this.taskBars.find((bar) => bar.id === this.scale.task.id);
      const x =
        this.scale.direction === "right"
          ? bar.originX2 + deltaX
          : bar.originX + deltaX;
      for (let i = 0; i < this.ganttDates.length - 1; i++) {
        if (this.ganttDates[i].x < x && this.ganttDates[i + 1].x >= x) {
          let d, t;
          if (this.scale.direction === "right") {
            d = this.ganttDates[i];
            t = this.ganttDates[i + 1];
            bar.due = d.time;
            bar.x2 = d.x;
            bar.width = bar.x2 - bar.originX;
          } else {
            d = this.ganttDates[i + 1];
            t = this.ganttDates[i + 2];

            bar.x = d.x;
            bar.begin = t.time;
            bar.width = bar.originX - bar.x + bar.originWidth;
          }
          // bar.due = dayjs(bar.begin)
          //   .add(dayjs(bar.originDue) - dayjs(bar.originBegin), 'millisecond')
          //   .format('YYYY-MM-DD')
        }
      }
    },
    handleBarScaleUp() {
      if (!this.scale.isScaling) return;
      const { begin, due, id: taskId } = this.scale.task;
      EventBus.$emit(
        "updateTaskTime",
        {
          begin,
          due,
          taskId,
        },
        (error) => {
          if (!error) {
            const bar = this.taskBars.find((bar) => bar.id === taskId);
            bar.originBegin = bar.begin;
            bar.originDue = bar.due;
            bar.originX2 = bar.x2;
            bar.originX = bar.x;
            bar.originWidth = bar.width;
          }
        }
      );

      this.scale = {
        isScaling: false,
        task: null,
        startX: 0,
      };
    },
    // computeTaskBars() {
    //   this.tasks.for
    // },
  },
};
</script>

<style lang="scss">
.gantt-wrapper {
  height: 100%;

  .gantt-header__time-range {
    font-size: 14px;
    font-weight: 600;
  }

  .gantt-header__time-date {
    font-size: 10px;
  }

  .gantt-body {
    .gantt-task-bar-wrapper {
      .gantt-task-bar {
        cursor: all-scroll;
      }
      .gantt-bar-text {
        font-size: 12px;
        dominant-baseline: middle;
        user-select: none;
      }

      .gantt-bar-adjust {
        &.adjust--w {
          cursor: w-resize;
        }

        &.adjust--e {
          cursor: e-resize;
        }
      }
    }
  }
}
</style>
