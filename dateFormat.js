let format = (date, fmt) => {
    let year = date.getFullYear();
    let o = {
        'M+': date.getMonth() + 1, // 月份
        'd+': date.getDate(), // 日
        'h+': date.getHours(), // 小时
        'm+': date.getMinutes(), // 分
        's+': date.getSeconds(), // 秒
        'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
        S: date.getMilliseconds() // 毫秒
    };
    let tmpFmt = fmt;
    if (/(y+)/.test(tmpFmt)) { // 处理年 替换yyyy-MM-dd hh:mm:ss -- 2019-MM-dd hh:mm:ss
        // console.log(RegExp.$1); // RegExp.$1是RegExp的一个属性,指的是与正则表达式匹配的第一个 子匹配(以括号为标志)字符串
        tmpFmt = tmpFmt.replace(RegExp.$1, (`${year}`).substr(4 - RegExp.$1.length));
    }
    let keys = Object.keys(o); // 处理除年之外的剩余格式
    for (let i = 0; i < keys.length; i++) {
        let k = keys[i];
        if (new RegExp(`(${k})`).test(tmpFmt)) {
            let len = `${o[k]}`.length;
            // RegExp.$1.length === 1 判断是否为M-d格式 RegExp.$1正则第一条匹配规则。 ((`00${o[k]}`).substr(`${len}`)))补0操作。
            tmpFmt = tmpFmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : ((`00${o[k]}`).substr(`${len}`)));
        }
    }
    return tmpFmt;
};

console.log('date format :', format(new Date(), "yyyy-MM-dd hh:mm:ss"))
