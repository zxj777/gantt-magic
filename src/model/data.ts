import { originDataRow } from "@/types/data.d";
import { createDate, isAfter, isBefore } from "@/utils/date";

export class DataRow {
  private _data: originDataRow;

  private _isExpand = true;

  /**
   * 父节点集合
   */
  private _pIds: string[] = [];

  constructor(data: originDataRow, pIds: string[]) {
    this._data = data;
    this._pIds = pIds;
    // this.__isExpand = false
  }

  /**
   * 任务是否展开
   */
  get isExpand(): boolean {
    return this._isExpand;
  }

  get pIds(): string[] {
    return this._pIds;
  }

  get begin(): Date {
    return createDate(this._data.begin);
  }

  get due(): Date {
    return createDate(this._data.due);
  }
}

export class Data {
  originData: originDataRow[] = [];

  data: DataRow[] = [];

  constructor(originData: originDataRow[]) {
    this.originData = originData;
    this.data = this.initData(originData);
  }

  /**
   * 初始化数据
   * @param originData 源数据
   */
  initData(originData: originDataRow[]): DataRow[] {
    const data = this._createDataTree(originData, []);

    return data;
  }

  private _createDataTree(data: originDataRow[], pIds: string[]) {
    const r = [];

    for (let i = 0; i < data.length; i++) {
      r.push(this._createDataRow(data[i], pIds));
    }

    return r;
  }

  private _createDataRow(data: originDataRow, pIds: string[]) {
    const row = new DataRow(data, pIds);

    // if (data?.children.length) {

    // }
    // this._updateDateRange(row);

    return row;
  }

  // /**
  //  * 更新甘特图时间范围
  //  * @param data 单条数据
  //  */
  // private _updateDateRange(data: DataRow): void {
  //   if (!this.begin || isBefore(data.begin, this.begin)) {
  //     this._begin = data.begin;
  //   }

  //   if (!this.due || isAfter(data.due, this.due)) {
  //     this._due = data.due;
  //   }
  // }
}
