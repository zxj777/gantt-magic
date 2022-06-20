import { ColumnType, ColumnConfig } from "@/types/options";

export const getColumnConfig = (): Record<ColumnType, ColumnConfig> => ({
  title: {
    label: "标题",
    value: "title",
    isLink: true,
    editable: false,
    expandable: true,
    width: 246,
  },
  creator: {
    label: "创建人",
    value: "creator",
    isLink: false,
    editable: false,
    expandable: false,
  },
  owner: {
    label: "处理人",
    value: "owner",
    isLink: false,
    editable: true,
    expandable: false,
    width: 80,
  },
  begin: {
    label: "预计开始",
    value: "begin",
    isLink: false,
    editable: true,
    expandable: false,
    width: 150,
  },
  due: {
    label: "预计结束",
    value: "due",
    isLink: false,
    editable: true,
    expandable: false,
    width: 150,
  },
  status: {
    label: "状态",
    value: "status",
    isLink: false,
    editable: true,
    expandable: false,
  },
});

export const getTimeUnitConfig = () => ({});
