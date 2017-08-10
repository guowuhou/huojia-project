/**
 * 从数组中根据一个字段名称，将对应的值都提取出来，例如：
 * const utils = require('utils');//可以忽略具体文件
 * const arr = [
 *      {name:'aaa', title:'1111'},
 *      {name:'bbb', title:'2222'},
 *      ... ...
 * ]
 * const ret = utils.array.pick(arr, 'name');
 * 此时ret为
 * ['aaa', 'bbb', .....]
 */
exports.pick = function (arr, id) {
    const ret = [];
    for (let i = 0; i < arr.length; i++) {
        const d = arr[i];
        ret.push(d[id]);
    }
    return ret;
};

exports.pickMul = function (...args) {
    const arr = args.shift();
    const ret = [];
    for (let i = 0; i < arr.length; i++) {
        const d = arr[i];
        const json = {};
        for (let i = 0; i < args.length; i++) {
            const name = args[i];
            json[name] = d[name];
        }
        ret.push(json);
    }
    return ret;
};

exports.find = function(arr, key, value, key2){
    for (let i = 0; i < arr.length; i++) {
        const d = arr[i];
        if( d[key] == value ){
            return d[key2];
        }
    }
    return null;
}