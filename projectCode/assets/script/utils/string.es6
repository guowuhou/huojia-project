exports.trim = function(str){
    return str.replace(/(^\s*)|(\s*$)/g, "");
};

exports.foramtMoney = function(moneyNum) {
    if(typeof(moneyNum=="number")){
        moneyNum=moneyNum+"";
    }
    var moneyNum = moneyNum.replace(/,/g,"");
    var result = isNaN((1 * moneyNum).toFixed(2)) ? (new Number(0).toFixed(2)) : (1 * moneyNum).toFixed(2);
    return /\./.test(result) ? result.replace(/(\d{1,3})(?=(\d{3})+\.)/g, "$1,") : result.replace(/(\d{1,3})(?=(\d{3})+\b)/g, "$1,");
}