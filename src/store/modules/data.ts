import { Data } from "@/model/data";

interface State {
  GanttData: Data;
  // data: DataRow[];
  // tasks: Array<any>;
  // columns: Array<any>;
  // options: {
  //   columnWidth: number;
  //   rowHeight: number;
  //   groupGap: number;
  //   columnGap: number;
  //   headerHeight: number;
  //   barPadding: number;
  //   barHeight: number;
  // };

  // viewConfig: any;
}

const state: State = {
  GanttData: null,
  // data: [],
  // tasks: [],
  // columns: [],
  // options: {
  //   columnWidth: 30,
  //   rowHeight: 36,
  //   groupGap: 2,
  //   columnGap: 1,
  //   headerHeight: 60,
  //   barPadding: 3,
  //   barHeight: 30,
  // },
  // viewConfig: {
  //   expandedKeys: [],
  // },
};

const mutations = {
  setData(state: State, data: Data): void {
    state.GanttData = data;
  },
};

export default {
  state,
  mutations,
};
