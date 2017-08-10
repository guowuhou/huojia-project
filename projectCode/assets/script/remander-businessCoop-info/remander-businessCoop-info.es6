const $ = require("lib/jquery.js");
const _ = require("lib/underscore.js");
const utils = require('utils');
const Dialog = require("plugins/dialog.es6");
const httpreq = require('httpreq.es6');
require('lib/bootstrap-table.js');
const addFunction=require("./remander-addFunction.es6");

class functionListClass extends uu.Component{
  properties() {
      return {
          tableNode: {
              defaultValue: null,
              type: uu.Node
          }
      }
  }
  onLoad () {
     window.$=$;
     this.queryMerchantCooperation();
     this.getColorTemplate();
     this.queryMerchantCoopInfo();//查询详细信息
     this.bindEvents();
  }
  bindEvents(row){
      $("#saveEditFunInfo").on("click",()=>{
          this.submitEditFunInfo();
      });
      $("#addFunction").on("click",()=>{
          var self=this;
        addFunction.show(row,(data)=>{
            var functionInfo;
            var functionList=[];
            functionInfo = {
                functionName: data.functionName,
                functionCode:data.functionCode,
                functionAlias: data.functionAlias
            };
            let funList =$("#merchantcooptable").bootstrapTable('getData');
            functionList.push(functionInfo);
             for(var j=0;j<functionList.length;j++){
                  for(var i=0;i<funList.length;i++){
                    if(funList[i].functionCode==functionList[j].functionCode){
                        Dialog.alert('添加的功能“'+`${functionList[j].functionName}`+'”重复了');
                        return;
                    }
                  };
             };
            $("#merchantcooptable").bootstrapTable('append', functionList);
        });
      })
  }
   //查询商户合作
  queryMerchantCooperation(){
        var self = this;
        utils.xhr.post(httpreq.QueryAccessMechantList, {}, (res) => {
             let BusCoopList = res.data;
                for (let index = 0; index < BusCoopList.length; index++) {
                    let element = BusCoopList[index];
                    $('#merchantCoop').append(`<option value=${element.merchantCode}>${element.merchantName}</option>`);
                }
        });
    }
    //查询模板颜色
  getColorTemplate(){
         var self = this;
        utils.xhr.post(httpreq.PS_GetDictionaryType,{ddType:"78"}, (res) => {
             let colorTemList = res.data;
                for (let index = 0; index < colorTemList.length; index++) {
                    let element = colorTemList[index];
                    $('#colorTemplate').append(`<option value=${element.ddCode}>${element.ddName}</option>`);
                }
        });
    }
  queryMerchantCoopInfo(){
     var paramData = utils.url.get()["id"];
     utils.xhr.post(httpreq.GetRemainingMoneyMerchantCooperate,{id:paramData},(res)=>{
         let detailData=res.data||'';
         this.showDetailInfo(detailData);
         this.showFunctionList(detailData.functions);
     });
      
  }      
  showDetailInfo(detailData){
      this.accessChannelCode=detailData.accessChannelCode;
      $("#updateBy").html(detailData.accessChannel.accessChannelName||'');
      $("#merchantCoop").val(detailData.accessMerchantCode||'');
      $("#merchantCoop").prop('disabled',true);
      $("#purseName").val(detailData.purseName||'');
      $("#serviceAgree").val(detailData.protocolUrl||'');
      $("#colorTemplate").val(detailData.colorTemplate||'');
      $("#remark").val(detailData.remark||'');
  } 
  showFunctionList(FunData){
      var self=this;
        var labellist=FunData;
        if(!FunData){
            labellist = [];
        }else{
            labellist = FunData; 
        };
        $("#merchantcooptable").bootstrapTable('destroy');
        var columnList=[{
                field: 'functionName',
                title: '功能名字',
                align: 'center'
            },{
                field: 'functionCode',
                title: '功能编码',
                align: 'center'
            },{
                field: 'functionAlias',
                title: '功能别名',
                align: 'center'
            },{
                field: '',
                title: '操作',
                align: 'center',
                formatter: function (value, row, index) {
                        return `<a class='del' id="editInfo" style='text-decoration:none;cursor: pointer'>编辑</a>&nbsp&nbsp
                                <a class='del' id="deleteFun" style='text-decoration:none;cursor: pointer'>删除</a>
                        `;
                },
                events:{
                    "click #editInfo":(e,value,row)=>{
                      self.rowIndex = $(e.target).parents('tr').data('index');
                       this.bindEditEvents(row);
                    },
                    "click #deleteFun": (e, value, row) => {
                        var dialog1 = Dialog.show({
                            title: '',
                            nl2br: false,
                            cssClass: 'ts-dialog',
                            message: () => {
                                return `<p>${'确定删除此功能？'}</P> `;
                            },
                            buttons: [{
                                label: '确定',
                                cssClass: 'btn btn btn-primary',
                                action: () => {
                                    dialog1.close();
                                    self.rowIndex = $(e.target).parents('tr').data('index');
                                    this.onDelList(row);
                                }
                            }]
                        });
                    }
                },
            }]; 
        $('#merchantcooptable').bootstrapTable({
            data:labellist,
            // uniqueId: 'tagCode',
            columns: columnList,
            formatNoMatches: () => {
                return '查无记录';
            }
        });
        $('#merchantcooptable').bootstrapTable('hideColumn', 'functionCode');//隐藏功能编码
  }
   //删除行
   onDelList(row) {
        var getfunctionList=$("#merchantcooptable").bootstrapTable('getData');
            getfunctionList.splice(this.rowIndex, 1);  
        this.showFunctionList(getfunctionList);
    }
    //编辑信息
    bindEditEvents(row){
        var self=this;
         addFunction.show(row,(data)=>{
            var editFunctionInfo;
            editFunctionInfo = {
                functionAlias: data.functionAlias
            };
            $("#merchantcooptable").bootstrapTable('updateRow', {index:self.rowIndex, row: editFunctionInfo});
        });
    }
    //保存编辑按钮信息
    submitEditFunInfo(){
      var functionData=$("#merchantcooptable").bootstrapTable('getData');
      var repeationsData={};
      repeationsData['accessMerchantCode']=$("#merchantCoop").val();
      repeationsData['accessChannelCode']=this.accessChannelCode;
      repeationsData['purseName']=$("#purseName").val();
      repeationsData['protocolUrl']=$("#serviceAgree").val();
      repeationsData['colorTemplate']=$("#colorTemplate").val();
      repeationsData['remark']=$("#remark").val();
      repeationsData['functionJson']=JSON.stringify(functionData);
      repeationsData['id']=utils.url.get()["id"];
      utils.xhr.post(httpreq.SaveRemainingMoneyMerchantCooperate,repeationsData,(res)=>{
         Dialog.alert("保存成功",()=>{
             window.location.reload();
         });
     });
    }
};
module.exports=functionListClass;