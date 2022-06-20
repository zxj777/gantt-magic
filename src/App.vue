<template>
  <div id="app">
    <GanttMagic :data="ganttData"></GanttMagic>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import GanttMagic from "./components/GanttMagic.vue";

export default Vue.extend({
  name: "App",
  components: {
    GanttMagic,
  },
  data() {
    return {
      ganttData: [
        {
          id: "1",
          title: "需求一",
          owner: "蛋包",
          begin: "2018-01-01",
          due: "2020-01-03",
          progress: 0,
          type: "story",
          creator: "朱晓江",
          status: "finish",
          children: [
            {
              id: "1001",
              title: "任务一",
              owner: "蛋包",
              begin: "2020-01-01",
              due: "2020-01-03",
              progress: 0,
              type: "task",
              creator: "朱晓江",
              status: "finish",
            },
            {
              id: "1002",
              title: "任务二",
              owner: "蛋包",
              begin: "2020-01-01",
              due: "2020-01-03",
              progress: 0,
              type: "task",
              creator: "朱晓江",
              status: "finish",
            },
          ],
        },
        {
          id: "2",
          title: "需求二",
          owner: "蛋包",
          begin: "2020-01-01",
          due: "2020-01-03",
          progress: 0,
          type: "story",
          children: [
            {
              id: "2001",
              title: "任务一",
              owner: "蛋包",
              begin: "2020-01-01",
              due: "2020-01-03",
              progress: 0,
              type: "task",
            },
            {
              id: "2002",
              title: "任务二",
              owner: "蛋包",
              begin: "2020-01-01",
              due: "2020-01-03",
              progress: 0,
              type: "task",
            },
            {
              id: "2003",
              title: "任务三",
              owner: "蛋包",
              begin: "2020-01-01",
              due: "2020-01-03",
              progress: 0,
              type: "task",
            },
          ],
        },
        // {
        //   id: '3',
        //   title: '需求三',
        //   owner: '蛋包',
        //   begin: '2019-12-01',
        //   due: '2020-01-03',
        //   progress: 0,
        //   type: 'story',
        //   children: [
        //     {
        //       id: '3001',
        //       title: '任务一',
        //       owner: '蛋包',
        //       begin: '2019-12-10',
        //       due: '2019-12-20',
        //       progress: 0,
        //       type: 'task',
        //     },
        //     {
        //       id: '3002',
        //       title: '任务二',
        //       owner: '蛋包',
        //       begin: '2019-12-15',
        //       due: '2019-12-28',
        //       progress: 0,
        //       type: 'task',
        //     },
        //     {
        //       id: '3003',
        //       title: '任务三',
        //       owner: '蛋包',
        //       begin: '2020-01-01',
        //       due: '2020-01-01',
        //       progress: 0,
        //       type: 'task',
        //     },
        //   ],
        // },
      ],
    };
  },
});
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
