<template>
  <span>{{showtime}}</span>
</template>

<script>
import Timer from "@/common/js/timer";
export default {
  name: 'TimeDown',
  props: {
    ndate: {
      type: String,
      default: ""
    },
    edate: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      isFirst: true,
      showtime: ""
    };
  },
  activated () {
    if (!this.isFirst) {
      this.init();
    }
  },
  methods: {
    init() {
      this.timer = new Timer();
      this.timer.countDown(this.timer.getGmt(this.edate), this.timer.getGmt(this.ndate), this.updateFn, null)
    },
    updateFn(args) {
      this.showtime = args;
    }
  },
  mounted () {
    if (this.isFirst) {
      this.init();
      this.isFirst = false;
    }
  },
  beforeDestroy () {
    this.isFirst = false
    this.timer.clear();
  },
  deactivated () {
    this.isFirst = false
    this.timer.clear();
  }
};
</script>

<style lang='stylus' rel='stylesheet/stylus' scoped></style>
