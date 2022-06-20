interface State {
  ganttColumnWidth: number;
  rowHeight: number;
  groupGap: number;
  columnGap: number;
  headerHeight: number;
  barPadding: number;
  barHeight: number;
}

const state: State = {
  ganttColumnWidth: 30,
  rowHeight: 36,
  groupGap: 2,
  columnGap: 1,
  headerHeight: 60,
  barPadding: 3,
  barHeight: 30,
};

export default {
  state,
};
