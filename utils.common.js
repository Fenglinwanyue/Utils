/**
 * 防抖函数
 * type: 事件触发的n秒后执行回调，如果n秒内被触发，则重新计时
 * scene: 按钮提交场景：防止多次提交按钮，只执行最后提交的一次、搜索
 * @param {*} fn 回调函数
 * @param {*} delay 计时时间
 */
export const debounce = (fn, delay) => {
  let timer = null;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

/**
 * 节流函数
 * type：单位时间内，只能触发一次函数
 * scene: 1、拖拽场景：固定时间内只执行一次，防止超高频次触发位置变动
 *        2、缩放场景：监控浏览器resize
 *        3、动画场景：避免短时间内多次触发动画引起性能问题
 * @param {*} fn 
 * @param {*} delay 
 */
export const throttle = (fn, delay = 500) => {
  let falg = true;
  return (...args) => {
    if (!falg) return
    falg = false
    setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}