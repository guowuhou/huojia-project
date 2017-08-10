/**搜索产品代码和名称**/
const $ = require('lib/jquery.js');
require('lib/bootstrap-table.js');
require('lib/bootstrap.autocomplete.js');
const httpreq = require('httpreq.es6');
const Dialog = require('plugins/dialog.es6');
const utils=require('utils');

class searchPrdCode extends uu.Component {
    onLoad() {
        this.bindEvents();
    }
    bindEvents() {
        $("#prdCode").autocomplete({
           source:function(query,process){
                var matchCount = this.options.items;//返回结果集最大数量
                 var data ={
                    "parentCode":$("#recList").val(),
                    "merchantCode":$("#fXList").val(),
                    "pageModuleCode":query,
                    "matchCount":matchCount
                }; 
                utils.xhr.post(httpreq.PS_queryPageModuleList,data, function (res) {
                    return process(res.data.pojos);
                 });
            },
            formatItem:function(item){
                return item["pageModuleCode"]+'-'+item["pageModuleName"];
            },
            setValue:function(item){
                return {'data-value':item["pageModuleCode"]+'-'+item["pageModuleName"],'real-value':item["pageModuleCode"]+'-'+item["pageModuleName"]};
            }
            // $("#goBtn").click(function(){ //获取文本框的实际值         var regionCode = $("#autocompleteInput").attr("real-value") || "";         alert(regionCode);     });//获取要上传的参数 

      })
    };
}
module.exports = searchPrdCode;