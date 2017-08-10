/**搜索产品代码和名称**/
const $ = require('lib/jquery.js');
require('lib/bootstrap-table.js');
require('lib/bootstrap.autocomplete.js');
const httpreq = require('httpreq.es6');
const Dialog = require('plugins/dialog.es6');
const utils=require('utils');

class proxyPrdName extends uu.Component {
    onLoad() {
        this.bindEvents();
    }
    bindEvents() {
        var self=this;
        $("#prductCode").autocomplete({
           source:function(query,process){
                var matchCount = this.options.items;//返回结果集最大数量
                 var data ={
                   "prdCode":query,
                   "matchCount":matchCount,
                    operateType:'fundProductInfo',
                }
                utils.xhr.post(httpreq.PS_CodeblurSel,data,function(res){
                         var list=res.data.selectedLibList;
                         if(list&&list.length>0){
                            self.mohuFlag=true;
                         }else{
                            self.mohuFlag=false;
                         }
                         return process(res.data.selectedLibList);
                });
            },
            formatItem:function(item){
                return item["prdCode"]+item["prdName"];
            },
            setValue:function(item){
                return {'data-value':item["prdCode"]+item["prdName"],'real-value':item["prdCode"]};
            },
            // $("#goBtn").click(function(){ //获取文本框的实际值         var regionCode = $("#autocompleteInput").attr("real-value") || "";         alert(regionCode);     });//获取要上传的参数 
      })
      this.prdCodeNameData();
    }
   prdCodeNameData(){
        if(utils.url.get()['backPage']=='1'){
            var showPrdCodeName=window.localStorage.getItem('proxyCodeName');
            $("#prductCode").val(showPrdCodeName)
        }
    };
   getmohuoFlag(){
        return this.mohuFlag;
   }; 
}
module.exports = proxyPrdName;