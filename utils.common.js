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
  let flag = true;
  return (...args) => {
    if (!flag) return
    flag = false
    setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

/**
 * 深拷贝：deepClone
 * newObj 简单的拷贝
 * 局限：1、无法实现对函数 、RegExp等特殊对象的克隆
 *      2、会抛弃对象的constructor,所有的构造函数会指向Object
 *      3、对象有循环引用,会报错
 * clone
 * 局限：1、一些特殊情况没有处理: 例如Buffer对象、Promise、Set、Map
 *      2、另外对于确保没有循环引用的对象，我们可以省去对循环引用的特殊处理，因为这很消耗时间
 * @param {*} parent object 需要进行克隆的对象
 * @return {*} child 克隆后的对象
 */
export const newObj = JSON.parse(JSON.stringify(oldObj))

export const clone = (parent) => {
  const isType = (obj, type) => {
    if (typeof obj !== "object") return false
    const typeString = Object.prototype.toString.call(obj)
    let flag;
    switch (type) {
      case "Array":
        flag = typeString === "[object,Array]"
        break;
      case "RegExp":
        flag = typeString === "[object,RegExp]"
        break;
      case "Date":
        flag = typeString === "[object,Date]"
      default:
        flag = false
    }
    return flag
  }

  const getRegExp = (re) => {
    var flags = "";
    if (re.global) flags += 'g';
    if (re.ignoreCase) flags += 'i';
    if (re.multiline) flags += 'm';
    return flags;
  }

  // 维护两个存储循环引用的数组
  const parents = []
  const children = []

  const _clone = (parent) => {
    if (parent === null) return null;
    if (typeof parent !== 'object') return parent;
    let child, proto

    // 数组 正则 Date 单独处理->判断类型
    if (isType(parent, "Array")) {
      // 数组单独处理
      child = []
    } else if (isType(parent, "RegExp")) {
      child = new RegExp(parent.souce, getRegExp(parent))
      if (parent.lastIndex) child.lastIndex = parent.lastIndex
    } else if (isType(parent, "Date")) {
      child = new Date(parent.getTime())
    } else {
      // 处理对象原型
      proto = Object.getPrototypeOf(parent)
      // 利用Object.create切断原型链
      child = Object.create(proto)
    }

    const Index = parents.indexOf(parent)

    if (Index != -1) {
      return children[Index]
    }

    parents.push(parent)
    children.push(child)

    for (let i in parent) {
      child[i] = _clone(parent[i])
    }
    return child
  }
  return _clone(parent)
}

console.log('clone: ', clone({ a: 1, b: ['111'], c: { d: "c" } }))
// code run: clone:  { a: 1, b: Array { '0': '111' }, c: { d: 'c' } }

export class EventEmitter {
  constructor() {
    this._events = this._events || new Map();
    this._maxListeners = this._maxListeners || 10;
  }
}

EventEmitter.prototype.emit = function (type, ...args) {
  let handler;
  handler = this._events.get(type);
  if (Array.isArray(handler)) {
    for (let i = 0; i < handler.length; i++) {
      if (args.length > 0) {
        handler[i].apply(this, args)
      } else {
        handler[i].call(this)
      }
    }
  } else {
    if (args.length > 0) {
      handler.apply(this, args)
    } else {
      handler.call(this)
    }
  }
  return true;
}

EventEmitter.prototype.addListener = function (type, fn) {
  const handler = this._events.get(type)
  if (!handler) {
    this._events.set(type, fn)
  } else if (handler && typeof handler == 'function') {
    this._events.set(type, [handler, fn])
  } else {
    handler.push(fn)
  }
}

EventEmitter.prototype.removeListener = function (type, fn) {
  const handler = this._events.get(type)
  if (handler && typeof handler === 'function') {
    this._events.delete(type, fn);
  } else {
    let position;
    if (Array.isArray(handler)) {
      for (let i = 0; i < handler.length; i++) {
        if (handler[i] === fn) {
          position = i
        } else {
          position = -1
        }
      }
    }
    if (position !== -1) {
      handler.splice(position, 1)
      if (handler.length === 1) {
        this._events.set(type, handler[0])
      }
    } else {
      return this;
    }
  }
}

// code run: 
let testEvent = new EventEmitter()
testEvent.addListener('test',function(arg){
  console.log('EventEmitter listener is complete:',arg)
})
testEvent.emit('test','test_params')
testEvent.removeListener('test',function(arg){
  console.log('EventEmitter listener is complete:',arg)
})
testEvent.emit('test','test_params')
// end
