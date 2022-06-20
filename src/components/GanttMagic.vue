<template>
  <div class="mihoyo-gantt">
    <slot name="header"></slot>
    <GanttMain></GanttMain>
    <slot name="footer"></slot>
  </div>
</template>

<script>
import GanttMain from "./GanttMain.vue";
import { mapMutations, mapState } from "vuex";
import Vue from "vue";
import { Data } from "@/model/data";

export default Vue.extend({
  components: {
    GanttMain,
  },
  props: {
    data: {
      type: Array,
      default() {
        return [];
      },
    },
    // columns: {
    //   type: Array,
    //   default() {
    //     return [];
    //   },
    // },
  },
  computed: {
    // ...mapState({
    //   viewConfig: "viewConfig",
    // }),
  },
  watch: {
    data: {
      handler(val) {
        this.setData(new Data(val));
      },
      immediate: true,
    },
    // tasks: {
    //   handler(val) {
    //     const expandedKeys = [];
    //     const tasks = this.formatTasks(val, expandedKeys);
    //     this.setTasks(tasks);
    //     this.setViewConfig({
    //       ...this.viewConfig,
    //       expandedKeys,
    //     });
    //   },
    //   immediate: true,
    // },
    // columns: {
    //   handler(val) {
    //     const columns = this.formatColumns(val);
    //     this.setColumns(columns);
    //   },
    //   immediate: true,
    // },
  },
  created() {
    // this.startEventListen();
  },
  methods: {
    ...mapMutations({
      setData: "data/setData",
    }),
    // ...mapMutations(["setTasks", "setColumns", "setViewConfig"]),
    // startEventListen() {
    //   EventBus.$on("updateTaskTime", (data, cb) => {
    //     this.$emit("updateTask", data, cb);
    //   });
    // },
    // formatTasks(tasks, expandedKeys, pid = null) {
    //   if (!tasks) return [];
    //   let r = [];
    //   tasks.forEach((task) => {
    //     task.pid = pid;
    //     task._begin = dayjs(task.begin);
    //     task._due = dayjs(task.due);
    //     r.push(task);
    //     if (task.children) {
    //       expandedKeys.push(task.id);
    //       task.expanded = true;
    //       r = r.concat(this.formatTasks(task.children, expandedKeys, task.id));
    //       delete task.children;
    //     }
    //   });
    //   return r;
    // },
    // formatColumns(columns) {
    //   const configMap = getColumnConfig();
    //   return columns.map((column) => ({
    //     ...configMap[column.name],
    //     ...column,
    //   }));
    // },
  },
});
</script>
