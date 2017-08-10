/**TA代码**/
const $ = require('lib/jquery.js');
const _ = require('lib/underscore.js');
require('lib/bootstrap-table.js');
require('lib/bootstrap.autocomplete.js');
const Dialog = require('plugins/dialog.es6');
const httpreq = require('httpreq.es6');
const utils=require('utils');

class TaCodeClass extends uu.Component {
    onLoad() {
        this.bindEvent();
    }
    bindEvent() {
        var self =this;
        $("#taCode").autocomplete({
           source:function(query,process){
                var matchCount = this.options.items;//返回结果集最大数量
                 var data ={
                   "taCode":query,
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
                return item["taCode"]+"-"+item["taName"];
            },
            setValue:function(item){
                return {'data-value':item["taCode"]+"-"+item["taName"],'real-value':item["taCode"]};
            },
            // $("#goBtn").click(function(){ //获取文本框的实际值         var regionCode = $("#autocompleteInput").attr("real-value") || "";         alert(regionCode);     });//获取要上传的参数 
      })
      this.prdTaCodeData();
    }
    //返显
    prdTaCodeData(){
        if(utils.url.get()['backPage']=='1'){
            var showprdTaCode=window.localStorage.getItem('proxyTaCode');
            $("#taCode").val(showprdTaCode)
        }
    };
    getsearchFlag(){
        return this.mohuFlag;
   }; 
}
module.exports = TaCodeClass;
