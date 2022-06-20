import { TimeUnit } from "@/store/modules/options";
// import { GanttHeaderDateUnit } from "@/types/options";
import dayjs from "dayjs";

const DAY_MAP = ["日", "一", "二", "三", "四", "五", "六"];

export function createDate(date?: Date | string | number): Date {
  return dayjs(date).toDate();
}

export function isBefore(date1: Date, date2: Date): boolean {
  return date1.valueOf() < date2.valueOf();
}

export function isAfter(date1: Date, date2: Date): boolean {
  return date1.valueOf() > date2.valueOf();
}

/**
 * 获取时间范围列表
 * @param start
 * @param end
 * @param unit
 * @returns
 */
// export function getDateList(
//   begin: Date,
//   due: Date,
//   unit: TimeUnit
// ): { ganttDateList: any[]; ganttDateGroupList: any[] } {
//   const ganttDateList = [];
//   const ganttDateGroupList = [];
//   let start, end

//   switch (unit) {
//     case TimeUnit.day:
//       // 按日维度,取最早日期的前一个月的第一个周日，最晚日期的后一个月的最后一个周六
//       start = dayjs(begin).subtract(1, "month").day(0);
//       end = dayjs(due).add(1, "month").day(6);
//       for (let s = start; s <= end; ) {
//         const day = s.day();
//         const date = s.date();
//         const year = s.year();
//         ganttDateList.push({
//           day,
//           date,
//           year,
//           dayLabel: DAY_MAP[s.day()],
//           instance: s,
//           time: s.format("YYYY-MM-DD"),
//         });
//         s = dayjs(s).add(1, "day");
//       }

//       break;

//     case TimeUnit.week:
//       break;

//     case TimeUnit.month:
//       break;

//     default:
//       console.log("时间维度不存在");
//       break;
//   }
//   return {
//     ganttDateList,
//     ganttDateGroupList,
//   };
// }
