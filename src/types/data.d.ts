export type DataRowType = "story" | "task";

export type Status = "finish" | "planning" | "developing";

export type IterationData = {
  timeBars: TimeBar[];
  list: originDataRow[];
};

type TimeBar = {
  startTime: string;
  endTime: string;
};

export type originDataRow = {
  id: string;
  title: string;
  owner: string;
  begin: string;
  due: string;
  progress: number;
  type: DataRowType;
  creator: string;
  status: Status;
  children?: originDataRow[];
};

export type CommonDataRow = originDataRow & {
  children?: CommonDataRow[];
};
