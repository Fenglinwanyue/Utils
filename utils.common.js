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
testEvent.addListener('test', function (arg) {
  console.log('EventEmitter listener is complete:', arg)
})
testEvent.emit('test', 'test_params')
testEvent.removeListener('test', function (arg) {
  console.log('EventEmitter listener is complete:', arg)
})
testEvent.emit('test', 'test_params')
// end

// 实现instanceof
export function instance_of(L, R) {
  let O = R.prototype;
  L = L.__proto__;
  while (true) {
    if (L === null) return false
    if (L === O) {
      return true
    }
    L = L.__proto__;
  }
}

/**
 * 模拟new
 * arguments
 * 1.每个函数都有一个arguments属性，表示函数的实参集合
 * 2.arguments不是数组而是一个对象，但它和数组很相似，所以通常称为类数组对象
 * 3.arguments有length属性，可以用arguments[length]显示调用
 * [].shift.call(arguments) shift也是Array的一个实例方法，用于获取并返回数组的第一个元素
 * 1、创建一个对象2.改变该对象的原型3.改变该对象的this指向4.判断构造函数是否返回了对象，未返回则返回该对象
 */
function Fun(author) {
  this.author = author;
  this.log = "模拟构造函数被实例化操作";
}
Fun.prototype.$log = function () {
  console.log(this.author, this.log)
}
function mockNew() { // 第一个参数为构造函数
  const obj = new Object();
  const Constructor = [].shift.call(arguments) // 拿到构造函数 
  obj.__proto__ = Constructor.prototype
  const ret = Constructor.apply(obj, arguments)
  return ret === 'object' ? ret : obj;
}
// code run: 
let newObj = mockNew(Fun, 'cyl')
newObj.$log()
// end

/**
 * mock call
 * url https://www.jianshu.com/p/097f995178e1
 */
Function.prototype.$call = function (context) {
  if (typeof this !== "function") {
    throw new TypeError("this must be function")
  }
  let ctx = context || window;
  let args = [...arguments].slice(1);
  ctx.$$fn = this;
  let result = ctx.$$fn(...args);
  delete (ctx.$$fn);
  return result;
}

/**
 * mock apply
 * url https://www.jianshu.com/p/097f995178e1
 */
Function.prototype.$apply = function (context) {
  if (typeof this !== "function") {
    throw new TypeError("this must be function")
  }
  let ctx = context || window;
  ctx.$$fn = this;
  let result;
  if (arguments[1]) {
    console.log('...arguments[1] :', ...arguments[1])
    result = ctx.$$fn([...arguments[1]])
  } else {
    result = ctx.$$fn()
  }
  delete (ctx.$$fn);
  return result;
}

// 测试一下
let a = {
  value: 1
}
function getValue(arr) {
  console.log('test arguments:', arr, 'log value:', this.value)
  return {
  }
}
// getValue.$apply(a, 'cyl', '18') test call
getValue.$apply(a, ['cyl', '18'])

/**
 * mock bind
 * url https://www.jianshu.com/p/097f995178e1
 * 函数柯里化
 * concat方法用于连接两个或多个数组。参数可以是具体的值，也可以是数组对象
 */
Function.prototype.$$bind = function (context) {
  if (typeof this !== "function") throw new TypeError("this must be funciton")
  let ctx = context || window;
  let _this = this;
  let args = [...arguments].slice(1)
  // 当 bind 返回的函数作为构造函数的时候，bind 时指定的 this 值会失效，但传入的参数依然生效
  return Fbind = function () {
    let self = this instanceof Fbind ? _this : ctx;
    return _this.apply(self, args.concat(...arguments))
  }
  // Fbind.prototype = this.prototype; // 修改返回函数的 prototype 为绑定函数的 prototype，实例就可以继承绑定函数的原型中的值
  // 将 Fbind.prototype = this.prototype，会导致修改 Fbind.prototype 的时候，也会直接修改绑定函数的 prototype。这个时候，我们可以通过一个空函数来进行中转（ js 高程中称为原型式继承）
  let F = function () { }
  F.prototype = this.prototype
  Fbind.prototype = new F()
  return Fbind
}

// 测试一下 
var value = 2;

var foo = {
  value: 1
};

function bar(name, age) {
  this.habit = 'shopping';
  console.log(this.value); // undefined
  console.log(name, age);
}

bar.prototype.friend = 'jianshu';

var bindFoo = bar.$$bind(foo, 'cyl');
var obj = new bindFoo('18');
console.log(obj.habit);
console.log(obj.friend);

/**
 * mock Object.create()
 * Object.create() ：创建一个新对象，使用现有的对象来提供新创建的对象的__proto__
 * 使用Object.create()是将对象继承到__proto__属性上
 */

export function objCreate(oriObj) {
  let f = function () { }
  f.prototype = oriObj
  return new f()
}
