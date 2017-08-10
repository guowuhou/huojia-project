/**搜索产品代码和名称**/
const $ = require('lib/jquery.js');
require('lib/bootstrap-table.js');
require('lib/bootstrap.autocomplete.js');
const httpreq = require('httpreq.es6');
const Dialog = require('plugins/dialog.es6');
const utils=require('utils');

class searchPageCode extends uu.Component {
    onLoad() {
        this.bindEvents();
    }
    bindEvents() {
        $("#pageRegionCode").autocomplete({
           source:function(query,process){
                var matchCount = this.options.items;//返回结果集最大数量
                 var data ={
                    "parentCode":utils.url.get()['pageModuleCode'],
                    "pageRegionCode":query
                }; 
                utils.xhr.post(httpreq.PS_queryPageRegionList,data, function (res) {
                    return process(res.data.pojos);
                 });
            },
            formatItem:function(item){
                return item["pageRegionCode"]+'-'+item["pageRegionName"];
            },
            setValue:function(item){
                return {'data-value':item["pageRegionCode"]+'-'+item["pageRegionName"],'real-value':item["pageRegionCode"]+'-'+item["pageRegionName"]};
            }
            // $("#goBtn").click(function(){ //获取文本框的实际值         var regionCode = $("#autocompleteInput").attr("real-value") || "";         alert(regionCode);     });//获取要上传的参数 

      })
    };
}
module.exports = searchPageCode;