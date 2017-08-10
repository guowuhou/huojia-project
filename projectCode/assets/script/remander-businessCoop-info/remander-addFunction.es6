const $ = require('lib/jquery.js');
const _ = require('lib/underscore.js');
const Dialog = require('plugins/dialog.es6');
const httpreq = require('httpreq.es6');
require('lib/bootstrap.autocomplete.js');
const utils = require('utils');
require('lib/bootstrap-table.js');
/**
 * 用法:
 * const addLevelProfitDialog = require(此文件);
 * 
 * addFuctionListClass.show({
 *      businessType:""  //业务类型，必传     001：理财；002：基金；003：智能货架   
 *      btnLabel: '提交审批' //设置按钮的文字,非必传，默认【提交审批】
 * }, (data)=>{     //返回信息包括
 *      //TODO
 * });
 * //返回信息data如下：
 * var data = {
 *      order  顺序
        proFitnName 收益名称
        targetRange 指标范围
        proceeds  收益值
  };
 */


class addFuctionListClass {
  constructor() {
    
  }
  show(options = {}, callback = null) {
    var dafaultData = {
    
    };
    this.remarkHtml = $(require('./remander-addFunction.tpl'));
    this.options = _.extend({}, dafaultData, options);
    this.callback = callback;
    this.showDialog(options)
  }
  getFunctionList(){
        var self = this;
        utils.xhr.post(httpreq.PS_GetDictionaryType,{ddType:"77"}, (res) => {
             let FunctionList = res.data;
                for (let index = 0; index < FunctionList.length; index++) {
                    let element = FunctionList[index];
                    $('#functionList').append(`<option value=${element.ddCode}>${element.ddName}</option>`);
                }
        });
  }
  showDialog(parmData) {
      var DialogTitle;
      if(parmData.functionName){
          DialogTitle='编辑功能';
          this.remarkHtml.find("#funAnotherName").val(parmData.functionAlias);
          this.remarkHtml.find("#functionList").attr("disabled",true);
      }else{
          DialogTitle='挑选功能';
      }
    const self = this;
    Dialog.show({
      title:DialogTitle,
      nl2br: false,
      cssClass: 'ts-dialog',
      message: () => {
        return this.remarkHtml;
      },
      onshown: () => {
                this.getFunctionList();//获取商户合作下拉框
            },
      buttons: [{
        label: '确认',
        cssClass: 'btn-primary',
        action: (dialogRef) => {
          var Inputdata = {
            functionCode:$('#functionList').val(),
            functionName:$('#functionList option:selected').text(),
            functionAlias:$('#funAnotherName').val()
          };
          this.callback && this.callback(Inputdata);
          dialogRef.close();
        }
      }]
    });
  }
};

module.exports = new addFuctionListClass();