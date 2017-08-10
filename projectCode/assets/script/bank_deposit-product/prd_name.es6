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
                   "prdCode":query,
                   "matchCount":matchCount,
                    operateType:'fixedCurrentLinkDetail'
                };
                utils.xhr.post(httpreq.GetcodeblurSel,data, function (res) {
                         return process(res.data.selectedLibList);
                 });
            },
            formatItem:function(item){
                return item["prdCode"]+item["prdName"];
            },
            setValue:function(item){
                return {'data-value':item["prdCode"]+item["prdName"],'real-value':item["prdCode"]};
            }
            // $("#goBtn").click(function(){ //获取文本框的实际值         var regionCode = $("#autocompleteInput").attr("real-value") || "";         alert(regionCode);     });//获取要上传的参数 

      })
    };
}
module.exports = searchPrdCode;