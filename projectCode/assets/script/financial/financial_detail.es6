const $ = require("lib/jquery.js");
const httpreq = require('httpreq.es6');
const artTemplate = require('lib/artTemplate.js');
const Dialog = require('plugins/dialog.es6');
const utils = require('utils');
const moment = require('lib/moment.js');
class financialDetail extends uu.Component {
    properties() {
        return {
           table: {
                defaultValue: null,
                type: uu.Dom
            }
        }
    }
    
    onLoad() {
         this.financialTableRender = artTemplate.compile( require("tpl/financial-table.tpl") );
         let param = {prdCode:utils.url.get()['prdCode']};
         this.initTable(param);
    }
    
    initTable(param) {
         utils.xhr.post(httpreq.getConsumerFinances,param, (res) => {
            var dep_data = res.data.list[0] || [];
            this.showTime(res.data.updateTime);
            dep_data["dbMinLimit"] = utils.string.foramtMoney(dep_data.dbMinLimit);
            dep_data["dbMaxLimit"] = utils.string.foramtMoney(dep_data.dbMaxLimit);
            dep_data["dhMinLimit"] = utils.string.foramtMoney(dep_data.dhMinLimit);
            dep_data["dhMaxLimit"] = utils.string.foramtMoney(dep_data.dhMaxLimit);
            dep_data["maxLPeriod"] = dep_data.maxLPeriod + "个月";
            this.showTable(dep_data);
         });
         
    }
    showTime(time){
        $("#updatetime").html("更新时间："+ time);
    }
    showTable(data){
        const financialTable = this.financialTableRender(data);
        $(this.table).html(financialTable);
    }
}

module.exports = financialDetail ;