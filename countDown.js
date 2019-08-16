/* eslint camelcase: "off" */
class Timer {
  constructor() {
    this.$$timer = null
    this.$$r_t = ''
  }
  clear() {
    clearInterval(this.$$timer)
  }
  getGmt(oriDate) {
    if (!oriDate) {
      return ''
    }
    const date_reg = /-/gi;
    if (Object.prototype.toString.call(oriDate) === '[object String]') {
      oriDate = oriDate.replace(date_reg, '/')
    }
    return new Date(oriDate)
  }
  $$interval_fn(undatefn) {
    const self = this
    const px_d = 60 * 60 * 24
    const px_h = 60 * 60
    const px_m = 60
    if (self.$$r_t <= 0) {
      clearInterval(self.$$timer)
      return
    }
    let d = Math.floor(this.$$r_t / px_d)
    let h = Math.floor((this.$$r_t - d * px_d) / px_h)
    let m = Math.floor((this.$$r_t - d * px_d - h * px_h) / px_m)
    let s = Math.floor((this.$$r_t - d * px_d - h * px_h - m * px_m))
    let d_r = [];
    if (d < 0) {
      d_r.push(`${d}天`)
      clearInterval(self.$$timer)
    } else {
      if (d_r.length || (h > 0)) {
        h = h < 10 ? `0${h}` : h
        d_r.push(`${h}:`)
      }
      if (d_r.length || (m > 0)) {
        m = m < 10 ? `0${m}` : m
        d_r.push(`${m}:`)
      }
      if (d_r.length || (s > 0)) {
        s = s < 10 ? `0${s}` : s
        d_r.push(`${s}`)
      }
    }
    undatefn.call(self, d_r.join(''))
    if (self.$$r_t <= 0) {
      clearInterval(self.$$timer)
    } else {
      self.$$r_t--
    }
  }
  countDown(edate, ndate, undatefn, cb) {
    const self = this
    clearInterval(self.$$timer)
    if (ndate >= edate) {
      cb && cb.call(self)
    } else {
      this.$$r_t = (edate - ndate) / 1000
      self.$$interval_fn(undatefn)
      self.$$timer = setInterval(() => {
        self.$$interval_fn(undatefn)
      }, 1000)
    }
  }
}

export default Timer
