/** 
 * compose 函数组合 从右至左依次执行
 * type： compose(f1,f2)(params) === f1(f2(params))
 * define： compose函数接收若干个函数作为参数，每个函数执行后的输出作为下一个函数的输出，直至最后一个函数的输出作为最终的结果
*/

function compose(...fns) {
  return function (params) {
    return fns.reduceRight(function (arg, fn) {
      return fn(arg)
    }, params)
  }
}

/**
 * pipeline 管道 从左至右依次执行
 * define: 从左至右处理数据流的过程称之为管道(pipeline)!
 */

function pipe(...fns) {
  return function (params) {
    return fns.reduce(function (arg, fn) {
      return fn(arg)
    }, params)
  }
}