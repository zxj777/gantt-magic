export type ColumnType =
  | "title"
  | "creator"
  | "owner"
  | "begin"
  | "due"
  | "status";

export type ColumnConfig = {
  label: string;
  value: string;
  isLink: boolean;
  editable: boolean;
  expandable: boolean;
  width?: number;
};

export type CalendarDimension = "day" | "week" | "month";
