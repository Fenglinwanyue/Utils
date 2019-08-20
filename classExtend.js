/**
 * extend
 * TODO: es6 class
 */

function Parent(name) {
  this.parent = name
}

Parent.prototype.say = function () {
  console.log(`Parent: this author is ${this.parent}`)
}

function Child(name, parent) {
   // 将父类的构造函数绑定在子类上
  Parent.call(this, parent)
  this.child = name;
}
/** 
  1. 这一步不用Child.prototype =Parent.prototype的原因是怕共享内存，修改父类原型对象就会影响子类
  2. 不用Child.prototype = new Parent()的原因是会调用2次父类的构造方法（另一次是call），会存在一份多余的父类实例属性
  3. Object.create是创建了父类原型的副本，与父类原型完全隔离
*/
Child.prototype = Object.create(Parent.prototype) // 将子类原型设置为父类的副本
Child.prototype.constructor = Child // 子类的构造函数指向子类

Child.prototype.say = function (){
  console.log(`I am extend by ${this.parent},and i am ${this.child}`)
}

let parent = new Parent('$$Parent')
parent.say()

let child = new Child("$$Child","_$$Parent")
child.say()

