<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
// ListItem
export default {
  props: {
    uniqueKey: {
      required: true,
      type: [String, Number],
    },
    row: {
      type: Object,
    },
    // 是否为水平移动
    horizontal: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    // console.log(111, this.$el);
    if (typeof ResizeObserver !== "undefined") {
      this.resizeObserver = new ResizeObserver(() => {
        this.onSizeChange();
      });
      this.resizeObserver.observe(this.$el);
    }
  },
  updated() {
    this.onSizeChange();
  },
  beforeDestroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
  },
  methods: {
    onSizeChange() {
      // console.log(this.getCurrentSize());
      this.$emit("itemResize", {
        uniqueKey: this.uniqueKey,
        size: this.getCurrentSize(),
      });
      // this.$parent.$emit(this.event, this.uniqueKey, this.getCurrentSize(), this.hasInitial);
    },
    getCurrentSize() {
      const directionKey = this.horizontal ? "offsetWidth" : "offsetHeight";
      return this.$el ? this.$el[directionKey] : 0;
    },
  },
};
</script>

<style></style>
