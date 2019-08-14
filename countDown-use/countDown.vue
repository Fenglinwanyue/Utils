<template>
  <span>{{showtime}}</span>
</template>

<script>
import Timer from "@/common/js/timer";
export default {
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
      showtime: ""
    };
  },
  created() {
    this.timer = new Timer();
    this.timeDown(this.edate, this.ndate, this.updateFn)
  },
  methods: {
    timeDown(edate, ndate) {
      this.timer.countDown(
        this.timer.getGmt(edate),
        this.timer.getGmt(ndate),
        this.updateFn
      );
    },
    updateFn(args) {
      this.showtime = args;
    }
  }
};
</script>

<style lang='stylus' rel='stylesheet/stylus' scoped></style>
