import { getColumnConfig } from "@/config/view";
import { ColumnType, ColumnConfig } from "@/types/options";

const DEFAULT_COLUMNS_LIST: ColumnType[] = ["title", "owner", "begin", "due"];

export const enum TimeUnit {
  "day" = 0,
  "week" = 3,
  "month" = 6,
}

interface State {
  columnsDisplayed: ColumnType[];
  timeUnit: TimeUnit;
}

const state: State = {
  columnsDisplayed: DEFAULT_COLUMNS_LIST,
  timeUnit: TimeUnit.day,
};

const getters = {
  columns(state: State): ColumnConfig[] {
    const columnConfig = getColumnConfig();
    return state.columnsDisplayed.map((columnType) => ({
      ...columnConfig[columnType],
    }));
  },
};

const mutations = {
  setColumnsDisplayed(state: State, data: ColumnType[]): void {
    state.columnsDisplayed = data;
  },
  setTimeUnit(state: State, data: TimeUnit): void {
    state.timeUnit = data;
  },
};

export default {
  state,
  getters,
  mutations,
};
