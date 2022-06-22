<template>
  <div
    ref="clientRef"
    class="infinity-list__client"
    :style="clientStyle"
    @scroll="onScroll"
  >
    <div :style="listStyle">
      <InfinityListItem
        v-for="row in visibleList"
        :key="row[dataKey]"
        :uniqueKey="row[dataKey]"
        :horizontal="horizontal"
        @itemResize="onItemResize"
      >
        <slot :row="row"></slot>
      </InfinityListItem>
    </div>
    <div ref="trailingRef" :style="trailingStyle"></div>
  </div>
</template>

<script>
import InfinityListItem from "./item.vue";

const DIRECTION = {
  FORWARD: "FORWARD",
  BACKWARD: "BACKWARD",
};

const sizesMap = new Map();

export default {
  components: {
    InfinityListItem,
  },
  props: {
    list: {
      type: Array,
      default: () => [],
    },
    // 平均尺寸
    averageSize: {
      type: Number,
      default: 50,
    },
    // 最小尺寸
    minSize: {
      type: Number,
      default: 50,
    },
    // 数据key
    dataKey: {
      required: true,
      type: [String, Number],
    },
    // 是否为水平移动
    horizontal: {
      type: Boolean,
      default: false,
    },
    start: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      initialized: false, // 是否初始化完成
      initializePromise: null, // 页面尺寸初始化promise
      clientSize: 0,
      views: 0,
      buffer: 0,
      range: {
        startIndex: -1, // 50，
        endIndex: -1, //
        paddingForward: 0, // paddingTop or paddingLeft
        paddingBackward: 0, // paddingBottom or paddingRight
      },
      sizes: [],
      offset: 0, // 移动偏移量
      direction: "",
    };
  },

  computed: {
    visibleList() {
      const { startIndex, endIndex } = this.range;
      return this.list.slice(startIndex, endIndex + 1);
    },
    listStyle() {
      const { paddingForward, paddingBackward } = this.range;
      // const overflowDirection = this.horizontal ? 'overflow-x: auto; display: flex;' : 'overflow-y: auto;';
      if (this.horizontal) {
        return `display: flex; padding: 0 ${paddingBackward}px 0 ${paddingForward}px`;
      }
      return `padding: ${paddingForward}px 0 ${paddingBackward}px`;
    },
    clientStyle() {
      if (this.horizontal) {
        return "overflow-x: auto; display: flex;";
      }
      return "overflow-y: auto;";
    },
    trailingStyle() {
      return this.horizontal
        ? "width: 0; height: 100%"
        : "width: 100%; height: 0";
    },
  },
  watch: {
    list: {
      handler(nv) {
        if (nv.length > 0) {
          this.initPageViews();
        }
      },
      immediate: true,
    },
    start: {
      handler() {
        this.checkStart();
      },
      immediate: true,
    },
  },
  mounted() {
    this.initializePromise = new Promise((resolve) => {
      this.clientSize = this.getClientSize();
      resolve();
    });
  },
  destroyed() {
    sizesMap.clear();
  },
  methods: {
    async initPageViews() {
      // console.log(1, '初始化');
      await this.initializePromise;
      // console.log(2, '初始化');
      if (!this.initialized) {
        // 计算个数
        const { minSize } = this;
        this.buffer = Math.ceil(this.clientSize / minSize);
        this.views = this.buffer * 2;
        this.initialized = true;
      }
      this.updateRange(0, this.views - 1);
      setTimeout(() => {
        this.checkStart();
      }, 0);
    },
    async checkStart() {
      this.scrollToIndex(this.start);
    },
    onItemResize(info) {
      const { uniqueKey, size } = info;
      sizesMap.set(uniqueKey, size);
    },
    getIndex(num) {
      const { startIndex } = this.range;
      return num + startIndex - 1;
    },
    getRowData(num) {
      const { startIndex } = this.range;
      return this.list[num + startIndex - 1];
    },
    getClientSize() {
      const { clientRef } = this.$refs;
      const directionKey = this.horizontal ? "clientWidth" : "clientHeight";
      return clientRef ? clientRef[directionKey] : 0;
    },
    // 获取偏移量
    getOffset() {
      const { clientRef } = this.$refs;
      // console.log('clientRef', clientRef);
      const directionKey = this.horizontal ? "scrollLeft" : "scrollTop";
      return clientRef ? clientRef[directionKey] : 0;
    },
    // 获取滚动卷轴大小
    getScrollSize() {
      const { clientRef } = this.$refs;
      const directionKey = this.horizontal ? "scrollWidth" : "scrollHeight";
      return clientRef ? clientRef[directionKey] : 0;
    },
    onScroll() {
      // console.log('onScroll');
      const offset = this.getOffset();
      const scrollSize = this.getScrollSize();
      const { clientSize } = this;

      // 如果滚动高度小于0，或者大于 最大高度
      if (offset < 0 || offset + clientSize > scrollSize) return;

      // 判断滚动方向
      this.direction =
        offset > this.offset ? DIRECTION.BACKWARD : DIRECTION.FORWARD;
      // 存储偏移量
      this.offset = offset;
      // 向后移动(下 or 右)
      if (this.direction === DIRECTION.BACKWARD) {
        this.scrollBackward();
      }

      // 向前移动(上 or 左)
      if (this.direction === DIRECTION.FORWARD) {
        this.scrollForward();
      }
    },
    // 根据便宜量获取起始索引
    getStartByOffset() {
      // let timeS = new Date().getTime();
      const { list, offset, dataKey, averageSize } = this;
      let offsetW = 0;
      let start;
      for (let i = 0; i < list.length; i++) {
        const currentSize = sizesMap.get(list[i][dataKey]) ?? averageSize;
        if (offsetW <= offset && offset < offsetW + currentSize) {
          start = i;
          break;
        }
        offsetW += currentSize;
      }
      // console.log('00000', offset, sizes, start);
      // console.log('getStartByOffset', new Date().getTime() - timeS, 'ms');
      return start;
    },
    // 向列表前滚动
    scrollForward() {
      const start = this.getStartByOffset();
      if (start > this.range.startIndex) {
        return;
      }
      const startIndex = Math.max(start - this.buffer, 0);
      this.updateRange(startIndex, this.getEndByStart(startIndex));
    },
    // 向列表后滚动
    scrollBackward() {
      // 获取这次滚动偏移个数
      const start = this.getStartByOffset();
      // console.log('scrollBackward', start);
      // 如果移动个数小于buffer，则不动。
      if (start < this.range.startIndex + this.buffer) {
        return;
      }

      // console.log('移动了');
      this.updateRange(start, this.getEndByStart(start));
    },
    // 根据起始索引获取结束索引
    getEndByStart(start) {
      return Math.min(start + this.views - 1, this.list.length - 1);
    },
    // 更新 range
    updateRange(startIndex, endIndex) {
      // console.log('updateRange', startIndex, endIndex);
      this.range.startIndex = startIndex;
      this.range.endIndex = endIndex;
      this.range.paddingForward = this.getPaddingForward();
      this.range.paddingBackward = this.getPaddingBackward();
    },
    // 获取paddingTop
    getPaddingForward() {
      return this.getOffsetByIndex(this.range.startIndex);
    },
    // 获取paddingBottom
    getPaddingBackward() {
      const lastIndex = this.list.length - 1;
      const res =
        this.getOffsetByIndex(lastIndex) -
        this.getOffsetByIndex(this.range.endIndex);
      // console.log('getPaddingBackward', res, lastIndex, this.range.endIndex);
      return res;
    },
    // 根据索引获取偏移量
    getOffsetByIndex(target) {
      // const timeS = new Date().getTime();
      const { list, dataKey, averageSize } = this;
      let offset = 0;
      for (let i = 0; i < target; i++) {
        const currentSize = sizesMap.get(list[i][dataKey]) ?? averageSize;
        offset += currentSize;
      }
      // console.log('getOffsetByIndex', new Date().getTime() - timeS, 'ms');
      return offset;
    },
    scrollToIndex(index) {
      if (index >= this.list.length - 1) {
        this.scrollToBottom();
      } else {
        const offset = this.getOffsetByIndex(index);
        this.scrollToOffset(offset);
      }
    },
    scrollToBottom() {
      const { trailingRef } = this.$refs;
      if (trailingRef) {
        const directionKey = this.isHorizontal ? "offsetLeft" : "offsetTop";
        const offset = trailingRef[directionKey];
        // console.log('scrollToBottom', offset);
        this.scrollToOffset(offset);

        setTimeout(() => {
          // console.log('===', this.getOffset(), this.getClientSize(), this.getScrollSize());
          if (this.getOffset() + this.getClientSize() < this.getScrollSize()) {
            this.scrollToBottom();
          }
        }, 16);
      }
    },
    scrollToOffset(offset) {
      const { clientRef } = this.$refs;
      const directionKey = this.isHorizontal ? "scrollLeft" : "scrollTop";

      if (clientRef) {
        clientRef[directionKey] = offset;
      }
    },
  },
};
</script>

<style lang="scss">
.infinity-list__client {
  width: 100%;
  height: 100%;
  /* height: 400px; */

  // &::-webkit-scrollbar {
  //   width: 10px;
  //   height: 10px;
  //   background-color: transparent;
  // }

  /* 定义滑块颜色、内阴影及圆角 */
  // &::-webkit-scrollbar-thumb {
  //   border-radius: 4px;
  //   background-color: #9093994d;
  // }

  /*滚动条里面轨道*/
  // &::-webkit-scrollbar-track {
  //   background-color: transparent;
  //   // background-color: rgba(255, 255, 255, 0.5); //设置背景透明
  // }
}
</style>
