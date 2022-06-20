<template>
  <vxe-table
    ref="xTable"
    :data="data"
    border="inner"
    row-id="id"
    :row-config="{ isHover: true }"
    height="100%"
    :tree-config="{
      reserve: true,
      rowField: 'id',
      expandAll: true,
    }"
    @toggle-tree-expand="toggleExpandChangeEvent"
    size="mini"
  >
    <vxe-column
      v-for="column in columns"
      :key="column.value"
      :field="column.value"
      :title="column.label"
      :min-width="column.width"
      show-overflow="ellipsis"
      tooltip
      :tree-node="column.value === 'title'"
    ></vxe-column>
  </vxe-table>
</template>

<script>
import { mapMutations, mapState, mapGetters } from "vuex";
import Vue from "vue";
import "xe-utils";
import "vxe-table/lib/style.css";
import {
  // 核心
  // VXETable,

  // 功能模块
  Icon,
  Filter,
  Menu,
  Edit,
  Export,
  Keyboard,
  Validator,
  Header,
  // Footer,

  // 可选组件
  Column,
  Colgroup,
  Grid,
  Toolbar,
  Pager,
  Checkbox,
  CheckboxGroup,
  Radio,
  RadioGroup,
  RadioButton,
  Input,
  Textarea,
  Button,
  Modal,
  Tooltip,
  Form,
  FormItem,
  FormGather,
  Select,
  Optgroup,
  Option,
  Switch,
  List,
  Pulldown,

  // 表格
  Table,
} from "vxe-table";

Vue.use(Header)
  // .use(Footer)
  .use(Icon)
  .use(Filter)
  .use(Edit)
  .use(Menu)
  .use(Export)
  .use(Keyboard)
  .use(Validator)

  // 可选组件
  .use(Column)
  .use(Colgroup)
  .use(Grid)
  .use(Toolbar)
  .use(Pager)
  .use(Checkbox)
  .use(CheckboxGroup)
  .use(Radio)
  .use(RadioGroup)
  .use(RadioButton)
  .use(Input)
  .use(Textarea)
  .use(Button)
  .use(Modal)
  .use(Tooltip)
  .use(Form)
  .use(FormItem)
  .use(FormGather)
  .use(Select)
  .use(Optgroup)
  .use(Option)
  .use(Switch)
  .use(List)
  .use(Pulldown)

  // 安装表格
  .use(Table);

export default Vue.extend({
  data() {
    return {
      // data: [
      //   {
      //     id: "1",
      //     title: "需求一",
      //     owner: "蛋包",
      //     begin: "2020-01-01",
      //     due: "2020-01-03",
      //     progress: 0,
      //     type: "story",
      //     children: [
      //       {
      //         id: "1001",
      //         title: "任务一",
      //         owner: "蛋包",
      //         begin: "2020-01-01",
      //         due: "2020-01-03",
      //         progress: 0,
      //         type: "task",
      //       },
      //       {
      //         id: "1002",
      //         title: "任务二",
      //         owner: "蛋包",
      //         begin: "2020-01-01",
      //         due: "2020-01-03",
      //         progress: 0,
      //         type: "task",
      //       },
      //       {
      //         id: "1003",
      //         title: "任务三",
      //         owner: "蛋包",
      //         begin: "2020-01-01",
      //         due: "2020-01-03",
      //         progress: 0,
      //         type: "task",
      //       },
      //     ],
      //   },
      //   {
      //     id: "2",
      //     title: "需求二",
      //     owner: "蛋包",
      //     begin: "2020-01-01",
      //     due: "2020-01-03",
      //     progress: 0,
      //     type: "story",
      //     children: [
      //       {
      //         id: "2001",
      //         title: "任务一",
      //         owner: "蛋包",
      //         begin: "2020-01-01",
      //         due: "2020-01-03",
      //         progress: 0,
      //         type: "task",
      //       },
      //       {
      //         id: "2002",
      //         title: "任务二",
      //         owner: "蛋包",
      //         begin: "2020-01-01",
      //         due: "2020-01-03",
      //         progress: 0,
      //         type: "task",
      //       },
      //       {
      //         id: "2003",
      //         title: "任务三",
      //         owner: "蛋包",
      //         begin: "2020-01-01",
      //         due: "2020-01-03",
      //         progress: 0,
      //         type: "task",
      //       },
      //     ],
      //   },
      // ],
    };
  },
  computed: {
    ...mapState({
      data: (state) => state.data.GanttData.data.map((row) => row._data),
      // viewConfig: "viewConfig",
    }),
    ...mapGetters({
      columns: "options/columns",
    }),
  },
  mounted() {
    this.init();
  },
  methods: {
    // ...mapMutations(["setViewConfig"]),
    init() {
      // this.$refs.xTable.setTreeExpand(
      //   this.data.filter((task) => task.expanded),
      //   true
      // );
    },
    getRowKey(row) {
      return row.id;
    },
    toggleExpandChangeEvent({ row, expanded }) {
      let expandedKeys;
      const { expandedKeys: keys } = this.viewConfig;
      if (expanded) {
        expandedKeys = keys.concat(row.id);
      } else {
        const idx = keys.findIndex((item) => item === row.id);
        expandedKeys = keys.slice(0, idx).concat(keys.slice(idx + 1));
      }

      // this.setViewConfig({
      //   ...this.viewConfig,
      //   expandedKeys,
      // });
    },
  },
});
</script>

<style lang="scss" scoped>
::v-deep .vxe-header--row {
  height: 60px;
}
</style>
