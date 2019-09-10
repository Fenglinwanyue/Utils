/**
 * 二分查找
 */

export function binary_search(arr, num) {
  let start = 0
  let arrLen = arr.length - 1
  while (start <= arrLen) {
    let mid = (start + arrLen) / 2
    if (num === arr[mid]) {
      return mid
    } else if (num < arr[mid]) {
      arrLen = mid - 1
    } else if (num > arr[mid]) {
      start = mid + 1
    } else {
      return -1
    }
  }
}

console.log('二分查找：', binary_search([1,2,3,4,5,6,7,8,9,10,11],9))